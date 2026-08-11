import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLocalAIMessages,
  createFastConversationResponse,
  isLikelyWorkflowRequest,
  LOCAL_AI_MAX_RESPONSE,
  LOCAL_AI_MODEL_ID,
  LOCAL_AI_MODEL_LICENSE,
  sanitizeLocalAIOutput,
} from "../app/lib/local-ai.ts";
import { publicTools } from "../app/lib/tools.ts";
import { createAgentPlan } from "../app/lib/agent-core.ts";

test("local AI runtime uses a pinned permissive multilingual model", () => {
  assert.equal(LOCAL_AI_MODEL_ID, "Qwen3-0.6B-q4f16_1-MLC");
  assert.equal(LOCAL_AI_MODEL_LICENSE, "Apache-2.0");
});

test("workflow detection separates everyday chat from tool work", () => {
  assert.equal(isLikelyWorkflowRequest("Merhaba, bugün nasılsın?"), false);
  assert.equal(isLikelyWorkflowRequest("Bu CSV listesini temizle ve JSON'a dönüştür"), true);
  assert.equal(isLikelyWorkflowRequest("Bitte diese JSON-Datei formatieren"), true);
  assert.equal(isLikelyWorkflowRequest("把这些数据转换为 JSON"), true);
});

test("fast fallback handles common conversation without inventing a tool", () => {
  assert.match(createFastConversationResponse("tr", "Bugün odaklanmak için öneri ver"), /25 dakikalık/);
  assert.match(createFastConversationResponse("en", "What is the weather today?"), /no live web access/i);
  assert.match(createFastConversationResponse("de", "Hallo"), /Hallo/);
  assert.match(createFastConversationResponse("zh", "你能做什么？"), /两种方式/);
});

test("model output hides internal thinking tags and remains session-safe", () => {
  const long = `<think>private scratchpad</think>\nUseful answer ${"x".repeat(3_000)}`;
  const clean = sanitizeLocalAIOutput(long);
  assert.doesNotMatch(clean, /scratchpad|<think>/i);
  assert.ok(clean.startsWith("Useful answer"));
  assert.ok(clean.length <= LOCAL_AI_MAX_RESPONSE);
});

test("grounded messages retain bounded conversation and verified host plan", () => {
  const plan = createAgentPlan("Format this JSON {\"ok\":true}", publicTools, "en");
  const history = Array.from({ length: 12 }, (_, index) => ({
    role: index % 2 ? "assistant" : "user",
    content: `turn-${index} ${"x".repeat(3_000)}`,
  }));
  const messages = buildLocalAIMessages("en", plan.goal, plan, history, true);
  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content, /host application.*selects and executes allowlisted tools/i);
  assert.match(messages[0].content, new RegExp(plan.steps[0].title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(messages.length, 10);
  assert.doesNotMatch(messages.map((message) => message.content).join("\n"), /turn-0/);
  assert.match(messages.at(-1).content, /Format this JSON/);
});
