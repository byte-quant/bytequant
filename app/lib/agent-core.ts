import type { Locale } from "./site";
import type { Tool, ToolCategory } from "./tools";
import { AGENT_VERSION } from "./agent-session";

export { AGENT_SESSION_KEY, AGENT_SESSION_LIMIT, AGENT_VERSION, readAgentSession } from "./agent-session";

export type AgentInputMode = "goal" | "previous" | "manual";

export type AgentPlanStep = {
  id: string;
  toolSlug: string;
  title: string;
  reason: string;
  inputMode: AgentInputMode;
  requiresFile: boolean;
  parameterHints: string[];
};

export type AgentPlan = {
  version: typeof AGENT_VERSION;
  locale: Locale;
  goal: string;
  confidence: number;
  signals: string[];
  extracted: AgentParameter[];
  steps: AgentPlanStep[];
  limitations: string[];
};

export type AgentSession = {
  plan: AgentPlan;
  currentStep: number;
  stepOutputs: Record<string, string>;
  completedStepIds: string[];
};

export type AgentSearchResult = {
  tool: Tool;
  score: number;
  matched: string[];
};

export type AgentParameter = {
  kind: "format" | "url-host" | "number" | "language" | "privacy" | "file";
  label: string;
  value: string;
};

export type ErrorTranslation = {
  title: string;
  explanation: string;
  actions: string[];
  suggestedSlugs: string[];
  boundary: string;
};

const localeTags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };

const conceptGroups = [
  ["json", "javascript object notation"],
  ["csv", "comma separated", "tablo", "table", "tabelle", "表格"],
  ["yaml", "yml"],
  ["xml"],
  ["pdf", "belge", "document", "dokument", "文档"],
  ["image", "görsel", "resim", "bild", "图片", "图像", "png", "jpg", "jpeg", "webp", "heic", "svg"],
  ["privacy", "gizlilik", "datenschutz", "隐私", "kvkk", "gdpr", "mask", "maskele", "redact"],
  ["security", "güvenlik", "sicherheit", "安全", "risk", "scan", "tara", "prüfen", "审计"],
  ["prompt", "system prompt", "persona", "提示词", "角色"],
  ["seo", "canonical", "hreflang", "robots", "sitemap", "schema", "utm"],
  ["encode", "decode", "kodla", "çöz", "kodieren", "dekodieren", "编码", "解码", "base64", "data uri"],
  ["hash", "sha", "hmac", "sri", "özet", "digest", "哈希"],
  ["convert", "dönüştür", "çevir", "konvertieren", "umwandeln", "转换"],
  ["compare", "karşılaştır", "fark", "diff", "vergleichen", "比较"],
  ["calculate", "hesapla", "rechnen", "berechnen", "计算", "yüzde", "percent", "steuer", "vergi"],
  ["error", "hata", "fehler", "错误", "exception", "stack trace"],
  ["token", "context", "bağlam", "kontext", "上下文", "rag"],
  ["password", "parola", "şifre", "passwort", "密码"],
  ["url", "link", "adres", "链接", "网址"],
] as const;

const fileTools = new Set([
  "arac-zinciri-pipeline", "exif-meta-veri-temizleyici", "gorsel-format-donusturucu", "gorsel-sikistirici",
  "gorselden-pdf", "pdf-gorsele", "pdf-birlestirme", "pdf-bolme", "pdf-sifreleme", "heic-donusturucu",
  "svg-png-donusturucu", "dosya-risk-on-taramasi", "dosya-hash-karsilastirici",
]);

const categoryTerms: Record<ToolCategory, string[]> = {
  prompt: ["prompt", "instruction", "talimat", "anweisung", "指令"],
  text: ["text", "metin", "nlp", "文本"],
  data: ["data", "veri", "developer", "entwickler", "数据"],
  converter: ["convert", "dönüştür", "converter", "konverter", "转换"],
  security: ["privacy", "gizlilik", "security", "datenschutz", "隐私"],
  calculation: ["calculate", "hesap", "formula", "rechnen", "计算"],
  general: ["document", "belge", "everyday", "alltag", "日常"],
  ai: ["ai", "agent", "model", "rag", "人工智能"],
  codeSecurity: ["code security", "kod güvenliği", "dateisicherheit", "代码安全"],
};

function normalize(value: string, locale: Locale) {
  return value.toLocaleLowerCase(localeTags[locale]).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}+#./-]+/gu, " ").trim();
}

function tokens(value: string, locale: Locale) {
  const normalized = normalize(value, locale);
  if (!normalized) return [];
  if (locale === "zh" && typeof Intl.Segmenter === "function") {
    return [...new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(normalized)].filter((item) => item.isWordLike).map((item) => item.segment);
  }
  return normalized.split(/\s+/).filter((item) => item.length > 1 || /\d/.test(item));
}

function expandQuery(query: string, locale: Locale) {
  const normalized = normalize(query, locale);
  const expanded = new Set(tokens(query, locale));
  conceptGroups.forEach((group) => {
    if (group.some((term) => normalized.includes(normalize(term, locale)))) {
      group.forEach((term) => tokens(term, locale).forEach((token) => expanded.add(token)));
    }
  });
  return [...expanded];
}

function trigrams(value: string) {
  const compact = value.replace(/\s+/g, " ");
  const result = new Set<string>();
  for (let index = 0; index <= compact.length - 3; index += 1) result.add(compact.slice(index, index + 3));
  return result;
}

function trigramSimilarity(left: string, right: string) {
  if (left.length < 3 || right.length < 3) return left === right ? 1 : 0;
  const a = trigrams(left); const b = trigrams(right);
  let shared = 0; a.forEach((item) => { if (b.has(item)) shared += 1; });
  return shared / Math.max(1, a.size + b.size - shared);
}

export function semanticToolSearch(query: string, catalog: Tool[], locale: Locale, limit = 8): AgentSearchResult[] {
  const normalizedQuery = normalize(query, locale);
  const queryTokens = expandQuery(query, locale);
  if (!normalizedQuery) return [];
  return catalog.map((tool) => {
    const fields = [
      { value: tool.title[locale], weight: 8 }, { value: tool.slug, weight: 6 }, { value: tool.short[locale], weight: 4 },
      { value: tool.description[locale], weight: 2 }, { value: tool.useCases[locale].join(" "), weight: 3 },
      { value: categoryTerms[tool.category].join(" "), weight: 2 }, { value: `${tool.title.tr} ${tool.title.en}`, weight: 1.5 },
    ];
    let score = 0; const matched = new Set<string>();
    fields.forEach((field) => {
      const normalizedField = normalize(field.value, locale);
      if (normalizedField.includes(normalizedQuery)) score += field.weight * 3;
      queryTokens.forEach((token) => {
        if (normalizedField.includes(token)) { score += field.weight; matched.add(token); }
        else if (token.length >= 4 && trigramSimilarity(token, normalizedField.slice(0, 120)) >= .42) score += field.weight * .35;
      });
    });
    return { tool, score, matched: [...matched].slice(0, 6) };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || Number(a.tool.mark) - Number(b.tool.mark)).slice(0, limit);
}

function local(locale: Locale, values: Record<Locale, string>) { return values[locale]; }

export function extractAgentParameters(goal: string, locale: Locale): AgentParameter[] {
  const result: AgentParameter[] = [];
  const normalized = normalize(goal, locale);
  const formats = ["json", "csv", "yaml", "xml", "pdf", "png", "jpg", "jpeg", "webp", "svg", "heic", "base64", "hex", "rgb", "hsl", "markdown"];
  const foundFormats = formats.filter((format) => new RegExp(`(?:^|[^a-z])${format}(?:$|[^a-z])`, "i").test(normalized));
  if (foundFormats.length) result.push({ kind: "format", label: local(locale, { tr: "Biçimler", en: "Formats", de: "Formate", zh: "格式" }), value: foundFormats.join(" → ") });
  const urls = goal.match(/https?:\/\/[^\s<>"']+/gi) ?? [];
  urls.slice(0, 3).forEach((value) => { try { result.push({ kind: "url-host", label: "URL host", value: new URL(value).hostname }); } catch { /* malformed URL stays unreported */ } });
  const numbers = goal.match(/(?<![\p{L}\p{N}])[-+]?\d+(?:[.,]\d+)?(?:\s*%|\s*(?:mb|gb|kb|px|token))?/giu) ?? [];
  if (numbers.length) result.push({ kind: "number", label: local(locale, { tr: "Sayısal parametreler", en: "Numeric parameters", de: "Numerische Parameter", zh: "数值参数" }), value: numbers.slice(0, 8).join(", ") });
  const languageNames = [["tr", "türkçe", "turkish"], ["en", "ingilizce", "english"], ["de", "almanca", "german", "deutsch"], ["zh", "çince", "chinese", "中文"]];
  const languages = languageNames.filter(([, ...names]) => names.some((name) => normalized.includes(normalize(name, locale)))).map(([code]) => code);
  if (languages.length) result.push({ kind: "language", label: local(locale, { tr: "Diller", en: "Languages", de: "Sprachen", zh: "语言" }), value: languages.join(", ") });
  if (conceptGroups[6].some((term) => normalized.includes(normalize(term, locale)))) result.push({ kind: "privacy", label: local(locale, { tr: "Gizlilik sinyali", en: "Privacy signal", de: "Datenschutzsignal", zh: "隐私信号" }), value: local(locale, { tr: "Yerel işleme ve maskeleme tercih edildi", en: "Local processing and masking preferred", de: "Lokale Verarbeitung und Maskierung bevorzugt", zh: "优先本地处理与遮蔽" }) });
  if (/\b(file|dosya|datei|upload|yükle|图片|文件)\b/iu.test(normalized)) result.push({ kind: "file", label: local(locale, { tr: "Dosya adımı", en: "File step", de: "Dateischritt", zh: "文件步骤" }), value: local(locale, { tr: "Dosya kullanıcı tarafından seçilmeli", en: "The user must choose the file", de: "Die Datei muss vom Nutzer gewählt werden", zh: "文件必须由用户选择" }) });
  return result;
}

type Recipe = { test: RegExp[]; steps: string[]; signal: Record<Locale, string> };
const recipes: Recipe[] = [
  { test: [/json[\s\S]{0,500}csv/i, /(mask|maskele|redact|kvkk|gdpr|gizli|privacy|hassas|sensitive|personenbezogen|敏感|隐私)/i], steps: ["json-bicimlendirici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"], signal: { tr: "JSON doğrulama, hassas veri maskeleme ve CSV teslim zinciri", en: "JSON validation, sensitive-data masking, and CSV delivery workflow", de: "JSON-Prüfung, Maskierung sensibler Daten und CSV-Ausgabe", zh: "JSON 验证、敏感数据遮蔽与 CSV 输出流程" } },
  { test: [/csv/i, /(mask|maskele|redact|kvkk|gdpr|gizli|privacy|hassas|sensitive|personenbezogen|敏感|隐私)/i], steps: ["csv-inceleyici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"], signal: { tr: "CSV inceleme, gizlilik maskeleme ve dönüşüm zinciri", en: "CSV inspection, privacy masking, and conversion workflow", de: "CSV-Prüfung, Datenschutzmaskierung und Konvertierung", zh: "CSV 检查、隐私遮蔽与转换流程" } },
  { test: [/(prompt|system|persona|talimat|提示词)/i, /(güven|security|injection|test|netlik|clarity|安全|测试)/i], steps: ["sistem-promptu-netlik-kontrolu", "prompt-enjeksiyon-on-taramasi", "prompt-test-vaka-matrisi"], signal: { tr: "Prompt netliği ve güvenlik doğrulama zinciri", en: "Prompt clarity and safety validation chain", de: "Prompt-Klarheits- und Sicherheitskette", zh: "提示词清晰度与安全验证链" } },
  { test: [/(seo|canonical|hreflang|robots|schema|index|sitemap)/i], steps: ["seo-slug-olusturucu", "robots-txt-olusturucu-denetleyici", "hreflang-etiket-olusturucu", "faq-json-ld-olusturucu"], signal: { tr: "Teknik SEO yayın öncesi kontrolü", en: "Pre-publication technical SEO review", de: "Technische SEO-Prüfung vor Veröffentlichung", zh: "发布前技术 SEO 检查" } },
  { test: [/(header|başlık|csp|hsts|http|tls|响应头)/i, /(security|güven|audit|denet|安全)/i], steps: ["http-guvenlik-basliklari-denetleyici", "csp-olusturucu-denetleyici"], signal: { tr: "HTTP güvenlik başlığı ve CSP ön denetimi", en: "HTTP security-header and CSP pre-audit", de: "HTTP-Sicherheitsheader- und CSP-Vorprüfung", zh: "HTTP 安全响应头与 CSP 预审" } },
  { test: [/(pdf)/i, /(merge|birleştir|split|böl|image|görsel|resim|合并|拆分|图片)/i], steps: ["pdf-birlestirme", "pdf-bolme", "pdf-gorsele"], signal: { tr: "Yerel PDF iş akışı", en: "Local PDF workflow", de: "Lokaler PDF-Arbeitsablauf", zh: "本地 PDF 流程" } },
  { test: [/(json)/i, /(compare|diff|fark|karşılaştır|比较)/i], steps: ["json-bicimlendirici", "json-diff-karsilastirma"], signal: { tr: "JSON doğrulama ve yapısal karşılaştırma", en: "JSON validation and structural comparison", de: "JSON-Prüfung und Strukturvergleich", zh: "JSON 验证与结构比较" } },
  { test: [/(url|link|网址)/i, /(security|risk|güven|şüpheli|安全)/i], steps: ["url-sorgu-parametresi-analizoru", "url-guvenlik-on-kontrolu"], signal: { tr: "URL yapısı ve risk ön taraması", en: "URL structure and risk pre-scan", de: "URL-Struktur- und Risiko-Vorprüfung", zh: "URL 结构与风险预扫描" } },
  { test: [/(rag|context|bağlam|retrieval|检索)/i], steps: ["rag-parcalama-butcesi-planlayici", "prompt-enjeksiyon-on-taramasi"], signal: { tr: "RAG kapasite ve talimat güveni ayrımı", en: "RAG capacity and instruction-trust separation", de: "RAG-Kapazität und Instruktionsvertrauen", zh: "RAG 容量与指令信任分离" } },
  { test: [/(image|görsel|resim|foto|bild|图片|照片)/i, /(privacy|gizlilik|exif|metadata|konum|gps|datenschutz|隐私|位置)/i], steps: ["exif-meta-veri-temizleyici", "gorsel-sikistirici", "gorsel-format-donusturucu"], signal: { tr: "Görsel meta veri temizleme ve teslim akışı", en: "Image metadata cleanup and delivery flow", de: "Bildmetadaten-Bereinigung und Ausgabe", zh: "图像元数据清理与交付流程" } },
  { test: [/(jwt|token)/i, /(decode|çöz|inspect|incele|ablauf|解码|检查)/i], steps: ["jwt-decoder", "unix-zaman-damgasi-donusturucu", "json-bicimlendirici"], signal: { tr: "JWT yapısı ve zaman alanları incelemesi", en: "JWT structure and timestamp inspection", de: "JWT-Struktur- und Zeitstempelprüfung", zh: "JWT 结构与时间戳检查" } },
  { test: [/(code|kod|source|kaynak|quellcode|代码)/i, /(secret|gizli|security|güven|scan|tara|sicherheit|安全|扫描)/i], steps: ["kod-guvenligi-on-taramasi", "dosya-risk-on-taramasi", "dosya-hash-karsilastirici"], signal: { tr: "Kod ve dosya güvenliği ön denetimi", en: "Code and file safety pre-audit", de: "Code- und Dateisicherheits-Vorprüfung", zh: "代码与文件安全预审" } },
  { test: [/(citation|atıf|kaynakça|apa|mla|zitat|引用)/i], steps: ["kaynakca-atif-formatlayici", "unicode-normalizasyon-inceleyici"], signal: { tr: "Kaynakça biçimi ve Unicode tutarlılığı", en: "Citation formatting and Unicode consistency", de: "Zitierformat und Unicode-Konsistenz", zh: "引用格式与 Unicode 一致性" } },
];

function stepReason(locale: Locale, tool: Tool, index: number) {
  return local(locale, {
    tr: `${index + 1}. aşamada ${tool.title.tr}, hedefin bu bölümünü açıklanabilir yerel kurallarla işler.`,
    en: `At stage ${index + 1}, ${tool.title.en} handles this part of the goal with explainable local rules.`,
    de: `In Stufe ${index + 1} verarbeitet ${tool.title.de} diesen Teil mit nachvollziehbaren lokalen Regeln.`,
    zh: `第 ${index + 1} 步由${tool.title.zh}使用可解释的本地规则处理该部分目标。`,
  });
}

function splitGoal(goal: string) {
  return goal.split(/\s*(?:→|=>|->|;|\bsonra\b|\bthen\b|\banschließend\b|然后|接着|\r?\n\s*(?:[-*]|\d+[.)])?)\s*/iu).map((item) => item.trim()).filter(Boolean).slice(0, 6);
}

export function createAgentPlan(goal: string, catalog: Tool[], locale: Locale): AgentPlan {
  const cleanGoal = goal.trim().slice(0, 20_000);
  const normalizedGoal = normalize(cleanGoal, locale);
  const signals: string[] = [];
  let selected: Tool[] = [];
  const segments = splitGoal(cleanGoal);
  if (segments.length > 1) {
    selected = segments.map((segment) => semanticToolSearch(segment, catalog, locale, 1)[0]?.tool).filter((tool): tool is Tool => Boolean(tool));
    signals.push(local(locale, { tr: "Açık çok adımlı sıra algılandı", en: "Explicit multi-step sequence detected", de: "Explizite Schrittfolge erkannt", zh: "检测到明确的多步骤顺序" }));
  }
  if (!selected.length) {
    const recipe = recipes.find((item) => item.test.every((pattern) => pattern.test(normalizedGoal)));
    if (recipe) {
      selected = recipe.steps.map((slug) => catalog.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool));
      signals.push(recipe.signal[locale]);
    }
  }
  const ranked = semanticToolSearch(cleanGoal, catalog, locale, 5);
  if (!selected.length && ranked.length) selected = [ranked[0].tool];
  if (!selected.length) selected = catalog.filter((tool) => ["prompt-kalite-denetimi", "metin-temizleyici", "json-bicimlendirici"].includes(tool.slug)).slice(0, 3);
  selected = selected.filter((tool, index, list) => list.findIndex((item) => item.slug === tool.slug) === index).slice(0, 6);
  if (ranked[0]) signals.push(local(locale, { tr: `En güçlü semantik eşleşme: ${ranked[0].tool.title.tr}`, en: `Strongest semantic match: ${ranked[0].tool.title.en}`, de: `Stärkster semantischer Treffer: ${ranked[0].tool.title.de}`, zh: `最强语义匹配：${ranked[0].tool.title.zh}` }));
  const extracted = extractAgentParameters(cleanGoal, locale);
  if (extracted.length) signals.push(local(locale, { tr: `${extracted.length} parametre grubu çıkarıldı`, en: `${extracted.length} parameter groups extracted`, de: `${extracted.length} Parametergruppen extrahiert`, zh: `提取了 ${extracted.length} 组参数` }));
  const steps = selected.map((tool, index): AgentPlanStep => ({
    id: `step-${index + 1}-${tool.slug}`,
    toolSlug: tool.slug,
    title: tool.title[locale],
    reason: stepReason(locale, tool, index),
    inputMode: fileTools.has(tool.slug) ? "manual" : index === 0 ? "goal" : "previous",
    requiresFile: fileTools.has(tool.slug),
    parameterHints: extracted.map((item) => `${item.label}: ${item.value}`).slice(0, 5),
  }));
  const manualSteps = steps.filter((step) => step.requiresFile).length;
  if (manualSteps) signals.push(local(locale, { tr: `${manualSteps} adım dosya seçimi için açık kullanıcı eylemi istiyor`, en: `${manualSteps} steps require explicit user file selection`, de: `${manualSteps} Schritte erfordern eine ausdrückliche Dateiauswahl`, zh: `${manualSteps} 个步骤需要用户明确选择文件` }));
  const topScore = ranked[0]?.score ?? 0; const runnerUp = ranked[1]?.score ?? 0;
  const confidence = Math.max(.35, Math.min(.94, .52 + Math.min(.28, topScore / 80) + Math.min(.14, Math.max(0, topScore - runnerUp) / 50)));
  return {
    version: AGENT_VERSION, locale, goal: cleanGoal, confidence, signals, extracted, steps,
    limitations: [
      local(locale, { tr: "Bu plan büyük dil modeli çıktısı değil; sürümlenmiş semantik puanlar ve açıklanabilir kurallarla üretilir.", en: "This plan is not large-language-model output; it is generated from versioned semantic scores and explainable rules.", de: "Dieser Plan ist keine LLM-Ausgabe, sondern entsteht aus versionierten semantischen Bewertungen und nachvollziehbaren Regeln.", zh: "该计划不是大语言模型输出，而是由版本化语义评分与可解释规则生成。" }),
      local(locale, { tr: "Ajan gizli düşünce zinciri göstermez; yalnızca karar sinyallerini ve seçilen adımları açıklar.", en: "The agent does not expose hidden chain-of-thought; it shows decision signals and selected steps only.", de: "Der Agent zeigt keine verborgene Gedankenkette, sondern nur Entscheidungssignale und gewählte Schritte.", zh: "助手不展示隐藏思维链，只显示决策信号与所选步骤。" }),
      local(locale, { tr: "Dosya seçimi, indirme ve yüksek etkili sonuçlar kullanıcı onayı gerektirir.", en: "File selection, downloads, and high-impact results require user confirmation.", de: "Dateiauswahl, Downloads und folgenreiche Ergebnisse erfordern Nutzerbestätigung.", zh: "文件选择、下载和高影响结果需要用户确认。" }),
    ],
  };
}

export function translateAgentError(raw: string, locale: Locale): ErrorTranslation {
  const text = raw.trim().slice(0, 30_000);
  const rule = [
    { pattern: /json|unexpected token|property name|position \d+/i, key: "json", slugs: ["json-bicimlendirici"] },
    { pattern: /yaml|indent|mapping|sequence|alias/i, key: "yaml", slugs: ["yaml-json-donusturucu"] },
    { pattern: /jwt|base64url|token.*segment|invalid character/i, key: "jwt", slugs: ["jwt-decoder", "base64-kodlayici"] },
    { pattern: /regex|regular expression|unterminated|backtrack/i, key: "regex", slugs: ["regex-test-araci"] },
    { pattern: /cron|minute|hour|day of month/i, key: "cron", slugs: ["cron-ifadesi-aciklayici"] },
    { pattern: /csp|content.security.policy|refused to (?:load|connect|execute)/i, key: "csp", slugs: ["csp-olusturucu-denetleyici", "http-guvenlik-basliklari-denetleyici"] },
    { pattern: /permission|notallowed|microphone|speech recognition/i, key: "permission", slugs: [] },
    { pattern: /memory|heap|too large|file size|exceeds.*mb/i, key: "size", slugs: ["dosya-risk-on-taramasi"] },
    { pattern: /network|fetch|cors|failed to fetch|dns|timeout/i, key: "network", slugs: ["url-guvenlik-on-kontrolu", "http-guvenlik-basliklari-denetleyici"] },
  ].find((item) => item.pattern.test(text)) ?? { key: "generic", slugs: ["metin-temizleyici"] };
  const messages: Record<string, Record<Locale, { title: string; explanation: string; actions: string[] }>> = {
    json: { tr: { title: "JSON sözdizimi okunamadı", explanation: "Mesaj genellikle eksik çift tırnak, fazladan virgül veya kapanmayan parantez gösterir.", actions: ["Hata konumunun çevresini kontrol edin.", "Tek tırnak yerine çift tırnak kullanın.", "JSON Biçimlendirici ile yeniden doğrulayın."] }, en: { title: "JSON syntax could not be parsed", explanation: "This usually points to a missing double quote, trailing comma, or unclosed bracket.", actions: ["Inspect the area around the reported position.", "Use double quotes for keys and strings.", "Validate again with JSON Formatter."] }, de: { title: "JSON-Syntax konnte nicht gelesen werden", explanation: "Meist fehlen Anführungszeichen, es gibt ein zusätzliches Komma oder eine Klammer ist offen.", actions: ["Stelle um die Fehlerposition prüfen.", "Doppelte Anführungszeichen verwenden.", "Mit dem JSON-Formatierer erneut prüfen."] }, zh: { title: "无法解析 JSON 语法", explanation: "通常原因是缺少双引号、多余逗号或括号未闭合。", actions: ["检查错误位置附近内容。", "键与字符串使用双引号。", "用 JSON 格式化工具再次验证。"] } },
    yaml: { tr: { title: "YAML yapısı geçersiz", explanation: "Girinti, liste işareti veya anahtar/değer yapısı aynı blokta tutarlı değil.", actions: ["Sekme yerine boşluk kullanın.", "Aynı seviyedeki satırları eşit girintileyin.", "YAML ↔ JSON aracında doğrulayın."] }, en: { title: "YAML structure is invalid", explanation: "Indentation, list markers, or key/value structure is inconsistent within a block.", actions: ["Use spaces instead of tabs.", "Align lines at the same level.", "Validate in YAML ↔ JSON Converter."] }, de: { title: "YAML-Struktur ist ungültig", explanation: "Einrückung, Listenzeichen oder Schlüssel/Wert-Struktur sind im Block uneinheitlich.", actions: ["Leerzeichen statt Tabs verwenden.", "Gleiche Ebenen gleich einrücken.", "Im YAML-JSON-Konverter prüfen."] }, zh: { title: "YAML 结构无效", explanation: "同一块中的缩进、列表标记或键值结构不一致。", actions: ["使用空格而不是制表符。", "同级行保持相同缩进。", "在 YAML ↔ JSON 工具中验证。"] } },
    jwt: { tr: { title: "JWT/Base64URL biçimi okunamadı", explanation: "Token üç bölümden oluşmuyor veya header/payload geçerli Base64URL JSON değil.", actions: ["Tokenı boşluk olmadan kopyalayın.", "Üç nokta ayrımlı bölümü kontrol edin.", "Decode işleminin imza doğrulaması olmadığını unutmayın."] }, en: { title: "JWT/Base64URL format could not be read", explanation: "The token lacks three segments or its header/payload is not valid Base64URL JSON.", actions: ["Copy the token without whitespace.", "Check the three dot-separated segments.", "Remember that decoding does not verify a signature."] }, de: { title: "JWT/Base64URL-Format ist nicht lesbar", explanation: "Das Token hat nicht drei Segmente oder Header/Payload sind kein gültiges Base64URL-JSON.", actions: ["Token ohne Leerraum kopieren.", "Drei durch Punkte getrennte Teile prüfen.", "Dekodieren ist keine Signaturprüfung."] }, zh: { title: "无法读取 JWT/Base64URL 格式", explanation: "Token 不是三段结构，或 header/payload 不是有效 Base64URL JSON。", actions: ["复制时移除空白。", "检查三个点分段。", "解码不等于签名验证。"] } },
    regex: { tr: { title: "Regex deseni geçersiz veya pahalı", explanation: "Parantez/kaçış hatası ya da aşırı geri izleme riski olabilir.", actions: ["Deseni küçük parçalarla deneyin.", "İç içe sınırsız tekrarları azaltın.", "Regex test aracının zaman sınırında doğrulayın."] }, en: { title: "Regex pattern is invalid or expensive", explanation: "There may be a bracket/escape error or excessive backtracking.", actions: ["Test a smaller pattern first.", "Reduce nested unbounded repetition.", "Use the time-bounded Regex Tester."] }, de: { title: "Regex ist ungültig oder aufwendig", explanation: "Möglicherweise fehlen Klammern/Escapes oder Backtracking ist übermäßig.", actions: ["Kleineres Muster testen.", "Verschachtelte Wiederholungen reduzieren.", "Im zeitbegrenzten Regex-Tester prüfen."] }, zh: { title: "正则表达式无效或开销过高", explanation: "可能存在括号/转义错误或过度回溯。", actions: ["先测试更小模式。", "减少嵌套无限重复。", "使用带时限的正则测试工具。"] } },
    cron: { tr: { title: "Cron ifadesi geçersiz", explanation: "Klasik cron beş alan ister; her alanın aralığı ve sözdizimi farklıdır.", actions: ["Alan sayısını beşe indirin.", "Dakika ve saat aralıklarını kontrol edin.", "Cron açıklayıcıda örnekle karşılaştırın."] }, en: { title: "Cron expression is invalid", explanation: "Classic cron requires five fields with different ranges and syntax.", actions: ["Use exactly five fields.", "Check minute and hour ranges.", "Compare with a demo in Cron Explainer."] }, de: { title: "Cron-Ausdruck ist ungültig", explanation: "Klassisches Cron benötigt fünf Felder mit unterschiedlichen Bereichen.", actions: ["Genau fünf Felder verwenden.", "Minuten- und Stundenbereich prüfen.", "Im Cron-Erklärer vergleichen."] }, zh: { title: "Cron 表达式无效", explanation: "经典 Cron 需要五个字段，每个字段范围和语法不同。", actions: ["使用恰好五个字段。", "检查分钟与小时范围。", "在 Cron 解释器中对照示例。"] } },
    csp: { tr: { title: "İçerik Güvenlik Politikası işlemi engelledi", explanation: "Tarayıcı, izin listesinde olmayan bir kaynak veya çalıştırma biçimi gördü.", actions: ["Konsoldaki engellenen direktifi bulun.", "Kaynağı otomatik olarak genişletmeyin; ihtiyacı doğrulayın.", "CSP denetleyicide en dar kuralı test edin."] }, en: { title: "Content Security Policy blocked an operation", explanation: "The browser found a source or execution mode outside the allowlist.", actions: ["Identify the blocked directive in the console.", "Do not broaden policy automatically; verify the need.", "Test the narrowest rule in CSP Auditor."] }, de: { title: "Content Security Policy hat einen Vorgang blockiert", explanation: "Eine Quelle oder Ausführungsart war nicht in der Allowlist.", actions: ["Blockierte Direktive in der Konsole finden.", "Policy nicht pauschal erweitern.", "Engste Regel im CSP-Prüfer testen."] }, zh: { title: "内容安全策略阻止了操作", explanation: "浏览器发现来源或执行方式不在允许列表中。", actions: ["在控制台查找被阻止的指令。", "不要直接放宽策略，先确认需要。", "在 CSP 审计器中测试最小规则。"] } },
    permission: { tr: { title: "Tarayıcı izni veya yerel özellik kullanılamıyor", explanation: "Özellik desteklenmiyor, izin reddedildi veya gerekli cihaz içi dil paketi yok.", actions: ["Site iznini tarayıcı ayarından kontrol edin.", "Yalnızca cihaz içi seçeneği destekleyen güncel tarayıcı kullanın.", "Metin girişine geri dönün."] }, en: { title: "Browser permission or local feature is unavailable", explanation: "The feature may be unsupported, denied, or missing an on-device language pack.", actions: ["Review site permission in browser settings.", "Use a current browser with on-device support.", "Fall back to text input."] }, de: { title: "Browserberechtigung oder lokale Funktion fehlt", explanation: "Die Funktion wird nicht unterstützt, wurde abgelehnt oder das lokale Sprachpaket fehlt.", actions: ["Website-Berechtigung prüfen.", "Aktuellen Browser mit lokaler Erkennung nutzen.", "Texteingabe verwenden."] }, zh: { title: "浏览器权限或本地功能不可用", explanation: "可能不受支持、权限被拒绝，或缺少设备端语言包。", actions: ["检查浏览器中的网站权限。", "使用支持设备端识别的现代浏览器。", "改用文本输入。"] } },
    size: { tr: { title: "Girdi cihaz sınırını aşıyor", explanation: "Dosya veya çözülen içerik bu aracın bellek ve süre sınırından büyük.", actions: ["Orijinalin kopyasıyla dosyayı bölün.", "Daha küçük örnekle yöntemi doğrulayın.", "Mobilde başka sekmeleri kapatın."] }, en: { title: "Input exceeds the device boundary", explanation: "The file or decoded content is larger than this tool's memory/time limit.", actions: ["Split a copy of the original.", "Verify the method on a smaller sample.", "Close other tabs on mobile."] }, de: { title: "Eingabe überschreitet die Gerätegrenze", explanation: "Datei oder dekodierter Inhalt ist größer als das Speicher-/Zeitlimit.", actions: ["Eine Kopie aufteilen.", "Methode mit kleiner Probe prüfen.", "Andere mobile Tabs schließen."] }, zh: { title: "输入超过设备限制", explanation: "文件或解码内容超过该工具的内存/时间限制。", actions: ["拆分原件副本。", "先用较小样本验证方法。", "在移动设备上关闭其他标签页。"] } },
    network: { tr: { title: "Ağ veya kaynak ilkesi isteği tamamlamadı", explanation: "URL erişilemiyor, zaman aşımı, CORS veya çevrimdışı durum olabilir. ByteQuant ajanı hedefe kendisi istek yapmaz.", actions: ["URL'yi ayrı sekmede yetkili biçimde doğrulayın.", "CORS ve yönlendirme zincirini sunucu tarafında inceleyin.", "Gizli anahtarları hata metninden çıkarın."] }, en: { title: "Network or resource policy prevented completion", explanation: "The URL may be unreachable, timed out, blocked by CORS, or offline. The ByteQuant agent does not fetch the target itself.", actions: ["Verify the URL in an authorized separate tab.", "Inspect CORS and redirects server-side.", "Remove secrets from the error text."] }, de: { title: "Netzwerk- oder Ressourcenregel verhinderte den Abschluss", explanation: "URL, Timeout, CORS oder Offlinezustand können die Ursache sein. Der Agent ruft das Ziel nicht selbst ab.", actions: ["URL autorisiert separat prüfen.", "CORS und Weiterleitungen serverseitig prüfen.", "Geheimnisse aus Fehlermeldungen entfernen."] }, zh: { title: "网络或资源策略阻止完成", explanation: "可能是 URL 不可达、超时、CORS 或离线。ByteQuant 助手不会自行请求目标。", actions: ["在授权的独立标签页验证 URL。", "在服务端检查 CORS 与重定向。", "从错误文本中移除秘密。"] } },
    generic: { tr: { title: "Teknik hata sadeleştirildi", explanation: "Mesaj bilinen özel kalıplardan biriyle eşleşmedi. İlk hatayı ve onu doğuran girdiyi izole etmek gerekir.", actions: ["Sır ve kişisel veriyi kaldırın.", "En küçük yeniden üretilebilir örneği oluşturun.", "İlk stack satırını ve tarayıcı sürümünü kaydedin."] }, en: { title: "Technical error simplified", explanation: "The message did not match a known specific pattern. Isolate the first error and the smallest input that triggers it.", actions: ["Remove secrets and personal data.", "Create a minimal reproducible example.", "Record the first stack line and browser version."] }, de: { title: "Technischer Fehler vereinfacht", explanation: "Die Meldung passt zu keinem bekannten Spezialmuster. Isolieren Sie den ersten Fehler und die kleinste auslösende Eingabe.", actions: ["Geheimnisse und Personendaten entfernen.", "Minimales Beispiel erstellen.", "Erste Stack-Zeile und Browser notieren."] }, zh: { title: "技术错误已简化", explanation: "该消息不匹配已知特定模式。请隔离第一个错误及触发它的最小输入。", actions: ["移除秘密和个人数据。", "创建最小可复现示例。", "记录首个堆栈行与浏览器版本。"] } },
  };
  const match = messages[rule.key][locale];
  return { ...match, suggestedSlugs: rule.slugs, boundary: local(locale, { tr: "Bu açıklama yerel örüntü eşlemesidir; kök neden analizi veya güvenlik onayı değildir.", en: "This explanation is local pattern matching, not root-cause analysis or security approval.", de: "Diese Erklärung ist lokale Mustererkennung, keine Ursachenanalyse oder Sicherheitsfreigabe.", zh: "该解释来自本地模式匹配，不是根因分析或安全批准。" }) };
}
