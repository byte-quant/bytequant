import Link from "next/link";
import { localizedInfo, type ExtendedLocale } from "../lib/localized-info";
import type { InfoKey } from "../lib/info";
import { absoluteUrl, languageTag, organizationId, pathFor, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function LocalizedInfoPage({ pageKey, locale }: { pageKey: InfoKey; locale: ExtendedLocale }) {
  const content = localizedInfo[locale][pageKey];
  const url = absoluteUrl(pathFor(locale, pageKey));
  const type = pageKey === "about" ? "AboutPage" : pageKey === "contact" ? "ContactPage" : pageKey === "faq" ? "FAQPage" : "WebPage";
  const schema = [
    { "@context": "https://schema.org", "@type": type, "@id": url + "#page", name: content.title, description: content.intro, url, inLanguage: languageTag(locale), isPartOf: { "@id": websiteId }, ...(pageKey === "faq" ? { mainEntity: content.sections.map((section) => ({ "@type": "Question", name: section.heading, acceptedAnswer: { "@type": "Answer", text: section.paragraphs.join(" ") } })) } : {}), ...(pageKey === "about" || pageKey === "contact" ? { about: { "@id": organizationId } } : {}) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "de" ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: content.title, item: url }] },
  ];
  return (
    <SiteShell locale={locale} alternateHref="/en" languageHrefs={{ de: pathFor("de", pageKey), zh: pathFor("zh", pageKey), tr: pathFor("tr", pageKey), en: pathFor("en", pageKey) }}>
      <SchemaScript data={schema} />
      <section className="page-hero info-hero"><div className="container narrow-container"><nav className="breadcrumbs"><Link href={pathFor(locale, "home")}>{locale === "de" ? "Startseite" : "首页"}</Link><span>/</span><span>{content.eyebrow.toLocaleLowerCase(locale === "de" ? "de-DE" : "zh-CN")}</span></nav><span className="kicker">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p>{content.updated && <time>{content.updated}</time>}</div></section>
      <section className={"section info-content " + (pageKey === "faq" ? "faq-info" : "")}><div className="container narrow-container">{content.sections.map((section, index) => pageKey === "faq" ? <details className="info-faq-item" key={section.heading} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}<b>+</b></summary><div>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details> : <article key={section.heading}><span className="section-index">{String(index + 1).padStart(2, "0")}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</article>)}</div></section>
      <section className="info-contact-band"><div className="container narrow-container"><div><span>{locale === "de" ? "Noch eine Frage?" : "还有问题？"}</span><h2>{locale === "de" ? "Schreiben Sie uns und helfen Sie, Produkt und Erklärungen zu verbessern." : "欢迎联系我们，帮助改进产品与说明。"}</h2></div><a className="primary-button" href="mailto:bytequant@yahoo.com">{locale === "de" ? "E-Mail senden" : "发送邮件"} →</a></div></section>
    </SiteShell>
  );
}
