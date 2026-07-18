import { WORKSPACE_MAX_BYTES, validateWorkspaceDocument, type WorkspaceDocument } from "./workspace-types";

const DB_NAME = "bytequant-workspaces";
const DB_VERSION = 1;
const PROJECT_STORE = "projects";
const KEY_STORE = "keys";
const DEVICE_KEY_ID = "workspace-aes-gcm-v1";

type EncryptedWorkspaceRecord = {
  id: string;
  updatedAt: string;
  iv: string;
  ciphertext: string;
  algorithm: "AES-GCM-256";
};

export type WorkspaceSummary = { id: string; name: string; updatedAt: string; nodes: number };

function encodeBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary);
}

function decodeBase64(value: string) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error("workspace-ciphertext");
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export async function encryptWorkspace(document: WorkspaceDocument, key: CryptoKey): Promise<EncryptedWorkspaceRecord> {
  if (!validateWorkspaceDocument(document)) throw new Error("workspace-invalid");
  const plaintext = new TextEncoder().encode(JSON.stringify(document));
  if (plaintext.byteLength > WORKSPACE_MAX_BYTES) throw new Error("workspace-size");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(document.id) }, key, plaintext));
  return { id: document.id, updatedAt: document.updatedAt, iv: encodeBase64(iv), ciphertext: encodeBase64(ciphertext), algorithm: "AES-GCM-256" };
}

export async function decryptWorkspace(record: EncryptedWorkspaceRecord, key: CryptoKey) {
  if (record.algorithm !== "AES-GCM-256" || typeof record.id !== "string" || record.ciphertext.length > WORKSPACE_MAX_BYTES * 2) throw new Error("workspace-record");
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decodeBase64(record.iv), additionalData: new TextEncoder().encode(record.id) }, key, decodeBase64(record.ciphertext));
  const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(plaintext)) as unknown;
  if (!validateWorkspaceDocument(value) || value.id !== record.id) throw new Error("workspace-invalid");
  return value;
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb-request"));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("indexeddb-abort"));
    transaction.onerror = () => reject(transaction.error ?? new Error("indexeddb-transaction"));
  });
}

async function openDatabase() {
  if (typeof indexedDB === "undefined") throw new Error("indexeddb-unavailable");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(PROJECT_STORE)) database.createObjectStore(PROJECT_STORE, { keyPath: "id" });
    if (!database.objectStoreNames.contains(KEY_STORE)) database.createObjectStore(KEY_STORE, { keyPath: "id" });
  };
  return requestResult(request);
}

async function getDeviceKey(database: IDBDatabase) {
  const transaction = database.transaction(KEY_STORE, "readonly");
  const existing = await requestResult(transaction.objectStore(KEY_STORE).get(DEVICE_KEY_ID)) as { id: string; key: CryptoKey } | undefined;
  await transactionDone(transaction);
  if (existing?.key) return existing.key;
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const write = database.transaction(KEY_STORE, "readwrite");
  write.objectStore(KEY_STORE).put({ id: DEVICE_KEY_ID, key });
  await transactionDone(write);
  return key;
}

export function assertWorkspaceQuota(estimate: { quota?: number; usage?: number } | undefined, nextBytes: number) {
  if (nextBytes > WORKSPACE_MAX_BYTES * 2) throw new Error("workspace-size");
  if (estimate?.quota && estimate.usage !== undefined && estimate.quota - estimate.usage < nextBytes * 2) throw new Error("workspace-quota");
}

async function checkQuota(nextBytes: number) {
  assertWorkspaceQuota(await navigator.storage?.estimate?.(), nextBytes);
}

export async function saveWorkspace(document: WorkspaceDocument) {
  const database = await openDatabase();
  try {
    const key = await getDeviceKey(database);
    const record = await encryptWorkspace(document, key);
    await checkQuota(record.ciphertext.length);
    const transaction = database.transaction(PROJECT_STORE, "readwrite");
    transaction.objectStore(PROJECT_STORE).put(record);
    await transactionDone(transaction);
  } finally { database.close(); }
}

export async function loadWorkspace(id: string) {
  const database = await openDatabase();
  try {
    const key = await getDeviceKey(database);
    const transaction = database.transaction(PROJECT_STORE, "readonly");
    const record = await requestResult(transaction.objectStore(PROJECT_STORE).get(id)) as EncryptedWorkspaceRecord | undefined;
    await transactionDone(transaction);
    if (!record) throw new Error("workspace-missing");
    return decryptWorkspace(record, key);
  } finally { database.close(); }
}

export async function listWorkspaces(): Promise<WorkspaceSummary[]> {
  const database = await openDatabase();
  try {
    const key = await getDeviceKey(database);
    const transaction = database.transaction(PROJECT_STORE, "readonly");
    const records = await requestResult(transaction.objectStore(PROJECT_STORE).getAll()) as EncryptedWorkspaceRecord[];
    await transactionDone(transaction);
    const results = await Promise.all(records.map(async (record) => {
      try { const document = await decryptWorkspace(record, key); return { id: document.id, name: document.name, updatedAt: document.updatedAt, nodes: document.nodes.length }; }
      catch { return null; }
    }));
    return results.filter((item): item is WorkspaceSummary => Boolean(item)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } finally { database.close(); }
}

export async function deleteWorkspace(id: string) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(PROJECT_STORE, "readwrite");
    transaction.objectStore(PROJECT_STORE).delete(id);
    await transactionDone(transaction);
  } finally { database.close(); }
}

export async function requestPersistentWorkspaceStorage() {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}
