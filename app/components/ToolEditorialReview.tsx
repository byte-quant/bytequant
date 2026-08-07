import type { Tool } from "../lib/tools";
import { isEditoriallyReviewedTool } from "../lib/content-quality";
import { CONTENT_REVIEW_DATE } from "../lib/content-review";
import type { Locale } from "../lib/site";

const methodology = {
  prompt: {
    tr: "Açık hedef, bağlam, çıktı sözleşmesi ve çelişen kısıtlar ayrı ayrı incelenir. Araç bir dil modeli çalıştırmaz; yalnızca görünür kuralları uygular.",
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

export function ToolEditorialReview({ tool, locale }: { tool: Tool; locale: Locale }) {
  const reviewed = isEditoriallyReviewedTool(tool.slug);
  const t = {
    tr: { eyebrow: "YÖNTEM VE EDİTORYAL DURUM", title: reviewed ? "Bu sayfa gözden geçirilmiş araç kitaplığındadır" : "Bu araç laboratuvar sürümündedir", reviewed: "Araç açıklaması, örnek girdisi, hata sınırı ve cihaz içi çalışma akışı sürüm kontrollüdür. Otomatik paket; sayfa dışa aktarımını, ortak hata davranışını ve temsilî araç sonuçlarını denetler.", lab: "Araç çalışır ve mevcut özellikleri korunur; ancak bireysel editoryal incelemesi tamamlanana kadar arama dizinine ve sitemap'e dahil edilmez. Sonucu gerçek bağlamda ayrıca doğrulayın.", method: "Uygulanan yöntem", acceptance: "Kabul ölçütü", acceptanceBody: "Örnek girdiyi çalıştırın, beklenen sonucu gözleyin, bozuk veya sınır değeri deneyin ve önemli kararlarda bağımsız doğrulama yapın.", date: "Son içerik ve yöntem incelemesi" },
    en: { eyebrow: "METHOD AND EDITORIAL STATUS", title: reviewed ? "This page belongs to the reviewed tool library" : "This tool is in the laboratory collection", reviewed: "The description, demo input, error boundary, and on-device flow are version controlled. The automated suite checks page export, shared error behavior, and representative tool results.", lab: "The tool remains functional and available, but it is excluded from search indexes and the sitemap until individual editorial review is complete. Verify its result in the real context.", method: "Method applied", acceptance: "Acceptance check", acceptanceBody: "Run the sample, observe the expected result, try malformed or boundary input, and independently verify any consequential decision.", date: "Latest content and method review" },
    de: { eyebrow: "METHODE UND REDAKTIONELLER STATUS", title: reviewed ? "Diese Seite gehört zur geprüften Werkzeugbibliothek" : "Dieses Werkzeug gehört zur Labor-Sammlung", reviewed: "Beschreibung, Beispieleingabe, Fehlergrenze und lokale Verarbeitung sind versionskontrolliert. Die Testsuite prüft Seitenexport, gemeinsames Fehlerverhalten und repräsentative Werkzeugergebnisse.", lab: "Das Werkzeug bleibt funktionsfähig, wird aber bis zur individuellen redaktionellen Prüfung nicht in Suchindex und Sitemap aufgenommen. Das Ergebnis ist im realen Kontext zu prüfen.", method: "Angewandte Methode", acceptance: "Abnahmekriterium", acceptanceBody: "Beispiel ausführen, Sollergebnis beobachten, fehlerhafte oder grenzwertige Eingaben testen und folgenreiche Entscheidungen unabhängig prüfen.", date: "Letzte Inhalts- und Methodenprüfung" },
    zh: { eyebrow: "方法与编辑状态", title: reviewed ? "本页面属于已审核工具库" : "本工具属于实验室集合", reviewed: "工具说明、示例输入、错误边界与设备内流程均受版本控制。自动化套件检查页面导出、共用错误行为与代表性工具结果。", lab: "工具保持可用，但在完成单项编辑审核前不会进入搜索索引或站点地图。请在实际语境中另行核验结果。", method: "采用的方法", acceptance: "验收检查", acceptanceBody: "运行示例、观察预期结果、测试错误或边界输入，并对可能产生重要后果的决定进行独立核验。", date: "最近内容与方法审核" },
  }[locale];

  return (
    <section className={`container tool-editorial-review ${reviewed ? "is-reviewed" : "is-lab"}`} data-editorial-status={reviewed ? "reviewed" : "laboratory"} aria-labelledby={`editorial-${tool.slug}`}>
      <div className="tool-editorial-heading">
        <div><span className="kicker">{t.eyebrow}</span><h2 id={`editorial-${tool.slug}`}>{t.title}</h2></div>
        <span className="tool-editorial-badge">{reviewed ? "✓ REVIEWED" : "◇ LAB"}</span>
      </div>
      <p>{reviewed ? t.reviewed : t.lab}</p>
      <div className="tool-editorial-grid">
        <article><strong>{t.method}</strong><p>{methodology[tool.category][locale]}</p></article>
        <article><strong>{t.acceptance}</strong><p>{t.acceptanceBody}</p></article>
      </div>
      <small>{t.date}: <time dateTime={CONTENT_REVIEW_DATE}>{CONTENT_REVIEW_DATE}</time></small>
    </section>
  );
}
