import Link from "next/link";
import type { ReferenceGuide } from "../lib/references";
import { referencePath } from "../lib/references";
import { pathFor, siteUrl, toolPath, type Locale } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function ReferencePage({ guide, locale }: { guide: ReferenceGuide; locale: Locale }) {
  const isTr = locale === "tr"; const url = `${siteUrl}${referencePath(locale, guide.slug)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "TechArticle", headline: guide.title[locale], description: guide.description[locale], url, datePublished: "2026-07-15", dateModified: "2026-07-15", inLanguage: isTr ? "tr-TR" : "en-US", author: { "@type": "Organization", name: "ByteQuant" }, publisher: { "@type": "Organization", name: "ByteQuant", url: siteUrl } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.question[locale], acceptedAnswer: { "@type": "Answer", text: item.answer[locale] } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: isTr ? "Ana sayfa" : "Home", item: `${siteUrl}${pathFor(locale, "home")}` }, { "@type": "ListItem", position: 2, name: isTr ? "Referanslar" : "References", item: url }, { "@type": "ListItem", position: 3, name: guide.title[locale], item: url }] },
  ];
  return <SiteShell locale={locale} alternateHref={referencePath(isTr ? "en" : "tr", guide.slug)}><SchemaScript data={schema} /><section className="reference-hero"><div className="narrow-container"><span className="kicker">{isTr ? "GELİŞTİRİCİ REFERANSI" : "DEVELOPER REFERENCE"}</span><h1>{guide.title[locale]}</h1><p>{guide.intro[locale]}</p><Link className="primary-button" href={toolPath(locale, guide.toolSlug)}>{isTr ? "Canlı araçta test et" : "Test in the live tool"} →</Link></div></section><div className="narrow-container reference-content">{guide.sections.map((section, index) => <section key={section.title[locale]}><div className="reference-heading"><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title[locale]}</h2></div><div className="reference-table-wrap"><table><thead><tr><th>{isTr ? "Sözdizimi" : "Syntax"}</th><th>{isTr ? "Anlam" : "Meaning"}</th><th>{isTr ? "Örnek" : "Example"}</th></tr></thead><tbody>{section.entries.map((entry) => <tr key={`${entry.expression}-${entry.example ?? ""}`}><td><code>{entry.expression}</code></td><td>{entry.meaning[locale]}</td><td>{entry.example ? <code>{entry.example}</code> : "—"}</td></tr>)}</tbody></table></div></section>)}<section className="reference-faq"><span className="kicker">FAQ</span><h2>{isTr ? "Sık sorulanlar" : "Common questions"}</h2>{guide.faq.map((item) => <details key={item.question[locale]}><summary>{item.question[locale]}<span>+</span></summary><p>{item.answer[locale]}</p></details>)}</section></div></SiteShell>;
}
