import { TOOL_PAGE_UPDATED } from "../lib/editorial-release";
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
  const answer = tool.short[locale];
  const privacyAnswer = localized(
    "Araç girdisi etkin sekmede işlenir. İş İstasyonu’na kaydetme veya başka bir araca aktarma ayrı bir seçimdir. Tarayıcı eklentileri ve paylaşılan cihazlar ayrıca değerlendirilmelidir; gizlilik sayfası reklam ve ağ bağlantılarını açıklar.",
    "Tool input is processed in the active tab. Saving to the Workstation or transferring to another tool is a separate choice. Consider browser extensions and shared devices separately; the privacy page explains advertising and network connections.",
    "Werkzeugeingaben werden im aktiven Tab verarbeitet. Speichern in der Workstation oder Übergabe an ein anderes Werkzeug erfolgt nach eigener Auswahl. Browser-Erweiterungen und gemeinsam genutzte Geräte gesondert prüfen; die Datenschutzseite erklärt Werbung und Netzwerkverbindungen.",
    "工具输入在当前标签页处理。保存到工作站或传递到其他工具需另行选择。请另外考虑浏览器扩展和共享设备；隐私页面说明广告和网络连接。",
  );
  const faq = [
    [localized(`${tool.title.tr} hangi girdiyi kabul eder?`, `What input does ${tool.title.en} accept?`, `Welche Eingabe akzeptiert ${tool.title.de}?`, `${tool.title.zh}接受什么输入？`), deepDive ? `${guidance.input[locale]} ${deepDive.fixture[locale]}` : `${guidance.input[locale]} ${tool.steps[locale][0]}`],
    [localized(`${tool.title.tr} çıktısında ne görürüm?`, `What does ${tool.title.en} return?`, `Was liefert ${tool.title.de}?`, `${tool.title.zh}会输出什么？`), deepDive ? `${guidance.output[locale]} ${deepDive.evidence[locale]}` : `${guidance.output[locale]} ${guidance.method[locale]}`],
    [localized(`${tool.title.tr} çıktısını nasıl doğrulamalıyım?`, `How should I validate ${tool.title.en} output?`, `Wie prüfe ich die Ausgabe von ${tool.title.de}?`, `如何核验${tool.title.zh}的输出？`), deepDive ? `${guidance.verification[locale]} ${deepDive.failure[locale]}` : guidance.verification[locale]],
    [localized(`${tool.title.tr} girdiyi bir sunucuya gönderir veya kaydeder mi?`, `Does ${tool.title.en} send or store input on a server?`, `Sendet oder speichert ${tool.title.de} Eingaben auf einem Server?`, `${tool.title.zh}会向服务器发送或保存输入吗？`), privacyAnswer],
  ];
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", "@id": `${pageUrl}#page`, name: tool.title[locale], description: tool.short[locale], url: pageUrl, inLanguage: currentLanguage, dateModified: schemaDate(TOOL_PAGE_UPDATED), isPartOf: { "@id": websiteId }, primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/og.png") }, mainEntity: { "@id": `${pageUrl}#application` }, breadcrumb: { "@id": `${pageUrl}#breadcrumb` } },
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
        <nav aria-label={localized("Araç içi hızlı bağlantılar", "Tool quick links", "Werkzeug-Schnelllinks", "工具快捷链接")}><a className="primary-button" href="#tool-workbench">{localized("Aracı kullan", "Use the tool", "Werkzeug nutzen", "使用工具")} →</a>{deepDive ? <a href="#worked-example">{localized("Gerçek örnek", "Worked example", "Praxisbeispiel", "实践示例")}</a> : null}<a href="#how-to">{localized("Kullanım adımları", "Usage steps", "Anleitung", "使用步骤")}</a><a href="#tool-faq">FAQ</a></nav>
      </section>
      <div className="container tool-workbench-stack tool-runtime-first" id="tool-workbench" data-stage-three-ready="true" data-tool-quality-contract="catalog-v2" data-input-output-contract="guided-v4" data-tool-slug={tool.slug} data-input-profile={guidance.input[locale]}><WorkspaceToolBridge slug={tool.slug} locale={locale} /><AgentToolBridge slug={tool.slug} locale={locale} /><div id={`run-${tool.slug}`} className="tool-runtime-anchor"><ToolWorkbench slug={tool.slug} locale={locale} /></div><ToolExperience slug={tool.slug} title={tool.title[locale]} locale={locale} compare={compareOutput} related={related.map((item) => ({ slug: item.slug, title: item.title[locale] }))} /></div>
      <div id="how-to"><ToolEditorialReview tool={tool} locale={locale} /></div>
      {guideLinks.length > 0 && <section className="container tool-guide-links" data-guide-links="editorial"><div className="section-heading split-heading"><div><span className="kicker">{localized("DERİNLEŞTİRİN", "LEARN THE WORKFLOW", "ARBEITSABLAUF VERTIEFEN", "深入了解工作流")}</span><h2>{localized("Bu araçla ilgili rehberler", "Guides for this tool", "Ratgeber zu diesem Werkzeug", "该工具的相关指南")}</h2></div></div><div className="tool-guide-link-grid">{guideLinks.map((guide) => <article key={guide.slug}><span>{guide.category} · {guide.readTime}</span><h3><Link href={guide.href} hrefLang={guide.hrefLang}>{guide.title}</Link></h3><p data-reusable-summary="guide">{guide.excerpt}</p><Link className="text-link" href={guide.href} hrefLang={guide.hrefLang}>{localized("Rehberi oku", "Read guide", guide.hrefLang === "de" ? "Ratgeber lesen" : "Englischen Ratgeber lesen", guide.hrefLang === "zh" ? "阅读指南" : "阅读英文指南")} →</Link></article>)}</div></section>}
      {relatedReference && relatedReferenceCopy && <section className="container tool-reference-link"><div><span className="kicker">{localized("HIZLI BAŞVURU", "QUICK REFERENCE", "SCHNELLREFERENZ", "快速参考")}</span><h2>{relatedReferenceCopy.title}</h2><p>{relatedReferenceCopy.description}</p></div><Link className="secondary-button" href={referencePath(locale, relatedReference.slug)} hrefLang={locale}>{localized("Cheat sheet’i aç", "Open cheat sheet", "Cheat-Sheet öffnen", "打开速查表")} →</Link></section>}
      <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{localized("BU ARAÇLA SIK KULLANILANLAR", "FREQUENTLY USED TOGETHER", "HÄUFIG ZUSAMMEN VERWENDET", "常用搭配工具")}</span><h2>{localized("Bunu şimdi şununla da işleyebilirsiniz", "Process the result with one of these next", "Ergebnis als Nächstes hier weiterverarbeiten", "接下来可用这些工具继续处理")}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{localized(`${tools.length} aracın tamamı`, `All ${tools.length} tools`, `Alle ${tools.length} Werkzeuge`, `全部 ${tools.length} 个工具`)} →</Link></div><div className="tool-grid">{related.map((item) => <ToolCard key={item.slug} tool={item} locale={locale} />)}</div></div></section>
      <section className="section compact-faq" id="tool-faq"><div className="container"><div className="section-heading centered"><span className="kicker">{localized("ARAÇ HAKKINDA", "ABOUT THIS TOOL", "ÜBER DIESES WERKZEUG", "关于此工具")}</span><h2>{localized("Sık sorulan sorular", "Frequently asked questions", "Häufig gestellte Fragen", "常见问题")}</h2></div><div className="faq-list narrow">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p data-shared-instruction="faq">{answer}</p></details>)}</div></div></section>
    </SiteShell>
  );
}
