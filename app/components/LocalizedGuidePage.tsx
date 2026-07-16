import Link from "next/link";
import type { LocalizedGuide, LocalizedGuideLocale } from "../lib/localized-guides";
import { getTool, type Tool } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pathFor, postPath, schemaDate, toolPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";

export function LocalizedGuidePage({ guide, locale }: { guide: LocalizedGuide; locale: LocalizedGuideLocale }) {
  const copy = guide.copy[locale];
  const isDe = locale === "de";
  const pageUrl = absoluteUrl(postPath(locale, guide.slug));
  const tools = guide.relatedTools.map(getTool).filter((tool): tool is Tool => Boolean(tool));
  const wordCount = copy.sections.flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])]).join(" ").trim().split(/\s+/).length;
  const schema = [
    { "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${pageUrl}#article`, headline: copy.title, description: copy.description, url: pageUrl, datePublished: schemaDate(guide.date), dateModified: schemaDate(guide.updated ?? guide.date), inLanguage: languageTag(locale), isAccessibleForFree: true, articleSection: copy.category, wordCount, mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }, isPartOf: { "@id": websiteId }, about: tools.map((tool) => ({ "@type": "WebApplication", name: tool.title[locale], url: absoluteUrl(toolPath(locale, tool.slug)) })), author: { "@type": "Organization", "@id": `${absoluteUrl("/")}#editorial`, name: "ByteQuant Editorial" }, publisher: { "@id": organizationId } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: isDe ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: isDe ? "Ratgeber" : "指南", item: absoluteUrl(pathFor(locale, "blog")) }, { "@type": "ListItem", position: 3, name: copy.title, item: pageUrl }] },
  ];
  return <SiteShell locale={locale} alternateHref={postPath("en", guide.slug)} languageHrefs={{ tr: postPath("tr", guide.slug), en: postPath("en", guide.slug), de: postPath("de", guide.slug), zh: postPath("zh", guide.slug) }}>
    <SchemaScript data={schema} />
    <div className="container page-top"><nav className="breadcrumbs" aria-label={isDe ? "Brotkrumen" : "面包屑导航"}><Link href={pathFor(locale, "home")}>{isDe ? "Startseite" : "首页"}</Link><span>/</span><Link href={pathFor(locale, "blog")}>{isDe ? "Ratgeber" : "指南"}</Link><span>/</span><span>{copy.category}</span></nav></div>
    <article>
      <header className="article-header"><div className="container narrow-container"><span className="kicker">{copy.category}</span><h1>{copy.title}</h1><p>{copy.excerpt}</p><div className="article-meta"><time dateTime={guide.date}>{new Intl.DateTimeFormat(languageTag(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.date}T00:00:00Z`))}</time><span>·</span><span>{copy.readTime}</span><span>·</span><span>ByteQuant Editorial</span></div></div></header>
      <div className="container article-layout"><div className="article-body">{copy.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}</div><aside className="article-sidebar"><div><span className="kicker">{isDe ? "IN DIESEM RATGEBER" : "本指南内容"}</span><ol>{copy.sections.map((section, index) => <li key={section.heading}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</li>)}</ol></div><div className="limit-note"><strong>{isDe ? "Redaktioneller Hinweis" : "编辑说明"}</strong><p>{isDe ? "Methoden und Grenzen wurden für diese Sprachfassung redaktionell lokalisiert. Fachlich kritische Entscheidungen benötigen weiterhin unabhängige Prüfung." : "本语言版本已对方法与限制进行编辑本地化。专业关键决策仍需独立核验。"}</p></div></aside></div>
    </article>
    <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isDe ? "WERKZEUGE ZUM RATGEBER" : "指南相关工具"}</span><h2>{isDe ? "Arbeitsablauf direkt ausprobieren" : "立即尝试工作流"}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{isDe ? "Alle Werkzeuge" : "全部工具"} →</Link></div><div className="tool-grid">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}</div></div></section>
  </SiteShell>;
}
