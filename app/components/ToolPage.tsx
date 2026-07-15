import Link from "next/link";
import { categories, getRelatedTools, tools, type Tool } from "../lib/tools";
import { pathFor, postPath, siteUrl, toolPath, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";
import { ToolUsageTracker } from "./ToolUsage";
import { ToolWorkbench } from "./ToolWorkbench";
import { referencePath, references } from "../lib/references";
import { posts } from "../lib/posts";

export function ToolPage({ tool, locale }: { tool: Tool; locale: Locale }) {
  const isTr = locale === "tr";
  const languageTag = isTr ? "tr-TR" : "en-US";
  const alternateHref = toolPath(locale === "tr" ? "en" : "tr", tool.slug);
  const related = getRelatedTools(tool);
  const relatedReference = references.find((guide) => guide.toolSlug === tool.slug);
  const relatedPosts = posts.filter((post) => post.relatedTools.includes(tool.slug)).slice(-2).reverse();
  const faq = [
    [isTr ? "Bu araç verimi bir sunucuya gönderiyor mu?" : "Does this tool send input to a server?", isTr ? "Hayır. İşlem bu tarayıcı sekmesinde çalışır. Sonucu kopyalamayı veya indirmeyi seçerseniz veri sayfanın dışına sizin işleminizle çıkar." : "No. Processing runs in this browser tab. Data leaves the page only when you choose to copy or download the result."],
    [isTr ? "Sonuç kesin midir?" : "Is the result definitive?", isTr ? "Araç açıklanan kurallar ve tarayıcı API'leriyle tutarlı sonuç üretir; bağlama, veri kalitesine ve yöntem sınırlarına bağlı hatalar olabilir. Kritik kararları ayrıca doğrulayın." : "The tool produces consistent output from disclosed rules and browser APIs, but context, data quality, and method limitations can affect it. Verify high-impact decisions."],
    [isTr ? "Girdi kaydediliyor mu?" : "Is input saved?", isTr ? "Hayır. Araç girdisi localStorage veya başka bir kalıcı alanda saklanmaz. Yalnızca açık rıza verirseniz araç slug'ı, sayaç ve son kullanım zamanı kişisel kısa yollar için bu cihazda tutulur; bu kayıt gizlilik tercihlerinden silinebilir." : "No. Tool input is not persisted to localStorage or another durable store. Only with your consent may tool slug, count, and last-used time be kept on this device for personal shortcuts; that record can be deleted through privacy choices."],
  ];
  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: tool.title[locale], description: tool.description[locale], url: `${siteUrl}${toolPath(locale, tool.slug)}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled", inLanguage: languageTag, isAccessibleForFree: true, dateModified: "2026-07-15", featureList: tool.useCases[locale], offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, creator: { "@type": "Organization", name: "ByteQuant", url: siteUrl }, privacyPolicy: `${siteUrl}${pathFor(locale, "privacy")}` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: isTr ? "Ana sayfa" : "Home", item: `${siteUrl}${pathFor(locale, "home")}` }, { "@type": "ListItem", position: 2, name: isTr ? "Araçlar" : "Tools", item: `${siteUrl}${pathFor(locale, "tools").split("#")[0]}` }, { "@type": "ListItem", position: 3, name: tool.title[locale], item: `${siteUrl}${toolPath(locale, tool.slug)}` }] },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: languageTag, mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    { "@context": "https://schema.org", "@type": "HowTo", name: isTr ? `${tool.title[locale]} nasıl kullanılır?` : `How to use ${tool.title[locale]}`, description: tool.short[locale], totalTime: "PT3M", inLanguage: languageTag, tool: [{ "@type": "HowToTool", name: isTr ? "Güncel bir web tarayıcısı" : "A current web browser" }], step: tool.steps[locale].map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: isTr ? `${index + 1}. adım` : `Step ${index + 1}`, text, url: `${siteUrl}${toolPath(locale, tool.slug)}#how-to-step-${index + 1}` })) },
  ];
  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <ToolUsageTracker slug={tool.slug} />
      <div className="container page-top"><nav className="breadcrumbs" aria-label={isTr ? "Sayfa yolu" : "Breadcrumb"}><Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link><span>/</span><Link href={pathFor(locale, "tools")}>{isTr ? "Araçlar" : "Tools"}</Link><span>/</span><span>{tool.title[locale]}</span></nav></div>
      <section className="tool-hero"><div className="container"><div className="tool-title-row"><span className={`tool-mark tool-mark-xl category-${tool.category}`}>{tool.mark}</span><div><span className="kicker">{categories[tool.category].label[locale]}</span><h1>{tool.title[locale]}</h1><p>{tool.description[locale]}</p></div></div><div className="tool-assurances"><span>✓ {isTr ? "Ücretsiz" : "Free"}</span><span>✓ {isTr ? "Üyelik yok" : "No account"}</span><span>✓ {isTr ? "Tarayıcı içinde" : "In-browser"}</span></div></div></section>
      <div className="container"><ToolWorkbench slug={tool.slug} locale={locale} /></div>
      <section className="container tool-transparency" aria-label={isTr ? "Araç veri ve yöntem özeti" : "Tool data and method summary"}>
        <article><span>01</span><div><strong>{isTr ? "İşleme sınırı" : "Processing boundary"}</strong><p>{isTr ? "Girdi yalnızca etkin tarayıcı sekmesinin belleğinde işlenir; ByteQuant sunucusuna gönderilmez." : "Input is processed only in the active browser tab's memory and is not sent to a ByteQuant server."}</p></div></article>
        <article><span>02</span><div><strong>{isTr ? "Kalıcı depolama" : "Persistent storage"}</strong><p>{isTr ? "Girdi ve çıktı kaydedilmez. İsteğe bağlı kullanım sayacı içerik değil yalnızca araç kimliği ve sayısını tutar." : "Input and output are not stored. The optional usage counter keeps only tool identity and count, never content."}</p></div></article>
        <article><span>03</span><div><strong>{isTr ? "Doğrulama" : "Verification"}</strong><p>{isTr ? "Sonuç açıklanan kurallar veya tarayıcı API'leriyle üretilir; yüksek etkili kullanım öncesinde bağımsız kontrol gerekir." : "Output comes from disclosed rules or browser APIs and needs independent review before high-impact use."}</p></div></article>
      </section>
      <section className="section tool-guide-section"><div className="container tool-guide-grid"><article><span className="kicker">{isTr ? "NASIL KULLANILIR?" : "HOW TO USE IT"}</span><h2>{isTr ? "Üç adımda sonuç" : "A result in three steps"}</h2><ol className="numbered-list">{tool.steps[locale].map((step, index) => <li id={`how-to-step-${index + 1}`} key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></article><article><span className="kicker">{isTr ? "UYGUN SENARYOLAR" : "GOOD USE CASES"}</span><h2>{isTr ? "Bu araç ne zaman işe yarar?" : "When is this tool useful?"}</h2><ul className="check-list">{tool.useCases[locale].map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><div className="limit-note"><strong>{isTr ? "Önemli sınır" : "Important limitation"}</strong><p>{isTr ? "Otomatik sonuç bir ön değerlendirmedir. Hukuki, finansal, tıbbi veya güvenlik açısından kritik kararlar için tek başına kullanılmamalıdır." : "Automated output is a preliminary assessment. Do not use it alone for legal, financial, medical, or security-critical decisions."}</p></div></article></div></section>
      <div className="container"><AdSlot locale={locale} /></div>
      {relatedPosts.length > 0 && <section className="container tool-guide-links"><div className="section-heading split-heading"><div><span className="kicker">{isTr ? "DERİNLEŞTİRİN" : "LEARN THE WORKFLOW"}</span><h2>{isTr ? "Bu araçla ilgili rehberler" : "Guides for this tool"}</h2></div></div><div className="tool-guide-link-grid">{relatedPosts.map((post) => <article key={post.slug}><span>{post.category[locale]} · {post.readTime[locale]}</span><h3><Link href={postPath(locale, post.slug)}>{post.title[locale]}</Link></h3><p>{post.excerpt[locale]}</p><Link className="text-link" href={postPath(locale, post.slug)}>{isTr ? "Rehberi oku" : "Read guide"} →</Link></article>)}</div></section>}
      {relatedReference && <section className="container tool-reference-link"><div><span className="kicker">{isTr ? "HIZLI BAŞVURU" : "QUICK REFERENCE"}</span><h2>{relatedReference.title[locale]}</h2><p>{relatedReference.description[locale]}</p></div><Link className="secondary-button" href={referencePath(locale, relatedReference.slug)}>{isTr ? "Cheat sheet’i aç" : "Open cheat sheet"} →</Link></section>}
      <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isTr ? "İLGİLİ ARAÇLAR" : "RELATED TOOLS"}</span><h2>{isTr ? "İş akışınıza devam edin" : "Continue your workflow"}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{isTr ? `${tools.length} aracın tamamı` : `All ${tools.length} tools`} →</Link></div><div className="tool-grid">{related.map((item) => <ToolCard key={item.slug} tool={item} locale={locale} />)}</div></div></section>
      <section className="section compact-faq"><div className="container"><div className="section-heading centered"><span className="kicker">{isTr ? "ARAÇ HAKKINDA" : "ABOUT THIS TOOL"}</span><h2>{isTr ? "Sık sorulan sorular" : "Frequently asked questions"}</h2></div><div className="faq-list narrow">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </SiteShell>
  );
}
