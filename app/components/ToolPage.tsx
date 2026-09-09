import Link from "next/link";
import { categories, getRelatedTools, getTool, publicTools as tools, type Tool } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pathFor, postPath, schemaDate, toolPath, websiteId, type Locale } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";
import { ToolUsageTracker } from "./ToolUsage";
import { ToolWorkbench } from "./ToolWorkbench";
import { referenceCopy, referencePath, references } from "../lib/references";
import { posts } from "../lib/posts";
import { localizedGuides } from "../lib/localized-guides";
import { AgentToolBridge } from "./AgentToolBridge";
import { WorkspaceToolBridge } from "./WorkspaceToolBridge";
import { ToolExperience } from "./ToolExperience";
import { CONTENT_REVIEW_DATE } from "../lib/content-review";
import { ToolEditorialReview } from "./ToolEditorialReview";
import { getToolGuidanceDetails } from "../lib/tool-guidance";
import { getToolDeepDive } from "../lib/tool-deep-dives";
import { ToolRunBrief } from "./ToolRunBrief";
import { rankToolGuides } from "../lib/guide-relevance";

export function ToolPage({ tool, locale }: { tool: Tool; locale: Locale }) {
  const editorialLocale = locale === "tr" ? "tr" : "en";
  const localized = (tr: string, en: string, de: string, zh: string) => ({ tr, en, de, zh })[locale];
  const currentLanguage = languageTag(locale);
  const guidance = getToolGuidanceDetails(tool);
  const deepDive = getToolDeepDive(tool.slug);
  const pageUrl = absoluteUrl(toolPath(locale, tool.slug));
  const alternateHref = toolPath(locale === "tr" ? "en" : "tr", tool.slug);
  const related = getRelatedTools(tool);
  const compareOutput = (["text", "data", "converter", "security"] as const).includes(tool.category as "text" | "data" | "converter" | "security");
  const relatedReference = references.find((guide) => guide.toolSlug === tool.slug);
  const relatedReferenceCopy = relatedReference ? referenceCopy(relatedReference, locale) : null;
  const relatedPosts = rankToolGuides(tool, posts, getTool).slice(0, 2);
  const recommendedLocalizedGuides = rankToolGuides(tool, localizedGuides, getTool).slice(0, 2);
  const guideLinks = locale === "de" || locale === "zh"
    ? [...recommendedLocalizedGuides.map((guide) => ({ slug: guide.slug, category: guide.copy[locale].category, readTime: guide.copy[locale].readTime, title: guide.copy[locale].title, excerpt: guide.copy[locale].excerpt, href: postPath(locale, guide.slug), hrefLang: locale })), ...relatedPosts.filter((post) => !recommendedLocalizedGuides.some((guide) => guide.slug === post.slug)).map((post) => ({ slug: post.slug, category: post.category.en, readTime: post.readTime.en, title: post.title.en, excerpt: post.excerpt.en, href: postPath("en", post.slug), hrefLang: "en" }))].slice(0, 2)
    : relatedPosts.map((post) => ({ slug: post.slug, category: post.category[editorialLocale], readTime: post.readTime[editorialLocale], title: post.title[editorialLocale], excerpt: post.excerpt[editorialLocale], href: postPath(editorialLocale, post.slug), hrefLang: editorialLocale }));
  const answer = `${tool.short[locale]} ${guidance.boundary[locale]}`;
  const inputLabel = localized("Girdi", "Input", "Eingabe", "输入");
  const outputLabel = localized("Çıktı", "Output", "Ausgabe", "输出");
  const verifyLabel = localized("Doğrulama", "Verification", "Prüfung", "核验");
  const methodLabel = localized("Yöntem", "Method", "Methode", "方法");
  const privacyAnswer = ({
    tr: `${tool.title.tr}, yalnızca burada açıklanan girdiyi etkin sekmede işler: ${guidance.input.tr} Girdi ve çıktı kalıcı alana yazılmaz; kopyalama, indirme veya başka araca aktarım ancak sizin seçiminizle gerçekleşir.`,
    en: `${tool.title.en} processes only the input described here in the active tab: ${guidance.input.en} Neither input nor output is persisted; copying, downloading, or transferring happens only when you choose it.`,
    de: `${tool.title.de} verarbeitet im aktiven Tab nur die hier beschriebene Eingabe: ${guidance.input.de} Ein- und Ausgabe werden nicht dauerhaft gespeichert; Kopieren, Herunterladen oder Übertragen erfolgt nur auf Ihre Auswahl.`,
    zh: `${tool.title.zh}只会在当前标签页处理此处说明的输入：${guidance.input.zh} 输入与输出不会持久保存；复制、下载或传递只会在您主动选择后发生。`,
  } as const)[locale];
  const transparency = ({
    tr: {
      processing: `${tool.title.tr}, “${tool.useCases.tr[0]}” amacı için ${guidance.input.tr} Tarayıcıda uygulanan yöntem şudur: ${guidance.method.tr}`,
      storage: `${tool.title.tr} girdiyi veya ${guidance.output.tr.toLocaleLowerCase("tr-TR")} kalıcı olarak saklamaz. Sonuç yalnızca sizin kopyalama, indirme ya da aktarım eyleminizle sekme dışına çıkar.`,
      verification: `${tool.title.tr} sonucunu kullanmadan önce şu kabul kontrolünü tamamlayın: ${guidance.verification.tr} Şu sınır aşılırsa durun: ${guidance.boundary.tr}`,
    },
    en: {
      processing: `${tool.title.en} uses ${guidance.input.en} for “${tool.useCases.en[0]}”. Its disclosed browser-side method is: ${guidance.method.en}`,
      storage: `${tool.title.en} does not persist its input or ${guidance.output.en.toLocaleLowerCase("en-US")}. Data leaves the tab only when you explicitly copy, download, or transfer the result.`,
      verification: `Before using a ${tool.title.en} result, complete this acceptance check: ${guidance.verification.en} Stop when this boundary is crossed: ${guidance.boundary.en}`,
    },
    de: {
      processing: `${tool.title.de} nutzt ${guidance.input.de} für „${tool.useCases.de[0]}“. Die offengelegte Browser-Methode lautet: ${guidance.method.de}`,
      storage: `${tool.title.de} speichert weder die Eingabe noch ${guidance.output.de.toLocaleLowerCase("de-DE")} dauerhaft. Daten verlassen den Tab nur nach Ihrer ausdrücklichen Kopier-, Download- oder Übergabeaktion.`,
      verification: `Vor der Nutzung eines Ergebnisses von ${tool.title.de} gilt diese Abnahmeprüfung: ${guidance.verification.de} Bei dieser Grenze stoppen: ${guidance.boundary.de}`,
    },
    zh: {
      processing: `${tool.title.zh}为“${tool.useCases.zh[0]}”处理${guidance.input.zh}。浏览器端公开方法为：${guidance.method.zh}`,
      storage: `${tool.title.zh}不会持久保存输入或${guidance.output.zh}。只有在您主动复制、下载或传递结果时，数据才会离开当前标签页。`,
      verification: `使用${tool.title.zh}的结果前，请完成此验收检查：${guidance.verification.zh} 超出以下边界时应停止：${guidance.boundary.zh}`,
    },
  } as const)[locale];
  const faq = [
    [localized(`${tool.title.tr} hangi girdiyi kabul eder?`, `What input does ${tool.title.en} accept?`, `Welche Eingabe akzeptiert ${tool.title.de}?`, `${tool.title.zh}接受什么输入？`), deepDive ? `${guidance.input[locale]} ${deepDive.fixture[locale]}` : `${guidance.input[locale]} ${tool.steps[locale][0]}`],
    [localized(`${tool.title.tr} çıktısında ne görürüm?`, `What does ${tool.title.en} return?`, `Was liefert ${tool.title.de}?`, `${tool.title.zh}会输出什么？`), deepDive ? `${guidance.output[locale]} ${deepDive.evidence[locale]}` : `${guidance.output[locale]} ${guidance.method[locale]}`],
    [localized(`${tool.title.tr} çıktısını nasıl doğrulamalıyım?`, `How should I validate ${tool.title.en} output?`, `Wie prüfe ich die Ausgabe von ${tool.title.de}?`, `如何核验${tool.title.zh}的输出？`), deepDive ? `${guidance.verification[locale]} ${deepDive.failure[locale]}` : guidance.verification[locale]],
    [localized(`${tool.title.tr} girdiyi bir sunucuya gönderir veya kaydeder mi?`, `Does ${tool.title.en} send or store input on a server?`, `Sendet oder speichert ${tool.title.de} Eingaben auf einem Server?`, `${tool.title.zh}会向服务器发送或保存输入吗？`), privacyAnswer],
  ];
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", "@id": `${pageUrl}#page`, name: tool.title[locale], description: tool.short[locale], url: pageUrl, inLanguage: currentLanguage, dateModified: schemaDate(CONTENT_REVIEW_DATE), isPartOf: { "@id": websiteId }, primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/og.png") }, mainEntity: { "@id": `${pageUrl}#application` }, breadcrumb: { "@id": `${pageUrl}#breadcrumb` } },
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${pageUrl}#application`, name: tool.title[locale], description: tool.description[locale], url: pageUrl, mainEntityOfPage: { "@id": `${pageUrl}#page` }, applicationCategory: "UtilitiesApplication", operatingSystem: "Any current standards-based browser", browserRequirements: "JavaScript enabled; secure context required for Web Crypto and PWA installation", inLanguage: currentLanguage, isAccessibleForFree: true, dateModified: schemaDate(CONTENT_REVIEW_DATE), featureList: tool.useCases[locale], offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, creator: { "@id": organizationId }, isPartOf: { "@id": websiteId }, privacyPolicy: absoluteUrl(pathFor(locale, "privacy")) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: localized("Ana sayfa", "Home", "Startseite", "首页"), item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: localized("Araçlar", "Tools", "Werkzeuge", "工具"), item: absoluteUrl(pathFor(locale, "tools")) }, { "@type": "ListItem", position: 3, name: tool.title[locale], item: pageUrl }] },
    { "@context": "https://schema.org", "@type": "HowTo", "@id": `${pageUrl}#how-to`, name: localized(`${tool.title[locale]} nasıl kullanılır?`, `How to use ${tool.title[locale]}`, `${tool.title[locale]} verwenden`, `如何使用${tool.title[locale]}`), description: tool.short[locale], inLanguage: currentLanguage, isPartOf: { "@id": `${pageUrl}#application` }, tool: [{ "@type": "HowToTool", name: localized("Güncel bir web tarayıcısı", "A current web browser", "Ein aktueller Webbrowser", "现代网页浏览器") }], step: tool.steps[locale].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: localized(`${index + 1}. adım`, `Step ${index + 1}`, `Schritt ${index + 1}`, `第 ${index + 1} 步`), text, url: `${pageUrl}#how-to-step-${index + 1}` })) },
    { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${pageUrl}#faq`, inLanguage: currentLanguage, mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];
  return (
    <SiteShell locale={locale} alternateHref={alternateHref} languageHrefs={{ tr: toolPath("tr", tool.slug), en: toolPath("en", tool.slug), de: toolPath("de", tool.slug), zh: toolPath("zh", tool.slug) }}>
      <SchemaScript data={schema} />
      <ToolUsageTracker slug={tool.slug} />
      <div className="container page-top"><nav className="breadcrumbs" aria-label={localized("Sayfa yolu", "Breadcrumb", "Brotkrumen", "面包屑导航")}><Link href={pathFor(locale, "home")}>{localized("Ana sayfa", "Home", "Startseite", "首页")}</Link><span>/</span><Link href={pathFor(locale, "tools")}>{localized("Araçlar", "Tools", "Werkzeuge", "工具")}</Link><span>/</span><span>{tool.title[locale]}</span></nav></div>
      <section className="tool-hero"><div className="container"><div className="tool-title-row"><span className={`tool-mark tool-mark-xl category-${tool.category}`}>{tool.mark}</span><div><span className="kicker">{categories[tool.category].label[locale]}</span><h1>{tool.title[locale]}</h1><p>{tool.description[locale]}</p></div></div><div className="tool-assurances"><span>✓ {localized("Ücretsiz", "Free", "Kostenlos", "免费")}</span><span>✓ {localized("Üyelik yok", "No account", "Kein Konto", "无需账户")}</span><span>✓ {localized("Tarayıcı içinde", "In-browser", "Im Browser", "浏览器内")}</span></div></div></section>
      <section className="container tool-answer-card" data-tool-intent="specific" aria-labelledby="tool-answer-title">
        <div className="tool-answer-copy"><span className="kicker">{localized("KISA CEVAP", "QUICK ANSWER", "KURZANTWORT", "简短回答")}</span><h2 id="tool-answer-title">{localized("Bu araç ne yapar?", "What does this tool do?", "Was macht dieses Werkzeug?", "这个工具能做什么？")}</h2><p>{answer}</p></div>
        <dl><div><dt>{inputLabel}</dt><dd>{guidance.input[locale]}</dd></div><div><dt>{outputLabel}</dt><dd>{guidance.output[locale]}</dd></div><div><dt>{methodLabel}</dt><dd>{guidance.method[locale]}</dd></div><div><dt>{verifyLabel}</dt><dd>{guidance.verification[locale]}</dd></div></dl>
        <nav aria-label={localized("Araç içi hızlı bağlantılar", "Tool quick links", "Werkzeug-Schnelllinks", "工具快捷链接")}><a className="primary-button" href="#tool-workbench">{localized("Aracı kullan", "Use the tool", "Werkzeug nutzen", "使用工具")} →</a>{deepDive ? <a href="#worked-example">{localized("Gerçek örnek", "Worked example", "Praxisbeispiel", "实践示例")}</a> : null}<a href="#how-to">{localized("Kullanım adımları", "Usage steps", "Anleitung", "使用步骤")}</a><a href="#tool-faq">FAQ</a></nav>
      </section>
      <div className="container tool-workbench-stack tool-runtime-first" id="tool-workbench" data-stage-three-ready="true" data-tool-quality-contract="catalog-v2" data-input-output-contract="guided-v4" data-tool-slug={tool.slug} data-input-profile={guidance.input[locale]}><WorkspaceToolBridge slug={tool.slug} locale={locale} /><AgentToolBridge slug={tool.slug} locale={locale} /><div id={`run-${tool.slug}`} className="tool-runtime-anchor"><ToolWorkbench slug={tool.slug} locale={locale} /></div><ToolRunBrief tool={tool} locale={locale} guidance={guidance} /><ToolExperience slug={tool.slug} title={tool.title[locale]} locale={locale} compare={compareOutput} related={related.map((item) => ({ slug: item.slug, title: item.title[locale] }))} /></div>
      <section className="container tool-transparency" aria-label={localized("Araç veri ve yöntem özeti", "Tool data and method summary", "Daten- und Methodenübersicht", "工具数据与方法摘要")}>
        <article><span>01</span><div><strong>{localized("İşleme sınırı", "Processing boundary", "Verarbeitungsgrenze", "处理边界")}</strong><p>{transparency.processing}</p></div></article>
        <article><span>02</span><div><strong>{localized("Kalıcı depolama", "Persistent storage", "Dauerhafte Speicherung", "持久存储")}</strong><p>{transparency.storage}</p></div></article>
        <article><span>03</span><div><strong>{localized("Doğrulama", "Verification", "Prüfung", "核验")}</strong><p>{transparency.verification}</p></div></article>
      </section>
      <ToolEditorialReview tool={tool} locale={locale} />
      <section className="section tool-guide-section" id="how-to"><div className="container tool-guide-grid"><article><span className="kicker">{localized("NASIL KULLANILIR?", "HOW TO USE IT", "ANWENDUNG", "使用方法")}</span><h2>{localized("Üç adımda sonuç", "A result in three steps", "Ergebnis in drei Schritten", "三步获得结果")}</h2><ol className="numbered-list">{tool.steps[locale].map((step, index) => <li id={`how-to-step-${index + 1}`} key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></article><article><span className="kicker">{localized("UYGUN SENARYOLAR", "GOOD USE CASES", "GEEIGNETE ANWENDUNGEN", "适用场景")}</span><h2>{localized("Bu araç ne zaman işe yarar?", "When is this tool useful?", "Wann ist dieses Werkzeug nützlich?", "该工具何时有用？")}</h2><ul className="check-list">{tool.useCases[locale].map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><div className="limit-note"><strong>{localized("Bu araca özgü sınır", "Tool-specific limitation", "Werkzeugspezifische Grenze", "该工具的特定限制")}</strong><p>{guidance.boundary[locale]}</p></div></article></div></section>
      {guideLinks.length > 0 && <section className="container tool-guide-links" data-guide-links="editorial"><div className="section-heading split-heading"><div><span className="kicker">{localized("DERİNLEŞTİRİN", "LEARN THE WORKFLOW", "ARBEITSABLAUF VERTIEFEN", "深入了解工作流")}</span><h2>{localized("Bu araçla ilgili rehberler", "Guides for this tool", "Ratgeber zu diesem Werkzeug", "该工具的相关指南")}</h2></div></div><div className="tool-guide-link-grid">{guideLinks.map((guide) => <article key={guide.slug}><span>{guide.category} · {guide.readTime}</span><h3><Link href={guide.href} hrefLang={guide.hrefLang}>{guide.title}</Link></h3><p data-reusable-summary="guide">{guide.excerpt}</p><Link className="text-link" href={guide.href} hrefLang={guide.hrefLang}>{localized("Rehberi oku", "Read guide", guide.hrefLang === "de" ? "Ratgeber lesen" : "Englischen Ratgeber lesen", guide.hrefLang === "zh" ? "阅读指南" : "阅读英文指南")} →</Link></article>)}</div></section>}
      {relatedReference && relatedReferenceCopy && <section className="container tool-reference-link"><div><span className="kicker">{localized("HIZLI BAŞVURU", "QUICK REFERENCE", "SCHNELLREFERENZ", "快速参考")}</span><h2>{relatedReferenceCopy.title}</h2><p>{relatedReferenceCopy.description}</p></div><Link className="secondary-button" href={referencePath(locale, relatedReference.slug)} hrefLang={locale}>{localized("Cheat sheet’i aç", "Open cheat sheet", "Cheat-Sheet öffnen", "打开速查表")} →</Link></section>}
      <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{localized("BU ARAÇLA SIK KULLANILANLAR", "FREQUENTLY USED TOGETHER", "HÄUFIG ZUSAMMEN VERWENDET", "常用搭配工具")}</span><h2>{localized("Bunu şimdi şununla da işleyebilirsiniz", "Process the result with one of these next", "Ergebnis als Nächstes hier weiterverarbeiten", "接下来可用这些工具继续处理")}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{localized(`${tools.length} aracın tamamı`, `All ${tools.length} tools`, `Alle ${tools.length} Werkzeuge`, `全部 ${tools.length} 个工具`)} →</Link></div><div className="tool-grid">{related.map((item) => <ToolCard key={item.slug} tool={item} locale={locale} />)}</div></div></section>
      <section className="section compact-faq" id="tool-faq"><div className="container"><div className="section-heading centered"><span className="kicker">{localized("ARAÇ HAKKINDA", "ABOUT THIS TOOL", "ÜBER DIESES WERKZEUG", "关于此工具")}</span><h2>{localized("Sık sorulan sorular", "Frequently asked questions", "Häufig gestellte Fragen", "常见问题")}</h2></div><div className="faq-list narrow">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </SiteShell>
  );
}
