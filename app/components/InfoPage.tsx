import Link from "next/link";
import { info, type InfoKey } from "../lib/info";
import { absoluteUrl, languageTag, organizationId, pathFor, websiteId, type Locale } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function InfoPage({ pageKey, locale }: { pageKey: InfoKey; locale: Locale }) {
  const content = info[pageKey];
  const isTr = locale === "tr";
  const currentLanguage = languageTag(locale);
  const alternateHref = pathFor(locale === "tr" ? "en" : "tr", pageKey);
  const type = pageKey === "about" ? "AboutPage" : pageKey === "contact" ? "ContactPage" : pageKey === "faq" ? "FAQPage" : "WebPage";
  const pageUrl = absoluteUrl(pathFor(locale, pageKey));
  const mainEntity = pageKey === "faq"
    ? content.sections[locale].map((section) => ({ "@type": "Question", name: section.heading, acceptedAnswer: { "@type": "Answer", text: section.paragraphs.join(" ") } }))
    : pageKey === "about" || pageKey === "contact" ? { "@id": organizationId } : undefined;
  const schema = [
    { "@context": "https://schema.org", "@type": type, "@id": `${pageUrl}#page`, name: content.title[locale], description: content.intro[locale], url: pageUrl, inLanguage: currentLanguage, isPartOf: { "@id": websiteId }, ...(mainEntity ? { mainEntity } : {}) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: isTr ? "Ana sayfa" : "Home", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: content.title[locale], item: pageUrl }] },
  ];
  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <section className="page-hero info-hero"><div className="container narrow-container"><nav className="breadcrumbs" aria-label={isTr ? "Sayfa yolu" : "Breadcrumb"}><Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link><span>/</span><span>{content.eyebrow[locale].toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US")}</span></nav><span className="kicker">{content.eyebrow[locale]}</span><h1>{content.title[locale]}</h1><p>{content.intro[locale]}</p>{content.updated && <time>{content.updated[locale]}</time>}</div></section>
      {pageKey === "contact" && <section className="contact-channels"><div className="container narrow-container channel-grid"><a href="mailto:bytequant@yahoo.com"><span>@</span><div><small>{isTr ? "E-POSTA" : "EMAIL"}</small><strong>bytequant@yahoo.com</strong><p>{isTr ? "Destek, gizlilik ve düzeltmeler" : "Support, privacy, and corrections"}</p></div></a><a href="https://x.com/byte_quant" rel="noopener noreferrer"><span>𝕏</span><div><small>X</small><strong>@byte_quant</strong><p>{isTr ? "Duyurular ve kısa güncellemeler" : "Announcements and short updates"}</p></div></a><a href="https://www.instagram.com/byte.quant" rel="noopener noreferrer"><span>◎</span><div><small>INSTAGRAM</small><strong>@byte.quant</strong><p>{isTr ? "Ürün görselleri ve ipuçları" : "Product visuals and tips"}</p></div></a></div></section>}
      <section className={`section info-content ${pageKey === "faq" ? "faq-info" : ""}`}><div className="container narrow-container">{content.sections[locale].map((section, index) => pageKey === "faq" ? <details className="info-faq-item" key={section.heading} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}<b>+</b></summary><div>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details> : <article key={section.heading} id={`section-${index + 1}`}><span className="section-index">{String(index + 1).padStart(2, "0")}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{section.links && <div className="info-source-links">{section.links.map((link) => <a href={link.href} key={link.href} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>{link.label} →</a>)}</div>}</article>)}</div></section>
      <section className="info-contact-band"><div className="container narrow-container"><div><span>{isTr ? "Açık olmayan bir nokta mı var?" : "Is anything unclear?"}</span><h2>{isTr ? "Bize yazın; politikaları ve ürün açıklamalarını birlikte iyileştirelim." : "Write to us and help improve the policies and product explanations."}</h2></div><a className="primary-button" href="mailto:bytequant@yahoo.com">{isTr ? "E-posta gönder" : "Send email"} →</a></div></section>
    </SiteShell>
  );
}
