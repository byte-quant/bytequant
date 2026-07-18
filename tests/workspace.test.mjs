import assert from "node:assert/strict";
import test from "node:test";
import { readWorkspaceAgentGoal, readWorkspaceHandoff } from "../app/lib/workspace-handoff.ts";
import { COLLABORATION_SIGNAL_LIFETIME_MS, createCollaborationSafetyCode, decodeCollaborationSignal, encodeCollaborationSignal } from "../app/lib/workspace-p2p.ts";
import { createWorkspaceRecipe, decodeWorkspaceRecipe, encodeWorkspaceRecipe } from "../app/lib/workspace-recipe.ts";
import { assertWorkspaceQuota, decryptWorkspace, encryptWorkspace } from "../app/lib/workspace-storage.ts";
import { WORKSPACE_MAX_NODES, createWorkspace, documentFromRecipe, layoutWorkspaceGraph, propagateWorkspaceOutput, validateWorkspaceDocument, workspaceGraphSummary } from "../app/lib/workspace-types.ts";

function sampleWorkspace() {
  const document = createWorkspace("en", "Private workflow");
  document.nodes = [
    { id: "node-json", toolSlug: "json-bicimlendirici", title: "JSON Formatter", x: 20, y: 30, input: '{"secret":"value"}', output: "", status: "ready" },
    { id: "node-csv", toolSlug: "json-csv-donusturucu", title: "JSON CSV", x: 320, y: 30, input: "", output: "", status: "idle" },
  ];
  document.edges = [{ id: "edge-json-csv", from: "node-json", to: "node-csv" }];
  return document;
}

test("workspace schema preserves bounded nodes and deterministic output handoff", () => {
  const document = sampleWorkspace();
  assert.equal(validateWorkspaceDocument(document), true);
  const next = propagateWorkspaceOutput(document, "node-json", "formatted-json");
  assert.equal(next.nodes[0].output, "formatted-json");
  assert.equal(next.nodes[1].input, "formatted-json");
  assert.equal(next.nodes[1].status, "ready");
  const layout = layoutWorkspaceGraph(document);
  assert.ok(layout.nodes[1].x > layout.nodes[0].x);
  assert.deepEqual(workspaceGraphSummary(next), { nodes: 2, edges: 1, ready: 1, complete: 1, errors: 0 });

  const overflow = structuredClone(document);
  overflow.nodes = Array.from({ length: WORKSPACE_MAX_NODES + 1 }, (_, index) => ({ ...document.nodes[0], id: `node-${index}` }));
  assert.equal(validateWorkspaceDocument(overflow), false);
});

test("URL recipes compress configuration and exclude sensitive content by default", async () => {
  const document = sampleWorkspace();
  const safeRecipe = createWorkspaceRecipe(document);
  assert.equal(safeRecipe.nodes[0].input, "");
  const code = await encodeWorkspaceRecipe(safeRecipe);
  assert.match(code, /^(?:g1|j1)\./);
  const decoded = await decodeWorkspaceRecipe(code);
  assert.equal(decoded.nodes.length, 2);
  assert.equal(documentFromRecipe(decoded).nodes[0].output, "");

  const explicit = await decodeWorkspaceRecipe(await encodeWorkspaceRecipe(createWorkspaceRecipe(document, true)));
  assert.equal(explicit.nodes[0].input, '{"secret":"value"}');
  await assert.rejects(() => decodeWorkspaceRecipe("g1.invalid***"));
});

test("IndexedDB payload encryption uses non-extractable AES-GCM and detects tampering", async () => {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  assert.equal(key.extractable, false);
  const document = sampleWorkspace();
  const record = await encryptWorkspace(document, key);
  assert.equal(record.algorithm, "AES-GCM-256");
  assert.notEqual(record.ciphertext.includes("secret"), true);
  assert.deepEqual(await decryptWorkspace(record, key), document);
  const tampered = { ...record, ciphertext: `${record.ciphertext.slice(0, -4)}AAAA` };
  await assert.rejects(() => decryptWorkspace(tampered, key));
});

test("storage quota guard reserves headroom before encrypted IndexedDB writes", () => {
  assert.doesNotThrow(() => assertWorkspaceQuota({ quota: 10_000_000, usage: 1_000_000 }, 1_000_000));
  assert.throws(() => assertWorkspaceQuota({ quota: 10_000_000, usage: 9_500_000 }, 300_000), /workspace-quota/);
  assert.throws(() => assertWorkspaceQuota(undefined, 5_100_000), /workspace-size/);
});

test("manual WebRTC signaling is expiring, bounded, typed, and room-scoped", async () => {
  const issuedAt = 1_800_000_000_000;
  const offer = { v: 2, kind: "offer", roomId: "room-abcd", offerId: "offer-abcde", from: "peer-abcde", issuedAt, sdp: { type: "offer", sdp: "v=0\r\na=fingerprint:sha-256 AA:BB\r\n" } };
  const code = encodeCollaborationSignal(offer);
  assert.match(code, /^p2\./);
  assert.deepEqual(decodeCollaborationSignal(code, issuedAt + 1_000), offer);
  assert.throws(() => decodeCollaborationSignal(code, issuedAt + COLLABORATION_SIGNAL_LIFETIME_MS + 1));
  assert.throws(() => decodeCollaborationSignal("p2.not-valid***", issuedAt));
  const first = await createCollaborationSafetyCode("room-abcd", "peer-a", "peer-b", "a=fingerprint:sha-256 AA:BB", "a=fingerprint:sha-256 CC:DD");
  const reverse = await createCollaborationSafetyCode("room-abcd", "peer-b", "peer-a", "a=fingerprint:sha-256 CC:DD", "a=fingerprint:sha-256 AA:BB");
  assert.equal(first, reverse);
  assert.match(first, /^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
  await assert.rejects(() => createCollaborationSafetyCode("room-abcd", "peer-a", "peer-b"), /safety-code-material/);
});

test("tool handoff rejects forged paths, password-sized data, and malformed ids", () => {
  const valid = { version: 1, workspaceId: "ws-abcdef", nodeId: "node-abcdef", toolSlug: "json-bicimlendirici", input: "{}", output: "", returnPath: "/en/workstation", completed: false };
  assert.deepEqual(readWorkspaceHandoff(JSON.stringify(valid)), valid);
  assert.equal(readWorkspaceHandoff(JSON.stringify({ ...valid, returnPath: "https://attacker.example" })), null);
  assert.equal(readWorkspaceHandoff(JSON.stringify({ ...valid, toolSlug: "../escape" })), null);
  assert.equal(readWorkspaceAgentGoal("  compare two JSON documents  "), "compare two JSON documents");
  assert.equal(readWorkspaceAgentGoal("x"), null);
});
