import Link from "next/link";
import { categories, tools, type Tool } from "../lib/tools";
import { pathFor, siteUrl, toolPath, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";
import { ToolWorkbench } from "./ToolWorkbench";

export function ToolPage({ tool, locale }: { tool: Tool; locale: Locale }) {
  const isTr = locale === "tr";
  const alternateHref = toolPath(locale === "tr" ? "en" : "tr", tool.slug);
  const related = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 3);
  const faq = [
    [isTr ? "Bu araç verimi bir sunucuya gönderiyor mu?" : "Does this tool send input to a server?", isTr ? "Hayır. İşlem bu tarayıcı sekmesinde çalışır. Sonucu kopyalamayı veya indirmeyi seçerseniz veri sayfanın dışına sizin işleminizle çıkar." : "No. Processing runs in this browser tab. Data leaves the page only when you choose to copy or download the result."],
    [isTr ? "Sonuç kesin midir?" : "Is the result definitive?", isTr ? "Araç açıklanan kurallar ve tarayıcı API'leriyle tutarlı sonuç üretir; bağlama, veri kalitesine ve yöntem sınırlarına bağlı hatalar olabilir. Kritik kararları ayrıca doğrulayın." : "The tool produces consistent output from disclosed rules and browser APIs, but context, data quality, and method limitations can affect it. Verify high-impact decisions."],
    [isTr ? "Girdi kaydediliyor mu?" : "Is input saved?", isTr ? "Hayır. Araç metni varsayılan olarak localStorage veya başka bir kalıcı alanda saklamaz. Sayfa yenilendiğinde girdi kaybolur." : "No. Tool text is not persisted to localStorage or another durable store by default. It is lost when the page is refreshed."],
  ];
  const schema = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: tool.title[locale], description: tool.description[locale], url: `${siteUrl}${toolPath(locale, tool.slug)}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled", inLanguage: locale, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, creator: { "@type": "Organization", name: "ByteQuant", url: siteUrl } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];
  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <div className="container page-top"><nav className="breadcrumbs" aria-label={isTr ? "Sayfa yolu" : "Breadcrumb"}><Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link><span>/</span><Link href={pathFor(locale, "tools")}>{isTr ? "Araçlar" : "Tools"}</Link><span>/</span><span>{tool.title[locale]}</span></nav></div>
      <section className="tool-hero"><div className="container"><div className="tool-title-row"><span className={`tool-mark tool-mark-xl category-${tool.category}`}>{tool.mark}</span><div><span className="kicker">{categories[tool.category].label[locale]}</span><h1>{tool.title[locale]}</h1><p>{tool.description[locale]}</p></div></div><div className="tool-assurances"><span>✓ {isTr ? "Ücretsiz" : "Free"}</span><span>✓ {isTr ? "Üyelik yok" : "No account"}</span><span>✓ {isTr ? "Tarayıcı içinde" : "In-browser"}</span></div></div></section>
      <div className="container"><ToolWorkbench slug={tool.slug} locale={locale} /></div>
      <section className="section tool-guide-section"><div className="container tool-guide-grid"><article><span className="kicker">{isTr ? "NASIL KULLANILIR?" : "HOW TO USE IT"}</span><h2>{isTr ? "Üç adımda sonuç" : "A result in three steps"}</h2><ol className="numbered-list">{tool.steps[locale].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></article><article><span className="kicker">{isTr ? "UYGUN SENARYOLAR" : "GOOD USE CASES"}</span><h2>{isTr ? "Bu araç ne zaman işe yarar?" : "When is this tool useful?"}</h2><ul className="check-list">{tool.useCases[locale].map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul><div className="limit-note"><strong>{isTr ? "Önemli sınır" : "Important limitation"}</strong><p>{isTr ? "Otomatik sonuç bir ön değerlendirmedir. Hukuki, finansal, tıbbi veya güvenlik açısından kritik kararlar için tek başına kullanılmamalıdır." : "Automated output is a preliminary assessment. Do not use it alone for legal, financial, medical, or security-critical decisions."}</p></div></article></div></section>
      <div className="container"><AdSlot locale={locale} /></div>
      <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isTr ? "İLGİLİ ARAÇLAR" : "RELATED TOOLS"}</span><h2>{isTr ? "İş akışınıza devam edin" : "Continue your workflow"}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{isTr ? "18 aracın tamamı" : "All 18 tools"} →</Link></div><div className="tool-grid">{related.map((item) => <ToolCard key={item.slug} tool={item} locale={locale} />)}</div></div></section>
      <section className="section compact-faq"><div className="container"><div className="section-heading centered"><span className="kicker">{isTr ? "ARAÇ HAKKINDA" : "ABOUT THIS TOOL"}</span><h2>{isTr ? "Sık sorulan sorular" : "Frequently asked questions"}</h2></div><div className="faq-list narrow">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </SiteShell>
  );
}

