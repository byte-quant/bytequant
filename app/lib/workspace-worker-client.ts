import { decodeWorkspaceRecipe, encodeWorkspaceRecipe } from "./workspace-recipe";
import { validateWorkspaceRecipe, type WorkspaceRecipe } from "./workspace-types";

type WorkerReply<T> = { id: string; ok: true; result: T } | { id: string; ok: false; error: string };

const workerSource = `
const MAX_CODE = 48000;
const MAX_BYTES = 2500000;
function toBase64Url(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}
function fromBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("recipe-base64");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}
async function readBounded(stream) {
  const reader = stream.getReader();
  const chunks = []; let total = 0;
  while (true) {
    const item = await reader.read();
    if (item.done) break;
    total += item.value.byteLength;
    if (total > MAX_BYTES) { await reader.cancel(); throw new Error("recipe-size"); }
    chunks.push(item.value);
  }
  const output = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}
async function encode(json) {
  const bytes = new TextEncoder().encode(json);
  if (bytes.byteLength > MAX_BYTES) throw new Error("recipe-size");
  let prefix = "j1."; let packed = bytes;
  if (typeof CompressionStream !== "undefined") {
    prefix = "g1.";
    packed = await readBounded(new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip")));
  }
  const code = prefix + toBase64Url(packed);
  if (code.length > MAX_CODE) throw new Error("recipe-url-size");
  return code;
}
async function decode(code) {
  const clean = String(code).trim();
  if (clean.length < 4 || clean.length > MAX_CODE) throw new Error("recipe-code-size");
  const prefix = clean.slice(0, 3);
  let bytes = fromBase64Url(clean.slice(3));
  if (prefix === "g1.") {
    if (typeof DecompressionStream === "undefined") throw new Error("recipe-compression");
    bytes = await readBounded(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")));
  } else if (prefix !== "j1.") throw new Error("recipe-compression");
  if (bytes.byteLength > MAX_BYTES) throw new Error("recipe-size");
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
self.addEventListener("message", async (event) => {
  const { id, action, payload } = event.data || {};
  try {
    const result = action === "encode" ? await encode(String(payload)) : action === "decode" ? await decode(payload) : (() => { throw new Error("workspace-worker-action"); })();
    self.postMessage({ id, ok: true, result });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : "workspace-worker" });
  }
});`;

async function requestWorker<T>(action: "encode" | "decode", payload: unknown): Promise<T> {
  if (typeof Worker === "undefined") return action === "encode" ? await encodeWorkspaceRecipe(JSON.parse(String(payload)) as WorkspaceRecipe) as T : await decodeWorkspaceRecipe(String(payload)) as T;
  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  const worker = new Worker(workerUrl, { name: "bytequant-workspace" });
  const id = crypto.randomUUID();
  return new Promise<T>((resolve, reject) => {
    const cleanup = () => { worker.terminate(); URL.revokeObjectURL(workerUrl); };
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error("workspace-worker-timeout")); }, 12_000);
    worker.addEventListener("message", (event: MessageEvent<WorkerReply<T>>) => {
      if (event.data.id !== id) return;
      window.clearTimeout(timeout); cleanup();
      if (event.data.ok) resolve(event.data.result); else reject(new Error(event.data.error));
    });
    worker.addEventListener("error", () => { window.clearTimeout(timeout); cleanup(); reject(new Error("workspace-worker")); }, { once: true });
    worker.postMessage({ id, action, payload });
  });
}

export async function encodeRecipeInWorker(recipe: WorkspaceRecipe) {
  if (!validateWorkspaceRecipe(recipe)) throw new Error("recipe-invalid");
  const code = await requestWorker<string>("encode", JSON.stringify(recipe));
  if (typeof code !== "string" || code.length > 48_000) throw new Error("recipe-invalid");
  return code;
}

export async function decodeRecipeInWorker(code: string) {
  const recipe = await requestWorker<unknown>("decode", code);
  if (!validateWorkspaceRecipe(recipe)) throw new Error("recipe-invalid");
  return recipe;
}
