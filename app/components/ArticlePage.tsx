import Link from "next/link";
import type { EditorialLocale, Post } from "../lib/posts";
import { posts } from "../lib/posts";
import { getTool, publicTools as tools, type Tool } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pathFor, postLanguageHrefs, postPath, schemaDate, siteUrl, toolPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { getLocalizedGuide } from "../lib/localized-guides";
import { BrandLogo } from "./BrandLogo";
import { GuideValidationLab, guideValidationText } from "./GuideValidationLab";
import { GuideActionPlan } from "./GuideActionPlan";

const articleUi = {
  tr: { home: "Ana sayfa", guides: "Rehberler", breadcrumb: "Sayfa yolu", updated: "Güncellendi", byline: "Teknik inceleme, birincil kaynak ve ürün doğrulaması", inGuide: "Bu rehberde", tryTool: "İlgili aracı deneyin", sources: "Kaynaklar", short: "Kısa cevap", sourcesTitle: "Kaynaklar ve doğrulama", sourcesIntro: "Bu rehber hazırlanırken aşağıdaki birincil ve resmî belgeler kontrol edildi. Bağlantıların güncel sürüm ve değişiklik tarihlerini ayrıca inceleyin.", related: "İLGİLİ ARAÇLAR", practice: "Bu rehberi uygulamaya dönüştürün", method: "Editoryal yöntem", methodBody: "İçerik, görünür ByteQuant ürün davranışı ve varsa listelenen birincil kaynaklarla karşılaştırılarak hazırlanır. Genel bilgilendirmedir; hukuki veya güvenlik danışmanlığı değildir.", action: "Bilgiyi uygulamaya dönüştürün", start: "araçla cihazınızda çalışmaya başlayın", explore: "Araçları keşfet", next: "SONRAKİ OKUMA", relatedGuides: "İlgili rehberler", all: "Tüm rehberler", read: "Rehberi oku" },
  en: { home: "Home", guides: "Guides", breadcrumb: "Breadcrumb", updated: "Updated", byline: "Technical review, primary sources, and product verification", inGuide: "In this guide", tryTool: "Try the related tool", sources: "Sources", short: "Short answer", sourcesTitle: "Sources and verification", sourcesIntro: "The following primary and official documentation was checked for this guide. Review each source's current version and change date as well.", related: "RELATED TOOLS", practice: "Put this guide into practice", method: "Editorial method", methodBody: "Content is checked against visible ByteQuant product behavior and the listed primary sources where available. It is general information, not legal or security advice.", action: "Turn guidance into action", start: "tools on your device", explore: "Explore tools", next: "READ NEXT", relatedGuides: "Related guides", all: "All guides", read: "Read guide" },
} as const;

function postRelevance(current: Post, candidate: Post) {
  const sharedTools = candidate.relatedTools.filter((slug) => current.relatedTools.includes(slug)).length;
  return sharedTools * 3 + (candidate.category.tr === current.category.tr ? 2 : 0);
}

export function ArticlePage({ post, locale }: { post: Post; locale: EditorialLocale }) {
  const isTr = locale === "tr";
  const ui = articleUi[locale];
  const currentLanguage = languageTag(locale);
  const pageUrl = absoluteUrl(postPath(locale, post.slug));
  const alternateHref = postPath(isTr ? "en" : "tr", post.slug);
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => postRelevance(post, b) - postRelevance(post, a))
    .slice(0, 3);
  const relatedTools = post.relatedTools
    .map((slug) => getTool(slug))
    .filter((tool): tool is Tool => Boolean(tool));
  const primaryTool = relatedTools[0];
  const isFourLanguageGuide = Boolean(getLocalizedGuide(post.slug));
  const formattedDate = new Intl.DateTimeFormat(currentLanguage, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.date}T00:00:00.000Z`));
  const modifiedDate = post.updated ?? post.date;
  const formattedModifiedDate = new Intl.DateTimeFormat(currentLanguage, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${modifiedDate}T00:00:00.000Z`));
  const visibleArticleText = [post.title[locale], post.description[locale], post.excerpt[locale], ...post.sections[locale].flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]), guideValidationText(post.title[locale], post.description[locale], locale, relatedTools)].join(" ");
  const wordCount = visibleArticleText.trim().split(/\s+/).length;
  const schema = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${pageUrl}#article`, headline: post.title[locale], description: post.description[locale], url: pageUrl,
      datePublished: schemaDate(post.date), dateModified: schemaDate(modifiedDate), inLanguage: currentLanguage, isAccessibleForFree: true, articleSection: post.category[locale], wordCount,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }, isPartOf: { "@id": websiteId },
      about: relatedTools.map((tool) => ({ "@type": "SoftwareApplication", name: tool.title[locale], url: absoluteUrl(toolPath(locale, tool.slug)) })),
      author: { "@type": "Organization", "@id": `${siteUrl}/#editorial`, name: "ByteQuant Editorial", url: absoluteUrl(pathFor(locale, "about")), parentOrganization: { "@id": organizationId } },
      publisher: { "@id": organizationId }, citation: post.sources?.map((source) => source.url),
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: ui.guides, item: absoluteUrl(pathFor(locale, "blog")) }, { "@type": "ListItem", position: 3, name: post.title[locale], item: pageUrl }] },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternateHref} languageHrefs={postLanguageHrefs(post.slug, isFourLanguageGuide)}>
      <SchemaScript data={schema} />
      <article className="article-page">
        <header className="article-header">
          <div className="container article-header-inner">
            <nav className="breadcrumbs" aria-label={ui.breadcrumb}>
              <Link href={pathFor(locale, "home")}>{ui.home}</Link>
              <span>/</span>
              <Link href={pathFor(locale, "blog")}>{ui.guides}</Link>
              <span>/</span>
              <span>{post.category[locale]}</span>
            </nav>
            <div className="article-meta">
              <span>{post.category[locale]}</span><span>·</span>
              <time dateTime={post.date}>{formattedDate}</time><span>·</span>
              <span>{post.readTime[locale]}</span>
              {post.updated && <><span>·</span><time dateTime={post.updated}>{ui.updated} {formattedModifiedDate}</time></>}
            </div>
            <h1>{post.title[locale]}</h1>
            <p>{post.excerpt[locale]}</p>
            <div className="byline">
              <BrandLogo />
              <div><Link href={pathFor(locale, "about")}><strong>ByteQuant Editorial</strong></Link><small>{ui.byline}</small></div>
            </div>
          </div>
        </header>

        <div className="container article-layout">
          <aside className="article-toc">
            <strong>{ui.inGuide}</strong>
            {post.sections[locale].map((section, index) => (
              <a href={`#section-${index + 1}`} key={section.heading}>
                <span>{String(index + 1).padStart(2, "0")}</span>{section.heading}
              </a>
            ))}
            {primaryTool && (
              <Link className="toc-tool" href={toolPath(locale, primaryTool.slug)}>
                <b>{ui.tryTool}</b>
                <span>{primaryTool.title[locale]} →</span>
              </Link>
            )}
            {post.sources && <a href="#sources"><span>↗</span>{ui.sources}</a>}
          </aside>

          <div className="article-body">
            <div className="article-summary"><strong>{ui.short}</strong><p>{post.description[locale]}</p></div>
            <GuideActionPlan guideTitle={post.title[locale]} locale={locale} tools={relatedTools.map((tool) => ({ slug: tool.slug, title: tool.title[locale], href: toolPath(locale, tool.slug), prepare: tool.steps[locale][0], verify: tool.steps[locale][2] }))} />
            {post.sections[locale].map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}

            {post.sources && <section id="sources" className="article-sources"><span className="section-index">↗</span><h2>{ui.sourcesTitle}</h2><p>{ui.sourcesIntro}</p><ol>{post.sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title[locale]} <span aria-hidden="true">↗</span></a></li>)}</ol></section>}

            <GuideValidationLab guideTitle={post.title[locale]} guideSummary={post.description[locale]} locale={locale} tools={relatedTools} />

            <section className="article-related-tools" aria-labelledby="article-related-tools-title">
              <span className="kicker">{ui.related}</span>
              <h2 id="article-related-tools-title">{ui.practice}</h2>
              <div className="article-tool-links">
                {relatedTools.map((tool) => (
                  <Link href={toolPath(locale, tool.slug)} key={tool.slug}>
                    <span className={`tool-mark category-${tool.category}`}>{tool.mark}</span>
                    <span><strong>{tool.title[locale]}</strong><small>{tool.short[locale]}</small></span>
                    <b aria-hidden="true">→</b>
                  </Link>
                ))}
              </div>
            </section>

            <div className="article-note">
              <strong>{ui.method}</strong>
              <p>{ui.methodBody}</p>
            </div>
            <div className="article-cta">
              <div><span>{ui.action}</span><h2>{tools.length} {ui.start}</h2></div>
              <Link className="light-button" href={pathFor(locale, "tools")}>{ui.explore} →</Link>
            </div>
          </div>
        </div>
      </article>

      <section className="section related-posts">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="kicker">{ui.next}</span><h2>{ui.relatedGuides}</h2></div>
            <Link className="text-link" href={pathFor(locale, "blog")}>{ui.all} →</Link>
          </div>
          <div className="post-grid">
            {relatedPosts.map((item) => (
              <article className="post-card" key={item.slug}>
                <span>{item.category[locale]} · {item.readTime[locale]}</span>
                <h3><Link href={postPath(locale, item.slug)}>{item.title[locale]}</Link></h3>
                <p>{item.excerpt[locale]}</p>
                <Link className="text-link" href={postPath(locale, item.slug)}>{ui.read} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
