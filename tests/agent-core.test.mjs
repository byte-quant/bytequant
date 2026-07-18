import assert from "node:assert/strict";
import test from "node:test";
import {
  AGENT_SESSION_KEY,
  AGENT_VERSION,
  createAgentPlan,
  extractAgentParameters,
  readAgentSession,
  semanticToolSearch,
  translateAgentError,
} from "../app/lib/agent-core.ts";

function tool(slug, category, mark, tr, en, de, zh, keywords = "") {
  const title = { tr, en, de, zh };
  const short = { tr: keywords, en: keywords, de: keywords, zh: keywords };
  const description = { tr: keywords, en: keywords, de: keywords, zh: keywords };
  const useCases = { tr: [keywords], en: [keywords], de: [keywords], zh: [keywords] };
  return { slug, category, mark, title, short, description, useCases, steps: useCases };
}

const catalog = [
  tool("json-bicimlendirici", "data", "01", "JSON Biçimlendirici", "JSON Formatter", "JSON-Formatierer", "JSON 格式化", "validate and format JSON"),
  tool("json-diff-karsilastirma", "data", "02", "JSON Diff", "JSON Diff", "JSON-Vergleich", "JSON 比较", "compare JSON structure"),
  tool("arac-zinciri-pipeline", "data", "03", "Araç Zinciri", "Tool Pipeline", "Werkzeug-Pipeline", "工具流水线", "CSV mask privacy convert"),
  tool("prompt-kalite-denetimi", "prompt", "04", "Prompt Denetimi", "Prompt Review", "Prompt-Prüfung", "提示词审查", "prompt clarity"),
  tool("metin-temizleyici", "text", "05", "Metin Temizleyici", "Text Cleaner", "Textbereinigung", "文本清理", "clean text"),
];

test("local agent semantically ranks tools and extracts bounded parameters", () => {
  const matches = semanticToolSearch("compare two JSON objects", catalog, "en", 3);
  assert.equal(matches[0]?.tool.slug, "json-diff-karsilastirma");
  assert.ok(matches[0].score > 0);

  const parameters = extractAgentParameters("Mask CSV then convert to JSON at https://bytequant.org with 25 MB", "en");
  assert.ok(parameters.some((item) => item.kind === "format" && item.value.includes("csv") && item.value.includes("json")));
  assert.ok(parameters.some((item) => item.kind === "url-host" && item.value === "bytequant.org"));
  assert.ok(parameters.some((item) => item.kind === "number"));
  assert.ok(parameters.some((item) => item.kind === "privacy"));
});

test("local agent builds explicit workflows without executing tools", () => {
  const plan = createAgentPlan("CSV dosyasını KVKK için maskele ve JSON'a dönüştür", catalog, "tr");
  assert.equal(plan.version, AGENT_VERSION);
  assert.equal(plan.steps[0]?.toolSlug, "arac-zinciri-pipeline");
  assert.ok(plan.confidence >= 0.35 && plan.confidence <= 0.94);
  assert.ok(plan.limitations.some((value) => value.includes("büyük dil modeli")));
  const numbered = createAgentPlan("1. validate and format JSON\n2. compare JSON structure", catalog, "en");
  assert.equal(numbered.steps.length, 2);
  assert.deepEqual(numbered.steps.map((step) => step.toolSlug), ["json-bicimlendirici", "json-diff-karsilastirma"]);
});

test("agent session parser rejects untrusted or oversized bridge data", () => {
  const plan = createAgentPlan("compare JSON", catalog, "en");
  const valid = { plan, currentStep: 99, stepOutputs: {}, completedStepIds: [] };
  assert.equal(readAgentSession(JSON.stringify(valid))?.currentStep, plan.steps.length - 1);
  assert.equal(readAgentSession(JSON.stringify({ ...valid, plan: { ...plan, version: "forged" } })), null);
  assert.equal(readAgentSession(JSON.stringify({ ...valid, stepOutputs: { unknown: "injected" } })), null);
  assert.equal(readAgentSession("{"), null);
  assert.equal(typeof AGENT_SESSION_KEY, "string");
});

test("error translator provides localized, non-verification guidance", () => {
  const json = translateAgentError("SyntaxError: Unexpected token } in JSON at position 8", "en");
  assert.match(json.title, /JSON/);
  assert.deepEqual(json.suggestedSlugs, ["json-bicimlendirici"]);
  assert.match(json.boundary, /not root-cause analysis/i);

  const jwt = translateAgentError("invalid JWT token segment", "de");
  assert.deepEqual(jwt.suggestedSlugs, ["jwt-decoder", "base64-kodlayici"]);
  assert.ok(jwt.actions.length >= 3);
});
