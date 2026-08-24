import Link from "next/link";
import type { ReferenceGuide, ReferenceLocale } from "../lib/references";
import { referenceCopy, referencePath } from "../lib/references";
import { absoluteUrl, languageTag, organizationId, pathFor, schemaDate, siteUrl, toolPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const referenceEditorial = {
  "regex-cheat-sheet": {
    tr: [
      ["Önce doğrulama hedefini yazın", "Bir regex yazmadan önce kabul ettiğiniz biçimi ve reddetmeniz gereken sınırları düz cümlelerle tanımlayın. Telefon, e-posta veya kimlik benzeri alanlarda yalnızca karakter şekline bakmak yeterli değildir; uzunluk, ülke ya da kurum kuralı ve sahiplik kontrolü ayrı katmanlardır."],
      ["Küçük ve karşıt örneklerle deneyin", "En az bir beklenen eşleşme, bir beklenen ret ve uzun ya da bozuk bir girdi hazırlayın. Global bayrak kullanıyorsanız tüm eşleşmeleri ve sonIndex davranışını; çok satırlı metinde m ve s bayraklarının etkisini ayrı ayrı kontrol edin."],
      ["Üretim öncesi kabul kontrolü", "Kalıbı hedef çalışma zamanında yeniden çalıştırın, Unicode karakterleri ve beklenmedik satır sonlarını deneyin. Kullanıcı tarafından sağlanan kalıpları sınırlayın; iç içe niceleyicilerin uzun girdide aşırı geri izleme üretmediğini ölçmeden güvenlik sınırı olarak kullanmayın."],
      ["Regex yerine ayrıştırıcı gereken durum", "İç içe JSON, HTML, programlama dili, serbest biçimli posta adresi veya bütün bir e-posta standardı gibi yapısal girdiler için tek bir regex güvenilir ayrıştırıcı değildir. Önce ilgili parser veya alan kütüphanesini kullanın; regex’i yalnızca dar ve açıklanmış bir ön kontrol için tutun."],
    ],
    en: [
      ["Write the validation goal first", "Before writing a regex, describe the accepted shape and rejection boundaries in plain sentences. For phone, email, or identity-like fields, character shape is only one layer; length, country or institutional rules, and ownership checks remain separate."],
      ["Test small and opposing fixtures", "Prepare at least one expected match, one expected rejection, and one long or malformed input. With the global flag, inspect all matches and lastIndex behavior; for multiline text, test the effects of m and s independently."],
      ["Acceptance check before production", "Run the pattern again in the target runtime and include Unicode characters and unexpected line endings. Bound user-supplied patterns, and never treat a pattern as a security boundary until nested quantifiers have been measured against adversarial long input."],
      ["Know when a parser is the right tool", "One regex is not a dependable parser for nested JSON, HTML, programming languages, free-form postal addresses, or an entire email standard. Use the relevant parser or domain library first and reserve regex for a narrow, disclosed pre-check."],
    ],
    de: [
      ["Zuerst das Prüfziel formulieren", "Beschreiben Sie vor dem Regex in ganzen Sätzen, welche Form akzeptiert und welche Grenze abgelehnt werden soll. Bei Telefon-, E-Mail- oder Identitätsfeldern ist die Zeichenform nur eine Ebene; Länge, Länder- oder Institutionsregeln und Besitzprüfung bleiben getrennt."],
      ["Mit kleinen Gegenbeispielen testen", "Bereiten Sie mindestens einen erwarteten Treffer, eine erwartete Ablehnung und eine lange oder fehlerhafte Eingabe vor. Prüfen Sie beim globalen Flag alle Treffer und lastIndex; testen Sie bei mehrzeiligem Text m und s unabhängig."],
      ["Abnahme vor dem Produktiveinsatz", "Führen Sie das Muster in der Ziellaufzeit erneut aus und testen Sie Unicode-Zeichen sowie unerwartete Zeilenenden. Begrenzen Sie nutzerdefinierte Muster und verwenden Sie sie erst als Sicherheitsgrenze, wenn verschachtelte Quantifizierer mit adversarialen langen Eingaben gemessen wurden."],
      ["Wann ein Parser das richtige Werkzeug ist", "Ein einzelner Regex ist kein zuverlässiger Parser für verschachteltes JSON, HTML, Programmiersprachen, freie Postadressen oder einen vollständigen E-Mail-Standard. Verwenden Sie zuerst den passenden Parser oder eine Fachbibliothek und Regex nur als enge, offengelegte Vorprüfung."],
    ],
    zh: [
      ["先写清验证目标", "编写正则表达式前，先用完整句子说明允许的格式与必须拒绝的边界。对于电话、邮箱或身份类字段，字符形状只是其中一层；长度、国家或机构规则以及所有权验证需要分别处理。"],
      ["使用小型正反样本", "至少准备一个应当匹配的样本、一个应当拒绝的样本，以及一个超长或错误输入。使用全局标志时检查全部匹配和 lastIndex；处理多行文本时分别验证 m 与 s 的影响。"],
      ["上线前的验收检查", "在目标运行时再次执行表达式，并覆盖 Unicode 字符和异常换行。限制用户提供的表达式；在用恶意长输入测量嵌套量词的回溯成本之前，不要把正则当作安全边界。"],
      ["何时应改用解析器", "单个正则表达式并不是嵌套 JSON、HTML、编程语言、自由格式邮寄地址或完整邮箱标准的可靠解析器。应先使用相应解析器或领域库，只把正则用于范围明确且已说明限制的预检查。"],
    ],
  },
  "cron-cheat-sheet": {
    tr: [
      ["Önce hedef zamanlayıcıyı belirleyin", "Beş alanlı klasik cron, Quartz, systemd ve bulut zamanlayıcıları aynı söz dizimini kullanmaz. İfadeyi yazmadan önce alan sayısını, haftanın günü değerlerini ve zaman diliminin nerede tanımlandığını hedef ürünün resmî belgesinden doğrulayın."],
      ["Sonraki çalışmaları takvimde kontrol edin", "İfadeyi yalnızca insan diline çevirmek yeterli değildir. En az beş sonraki çalışma zamanını listeleyin; ay sonu, artık gün, yaz/kış saati geçişi ve kaçırılmış görev politikasını gerçek dağıtım bölgesiyle sınayın."],
      ["Güvenli işletim kaydı oluşturun", "Görevin çakışması durumunda ne olacağını, yeniden deneme sınırını, zaman aşımını ve uyarı sahibini kaydedin. Aynı görev önceki çalışma bitmeden başlayabiliyorsa kilit veya idempotency tasarımı cron ifadesinden ayrı olarak gerekir."],
      ["Cron yerine olay veya kuyruk kullanın", "Bir işin tam olarak bir kez çalışması, önceki işlemin sonucunu beklemesi ya da gecikmeden tetiklenmesi gerekiyorsa yalnız cron yeterli olmayabilir. Olay tetikleyici, dayanıklı kuyruk, dağıtık kilit ve gözlemlenebilir yeniden deneme politikası gibi bileşenleri ayrıca değerlendirin."],
    ],
    en: [
      ["Identify the target scheduler first", "Classic five-field cron, Quartz, systemd, and cloud schedulers do not share one syntax. Before writing the expression, verify field count, weekday values, and where the time zone is configured in the target product's official documentation."],
      ["Inspect future runs on a calendar", "A plain-language translation is not enough. List at least five upcoming run times, then test month end, leap day, daylight-saving transitions, and missed-run policy in the actual deployment region."],
      ["Create a safe operations record", "Record what happens when runs overlap, the retry ceiling, timeout, and alert owner. If a new run can begin before the previous one finishes, locking or idempotency must be designed separately from the cron expression."],
      ["Use events or a queue when cron is not enough", "Cron alone may be wrong when a job must run exactly once, wait for a prior result, or react without schedule delay. Evaluate an event trigger, durable queue, distributed lock, and observable retry policy as separate system components."],
    ],
    de: [
      ["Zuerst den Ziel-Scheduler bestimmen", "Klassischer Cron mit fünf Feldern, Quartz, systemd und Cloud-Scheduler verwenden nicht dieselbe Syntax. Prüfen Sie vor dem Schreiben Feldanzahl, Wochentagswerte und Zeitzonenkonfiguration in der offiziellen Dokumentation des Zielprodukts."],
      ["Künftige Läufe im Kalender prüfen", "Eine Übersetzung in Alltagssprache reicht nicht. Listen Sie mindestens fünf nächste Ausführungen auf und testen Sie Monatsende, Schalttag, Sommerzeitwechsel und die Richtlinie für verpasste Läufe in der tatsächlichen Region."],
      ["Sicheren Betriebsnachweis anlegen", "Dokumentieren Sie Überlappungsverhalten, maximale Wiederholungen, Zeitlimit und Alarmverantwortung. Kann ein neuer Lauf vor Abschluss des vorherigen beginnen, müssen Sperre oder Idempotenz unabhängig vom Cron-Ausdruck entworfen werden."],
      ["Ereignis oder Queue statt Cron", "Cron allein passt nicht, wenn ein Auftrag exakt einmal laufen, auf ein Vorgängerergebnis warten oder ohne Zeitplanverzug reagieren muss. Ereignisauslöser, dauerhafte Queue, verteilte Sperre und beobachtbare Wiederholungsrichtlinie sind dann getrennt zu entwerfen."],
    ],
    zh: [
      ["先确定目标调度器", "经典五字段 Cron、Quartz、systemd 与云调度器并不共用同一种语法。编写表达式前，请在目标产品的官方文档中核对字段数量、星期取值以及时区配置位置。"],
      ["在日历中检查后续运行", "只把表达式翻译成人类语言还不够。请列出至少五次后续运行时间，并结合实际部署地区测试月末、闰日、夏令时切换以及错过任务后的处理策略。"],
      ["建立安全运维记录", "记录任务重叠时的行为、重试上限、超时和告警负责人。如果前一次尚未结束就可能启动下一次，则还需要独立设计锁或幂等机制；这些不能由 Cron 表达式本身解决。"],
      ["Cron 不足时使用事件或队列", "如果任务必须恰好执行一次、等待上一任务结果，或需要无调度延迟地响应事件，那么只用 Cron 可能不合适。还应分别评估事件触发器、持久队列、分布式锁与可观测的重试策略。"],
    ],
  },
} as const;

export function ReferencePage({ guide, locale }: { guide: ReferenceGuide; locale: ReferenceLocale }) {
  const copy = referenceCopy(guide, locale); const url = absoluteUrl(referencePath(locale, guide.slug));
  const editorial = referenceEditorial[guide.slug as keyof typeof referenceEditorial][locale];
  const t = <T,>(values: Record<ReferenceLocale, T>) => values[locale];
  const schema = [
    { "@context": "https://schema.org", "@type": "TechArticle", "@id": `${url}#article`, headline: copy.title, description: copy.description, url, mainEntityOfPage: { "@type": "WebPage", "@id": url }, isPartOf: { "@id": websiteId }, datePublished: schemaDate("2026-07-15"), dateModified: schemaDate("2026-07-17"), inLanguage: languageTag(locale), author: { "@type": "Organization", "@id": `${siteUrl}/#editorial`, name: "ByteQuant Editorial", parentOrganization: { "@id": organizationId } }, publisher: { "@id": organizationId } },
    { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${url}#faq`, url, inLanguage: languageTag(locale), isPartOf: { "@id": websiteId }, mainEntity: copy.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: t({ tr: "Ana sayfa", en: "Home", de: "Startseite", zh: "首页" }), item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: copy.title, item: url }] },
  ];
  return <SiteShell locale={locale} alternateHref={referencePath(locale === "tr" ? "en" : "tr", guide.slug)} languageHrefs={{ tr: referencePath("tr", guide.slug), en: referencePath("en", guide.slug), de: referencePath("de", guide.slug), zh: referencePath("zh", guide.slug) }}><SchemaScript data={schema} /><section className="reference-hero"><div className="narrow-container"><nav className="breadcrumbs" aria-label={t({ tr: "Sayfa yolu", en: "Breadcrumb", de: "Brotkrumen", zh: "面包屑导航" })}><Link href={pathFor(locale, "home")}>{t({ tr: "Ana sayfa", en: "Home", de: "Startseite", zh: "首页" })}</Link><span>/</span><span>{copy.title}</span></nav><span className="kicker">{t({ tr: "GELİŞTİRİCİ REFERANSI", en: "DEVELOPER REFERENCE", de: "ENTWICKLERREFERENZ", zh: "开发者参考" })}</span><h1>{copy.title}</h1><p>{copy.intro}</p><Link className="primary-button" href={toolPath(locale, guide.toolSlug)}>{t({ tr: "Canlı araçta test et", en: "Test in the live tool", de: "Im Live-Werkzeug testen", zh: "在实时工具中测试" })} →</Link></div></section><div className="narrow-container reference-content"><section className="reference-editorial" aria-labelledby="reference-method-title"><span className="kicker">{t({ tr: "UYGULAMA YÖNTEMİ", en: "PRACTICAL METHOD", de: "PRAXISMETHODE", zh: "实践方法" })}</span><h2 id="reference-method-title">{t({ tr: "Sözdiziminden güvenilir sonuca", en: "From syntax to a dependable result", de: "Von der Syntax zum belastbaren Ergebnis", zh: "从语法到可靠结果" })}</h2><div className="reference-editorial-grid">{editorial.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>{copy.sections.map((section, index) => <section key={section.title}><div className="reference-heading"><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2></div><div className="reference-table-wrap"><table><thead><tr><th>{t({ tr: "Sözdizimi", en: "Syntax", de: "Syntax", zh: "语法" })}</th><th>{t({ tr: "Anlam", en: "Meaning", de: "Bedeutung", zh: "含义" })}</th><th>{t({ tr: "Örnek", en: "Example", de: "Beispiel", zh: "示例" })}</th></tr></thead><tbody>{section.entries.map((entry) => <tr key={`${entry.expression}-${entry.example ?? ""}`}><td><code>{entry.expression}</code></td><td>{entry.meaning}</td><td>{entry.example ? <code>{entry.example}</code> : "—"}</td></tr>)}</tbody></table></div></section>)}<section className="reference-faq"><span className="kicker">FAQ</span><h2>{t({ tr: "Sık sorulanlar", en: "Common questions", de: "Häufige Fragen", zh: "常见问题" })}</h2>{copy.faq.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</section></div></SiteShell>;
}
