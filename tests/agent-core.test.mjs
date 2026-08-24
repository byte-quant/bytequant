import assert from "node:assert/strict";
import test from "node:test";
import {
  AGENT_SESSION_KEY,
  AGENT_VERSION,
  createAgentPlan,
  extractAgentPayload,
  extractAgentParameters,
  prepareAgentInput,
  readAgentSession,
  semanticToolSearch,
  translateAgentError,
} from "../app/lib/agent-core.ts";
import { canAutomatePlan, runAgentAutomation } from "../app/lib/agent-automation.ts";

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
  tool("e-posta-listesi-temizleyici", "text", "12", "E-posta Listesi Temizleyici", "Email List Cleaner", "E-Mail-Listenbereinigung", "电子邮件列表清理器", "extract clean deduplicate email list"),
  tool("satir-siralayici-tekillestirici", "text", "13", "Satır Sıralayıcı", "Line Sorter", "Zeilensortierer", "文本行排序器", "sort lines alphabetically and deduplicate"),
  tool("jwt-decoder", "data", "14", "JWT Çözücü", "JWT Decoder", "JWT-Dekodierer", "JWT 解码器", "decode inspect JWT token"),
  tool("base64-kodlayici", "data", "15", "Base64 Kodlayıcı", "Base64 Encoder", "Base64-Kodierer", "Base64 编码器", "encode decode Base64"),
  tool("qr-kod-olusturucu", "data", "16", "QR Kod Oluşturucu", "QR Code Generator", "QR-Code-Ersteller", "二维码生成器", "generate QR code"),
  tool("bahsis-hesap-bolusturucu", "calculation", "17", "Bahşiş Hesapla", "Tip Calculator", "Trinkgeldrechner", "小费计算器", "calculate tip split bill"),
  tool("kredi-amortisman-tahminleyici", "calculation", "18", "Kredi Amortismanı", "Loan Amortization", "Kredittilgung", "贷款摊还", "loan payment amortization"),
  tool("enflasyon-satin-alma-gucu", "calculation", "19", "Enflasyon Satın Alma Gücü", "Inflation Purchasing Power", "Inflations-Kaufkraft", "通胀购买力", "inflation purchasing power"),
  tool("basabas-noktasi-hesaplayici", "calculation", "20", "Başabaş Noktası", "Break-even Calculator", "Break-even-Rechner", "盈亏平衡计算器", "break even fixed variable cost"),
  tool("marj-kar-orani-hesaplayici", "calculation", "21", "Marj ve Kâr Oranı", "Margin and Markup", "Marge und Aufschlag", "毛利率与加价率", "margin markup profit"),
  tool("olasilik-hesaplayici", "calculation", "22", "Olasılık Hesaplayıcı", "Probability Calculator", "Wahrscheinlichkeitsrechner", "概率计算器", "probability intersection union"),
  tool("orneklem-buyuklugu-tahminleyici", "calculation", "23", "Örneklem Büyüklüğü", "Sample Size Estimator", "Stichprobengröße", "样本量估算器", "sample size confidence margin"),
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

test("local agent extracts only strongly bounded payloads for safe handoff", () => {
  assert.equal(extractAgentPayload('Format this JSON: {"ok":true}'), '{"ok":true}');
  assert.equal(extractAgentPayload("Clean this list\ninput: a@example.com, b@example.com"), "a@example.com, b@example.com");
  assert.equal(
    extractAgentPayload("Bu CSV listesindeki e-postaları temizle ve JSON'a dönüştür: ad,email\nAda,ADA@example.com\nAda,ada@example.com"),
    "ad,email\nAda,ADA@example.com\nAda,ada@example.com",
  );
  assert.equal(extractAgentPayload("Explain how JSON formatting works"), "");
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

  const pastedList = createAgentPlan("E-posta listesini temizle, tekrarları kaldır ve alfabetik sırala. Veri:\nADA@EXAMPLE.COM\nada@example.com\nveli@example.org", catalog, "tr");
  assert.deepEqual(pastedList.steps.map((step) => step.toolSlug), ["e-posta-listesi-temizleyici", "satir-siralayici-tekillestirici"]);
  assert.ok(pastedList.steps.every((step) => !step.toolSlug.includes("exif")));

  const uncertain = createAgentPlan("help me with this unusual thing", catalog, "en");
  assert.equal(uncertain.matchQuality, "review");
  assert.equal(uncertain.clarifyingQuestions.length, 3);
  assert.match(uncertain.response, /not clear enough/i);
});

test("local agent carries a bounded previous goal into natural follow-up requests", () => {
  const previous = createAgentPlan("Mask personal data in my CSV and prepare JSON", catalog, "en");
  const followUp = createAgentPlan("Now make the result easier to share", catalog, "en", previous);
  assert.equal(followUp.conversation.isFollowUp, true);
  assert.match(followUp.conversation.contextNote, /previous/i);
  assert.ok(followUp.conversation.suggestedReplies.length >= 2);
  assert.ok(followUp.goal.includes(previous.goal));
});

test("local agent preserves every explicit CSV operation and executes the verified chain", () => {
  const prompt = "Bu CSV'deki e-postaları maskele, tekrarları kaldır ve JSON'a çevir:\nname,email\nAli,ali@example.com\nAli,ali@example.com\nAyşe,ayse@example.com";
  const plan = createAgentPlan(prompt, catalog, "tr");
  assert.deepEqual(plan.steps.map((step) => step.toolSlug), ["csv-inceleyici", "kvkk-veri-maskeleyici", "satir-siralayici-tekillestirici", "json-csv-donusturucu"]);
  assert.equal(plan.coverage.missing.length, 0);
  assert.equal(canAutomatePlan(plan), true);
  const result = runAgentAutomation(plan, extractAgentPayload(prompt), "tr");
  assert.equal(result.steps.length, 4);
  assert.deepEqual(JSON.parse(result.output), [{ name: "Ali", email: "[EMAIL]" }, { name: "Ayşe", email: "[EMAIL]" }]);
});

test("short standalone intents do not inherit an unrelated previous plan", () => {
  const previous = createAgentPlan("Bahşiş hesapla: hesap 1200 TL, 4 kişi, yüzde 10", catalog, "tr");
  const jwt = createAgentPlan("JWT tokenımı çöz: eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMifQ.", catalog, "tr", previous);
  assert.equal(jwt.conversation.isFollowUp, false);
  assert.equal(jwt.steps[0].toolSlug, "jwt-decoder");
  assert.match(extractAgentPayload(jwt.goal), /^eyJ/);

  const qr = createAgentPlan("QR kod oluştur https://bytequant.org", catalog, "tr", jwt);
  assert.equal(qr.conversation.isFollowUp, false);
  assert.equal(qr.steps[0].toolSlug, "qr-kod-olusturucu");
  assert.equal(extractAgentPayload(qr.goal), "https://bytequant.org");
  assert.equal(extractAgentPayload("bunu Base64 yap: merhaba dünya"), "merhaba dünya");
});

test("agent prepares field-mapped input for everyday form tools", () => {
  const goal = "Bahşiş hesapla: hesap 1200 TL, 4 kişi, yüzde 10";
  const plan = createAgentPlan(goal, catalog, "tr");
  assert.deepEqual(JSON.parse(prepareAgentInput(goal, plan)), { subtotal: "1200", tip: "10", people: "4" });
});

test("agent maps natural-language values into all six guided calculator contracts", () => {
  const cases = [
    ["tr", "Kredi amortismanı hesapla: kredi tutarı 250.000 TL, yıllık faiz %3,4, vade 10 yıl, aylık ek ödeme 250 TL", "kredi-amortisman-tahminleyici", { principal: "250000", annualRate: "3.4", years: "10", extraMonthly: "250" }],
    ["en", "Compare inflation purchasing power: amount today 100,000, annual inflation 12%, period 5 years", "enflasyon-satin-alma-gucu", { amount: "100000", annualInflation: "12", years: "5" }],
    ["de", "Break-even berechnen: Fixkosten 120.000, Verkaufspreis je Einheit 480, variable Kosten je Einheit 210", "basabas-noktasi-hesaplayici", { fixedCost: "120000", unitPrice: "480", unitVariableCost: "210" }],
    ["zh", "计算利润率与加价率：单位成本80，售价125", "marj-kar-orani-hesaplayici", { cost: "80", price: "125" }],
    ["en", "Calculate intersection and union probability for independent events: probability A 65%, probability B 40%", "olasilik-hesaplayici", { a: "65", b: "40", relationship: "independent" }],
    ["tr", "Örneklem büyüklüğü hesapla: güven düzeyi %95, hata payı %5, beklenen oran %50, evren büyüklüğü 10.000", "orneklem-buyuklugu-tahminleyici", { confidence: "95", marginOfError: "5", proportion: "50", population: "10000" }],
  ];
  for (const [locale, goal, slug, expected] of cases) {
    const plan = createAgentPlan(goal, catalog, locale);
    assert.equal(plan.steps[0].toolSlug, slug);
    assert.deepEqual(JSON.parse(prepareAgentInput(goal, plan)), expected);
  }
});

test("agent preserves partial calculator values without claiming raw prose was applied", () => {
  const goal = "Kredi amortismanı hesapla, girdi: kredi 250000, faiz %3";
  const plan = createAgentPlan(goal, catalog, "tr");
  assert.equal(plan.steps[0].toolSlug, "kredi-amortisman-tahminleyici");
  assert.deepEqual(JSON.parse(prepareAgentInput(goal, plan)), { principal: "250000", annualRate: "3" });
});

test("agent session parser rejects untrusted or oversized bridge data", () => {
  const plan = createAgentPlan("compare JSON", catalog, "en");
  const valid = { plan, currentStep: 99, stepOutputs: {}, completedStepIds: [], preparedInput: '{"safe":true}' };
  assert.equal(readAgentSession(JSON.stringify(valid))?.currentStep, plan.steps.length - 1);
  assert.equal(readAgentSession(JSON.stringify(valid))?.preparedInput, '{"safe":true}');
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
