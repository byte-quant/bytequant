import { WORKSPACE_MAX_BYTES, WORKSPACE_MAX_TEXT, WORKSPACE_VERSION, validateWorkspaceRecipe, type WorkspaceDocument, type WorkspaceRecipe } from "./workspace-types";

const RECIPE_MAX_CODE = 48_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("recipe-base64");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary");
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function compress(bytes: Uint8Array) {
  if (typeof CompressionStream === "undefined") return { prefix: "j1.", bytes };
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream("gzip"));
  return { prefix: "g1.", bytes: new Uint8Array(await new Response(stream).arrayBuffer()) };
}

async function decompress(prefix: string, bytes: Uint8Array) {
  if (prefix === "j1.") return bytes;
  if (prefix !== "g1." || typeof DecompressionStream === "undefined") throw new Error("recipe-compression");
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("gzip"));
  const result = new Uint8Array(await new Response(stream).arrayBuffer());
  if (result.byteLength > WORKSPACE_MAX_BYTES) throw new Error("recipe-size");
  return result;
}

export function createWorkspaceRecipe(document: WorkspaceDocument, includeInputs = false): WorkspaceRecipe {
  return {
    version: WORKSPACE_VERSION,
    name: document.name.slice(0, 100),
    locale: document.locale,
    nodes: document.nodes.map(({ id, toolSlug, title, x, y, input }) => ({ id, toolSlug, title, x, y, input: includeInputs ? input.slice(0, WORKSPACE_MAX_TEXT) : "" })),
    edges: document.edges.map((edge) => ({ ...edge })),
  };
}

export async function encodeWorkspaceRecipe(recipe: WorkspaceRecipe) {
  if (!validateWorkspaceRecipe(recipe)) throw new Error("recipe-invalid");
  const bytes = encoder.encode(JSON.stringify(recipe));
  if (bytes.byteLength > WORKSPACE_MAX_BYTES) throw new Error("recipe-size");
  const packed = await compress(bytes);
  const code = `${packed.prefix}${bytesToBase64Url(packed.bytes)}`;
  if (code.length > RECIPE_MAX_CODE) throw new Error("recipe-url-size");
  return code;
}

export async function decodeWorkspaceRecipe(code: string) {
  const clean = code.trim();
  if (clean.length < 4 || clean.length > RECIPE_MAX_CODE) throw new Error("recipe-code-size");
  const prefix = clean.slice(0, 3);
  const bytes = await decompress(prefix, base64UrlToBytes(clean.slice(3)));
  const value = JSON.parse(decoder.decode(bytes)) as unknown;
  if (!validateWorkspaceRecipe(value)) throw new Error("recipe-invalid");
  return value;
}
