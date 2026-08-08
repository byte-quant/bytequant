import Link from "next/link";
import { publishingStandards } from "../lib/publishing-standards";
import { absoluteUrl, languageTag, organizationId, pathFor, schemaDate, websiteId, type Locale } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function PublishingStandardsPage({ locale }: { locale: Locale }) {
  const copy = publishingStandards[locale];
  const url = absoluteUrl(pathFor(locale, "standards"));
  const homeLabel = { tr: "Ana sayfa", en: "Home", de: "Startseite", zh: "首页" }[locale];
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#page`,
      name: copy.title,
      description: copy.intro,
      url,
      inLanguage: languageTag(locale),
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      publisher: { "@id": organizationId },
      datePublished: schemaDate("2026-08-08"),
      dateModified: schemaDate("2026-08-08"),
      mainEntity: {
        "@type": "DigitalDocument",
        name: copy.title,
        author: { "@id": organizationId },
        isAccessibleForFree: true,
        license: "https://github.com/byte-quant/bytequant/blob/main/LICENSE",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: homeLabel, item: absoluteUrl(pathFor(locale, "home")) },
        { "@type": "ListItem", position: 2, name: copy.breadcrumb, item: url },
      ],
    },
  ];

  return (
    <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "standards")} languageHrefs={{ tr: pathFor("tr", "standards"), en: pathFor("en", "standards"), de: pathFor("de", "standards"), zh: pathFor("zh", "standards") }}>
      <SchemaScript data={schema} />
      <section className="page-hero standards-hero" data-publisher-standards="applied">
        <div className="container narrow-container">
          <nav className="breadcrumbs" aria-label={locale === "tr" ? "Sayfa yolu" : "Breadcrumb"}><Link href={pathFor(locale, "home")}>{homeLabel}</Link><span aria-hidden="true">/</span><span aria-current="page">{copy.breadcrumb}</span></nav>
          <span className="kicker">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <time dateTime="2026-08-08">{copy.updated}</time>
        </div>
      </section>

      <section className="section standards-evidence" data-publisher-evidence="verified" aria-labelledby="standards-evidence-title">
        <div className="container">
          <span className="kicker" id="standards-evidence-title">{copy.evidenceLabel}</span>
          <div className="standards-evidence-grid">
            {copy.evidence.map((item) => <article key={item.label}><strong>{item.value}</strong><h2>{item.label}</h2><p>{item.detail}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section standards-content">
        <div className="container narrow-container">
          {copy.sections.map((section) => <article key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<ul>{section.checks.map((check) => <li key={check}>✓ <span>{check}</span></li>)}</ul></article>)}
        </div>
      </section>

      <section className="section standards-sources" aria-labelledby="standards-sources-title">
        <div className="container narrow-container">
          <div><span className="kicker">{copy.eyebrow}</span><h2 id="standards-sources-title">{copy.sourcesTitle}</h2><p>{copy.sourcesIntro}</p></div>
          <div className="standards-source-list">{copy.sources.map((source, index) => <a href={source.href} key={source.href} rel="noopener noreferrer"><span>{String(index + 1).padStart(2, "0")}</span><strong>{source.label}</strong><b aria-hidden="true">↗</b></a>)}</div>
        </div>
      </section>

      <section className="standards-report"><div className="container narrow-container"><div><span>↳</span><div><h2>{copy.reportTitle}</h2><p>{copy.reportBody}</p></div></div><a className="primary-button" href={`mailto:bytequant@yahoo.com?subject=${encodeURIComponent(`ByteQuant correction · ${copy.breadcrumb}`)}`}>{copy.reportCta} →</a></div></section>
    </SiteShell>
  );
}
