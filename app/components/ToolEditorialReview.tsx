import type { Tool } from "../lib/tools";
import { CONTENT_REVIEW_DATE } from "../lib/content-review";
import type { Locale } from "../lib/site";

const methodology = {
  prompt: {
    tr: "Hedef, bağlam, çıktı sözleşmesi ve çelişen kısıtlar ayrı ayrı incelenir. Araç bir dil modeli çalıştırmaz; yalnızca görünür kuralları uygular.",
    en: "Goal, context, output contract, and conflicting constraints are inspected separately. The tool runs no language model and applies only visible rules.",
    de: "Ziel, Kontext, Ausgabevertrag und widersprüchliche Bedingungen werden getrennt geprüft. Das Werkzeug nutzt kein Sprachmodell und wendet nur sichtbare Regeln an.",
    zh: "分别检查目标、上下文、输出约定与冲突约束。该工具不运行语言模型，只应用页面公开的规则。",
  },
  text: {
    tr: "Metin, Unicode ve satır sınırları korunarak deterministik kurallarla işlenir. Anlam, niyet veya doğruluk hakkında otomatik otorite iddiası üretilmez.",
    en: "Text is processed with deterministic rules that preserve Unicode and line boundaries. The result makes no authoritative claim about meaning, intent, or truth.",
    de: "Text wird mit deterministischen Regeln unter Erhalt von Unicode- und Zeilengrenzen verarbeitet. Das Ergebnis erhebt keinen verbindlichen Anspruch auf Bedeutung, Absicht oder Wahrheit.",
    zh: "文本按确定性规则处理，并保留 Unicode 与行边界。结果不会对语义、意图或真实性作权威判断。",
  },
  data: {
    tr: "Girdi önce ayrıştırılır; geçersiz yapı açık hata üretir. Başarılı çıktı, alan ve tür kaybını fark edebilmeniz için yapılandırılmış biçimde gösterilir.",
    en: "Input is parsed before transformation and malformed structures produce an explicit error. Successful output remains structured so field or type loss can be reviewed.",
    de: "Eingaben werden vor der Umwandlung geparst; fehlerhafte Strukturen erzeugen eine klare Meldung. Strukturierte Ausgaben machen Feld- oder Typverluste prüfbar.",
    zh: "转换前先解析输入，格式错误会生成明确提示。成功输出保持结构化，便于检查字段或类型是否丢失。",
  },
  security: {
    tr: "Sonuç yalnızca açıklanabilir bir ön kontroldür. Kimlik doğrulama, zararlı yazılım kararı, mevzuat uygunluğu veya profesyonel güvenlik incelemesi yerine geçmez.",
    en: "The result is an explainable pre-check only. It does not replace authentication, a malware verdict, regulatory assessment, or professional security review.",
    de: "Das Ergebnis ist nur eine erklärbare Vorprüfung. Es ersetzt weder Authentifizierung, Schadsoftwarebewertung, Rechtsprüfung noch professionelle Sicherheitsanalyse.",
    zh: "结果仅为可解释的初步检查，不能替代身份验证、恶意软件判定、法规评估或专业安全审查。",
  },
  converter: {
    tr: "Dönüşümden sonra çıktı biçimi yeniden doğrulanır; kayıplı veya tarayıcıya bağlı işlemler ayrıca belirtilir. Kritik dosyalarda özgün kopya korunmalıdır.",
    en: "The target format is validated after conversion and lossy or browser-dependent behavior is disclosed. Keep the original copy for important files.",
    de: "Das Zielformat wird nach der Umwandlung geprüft; verlustbehaftetes oder browserabhängiges Verhalten wird offengelegt. Wichtige Originaldateien sollten erhalten bleiben.",
    zh: "转换后会再次验证目标格式，并说明有损或依赖浏览器的行为。重要文件应保留原始副本。",
  },
  calculation: {
    tr: "Formül, birim, yuvarlama ve dahil etme kuralları görünür tutulur. Finansal, hukuki, akademik veya sağlıkla ilgili sonuçlar yetkili kaynakla doğrulanmalıdır.",
    en: "Formula, units, rounding, and inclusion rules remain visible. Financial, legal, academic, or health-related results require verification with an authoritative source.",
    de: "Formel, Einheiten, Rundung und Einbeziehungsregeln bleiben sichtbar. Finanzielle, rechtliche, akademische oder gesundheitliche Ergebnisse sind fachlich zu prüfen.",
    zh: "公式、单位、舍入与纳入规则保持可见。涉及财务、法律、学术或健康的结果须由权威来源复核。",
  },
  general: {
    tr: "İşlem sınırları, örnek girdi ve hata yolu birlikte gösterilir. Çıktı yalnızca açıklanan kullanım senaryosu için değerlendirilmelidir.",
    en: "Processing limits, sample input, and the failure path are shown together. Evaluate output only for the disclosed use case.",
    de: "Verarbeitungsgrenzen, Beispieleingabe und Fehlerweg werden gemeinsam gezeigt. Ergebnisse gelten nur für den beschriebenen Anwendungsfall.",
    zh: "处理边界、示例输入与失败路径会一并说明。输出仅适用于页面公开的使用场景。",
  },
  ai: {
    tr: "Araç uzak model veya üretken LLM kullanmaz. Yerel, açıklanabilir sezgiler öneri üretir; bağlamı ve son kararı kullanıcı sağlar.",
    en: "The tool uses no remote model or generative LLM. Local explainable heuristics produce suggestions while the user supplies context and the final decision.",
    de: "Das Werkzeug verwendet weder ein entferntes Modell noch ein generatives LLM. Lokale, erklärbare Heuristiken liefern Hinweise; Kontext und Entscheidung bleiben beim Menschen.",
    zh: "该工具不使用远程模型或生成式 LLM。本地可解释启发式规则提供建议，语境与最终决定由用户负责。",
  },
  codeSecurity: {
    tr: "Kod çalıştırılmaz; yalnızca statik desen ve sözleşmeler incelenir. Bulgu olmaması güvenlik açığı bulunmadığını kanıtlamaz.",
    en: "Code is not executed; only static patterns and contracts are inspected. No finding does not prove the absence of a vulnerability.",
    de: "Code wird nicht ausgeführt; geprüft werden nur statische Muster und Verträge. Kein Fund beweist nicht die Abwesenheit einer Schwachstelle.",
    zh: "代码不会执行，仅检查静态模式与约定。未发现问题并不能证明不存在安全漏洞。",
  },
  research: {
    tr: "Araç kaynak, tarih, iddia ve kanıt kaydını düzenler; kaynağın doğruluğunu kendiliğinden kanıtlamaz. Birincil kaynak ve güncellik ayrıca kontrol edilmelidir.",
    en: "The tool organises source, date, claim, and evidence records; it does not prove a source true. Recency and primary evidence must be checked separately.",
    de: "Das Werkzeug ordnet Quelle, Datum, Behauptung und Beleg; es beweist keine Quellenwahrheit. Aktualität und Primärbelege müssen separat geprüft werden.",
    zh: "该工具整理来源、日期、主张与证据记录，但不会自动证明来源真实。仍需单独核对时效性与一手证据。",
  },
} as const;

const copy = {
  tr: { eyebrow: "YÖNTEM VE KALİTE PASAPORTU", title: "Bu araç benzersiz kanonik adresiyle yayımlanır", body: "Açıklama, örnek girdi, hata sınırı ve cihaz içi çalışma akışı sürüm kontrollüdür. Otomatik paket; sayfa çıktısını, ortak hata davranışını ve temsilî sonuçları denetler.", method: "Uygulanan yöntem", acceptance: "Bu araç için kabul akışı", outcome: "Başarılı kullanım ne demektir?", outcomeBody: (useCase: string, result: string) => `${useCase} senaryosunda çıktı “${result}” amacını karşılamalıdır. Sonucu hedef ortamda kontrol edin; uyarı veya belirsizlik varsa dışa aktarmadan önce düzeltin.`, date: "Son içerik ve yöntem incelemesi", badge: "YAYINDA" },
  en: { eyebrow: "METHOD AND QUALITY PASSPORT", title: "This tool is published at its unique canonical URL", body: "The description, demo input, error boundary, and on-device flow are version controlled. The automated suite checks page output, shared error behavior, and representative results.", method: "Method applied", acceptance: "Acceptance path for this tool", outcome: "What does successful use mean?", outcomeBody: (useCase: string, result: string) => `For “${useCase}”, the output should fulfil this stated purpose: “${result}”. Check it in the target environment and resolve any warning or uncertainty before export.`, date: "Latest content and method review", badge: "PUBLISHED" },
  de: { eyebrow: "METHODEN- UND QUALITÄTSPASS", title: "Dieses Werkzeug wird unter seiner eindeutigen kanonischen URL veröffentlicht", body: "Beschreibung, Beispieleingabe, Fehlergrenze und lokale Verarbeitung sind versionskontrolliert. Die Testsuite prüft Seitenausgabe, gemeinsames Fehlerverhalten und repräsentative Ergebnisse.", method: "Angewandte Methode", acceptance: "Abnahmeweg für dieses Werkzeug", outcome: "Was bedeutet eine erfolgreiche Nutzung?", outcomeBody: (useCase: string, result: string) => `Für „${useCase}“ muss die Ausgabe den beschriebenen Zweck „${result}“ erfüllen. Prüfen Sie das Ergebnis im Zielsystem und beheben Sie Warnungen oder Unklarheiten vor dem Export.`, date: "Letzte Inhalts- und Methodenprüfung", badge: "VERÖFFENTLICHT" },
  zh: { eyebrow: "方法与质量说明", title: "该工具通过唯一的规范网址发布", body: "工具说明、示例输入、错误边界与设备内流程均受版本控制。自动化测试会检查页面输出、共用错误行为与代表性结果。", method: "采用的方法", acceptance: "该工具的验收路径", outcome: "怎样才算成功使用？", outcomeBody: (useCase: string, result: string) => `在“${useCase}”场景中，输出应满足“${result}”这一公开目的。请在目标环境中复核，并在导出前处理所有警告或不确定性。`, date: "最近内容与方法审核", badge: "已发布" },
} as const;

export function ToolEditorialReview({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="container tool-editorial-review is-published" data-editorial-status="published" data-editorial-depth="applied" aria-labelledby={`editorial-${tool.slug}`}>
      <div className="tool-editorial-heading">
        <div><span className="kicker">{t.eyebrow}</span><h2 id={`editorial-${tool.slug}`}>{t.title}</h2></div>
        <span className="tool-editorial-badge">✓ {t.badge}</span>
      </div>
      <p>{t.body}</p>
      <div className="tool-editorial-grid">
        <article><strong>{t.method}</strong><p>{methodology[tool.category][locale]}</p></article>
        <article><strong>{t.acceptance}</strong><ol>{tool.steps[locale].map((step) => <li key={step}>{step}</li>)}</ol></article>
        <article><strong>{t.outcome}</strong><p>{t.outcomeBody(tool.useCases[locale][0], tool.short[locale])}</p></article>
      </div>
      <small>{t.date}: <time dateTime={CONTENT_REVIEW_DATE}>{CONTENT_REVIEW_DATE}</time></small>
    </section>
  );
}
