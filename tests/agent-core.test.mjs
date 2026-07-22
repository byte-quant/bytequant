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
  tool("csv-inceleyici", "data", "06", "CSV İnceleyici", "CSV Inspector", "CSV-Prüfer", "CSV 检查器", "inspect CSV rows and columns"),
  tool("kvkk-veri-maskeleyici", "security", "07", "KVKK Veri Maskeleyici", "Privacy Data Masker", "Datenschutz-Maskierer", "隐私数据遮蔽", "mask redact personal sensitive data KVKK GDPR privacy"),
  tool("json-csv-donusturucu", "data", "08", "JSON CSV Dönüştürücü", "JSON CSV Converter", "JSON-CSV-Konverter", "JSON CSV 转换器", "convert JSON CSV"),
  tool("kod-guvenligi-on-taramasi", "codeSecurity", "09", "Kod Güvenliği Ön Taraması", "Code Safety Pre-scan", "Code-Sicherheitsprüfung", "代码安全预扫描", "scan source code for secrets security"),
  tool("dosya-risk-on-taramasi", "codeSecurity", "10", "Dosya Risk Ön Taraması", "File Risk Pre-scan", "Dateirisiko-Prüfung", "文件风险预扫描", "scan file risk security"),
  tool("dosya-hash-karsilastirici", "security", "11", "Dosya Hash Hesaplayıcı", "File Hash Calculator", "Datei-Hash-Rechner", "文件哈希计算器", "SHA-256 file integrity compare"),
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
  assert.deepEqual(plan.steps.map((step) => step.toolSlug), ["csv-inceleyici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"]);
  assert.ok(plan.confidence >= 0.35 && plan.confidence <= 0.94);
  assert.equal(plan.matchQuality, "strong");
  assert.equal(plan.clarifyingQuestions.length, 0);
  assert.equal(plan.nextActions.length, 3);
  assert.ok(plan.limitations.some((value) => value.includes("büyük dil modeli")));
  const privacyDelivery = createAgentPlan("JSON verisini doğrula, hassas alanları maskele ve CSV olarak hazırla", catalog, "tr");
  assert.deepEqual(privacyDelivery.steps.map((step) => step.toolSlug), ["json-bicimlendirici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"]);
  const codeSafety = createAgentPlan("Kaynak kodu gizli anahtar ve güvenlik riski için tara", catalog, "tr");
  assert.deepEqual(codeSafety.steps.map((step) => step.toolSlug), ["kod-guvenligi-on-taramasi", "dosya-risk-on-taramasi", "dosya-hash-karsilastirici"]);
  const numbered = createAgentPlan("1. validate and format JSON\n2. compare JSON structure", catalog, "en");
  assert.equal(numbered.steps.length, 2);
  assert.deepEqual(numbered.steps.map((step) => step.toolSlug), ["json-bicimlendirici", "json-diff-karsilastirma"]);

  const uncertain = createAgentPlan("help me with this unusual thing", catalog, "en");
  assert.equal(uncertain.matchQuality, "review");
  assert.equal(uncertain.clarifyingQuestions.length, 3);
  assert.match(uncertain.response, /not clear enough/i);
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
