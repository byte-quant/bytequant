import assert from "node:assert/strict";
import test from "node:test";
import { canAutomatePlan, runAgentAutomation } from "../app/lib/agent-automation.ts";

function plan(slugs) {
  return {
    steps: slugs.map((toolSlug, index) => ({
      id: `step-${index + 1}`,
      toolSlug,
      title: toolSlug,
      reason: "test",
      requiresFile: false,
    })),
  };
}

test("agent executes a privacy-safe CSV workflow locally", () => {
  const workflow = plan(["csv-inceleyici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"]);
  assert.equal(canAutomatePlan(workflow), true);
  const result = runAgentAutomation(workflow, "name,email\nAda,ada@example.com", "en");
  assert.equal(result.steps.length, 3);
  assert.ok(result.steps.every((step) => step.status === "completed"));
  assert.deepEqual(JSON.parse(result.output), [{ name: "Ada", email: "[EMAIL]" }]);
});

test("agent handles quoted CSV and rejects inconsistent rows", () => {
  const workflow = plan(["csv-inceleyici", "json-csv-donusturucu"]);
  const result = runAgentAutomation(workflow, 'name,note\nAda,"one, two"', "en");
  assert.deepEqual(JSON.parse(result.output), [{ name: "Ada", note: "one, two" }]);
  assert.throws(() => runAgentAutomation(workflow, "a,b\n1", "en"), /inconsistent/i);
});

test("agent keeps large UTF-8 Base64 encoding stable without argument overflow", () => {
  const workflow = plan(["base64-kodlayici"]);
  const input = "ç".repeat(80_000);
  const result = runAgentAutomation(workflow, input, "tr");
  assert.equal(new TextDecoder().decode(Uint8Array.from(atob(result.output), (char) => char.charCodeAt(0))), input);
});

test("agent refuses unsupported or oversized automatic execution", () => {
  assert.equal(canAutomatePlan(plan(["pdf-birlestirici"])), false);
  assert.throws(() => runAgentAutomation(plan(["url-kodlayici"]), "x".repeat(200_001), "en"), /200,000/);
});
