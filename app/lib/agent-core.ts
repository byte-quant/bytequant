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
  operation?: "encode" | "decode" | "csv-to-json" | "json-to-csv" | "format" | "minify" | "sort" | "deduplicate" | "mask" | "inspect" | "extract";
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
  response: string;
  alternativeSlugs: string[];
  matchQuality: "strong" | "review";
  clarifyingQuestions: string[];
  nextActions: string[];
  goalFrame: { outcome: string; input: string; delivery: string; safety: string };
  planReview: string[];
  conversation: {
    isFollowUp: boolean;
    intentSummary: string;
    contextNote: string;
    suggestedReplies: string[];
  };
  coverage: {
    requested: string[];
    covered: string[];
    missing: string[];
  };
};

export type AgentSession = {
  plan: AgentPlan;
  currentStep: number;
  stepOutputs: Record<string, string>;
  completedStepIds: string[];
  preparedInput?: string;
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
  ["bill", "tip", "split", "bahşiş", "hesap böl", "trinkgeld", "rechnung teilen", "小费", "分账"],
  ["salary", "hourly", "maaş", "ücret", "gehalt", "stundenlohn", "薪资", "时薪"],
  ["date", "duration", "age", "tarih", "süre", "yaş", "datum", "dauer", "alter", "日期", "时长", "年龄"],
  ["deduplicate", "sort lines", "tekilleştir", "satır sırala", "duplikate", "zeilen sortieren", "去重", "行排序"],
  ["cors", "oauth", "cache-control", "content-disposition", "cookie", "redirect uri", "yönlendirme", "weiterleitung", "重定向", "缓存"],
  ["pivot", "reshape", "long wide", "uzun geniş", "sabit genişlik", "fixed width", "umformen", "透视", "长表", "宽表"],
  ["pico", "boolean search", "evidence gap", "kanıt boşluğu", "güncellik", "freshness", "evidenzlücke", "布尔检索", "证据缺口"],
  ["anonymisation", "anonymization", "anonimleştirme", "retention", "saklama süresi", "aufbewahrung", "匿名化", "保留期限"],
  ["cagr", "roas", "roi", "growth", "büyüme", "return on ad spend", "wachstum", "增长率", "广告回报"],
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
  research: ["research", "evidence", "source", "araştırma", "kanıt", "kaynak", "recherche", "quelle", "研究", "证据", "来源"],
};

function normalize(value: string, locale: Locale) {
  return value.toLocaleLowerCase(localeTags[locale]).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[ıİ]/g, "i").replace(/ß/g, "ss").replace(/[^\p{L}\p{N}+#./-]+/gu, " ").trim();
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
  const directTokens = new Set(tokens(query, locale));
  const queryTokens = expandQuery(query, locale);
  if (!normalizedQuery) return [];
  return catalog.map((tool) => {
    const fields = [
      { value: tool.title[locale], weight: 8, direct: true }, { value: tool.slug, weight: 6, direct: true }, { value: tool.short[locale], weight: 4 },
      { value: tool.description[locale], weight: 2 }, { value: tool.useCases[locale].join(" "), weight: 3 },
      { value: categoryTerms[tool.category].join(" "), weight: 2 }, { value: `${tool.title.tr} ${tool.title.en}`, weight: 1.5 },
    ];
    let score = 0; const matched = new Set<string>();
    fields.forEach((field) => {
      const normalizedField = normalize(field.value, locale);
      if (normalizedField.includes(normalizedQuery)) score += field.weight * 3;
      if (field.direct) {
        const fieldTokens = new Set(tokens(field.value, locale));
        directTokens.forEach((token) => {
          if (fieldTokens.has(token)) { score += field.weight * 2.5; matched.add(token); }
        });
      }
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

/** Extracts user data only when the message contains a strong data boundary. */
export function extractAgentPayload(goal: string) {
  const bounded = goal.slice(0, 200_000);
  const fenced = bounded.match(/```(?:json|csv|yaml|xml|text|txt|md|markdown)?\s*\r?\n?([\s\S]*?)```/i)?.[1]?.trim();
  if (fenced) return fenced.slice(0, 180_000);

  const labelled = bounded.match(/(?:^|\n|\b)(?:girdi|veri|metin|input|data|inhalt|eingabe|输入|数据)\s*:\s*([\s\S]+)/iu)?.[1]?.trim();
  if (labelled) return labelled.slice(0, 180_000);

  for (const opener of ["{", "["] as const) {
    const start = bounded.indexOf(opener);
    if (start < 0) continue;
    const candidate = bounded.slice(start).trim();
    try { JSON.parse(candidate); return candidate.slice(0, 180_000); } catch { /* not a complete JSON payload */ }
  }

  // Tokens and URLs are common one-line inputs. Requiring a data label made
  // apparently successful JWT/QR handoffs arrive at an empty tool before.
  const jwt = bounded.match(/\beyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]*(?=$|\s)/u)?.[0];
  if (jwt) return jwt.slice(0, 180_000);
  const url = bounded.match(/https?:\/\/[^\s<>"']+/iu)?.[0];
  if (url && /(?:qr|encode|decode|kodla|coz|çöz|analiz|incele|check|pruf|prüf|生成|编码|解码|检查)/iu.test(bounded.slice(0, Math.max(0, bounded.indexOf(url))))) return url.slice(0, 180_000);

  const colon = bounded.search(/:\s+/);
  if (colon >= 0) {
    const lead = bounded.slice(0, colon);
    const tail = bounded.slice(colon + 1).trim();
    const explicitAction = /(?:girdi|veri|metin|input|data|content|inhalt|eingabe|输入|数据|bicimlendir|biçimlendir|format|donustur|dönüştür|cevir|çevir|convert|\byap\b|\bmake\b|maskele|mask|redact|kodla|encode|decode|coz|çöz|olustur|oluştur|generate|temizle|clean|sirala|sırala|sort|incele|inspect|compare|karsilastir|karşılaştır)/iu.test(lead);
    if (tail && (explicitAction || /@|https?:\/\/|\b(?:true|false|null)\b|[,\t].*[,\t]/iu.test(tail))) return tail.slice(0, 180_000);
  }

  const lines = bounded.split(/\r?\n/);
  const structuredLine = lines.findIndex((line, index) => index > 0 && /[,\t;]/.test(line) && /[,\t;]/.test(lines[index + 1] ?? ""));
  if (structuredLine >= 0) return lines.slice(structuredLine).join("\n").trim().slice(0, 180_000);
  return "";
}

type Recipe = { test: RegExp[]; steps: string[]; signal: Record<Locale, string> };
const recipes: Recipe[] = [
  { test: [/(tip|bahşiş|trinkgeld|小费|bill split|hesap böl|rechnung teilen|分账)/i], steps: ["bahsis-hesap-bolusturucu"], signal: { tr: "Genel kullanıcı için alan bazlı hesap ve bahşiş paylaşımı", en: "Field-based bill and tip split for everyday use", de: "Feldbasierte Rechnungs- und Trinkgeldaufteilung", zh: "面向日常使用的字段式账单与小费分摊" } },
  { test: [/(email|e-posta|e-mail|邮件)/i, /(clean|temiz|duplicate|tekrar|bereinig|duplikat|清理|重复)/i], steps: ["e-posta-listesi-temizleyici", "satir-siralayici-tekillestirici"], signal: { tr: "E-posta ayıklama ve tekrarsız liste hazırlama", en: "Email extraction and deduplicated list preparation", de: "E-Mail-Extraktion und duplikatfreie Liste", zh: "电子邮件提取与去重列表流程" } },
  { test: [/(csp|content security policy)/i, /(merge|birleştir|combine|zusammenführ|合并)/i], steps: ["csp-direktif-birlestirici", "sri-butunluk-hash-uretici"], signal: { tr: "CSP birleştirme ve kaynak bütünlüğü ön kontrolü", en: "CSP merge and resource-integrity preflight", de: "CSP-Zusammenführung und Integritäts-Vorprüfung", zh: "CSP 合并与资源完整性预检" } },
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
  { test: [/(cors|oauth|redirect|yönlendirme|weiterleitung|重定向)/i], steps: ["cors-politikasi-denetleyici", "oauth-yonlendirme-uri-denetleyici", "http-cache-control-olusturucu"], signal: { tr: "Origin, kimlik dönüşü ve önbellek sınırlarını birlikte doğrulayan API teslim akışı", en: "API delivery flow covering origins, identity redirects, and cache boundaries", de: "API-Auslieferung mit Origin-, OAuth-Redirect- und Cache-Grenzen", zh: "覆盖来源、身份重定向和缓存边界的 API 交付流程" } },
  { test: [/(csv|table|tablo|tabelle|表格)/i, /(pivot|reshape|long|wide|uzun|geniş|umform|透视|长表|宽表)/i], steps: ["csv-inceleyici", "csv-pivot-ozeti", "csv-uzun-genis-donusturucu"], signal: { tr: "CSV kalite kontrolü, pivot özeti ve uzun-geniş yeniden şekillendirme", en: "CSV quality check, pivot summary, and long-wide reshaping", de: "CSV-Prüfung, Pivot-Zusammenfassung und Long-Wide-Umformung", zh: "CSV 质量检查、透视汇总与长宽重塑" } },
  { test: [/(research|araştır|recherche|研究|evidence|kanıt|evidenz|证据)/i], steps: ["pico-arastirma-sorusu-olusturucu", "boolean-arama-stratejisi-olusturucu", "iddia-kanit-boslugu-inceleyici", "kaynak-guncellik-takipcisi"], signal: { tr: "Sorudan arama stratejisine, iddia kanıtına ve güncellik kontrolüne uzanan araştırma zinciri", en: "Research chain from question and search strategy to claim evidence and freshness", de: "Recherchekette von Frage und Suche bis Evidenz und Aktualität", zh: "从问题和检索策略到主张证据与时效核验的研究链" } },
  { test: [/(retention|saklama|aufbewahrung|保留|anonym|anonim|匿名)/i], steps: ["veri-saklama-suresi-planlayici", "anonimlestirme-risk-on-kontrolu", "kvkk-veri-maskeleyici"], signal: { tr: "Veri saklama gerekçesi, yeniden tanımlama riski ve kontrollü maskeleme", en: "Retention purpose, re-identification risk, and controlled masking", de: "Aufbewahrungszweck, Re-Identifikationsrisiko und kontrollierte Maskierung", zh: "数据保留目的、重新识别风险与受控掩码" } },
  { test: [/(few-shot|example|örnek|beispiel|示例)/i, /(test|coverage|kapsam|evaluation|değerlendir|bewert|评估)/i], steps: ["few-shot-kapsama-analizoru", "degerlendirme-veri-seti-sablonu", "talimat-cakisma-denetleyici"], signal: { tr: "Örnek kapsamı, değerlendirme vakası ve talimat çakışması için prompt kalite zinciri", en: "Prompt quality chain for example coverage, evaluation cases, and instruction conflicts", de: "Prompt-Qualitätskette für Beispielabdeckung, Evaluation und Konflikte", zh: "用于示例覆盖、评估用例和指令冲突的提示词质量链" } },
  { test: [/(cagr|roas|roi|growth|büyüme|wachstum|增长|回报)/i], steps: ["cagr-hesaplayici", "roas-roi-hesaplayici"], signal: { tr: "Büyüme ve reklam getirisi varsayımlarını ayrı gösteren hesaplama", en: "Calculation that separates growth and advertising-return assumptions", de: "Berechnung mit getrennten Wachstums- und Werberenditeannahmen", zh: "区分增长与广告回报假设的计算流程" } },
];

type GoalIntent = { slug: string; label: Record<Locale, string> };

const intentLabel = (tr: string, en: string, de: string, zh: string): Record<Locale, string> => ({ tr, en, de, zh });

/**
 * Detects explicit operations before fuzzy catalog ranking. This keeps a
 * multi-intent request intact: mentioning e-mail inside a CSV must not turn a
 * masking/conversion request into a destructive e-mail-extraction workflow.
 */
function detectGoalIntents(goal: string, payload: string, locale: Locale): GoalIntent[] {
  const text = normalize(goal, locale);
  const rawPayload = payload.trim();
  const intents: GoalIntent[] = [];
  const add = (slug: string, label: Record<Locale, string>) => {
    if (!intents.some((item) => item.slug === slug)) intents.push({ slug, label });
  };
  const has = (pattern: RegExp) => pattern.test(text);
  const csvShape = rawPayload.split(/\r?\n/u).filter(Boolean).slice(0, 3).filter((line) => /[,;\t]/u.test(line)).length >= 2;
  const jsonShape = /^[\[{]/u.test(rawPayload);
  const csvMention = has(/\bcsv\b|comma separated|virgulle ayril|tablo|tabelle|表格/u) || csvShape;
  const jsonMention = has(/\bjson\b/u) || jsonShape;
  const mask = has(/mask|maskele|redact|anonim|kisisel veri|hassas veri|kvkk|gdpr|personenbezogen|遮蔽|匿名/u);
  const deduplicate = has(/duplicate|deduplic|tekrar(?:lari|ları)? kaldir|tekillestir|yinelenen|duplikat|去重|重复/u);
  const sort = has(/alphabet|alfabetik|sirala|sort|排序/u);
  const toJson = has(/json(?:a| a| olarak| format)|to json|into json|als json|zu json|转(?:为|成) json/u) && has(/cevir|donustur|convert|hazirla|prepare|\byap\b|\bmake\b|umwandel|konvertier|erstell|转/u);
  const toCsv = has(/csv(?:ye| ye| olarak| format)|to csv|into csv|als csv|zu csv|转(?:为|成) csv/u) && has(/cevir|donustur|convert|hazirla|prepare|\byap\b|\bmake\b|umwandel|konvertier|erstell|转/u);

  const imageMention = has(/gorsel|resim|foto|png|jpe?g|webp|image|picture|photo|bild|图片|照片/u);
  const pdfMention = has(/\bpdf\b/u);
  const conversion = has(/donustur|cevir|pdf yap|convert|turn into|umwandel|konvertier|转(?:为|成)|转换/u);
  if (imageMention && pdfMention && conversion) {
    const pdfIsSource = has(/pdf(?:den| den|ten| ten)|from (?:a )?pdf|aus (?:einer )?pdf|从 pdf/u);
    if (!pdfIsSource) add("gorselden-pdf", intentLabel("Görselleri tek bir PDF dosyasına dönüştür", "Convert images into one PDF file", "Bilder in eine PDF-Datei umwandeln", "将图像转换为一个 PDF 文件"));
  }

  if (has(/\bjwt\b|json web token/u) && has(/decode|coz|incele|oku|inspect|解析|解码/u)) {
    add("jwt-decoder", intentLabel("JWT içeriğini yerel olarak çöz", "Decode JWT content locally", "JWT-Inhalt lokal dekodieren", "在本地解码 JWT 内容"));
  } else if (has(/regex|regular expression|duzenli ifade/u) && has(/test|hata|error|kontrol|dene|pruf|prüf|检查|错误/u)) {
    add("regex-test-araci", intentLabel("Regex ifadesini güvenli biçimde test et", "Test the regular expression safely", "Regulären Ausdruck sicher testen", "安全测试正则表达式"));
  } else if (has(/\bcron\b/u) && has(/acikla|explain|yorumla|parse|erklar|erklär|解释/u)) {
    add("cron-ifadesi-aciklayici", intentLabel("Cron ifadesini açıkla", "Explain the cron expression", "Cron-Ausdruck erklären", "解释 Cron 表达式"));
  }

  if (has(/\bqr\b|qr kod/u) && has(/olustur|uret|generate|create|erstell|生成/u)) add("qr-kod-olusturucu", intentLabel("QR kod oluştur", "Generate a QR code", "QR-Code erstellen", "生成二维码"));
  if (has(/base64/u) && has(/kodla|encode|coz|decode|dekod|编码|解码/u)) add("base64-kodlayici", intentLabel("Base64 işlemini uygula", "Apply the Base64 operation", "Base64-Vorgang ausführen", "执行 Base64 操作"));
  if (has(/\burl\b|link|adres|网址/u) && has(/kodla|encode|coz|decode|percent encoding|编码|解码/u)) add("url-kodlayici", intentLabel("URL kodlama işlemini uygula", "Apply URL encoding", "URL-Kodierung anwenden", "执行 URL 编码"));
  if (has(/password|parola|sifre|passwort|密码/u) && has(/strength|guc|guven|test|pruf|prüf|强度/u)) add("sifre-gucu-test-araci", intentLabel("Parola gücünü yerel ölçütlerle incele", "Review password strength with local checks", "Passwortstärke lokal prüfen", "在本地检查密码强度"));

  if (csvMention && !toCsv && (mask || deduplicate || sort || toJson)) add("csv-inceleyici", intentLabel("CSV yapısını ve sütunları doğrula", "Validate CSV structure and columns", "CSV-Struktur und Spalten prüfen", "验证 CSV 结构与列"));
  if (jsonMention && !toJson && (toCsv || has(/bicimlendir|format|pretty|dogrula|validate|gultig|gültig|格式化|验证/u))) add("json-bicimlendirici", intentLabel("JSON yapısını doğrula ve biçimlendir", "Validate and format JSON", "JSON prüfen und formatieren", "验证并格式化 JSON"));
  if (mask) add("kvkk-veri-maskeleyici", intentLabel("Hassas değerleri geri alınabilir olmayan etiketlerle maskele", "Mask sensitive values with non-reversible labels", "Sensible Werte mit nicht umkehrbaren Markern maskieren", "使用不可逆标签遮蔽敏感值"));

  const emailMention = has(/e posta|e-posta|email|e-mail|邮件/u);
  const extractEmail = emailMention && has(/ayikla|cikar|extract|liste[\p{L}]* temizle|collect|sammel|提取|收集/u) && !mask && !csvMention;
  if (extractEmail) add("e-posta-listesi-temizleyici", intentLabel("E-posta adreslerini ayıkla ve normalleştir", "Extract and normalize email addresses", "E-Mail-Adressen extrahieren und normalisieren", "提取并规范化电子邮件地址"));
  if (deduplicate || sort) add("satir-siralayici-tekillestirici", intentLabel(deduplicate ? "Yinelenen kayıtları kaldır" : "Kayıtları sırala", deduplicate ? "Remove duplicate records" : "Sort records", deduplicate ? "Doppelte Einträge entfernen" : "Einträge sortieren", deduplicate ? "删除重复记录" : "排序记录"));
  if (toJson || toCsv) add("json-csv-donusturucu", intentLabel(toJson ? "Temizlenmiş CSV'yi JSON'a dönüştür" : "JSON'u CSV'ye dönüştür", toJson ? "Convert the cleaned CSV to JSON" : "Convert JSON to CSV", toJson ? "Bereinigtes CSV in JSON umwandeln" : "JSON in CSV umwandeln", toJson ? "将清理后的 CSV 转为 JSON" : "将 JSON 转为 CSV"));

  if (jsonMention && has(/compare|diff|fark|karsilastir|vergleich|比较/u)) add("json-diff-karsilastirma", intentLabel("JSON yapılarını karşılaştır", "Compare JSON structures", "JSON-Strukturen vergleichen", "比较 JSON 结构"));
  if (has(/markdown/u) && has(/preview|onizle|render|vorschau|预览/u)) add("markdown-onizleyici", intentLabel("Markdown önizlemesi oluştur", "Render a Markdown preview", "Markdown-Vorschau erzeugen", "生成 Markdown 预览"));
  if (has(/metin|text|yazi|text|文本/u) && has(/temizle|clean|whitespace|bosluk|bereinig|清理/u) && !emailMention) add("metin-temizleyici", intentLabel("Metni normalize et", "Normalize the text", "Text normalisieren", "规范化文本"));
  if (has(/kredi|loan|darlehen|kredit|贷款/u) && has(/amort|taksit|odeme|payment|tilgung|还款|摊还/u)) add("kredi-amortisman-tahminleyici", intentLabel("Kredi ödeme ve amortisman senaryosunu hesapla", "Estimate the loan payment and amortization", "Kreditrate und Tilgung schätzen", "估算贷款还款与摊还"));
  if (has(/enflasyon|inflation|通胀/u) && has(/satin alma|purchasing power|kaufkraft|reel deger|real value|购买力/u)) add("enflasyon-satin-alma-gucu", intentLabel("Enflasyon altında satın alma gücünü karşılaştır", "Compare purchasing power under inflation", "Kaufkraft unter Inflation vergleichen", "比较通胀下的购买力"));
  if (has(/basabas|break even|break-even|盈亏平衡/u)) add("basabas-noktasi-hesaplayici", intentLabel("Başabaş satış eşiğini hesapla", "Calculate the break-even sales threshold", "Break-even-Schwelle berechnen", "计算盈亏平衡点"));
  if (has(/marj|markup|margin|aufschlag|marge|毛利率|加价率/u) && has(/kar|profit|gewinn|利润/u)) add("marj-kar-orani-hesaplayici", intentLabel("Marj ve maliyet üstü kâr oranını karşılaştır", "Compare margin and markup", "Marge und Aufschlag vergleichen", "比较利润率与加价率"));
  if (has(/olasilik|probability|wahrscheinlichkeit|概率/u) && has(/a[^\p{L}\p{N}]{0,4}b|kesisim|intersection|schnitt|交集|birlesim|union|并集/u)) add("olasilik-hesaplayici", intentLabel("Olay olasılıklarını hesapla", "Calculate event probabilities", "Ereigniswahrscheinlichkeiten berechnen", "计算事件概率"));
  if (has(/orneklem|sample size|stichprob|样本量/u) && has(/guven|confidence|konfidenz|置信|hata payi|margin of error|fehlerspanne|误差/u)) add("orneklem-buyuklugu-tahminleyici", intentLabel("Anket örneklem büyüklüğünü tahmin et", "Estimate survey sample size", "Stichprobengröße schätzen", "估算调查样本量"));
  if (has(/bahsis|tip|trinkgeld|小费/u) && has(/hesap|calculate|split|bol|rechnung|计算|分摊/u)) add("bahsis-hesap-bolusturucu", intentLabel("Bahşişi ve kişi başı tutarı hesapla", "Calculate the tip and per-person amount", "Trinkgeld und Pro-Kopf-Betrag berechnen", "计算小费与人均金额"));

  if (has(/retry-after|backoff|geri cekil|yeniden dene|wiederhol|退避|重试/u)) add("retry-after-geri-cekilme-planlayici", intentLabel("Yeniden deneme zamanlamasını planla", "Plan a safe retry schedule", "Sichere Wiederholungen planen", "规划安全重试时间"));
  if (has(/webhook/u) && has(/log|gunluk|teslim|delivery|protokoll|日志|投递/u)) add("webhook-teslim-gunlugu-analizoru", intentLabel("Webhook teslim kayıtlarını incele", "Review webhook delivery logs", "Webhook-Auslieferungsprotokolle prüfen", "检查 Webhook 投递日志"));
  if (has(/aria|accessible name|erisilebilir ad|zuganglich|zugänglich|无障碍名称/u)) add("aria-erisebilir-ad-envanteri", intentLabel("Erişilebilir adları envanterle", "Inventory accessible names", "Barrierefreie Namen erfassen", "盘点无障碍名称"));
  if (has(/html/u) && has(/lang|language|dil|heading|baslik|uberschrift|überschrift|语言|标题/u)) add("html-dil-baslik-yapisi-denetleyici", intentLabel("HTML dil ve başlık yapısını incele", "Review HTML language and heading structure", "HTML-Sprache und Überschriften prüfen", "检查 HTML 语言与标题结构"));
  if (has(/sitemap/u) && has(/url|kume|liste|cluster|gruppe|聚类|列表/u)) add("sitemap-url-kume-analizoru", intentLabel("Sitemap URL kümelerini incele", "Review sitemap URL clusters", "Sitemap-URL-Gruppen prüfen", "检查 Sitemap URL 分组"));
  if (has(/robots meta|noindex|nofollow|nosnippet|max-snippet/u)) add("robots-meta-politikasi-olusturucu", intentLabel("Robots meta politikasını hazırla", "Prepare a robots meta policy", "Robots-Meta-Richtlinie erstellen", "生成 Robots Meta 策略"));
  if (has(/subject|konu|betreff|主题/u) && has(/email|e-posta|e-mail|mail|邮件/u)) add("eposta-konu-onizleme-denetleyici", intentLabel("E-posta konu ve önizlemesini incele", "Review email subject and preview text", "E-Mail-Betreff und Vorschau prüfen", "检查邮件主题与预览文本"));
  if (has(/performance budget|performans butce|lcp|inp|cls|bundle|leistungsbudget|性能预算/u)) add("web-performans-butce-planlayici", intentLabel("Web performans bütçesini değerlendir", "Evaluate the web performance budget", "Web-Performance-Budget bewerten", "评估网页性能预算"));
  if (has(/3-2-1|backup|yedek|sicherung|备份/u)) add("yedekleme-3-2-1-hazirlik-denetleyici", intentLabel("3-2-1 yedekleme hazırlığını incele", "Review 3-2-1 backup readiness", "3-2-1-Sicherungsbereitschaft prüfen", "检查 3-2-1 备份就绪度"));
  if (has(/release note|changelog|surum not|versionshinweis|发布说明|更新日志/u)) add("surum-notu-degisiklik-derleyici", intentLabel("Değişikliklerden sürüm notu hazırla", "Draft release notes from changes", "Versionshinweise aus Änderungen erstellen", "根据变更生成发布说明"));

  return intents.slice(0, 6);
}

function operationFor(slug: string, goal: string, locale: Locale): AgentPlanStep["operation"] {
  const text = normalize(goal, locale);
  if (slug === "json-csv-donusturucu") return /json(?:a| a| olarak)|to json|als json|zu json|转(?:为|成) json/u.test(text) ? "csv-to-json" : "json-to-csv";
  if (slug === "base64-kodlayici" || slug === "url-kodlayici") return /decode|coz|dekod|解码/u.test(text) ? "decode" : "encode";
  if (slug === "json-bicimlendirici") return /minif|kucult|sikistir|kompakt|压缩/u.test(text) ? "minify" : "format";
  if (slug === "kvkk-veri-maskeleyici") return "mask";
  if (slug === "e-posta-listesi-temizleyici") return "extract";
  if (slug === "satir-siralayici-tekillestirici") return /duplicate|deduplic|tekrar|tekillestir|yinelenen|duplikat|去重|重复/u.test(text) ? "deduplicate" : "sort";
  if (slug === "csv-inceleyici" || slug === "jwt-decoder" || slug === "regex-test-araci" || slug === "cron-ifadesi-aciklayici") return "inspect";
  return undefined;
}

function recipeMatches(recipe: Recipe, rawGoal: string, normalizedGoal: string) {
  return recipe.test.every((pattern) => pattern.test(rawGoal) || pattern.test(normalizedGoal));
}

function numberNear(goal: string, labels: string, after = true) {
  const expression = after
    ? new RegExp(`(?:${labels})[^\\d+-]{0,24}([-+]?\\d[\\d .,'’]*\\d|[-+]?\\d)`, "iu")
    : new RegExp(`([-+]?\\d[\\d .,'’]*\\d|[-+]?\\d)[^\\p{L}\\d]{0,10}(?:${labels})`, "iu");
  const value = expression.exec(goal)?.[1];
  if (!value) return undefined;
  const compact = value.replace(/[\s'’]/gu, "");
  const comma = compact.lastIndexOf(",");
  const dot = compact.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    const decimal = comma > dot ? "," : ".";
    return compact.replace(new RegExp(`\\${decimal === "," ? "." : ","}`, "g"), "").replace(decimal, ".");
  }
  const separator = comma >= 0 ? "," : dot >= 0 ? "." : "";
  if (!separator) return compact;
  const parts = compact.split(separator);
  if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].replace(/^[-+]/u, "").length <= 3)) return parts.join("");
  return compact.replace(separator, ".");
}

function numberAround(goal: string, labels: string) {
  return numberNear(goal, labels) ?? numberNear(goal, labels, false);
}

/** Creates a bounded first-tool input, including field maps for form tools. */
export function prepareAgentInput(goal: string, plan: AgentPlan, detectedPayload = extractAgentPayload(goal)) {
  const slug = plan.steps[0]?.toolSlug;
  if (/^\s*\{/u.test(detectedPayload)) {
    try { const value: unknown = JSON.parse(detectedPayload); if (value && typeof value === "object" && !Array.isArray(value)) return detectedPayload.slice(0, 180_000); } catch { /* infer fields from natural language instead */ }
  }
  if (slug === "bahsis-hesap-bolusturucu") {
    const subtotal = numberNear(goal, "hesap(?: tutari)?|ara toplam|subtotal|bill(?: amount)?|rechnungsbetrag|账单金额")
      ?? goal.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:tl|try|usd|eur|gbp|₺|€|\$)/iu)?.[1]?.replace(",", ".");
    const tax = numberNear(goal, "vergi|servis|tax|service|steuer|税费");
    const tip = goal.match(/(\d+(?:[.,]\d+)?)\s*%/u)?.[1]?.replace(",", ".")
      ?? numberNear(goal, "yuzde|yüzde|percent", true)
      ?? numberNear(goal, "bahsis(?: orani)?|bahşiş(?: oranı)?|tip rate|trinkgeldsatz|小费比例");
    const people = numberNear(goal, "kisi|kişi|people|person|personen|人", false) ?? numberNear(goal, "kisi|kişi|people|person|personen|人数");
    const fields = Object.fromEntries(Object.entries({ subtotal, tax, tip, people }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length >= 2) return JSON.stringify(fields);
  }
  if (["yuzde-degisim-hesaplayici", "yuzde-degisim-hizli-hesaplayici"].includes(slug ?? "")) {
    const old = numberNear(goal, "ilk|eski|baslangic|başlangıç|old|from|ausgang|原值");
    const next = numberNear(goal, "yeni|son|next|to|neu|新值");
    if (old && next) return JSON.stringify({ old, next });
  }
  if (["kdv-indirim-hesaplayici", "indirim-kdv-hesaplayici"].includes(slug ?? "")) {
    const price = numberNear(goal, "fiyat|tutar|price|preis|价格");
    const discount = numberNear(goal, "indirim|discount|rabatt|折扣");
    const vat = numberNear(goal, "kdv|vat|vergi|steuer|增值税");
    const fields = Object.fromEntries(Object.entries({ price, discount, vat }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length >= 2) return JSON.stringify(fields);
  }
  if (slug === "kredi-amortisman-tahminleyici") {
    const principal = numberAround(goal, "kredi tutari|kredi tutarı|\\bkredi\\b|ana para|principal|loan amount|kreditbetrag|darlehensbetrag|贷款金额|本金");
    const annualRate = numberAround(goal, "yillik faiz|yıllık faiz|faiz orani|faiz oranı|\\bfaiz\\b|annual (?:interest )?rate|annual interest|jahreszins|zinssatz|年利率");
    const years = numberAround(goal, "vade|sure|süre|term|years?|laufzeit|jahre|期限|年限");
    const extraMonthly = numberAround(goal, "aylik ek odeme|aylık ek ödeme|ek odeme|ek ödeme|extra monthly|monthly extra|monatliche sondertilgung|sondertilgung|每月额外还款|额外月供");
    const fields = Object.fromEntries(Object.entries({ principal, annualRate, years, extraMonthly }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length) return JSON.stringify(fields);
  }
  if (slug === "enflasyon-satin-alma-gucu") {
    const amount = numberAround(goal, "bugunku tutar|tutar|amount today|current amount|heutiger betrag|betrag|当前金额|当前价值");
    const annualInflation = numberAround(goal, "yillik enflasyon|enflasyon|annual inflation|inflation rate|inflationsrate|通胀率|年通胀");
    const years = numberAround(goal, "sure|yil|period|years?|zeitraum|jahre|期限|年");
    const fields = Object.fromEntries(Object.entries({ amount, annualInflation, years }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length) return JSON.stringify(fields);
  }
  if (slug === "basabas-noktasi-hesaplayici") {
    const fixedCost = numberAround(goal, "sabit maliyet|fixed costs?|fixkosten|固定成本");
    const unitPrice = numberAround(goal, "birim satis fiyati|birim fiyat|unit selling price|unit price|verkaufspreis je einheit|stuckpreis|stückpreis|单位售价|单价");
    const unitVariableCost = numberAround(goal, "birim degisken maliyet|variable cost per unit|variable kosten je einheit|单位变动成本");
    const fields = Object.fromEntries(Object.entries({ fixedCost, unitPrice, unitVariableCost }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length) return JSON.stringify(fields);
  }
  if (slug === "marj-kar-orani-hesaplayici") {
    const cost = numberAround(goal, "birim maliyet|maliyet|unit cost|cost|stuckkosten|stückkosten|kosten|单位成本|成本");
    const price = numberAround(goal, "satis fiyati|fiyat|selling price|price|verkaufspreis|售价");
    if (cost || price) return JSON.stringify(Object.fromEntries(Object.entries({ cost, price }).filter((entry): entry is [string, string] => Boolean(entry[1]))));
  }
  if (slug === "olasilik-hesaplayici") {
    const a = numberAround(goal, "p\\s*\\(\\s*a\\s*\\)|a olasiligi|probability a|wahrscheinlichkeit a|a 概率");
    const b = numberAround(goal, "p\\s*\\(\\s*b\\s*\\)|b olasiligi|probability b|wahrscheinlichkeit b|b 概率");
    const intersection = numberAround(goal, "kesisim|p\\s*\\(\\s*a[^)]*b\\s*\\)|intersection|schnittmenge|交集");
    const known = /kesişim biliniyor|known intersection|bekannte schnittmenge|已知交集/iu.test(goal);
    const independent = /bagimsiz|bağımsız|independent|unabhangig|unabhängig|独立/iu.test(goal);
    const fields = Object.fromEntries(Object.entries({ a, b, relationship: known ? "known" : independent ? "independent" : undefined, intersection: known ? intersection : undefined }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length) return JSON.stringify(fields);
  }
  if (slug === "orneklem-buyuklugu-tahminleyici") {
    const confidence = numberAround(goal, "guven duzeyi|güven düzeyi|confidence(?: level)?|konfidenzniveau|置信水平");
    const marginOfError = numberAround(goal, "hata payi|hata payı|margin of error|fehlerspanne|误差范围");
    const proportion = numberAround(goal, "beklenen oran|expected proportion|erwarteter anteil|预期比例");
    const population = numberAround(goal, "evren buyuklugu|evren büyüklüğü|population(?: size)?|grundgesamtheit|总体规模");
    const fields = Object.fromEntries(Object.entries({ confidence, marginOfError, proportion, population }).filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(fields).length) return JSON.stringify(fields);
  }
  return detectedPayload.slice(0, 180_000);
}

function stepReason(locale: Locale, tool: Tool, index: number) {
  const purpose = tool.short[locale].replace(/[.!?。！？]+$/u, "");
  return local(locale, {
    tr: `${index === 0 ? "Önce" : "Ardından"} ${tool.title.tr} seçildi; çünkü hedefinizde bu aşamanın ihtiyacı “${purpose}” yeteneğiyle doğrudan örtüşüyor.`,
    en: `${index === 0 ? "Start with" : "Then use"} ${tool.title.en}, because this part of your outcome directly matches its ability to ${purpose.charAt(0).toLocaleLowerCase("en-US") + purpose.slice(1)}.`,
    de: `${index === 0 ? "Beginnen Sie mit" : "Danach folgt"} ${tool.title.de}, weil dieser Teil des Ziels direkt zu seiner Aufgabe passt: ${purpose}.`,
    zh: `${index === 0 ? "先使用" : "然后使用"}${tool.title.zh}，因为当前目标与其能力直接匹配：${purpose}。`,
  });
}

function splitGoal(goal: string) {
  // A plain newline often separates pasted data rows, not workflow steps. Only
  // treat a newline as a boundary when it starts an explicit bullet/number.
  return goal.split(/\s*(?:→|=>|->|;|\bsonra\b|\bthen\b|\banschließend\b|然后|接着|\r?\n\s*(?:[-*]|\d+[.)])\s+)\s*/iu).map((item) => item.trim()).filter(Boolean).slice(0, 6);
}

const followUpPattern = /(?:az önce|önceki|devam et|bunu|şunu|aynı akış|sonucu|\bşimdi\b|previous|just now|\bnow\b|continue|this flow|that plan|make (?:it|the result|the output)|\bresult\b|\boutput\b|vorher|gerade|\bnun\b|weiter|diesen plan|dieses ergebnis|刚才|继续|现在|这个流程|该计划|结果)/iu;
const simplifyPattern = /(?:sadeleştir|daha az adım|kısalt|simplif|fewer steps|shorter flow|vereinfach|weniger schritte|简化|更少步骤)/iu;
const safetyPattern = /(?:güvenli|güvenlik|gizlilik|kvkk|gdpr|maskele|security|privacy|safe|redact|sicher|datenschutz|安全|隐私|遮蔽)/iu;
const deliveryPattern = /(?:paylaş|teslim|indir|dışa aktar|share|deliver|download|export|teilen|liefern|herunterladen|分享|交付|下载|导出)/iu;

function conversationIntent(goal: string, locale: Locale) {
  if (simplifyPattern.test(goal)) return local(locale, { tr: "Akışı sadeleştirme", en: "Simplify the workflow", de: "Ablauf vereinfachen", zh: "简化流程" });
  if (safetyPattern.test(goal)) return local(locale, { tr: "Güvenli ve yerel işleme", en: "Safe, local processing", de: "Sichere lokale Verarbeitung", zh: "安全的本地处理" });
  if (deliveryPattern.test(goal)) return local(locale, { tr: "Kontrollü teslim ve paylaşım", en: "Controlled delivery and sharing", de: "Kontrollierte Übergabe und Freigabe", zh: "受控交付与分享" });
  return local(locale, { tr: "Hedefe uygun araç akışı", en: "Outcome-aligned tool workflow", de: "Zielgerechter Werkzeugablauf", zh: "与目标匹配的工具流程" });
}

function frameGoal(goal: string, locale: Locale, extracted: AgentParameter[], steps: AgentPlanStep[]) {
  const formats = extracted.find((item) => item.kind === "format")?.value;
  const file = extracted.some((item) => item.kind === "file") || steps.some((step) => step.requiresFile);
  const privateData = extracted.some((item) => item.kind === "privacy");
  const deliverySignals = goal.match(/\b(download|indir|export|dışa aktar|copy|kopyala|share|paylaş|herunterladen|exportieren|下载|导出|分享)\b/iu);
  return {
    outcome: goal.split(/[.;\n]/)[0]?.trim().slice(0, 220) || local(locale, { tr: "Hedef belirtilmedi", en: "Outcome not stated", de: "Ziel nicht angegeben", zh: "未说明目标" }),
    input: formats ? formats : file ? local(locale, { tr: "Kullanıcının seçeceği yerel dosya", en: "A local file selected by the user", de: "Eine lokal ausgewählte Datei", zh: "用户选择的本地文件" }) : local(locale, { tr: "Doğal dil veya yapıştırılan veri", en: "Natural language or pasted data", de: "Natürliche Sprache oder eingefügte Daten", zh: "自然语言或粘贴数据" }),
    delivery: deliverySignals ? deliverySignals[0] : local(locale, { tr: "Önizleme; çıktı biçimi doğrulanmalı", en: "Preview; confirm the delivery format", de: "Vorschau; Ausgabeformat bestätigen", zh: "预览；需确认交付格式" }),
    safety: privateData ? local(locale, { tr: "Hassas veri sinyali var: sentetik örnek ve maskeleme önerildi", en: "Sensitive-data signal: use synthetic data and masking", de: "Signal für sensible Daten: synthetische Daten und Maskierung nutzen", zh: "检测到敏感数据信号：请使用合成数据与遮蔽" }) : local(locale, { tr: "Yerel işleme; yüksek etkili sonuçları bağımsız doğrulayın", en: "Local processing; independently verify high-impact results", de: "Lokale Verarbeitung; folgenreiche Ergebnisse unabhängig prüfen", zh: "本地处理；高影响结果需独立核验" }),
  };
}

export function createAgentPlan(goal: string, catalog: Tool[], locale: Locale, previousPlan?: AgentPlan | null): AgentPlan {
  const cleanGoal = goal.trim().slice(0, 20_000);
  const normalizedGoal = normalize(cleanGoal, locale);
  const payload = extractAgentPayload(cleanGoal);
  const signals: string[] = [];
  let selected: Tool[] = [];
  // Length alone is not conversational context. The former `<72` shortcut
  // caused short, unrelated requests (JWT, QR, Base64) to inherit an old plan.
  const isFollowUp = Boolean(previousPlan && followUpPattern.test(cleanGoal));
  const contextualGoal = isFollowUp && previousPlan ? `${previousPlan.goal}. ${cleanGoal}`.slice(0, 20_000) : cleanGoal;
  if (isFollowUp && previousPlan) {
    signals.push(local(locale, { tr: "Önceki plan bu sekmenin bağlamından devralındı", en: "The previous plan was carried forward from this tab's context", de: "Der vorige Plan wurde aus dem Kontext dieses Tabs übernommen", zh: "已从当前标签页语境继承上一份计划" }));
    if (simplifyPattern.test(cleanGoal)) {
      const retained = previousPlan.steps.length > 2 ? [previousPlan.steps[0], previousPlan.steps.at(-1)!] : previousPlan.steps;
      selected = retained.map((step) => catalog.find((tool) => tool.slug === step.toolSlug)).filter((tool): tool is Tool => Boolean(tool));
      signals.push(local(locale, { tr: "Sadeleştirme isteği: yalnızca başlangıç ve teslim için gerekli adımlar korundu", en: "Simplification request: only essential start and delivery steps were retained", de: "Vereinfachung: nur wesentliche Start- und Übergabeschritte bleiben", zh: "简化请求：仅保留必要的开始与交付步骤" }));
    }
  }
  const detectedIntents = detectGoalIntents(cleanGoal, payload, locale);
  if (!selected.length && detectedIntents.length) {
    selected = detectedIntents.map((intent) => catalog.find((tool) => tool.slug === intent.slug)).filter((tool): tool is Tool => Boolean(tool));
    signals.push(local(locale, {
      tr: `${detectedIntents.length} açık işlem niyeti sıraya kondu`,
      en: `${detectedIntents.length} explicit operations were ordered`,
      de: `${detectedIntents.length} eindeutige Vorgänge wurden angeordnet`,
      zh: `已按顺序识别 ${detectedIntents.length} 个明确操作`,
    }));
  }
  const segments = splitGoal(cleanGoal);
  if (!selected.length && segments.length > 1) {
    selected = segments.map((segment) => semanticToolSearch(segment, catalog, locale, 1)[0]?.tool).filter((tool): tool is Tool => Boolean(tool));
    signals.push(local(locale, { tr: "Açık çok adımlı sıra algılandı", en: "Explicit multi-step sequence detected", de: "Explizite Schrittfolge erkannt", zh: "检测到明确的多步骤顺序" }));
  }
  let matchedWorkflow = selected.length > 1 || detectedIntents.length > 0;
  if (!selected.length) {
    const recipe = recipes.find((item) => recipeMatches(item, cleanGoal, normalizedGoal));
    if (recipe) {
      selected = recipe.steps.map((slug) => catalog.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool));
      matchedWorkflow = selected.length > 0;
      signals.push(recipe.signal[locale]);
    }
  }
  const currentRanked = semanticToolSearch(cleanGoal, catalog, locale, 5);
  const contextualRanked = isFollowUp ? semanticToolSearch(contextualGoal, catalog, locale, 5) : currentRanked;
  const ranked = currentRanked[0]?.score && currentRanked[0].score >= 12 ? currentRanked : contextualRanked;
  if (!selected.length && ranked.length) selected = [ranked[0].tool];
  if (!selected.length) selected = catalog.filter((tool) => ["prompt-kalite-denetimi", "metin-temizleyici", "json-bicimlendirici"].includes(tool.slug)).slice(0, 3);
  selected = selected.filter((tool, index, list) => list.findIndex((item) => item.slug === tool.slug) === index).slice(0, 6);
  if (ranked[0]) signals.push(local(locale, { tr: `En güçlü semantik eşleşme: ${ranked[0].tool.title.tr}`, en: `Strongest semantic match: ${ranked[0].tool.title.en}`, de: `Stärkster semantischer Treffer: ${ranked[0].tool.title.de}`, zh: `最强语义匹配：${ranked[0].tool.title.zh}` }));
  const extracted = extractAgentParameters(contextualGoal, locale);
  if (extracted.length) signals.push(local(locale, { tr: `${extracted.length} parametre grubu çıkarıldı`, en: `${extracted.length} parameter groups extracted`, de: `${extracted.length} Parametergruppen extrahiert`, zh: `提取了 ${extracted.length} 组参数` }));
  const steps = selected.map((tool, index): AgentPlanStep => ({
    id: `step-${index + 1}-${tool.slug}`,
    toolSlug: tool.slug,
    title: tool.title[locale],
    reason: stepReason(locale, tool, index),
    inputMode: fileTools.has(tool.slug) ? "manual" : index === 0 ? "goal" : "previous",
    requiresFile: fileTools.has(tool.slug),
    parameterHints: extracted.map((item) => `${item.label}: ${item.value}`).slice(0, 5),
    operation: operationFor(tool.slug, cleanGoal, locale),
  }));
  const requested = detectedIntents.map((intent) => intent.label[locale]);
  const covered = detectedIntents.filter((intent) => steps.some((step) => step.toolSlug === intent.slug)).map((intent) => intent.label[locale]);
  const missing = detectedIntents.filter((intent) => !steps.some((step) => step.toolSlug === intent.slug)).map((intent) => intent.label[locale]);
  if (missing.length) signals.push(local(locale, { tr: `${missing.length} istenen işlem mevcut katalogla güvenle eşleşmedi`, en: `${missing.length} requested operations could not be safely matched to the catalog`, de: `${missing.length} gewünschte Vorgänge konnten nicht sicher zugeordnet werden`, zh: `${missing.length} 个请求操作无法安全匹配目录` }));
  const manualSteps = steps.filter((step) => step.requiresFile).length;
  if (manualSteps) signals.push(local(locale, { tr: `${manualSteps} adım dosya seçimi için açık kullanıcı eylemi istiyor`, en: `${manualSteps} steps require explicit user file selection`, de: `${manualSteps} Schritte erfordern eine ausdrückliche Dateiauswahl`, zh: `${manualSteps} 个步骤需要用户明确选择文件` }));
  const topScore = ranked[0]?.score ?? 0; const runnerUp = ranked[1]?.score ?? 0;
  const needsClarification = missing.length > 0 || (!matchedWorkflow && topScore < 18);
  const confidence = Math.max(.35, Math.min(.94, .52 + Math.min(.28, topScore / 80) + Math.min(.14, Math.max(0, topScore - runnerUp) / 50) - (needsClarification ? .12 : 0)));
  const alternativeSlugs = ranked.map((item) => item.tool.slug).filter((slug) => !selected.some((tool) => tool.slug === slug)).slice(0, 3);
  const first = selected[0]?.title[locale] ?? local(locale, { tr: "araç araması", en: "tool search", de: "Werkzeugsuche", zh: "工具搜索" });
  const last = selected.at(-1)?.title[locale] ?? first;
  const previousLast = isFollowUp ? previousPlan?.steps.at(-1)?.title : undefined;
  const baseResponse = needsClarification
    ? local(locale, {
      tr: `Size yardımcı olabilirim; ancak hedefte giriş veya beklenen çıktı biçimi henüz net değil. En yakın başlangıç olarak ${first} aracını buldum. Aşağıdaki kısa sorulardan birini yanıtladığınızda daha güvenilir bir akış kuracağım.`,
      en: `I can help, but the input or desired output is not clear enough yet. ${first} is the closest starting point I found. Answer one of the short questions below and I will build a more reliable workflow.`,
      de: `Ich kann helfen, aber Eingabe oder gewünschte Ausgabe sind noch nicht eindeutig. ${first} ist der passendste Einstieg. Beantworten Sie eine der kurzen Fragen unten, dann erstelle ich einen verlässlicheren Ablauf.`,
      zh: `我可以帮忙，但输入或期望输出还不够明确。目前最接近的起点是${first}。回答下面任一简短问题后，我会生成更可靠的流程。`,
    })
    : previousLast
    ? local(locale, {
      tr: `Az önceki akış ${previousLast} ile bitiyordu. Şimdiki hedef için ${first} ile başlayıp ${selected.length > 1 ? `${last} adımına kadar ilerleyen` : "tek adımlı"} daha uygun bir yol kurdum. Her adımı çalıştırmadan önce siz onaylayacaksınız.`,
      en: `The previous flow ended with ${previousLast}. For this goal, I built a better-fitting path that starts with ${first}${selected.length > 1 ? ` and progresses to ${last}` : ""}. You remain in control before every step runs.`,
      de: `Der vorherige Ablauf endete mit ${previousLast}. Für dieses Ziel habe ich einen passenderen Weg ab ${first}${selected.length > 1 ? ` bis ${last}` : ""} erstellt. Vor jedem Schritt behalten Sie die Kontrolle.`,
      zh: `刚才的流程以${previousLast}结束。针对当前目标，我设计了从${first}${selected.length > 1 ? `到${last}` : ""}的更合适路径；每一步运行前仍由您确认。`,
    })
    : local(locale, {
      tr: `Hedefiniz için ${first} ile başlamayı öneriyorum${selected.length > 1 ? `; sonra ${last} adımına kadar kontrollü ilerleyebiliriz` : ""}. Seçim, hedefteki biçim ve gizlilik sinyalleriyle en güçlü eşleşmeye dayanıyor.`,
      en: `I suggest starting with ${first}${selected.length > 1 ? ` and moving deliberately toward ${last}` : ""}. The choice follows the strongest match to the goal's format and privacy signals.`,
      de: `Ich empfehle, mit ${first} zu beginnen${selected.length > 1 ? ` und kontrolliert bis ${last} weiterzugehen` : ""}. Die Auswahl folgt dem stärksten Treffer für Format- und Datenschutzsignale.`,
      zh: `建议先使用${first}${selected.length > 1 ? `，再按顺序推进到${last}` : ""}。该选择基于目标中的格式与隐私信号的最强匹配。`,
    });
  const looksLikeError = /(?:syntaxerror|typeerror|referenceerror|unexpected token|invalid regular expression|exception|\bhata\b|\berror\b|\bfehler\b|错误)/iu.test(cleanGoal);
  const diagnostic = looksLikeError ? translateAgentError(cleanGoal, locale) : null;
  const response = diagnostic
    ? local(locale, {
      tr: `${diagnostic.title}: ${diagnostic.explanation} İlk güvenli adım olarak ${first} aracını hazırladım.`,
      en: `${diagnostic.title}: ${diagnostic.explanation} I prepared ${first} as the first safe step.`,
      de: `${diagnostic.title}: ${diagnostic.explanation} Als ersten sicheren Schritt habe ich ${first} vorbereitet.`,
      zh: `${diagnostic.title}：${diagnostic.explanation}。我已将${first}准备为第一个安全步骤。`,
    })
    : baseResponse;
  const clarifyingQuestions = needsClarification ? [
    local(locale, { tr: "Hangi biçimde veriyle başlayacağız?", en: "What input format are we starting with?", de: "Mit welchem Eingabeformat beginnen wir?", zh: "输入数据是什么格式？" }),
    local(locale, { tr: "Sonuç hangi biçimde ve ne amaçla kullanılacak?", en: "What output format and use do you need?", de: "Welches Ausgabeformat und welchen Zweck benötigen Sie?", zh: "需要什么输出格式，用于什么目的？" }),
    local(locale, { tr: "Veri kişisel, gizli veya güvenlik açısından hassas mı?", en: "Is the data personal, confidential, or security-sensitive?", de: "Sind die Daten personenbezogen, vertraulich oder sicherheitskritisch?", zh: "数据是否包含个人、机密或安全敏感内容？" }),
  ] : [];
  const nextActions = [
    local(locale, { tr: "Yapay örnekle ilk adımı doğrulayın", en: "Validate the first step with synthetic data", de: "Ersten Schritt mit synthetischen Daten prüfen", zh: "先用合成数据验证第一步" }),
    local(locale, { tr: "Planı gözden geçirip İş İstasyonuna aktarın", en: "Review the plan and send it to Workstation", de: "Plan prüfen und an die Workstation senden", zh: "审核计划并发送到工作站" }),
    local(locale, { tr: "Yüksek etkili sonucu bağımsız olarak kontrol edin", en: "Independently verify high-impact output", de: "Folgenreiche Ausgaben unabhängig prüfen", zh: "独立核验高影响结果" }),
  ];
  const suggestedReplies = needsClarification
    ? [
      local(locale, { tr: "CSV girdisiyle başlayıp JSON çıktısı istiyorum", en: "Start with CSV and produce JSON", de: "Mit CSV beginnen und JSON ausgeben", zh: "从 CSV 开始并输出 JSON" }),
      local(locale, { tr: "Düz metni temizleyip kopyalanabilir sonuç istiyorum", en: "Clean plain text and return a copyable result", de: "Klartext bereinigen und kopierbar ausgeben", zh: "清理纯文本并返回可复制结果" }),
      local(locale, { tr: "Önce yalnızca doğru aracı bul", en: "First, only find the right tool", de: "Zuerst nur das passende Werkzeug finden", zh: "先只查找合适的工具" }),
    ]
    : [
      local(locale, { tr: "Bu akışı daha az adımla sadeleştir", en: "Simplify this workflow into fewer steps", de: "Diesen Ablauf auf weniger Schritte kürzen", zh: "把这个流程简化为更少步骤" }),
      local(locale, { tr: "Gizlilik risklerini kontrol edip güvenli hale getir", en: "Review privacy risks and make it safer", de: "Datenschutzrisiken prüfen und sicherer machen", zh: "检查隐私风险并提高安全性" }),
      local(locale, { tr: "Sonucu paylaşmaya hazır bir biçime getir", en: "Prepare the result for safe sharing", de: "Ergebnis für sicheres Teilen vorbereiten", zh: "把结果整理为可安全分享的格式" }),
    ];
  const goalFrame = frameGoal(contextualGoal, locale, extracted, steps);
  const planReview = [
    steps.length > 1
      ? local(locale, { tr: `Akış ${steps.length} bağımlı adıma ayrıldı; her çıktı bir sonraki girdiden önce doğrulanmalı.`, en: `The workflow has ${steps.length} dependent steps; validate every output before it becomes the next input.`, de: `Der Ablauf hat ${steps.length} abhängige Schritte; jede Ausgabe vor der Weitergabe prüfen.`, zh: `流程包含 ${steps.length} 个依赖步骤；每次输出进入下一步前都应验证。` })
      : local(locale, { tr: "Tek adım yeterli görünüyor; gerekmedikçe zinciri büyütmeyin.", en: "One step appears sufficient; avoid expanding the chain without a concrete need.", de: "Ein Schritt scheint ausreichend; Ablauf nur bei konkretem Bedarf erweitern.", zh: "单步看起来已足够；没有明确需要时不要扩展流程。" }),
    manualSteps
      ? local(locale, { tr: "Dosya adımları otomatik çalıştırılmaz; seçim ve indirme kullanıcı kontrolünde kalır.", en: "File steps never run automatically; selection and download remain under user control.", de: "Dateischritte laufen nie automatisch; Auswahl und Download bleiben unter Nutzerkontrolle.", zh: "文件步骤不会自动运行；选择和下载始终由用户控制。" })
      : local(locale, { tr: "Girdi aktarımı metin tabanlı ve geri alınabilir; yine de paylaşmadan önce çıktıyı inceleyin.", en: "Input handoff is text-based and reversible; still review output before sharing.", de: "Die Eingabeübergabe ist textbasiert und umkehrbar; Ausgabe vor dem Teilen prüfen.", zh: "输入传递基于文本且可撤销；分享前仍需检查输出。" }),
    confidence < .7
      ? local(locale, { tr: "Eşleşme orta düzeyde: giriş, hedef çıktı veya hassasiyet bilgisini eklemek planı iyileştirir.", en: "Match confidence is moderate: adding input, desired output, or sensitivity details will improve the plan.", de: "Mittlere Sicherheit: Eingabe, gewünschte Ausgabe oder Sensibilität ergänzen.", zh: "匹配置信度中等：补充输入、期望输出或敏感性信息可改进计划。" })
      : local(locale, { tr: "Plan hedef sinyalleriyle tutarlı; sentetik bir örnekle küçük ölçekte başlayın.", en: "The plan is consistent with the goal signals; start small with synthetic data.", de: "Plan passt zu den Zielsignalen; klein mit synthetischen Daten beginnen.", zh: "计划与目标信号一致；请先用少量合成数据测试。" }),
  ];
  return {
    version: AGENT_VERSION, locale, goal: contextualGoal, confidence, signals, extracted, steps, response, alternativeSlugs,
    matchQuality: needsClarification ? "review" : "strong", clarifyingQuestions, nextActions, goalFrame, planReview,
    conversation: {
      isFollowUp,
      intentSummary: conversationIntent(cleanGoal, locale),
      contextNote: isFollowUp && previousPlan
        ? local(locale, { tr: `Önceki hedef bağlama alındı: ${previousPlan.goal.slice(0, 160)}`, en: `Previous outcome retained as context: ${previousPlan.goal.slice(0, 160)}`, de: `Vorheriges Ziel bleibt im Kontext: ${previousPlan.goal.slice(0, 160)}`, zh: `已保留上一目标作为语境：${previousPlan.goal.slice(0, 160)}` })
        : local(locale, { tr: "Bu, yeni bir hedef olarak ele alındı.", en: "This was treated as a new outcome.", de: "Dies wurde als neues Ziel behandelt.", zh: "该请求被视为新目标。" }),
      suggestedReplies,
    },
    coverage: { requested, covered, missing },
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
