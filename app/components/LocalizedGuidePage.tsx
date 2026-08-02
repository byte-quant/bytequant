import Link from "next/link";
import type { LocalizedGuide, LocalizedGuideLocale } from "../lib/localized-guides";
import { getTool, type Tool } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pathFor, postPath, schemaDate, toolPath, websiteId } from "../lib/site";
import { BrandLogo } from "./BrandLogo";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";

function articleWordCount(text: string, locale: LocalizedGuideLocale) {
  const segmenter = new Intl.Segmenter(languageTag(locale), { granularity: "word" });
  return [...segmenter.segment(text)].filter((segment) => segment.isWordLike).length;
}

export function LocalizedGuidePage({ guide, locale }: { guide: LocalizedGuide; locale: LocalizedGuideLocale }) {
  const copy = guide.copy[locale];
  const isDe = locale === "de";
  const localized = <T,>(de: T, zh: T) => (isDe ? de : zh);
  const pageUrl = absoluteUrl(postPath(locale, guide.slug));
  const tools = guide.relatedTools.map(getTool).filter((tool): tool is Tool => Boolean(tool));
  const articleText = [copy.title, copy.description, ...copy.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])].join(" ");
  const wordCount = articleWordCount(articleText, locale);
  const published = new Intl.DateTimeFormat(languageTag(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.date}T00:00:00Z`));
  const updated = new Intl.DateTimeFormat(languageTag(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.updated ?? guide.date}T00:00:00Z`));
  const schema = [
    { "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${pageUrl}#article`, headline: copy.title, description: copy.description, url: pageUrl, datePublished: schemaDate(guide.date), dateModified: schemaDate(guide.updated ?? guide.date), inLanguage: languageTag(locale), isAccessibleForFree: true, articleSection: copy.category, wordCount, mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }, isPartOf: { "@id": websiteId }, about: tools.map((tool) => ({ "@type": "WebApplication", name: tool.title[locale], url: absoluteUrl(toolPath(locale, tool.slug)) })), author: { "@type": "Organization", "@id": `${absoluteUrl("/")}#editorial`, name: "ByteQuant Editorial", url: absoluteUrl(pathFor(locale, "about")) }, publisher: { "@id": organizationId } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: localized("Startseite", "首页"), item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: localized("Ratgeber", "指南"), item: absoluteUrl(pathFor(locale, "blog")) }, { "@type": "ListItem", position: 3, name: copy.title, item: pageUrl }] },
  ];

  return (
    <SiteShell locale={locale} alternateHref={postPath("en", guide.slug)} languageHrefs={{ tr: postPath("tr", guide.slug), en: postPath("en", guide.slug), de: postPath("de", guide.slug), zh: postPath("zh", guide.slug) }}>
      <SchemaScript data={schema} />
      <article className="article-page localized-guide-page" lang={languageTag(locale)}>
        <header className="article-header">
          <div className="container article-header-inner">
            <nav className="breadcrumbs" aria-label={localized("Brotkrumen", "面包屑导航")}>
              <Link href={pathFor(locale, "home")}>{localized("Startseite", "首页")}</Link><span>/</span>
              <Link href={pathFor(locale, "blog")}>{localized("Ratgeber", "指南")}</Link><span>/</span>
              <span>{copy.category}</span>
            </nav>
            <div className="article-meta"><span>{copy.category}</span><span aria-hidden="true">·</span><time dateTime={guide.date}>{published}</time><span aria-hidden="true">·</span><span>{copy.readTime}</span></div>
            <h1>{copy.title}</h1>
            <p>{copy.excerpt}</p>
            <div className="byline"><BrandLogo /><div><Link href={pathFor(locale, "about")}><strong>ByteQuant Editorial</strong></Link><small>{localized("Methodenprüfung, lokale Produktkontrolle und klare Grenzen", "方法核验、本地产品验证与清晰边界")}</small></div></div>
            {guide.updated && guide.updated !== guide.date ? <small className="article-updated"><time dateTime={guide.updated}>{localized(`Fachlich aktualisiert: ${updated}`, `内容更新：${updated}`)}</time></small> : null}
          </div>
        </header>

        <div className="container article-layout localized-guide-layout">
          <aside className="article-toc localized-guide-toc" aria-label={localized("Inhaltsverzeichnis", "文章目录")}>
            <strong>{localized("In diesem Ratgeber", "本指南内容")}</strong>
            {copy.sections.map((section, index) => (
              <a href={`#guide-section-${index + 1}`} key={section.heading}>
                <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b><span>{section.heading}</span>
              </a>
            ))}
            {tools[0] ? <Link className="toc-tool" href={toolPath(locale, tools[0].slug)}><b>{localized("Passendes Werkzeug", "相关工具")}</b><span>{tools[0].title[locale]} →</span></Link> : null}
            <div className="localized-editorial-note"><strong>{localized("Redaktioneller Hinweis", "编辑说明")}</strong><p>{localized("Methoden und Grenzen wurden für diese Sprachfassung redaktionell lokalisiert. Folgenreiche Entscheidungen benötigen eine unabhängige fachliche Prüfung.", "本语言版本已对方法与限制进行编辑本地化。涉及重要后果的决定仍需独立专业核验。")}</p></div>
          </aside>

          <div className="article-body">
            <aside className="article-summary" aria-label={localized("Kurzfassung", "摘要")}>
              <strong>{localized("Was Sie mitnehmen", "读完您将掌握")}</strong><p>{copy.description}</p>
              <ul>
                <li>{localized("Ein wiederholbarer Ablauf mit klaren Abnahmekriterien", "带有明确验收标准的可重复流程")}</li>
                <li>{localized("Sichere Fehler- und Abbruchbedingungen", "安全的失败与停止条件")}</li>
                <li>{localized("Eine nachvollziehbare Übergabe an passende lokale Werkzeuge", "可核验地交付到相关本地工具")}</li>
              </ul>
            </aside>
            {copy.sections.map((section, index) => (
              <section id={`guide-section-${index + 1}`} key={section.heading}>
                <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{localized("WERKZEUGE ZUM RATGEBER", "指南相关工具")}</span><h2>{localized("Arbeitsablauf direkt ausprobieren", "立即尝试工作流")}</h2></div><Link className="text-link" href={pathFor(locale, "tools")}>{localized("Alle Werkzeuge", "全部工具")} →</Link></div><div className="tool-grid">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}</div></div></section>
    </SiteShell>
  );
}
