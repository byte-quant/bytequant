import Link from "next/link";
import type { Post } from "../lib/posts";
import { posts } from "../lib/posts";
import { getTool, tools, type Tool } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pathFor, postPath, schemaDate, siteUrl, toolPath, websiteId, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { BrandLogo } from "./BrandLogo";

function postRelevance(current: Post, candidate: Post) {
  const sharedTools = candidate.relatedTools.filter((slug) => current.relatedTools.includes(slug)).length;
  return sharedTools * 3 + (candidate.category.tr === current.category.tr ? 2 : 0);
}

export function ArticlePage({ post, locale }: { post: Post; locale: Locale }) {
  const isTr = locale === "tr";
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
  const formattedDate = new Intl.DateTimeFormat(currentLanguage, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.date}T00:00:00.000Z`));
  const modifiedDate = post.updated ?? post.date;
  const formattedModifiedDate = new Intl.DateTimeFormat(currentLanguage, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${modifiedDate}T00:00:00.000Z`));
  const wordCount = post.sections[locale].flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])]).join(" ").trim().split(/\s+/).length;
  const schema = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${pageUrl}#article`, headline: post.title[locale], description: post.description[locale], url: pageUrl,
      datePublished: schemaDate(post.date), dateModified: schemaDate(modifiedDate), inLanguage: currentLanguage, isAccessibleForFree: true, articleSection: post.category[locale], wordCount,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }, isPartOf: { "@id": websiteId },
      about: relatedTools.map((tool) => ({ "@type": "SoftwareApplication", name: tool.title[locale], url: absoluteUrl(toolPath(locale, tool.slug)) })),
      author: { "@type": "Organization", "@id": `${siteUrl}/#editorial`, name: "ByteQuant Editorial", url: absoluteUrl(pathFor(locale, "about")), parentOrganization: { "@id": organizationId } },
      publisher: { "@id": organizationId }, citation: post.sources?.map((source) => source.url),
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: isTr ? "Ana sayfa" : "Home", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: isTr ? "Rehberler" : "Guides", item: absoluteUrl(pathFor(locale, "blog")) }, { "@type": "ListItem", position: 3, name: post.title[locale], item: pageUrl }] },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <article className="article-page">
        <header className="article-header">
          <div className="container article-header-inner">
            <nav className="breadcrumbs" aria-label={isTr ? "Sayfa yolu" : "Breadcrumb"}>
              <Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link>
              <span>/</span>
              <Link href={pathFor(locale, "blog")}>{isTr ? "Rehberler" : "Guides"}</Link>
              <span>/</span>
              <span>{post.category[locale]}</span>
            </nav>
            <div className="article-meta">
              <span>{post.category[locale]}</span><span>·</span>
              <time dateTime={post.date}>{formattedDate}</time><span>·</span>
              <span>{post.readTime[locale]}</span>
              {post.updated && <><span>·</span><time dateTime={post.updated}>{isTr ? `Güncellendi ${formattedModifiedDate}` : `Updated ${formattedModifiedDate}`}</time></>}
            </div>
            <h1>{post.title[locale]}</h1>
            <p>{post.excerpt[locale]}</p>
            <div className="byline">
              <BrandLogo />
              <div><Link href={pathFor(locale, "about")}><strong>ByteQuant Editorial</strong></Link><small>{isTr ? "Teknik inceleme, birincil kaynak ve ürün doğrulaması" : "Technical review, primary sources, and product verification"}</small></div>
            </div>
          </div>
        </header>

        <div className="container article-layout">
          <aside className="article-toc">
            <strong>{isTr ? "Bu rehberde" : "In this guide"}</strong>
            {post.sections[locale].map((section, index) => (
              <a href={`#section-${index + 1}`} key={section.heading}>
                <span>{String(index + 1).padStart(2, "0")}</span>{section.heading}
              </a>
            ))}
            {primaryTool && (
              <Link className="toc-tool" href={toolPath(locale, primaryTool.slug)}>
                <b>{isTr ? "İlgili aracı deneyin" : "Try the related tool"}</b>
                <span>{primaryTool.title[locale]} →</span>
              </Link>
            )}
            {post.sources && <a href="#sources"><span>↗</span>{isTr ? "Kaynaklar" : "Sources"}</a>}
          </aside>

          <div className="article-body">
            <div className="article-summary"><strong>{isTr ? "Kısa cevap" : "Short answer"}</strong><p>{post.description[locale]}</p></div>
            {post.sections[locale].map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {index === 1 && <AdSlot locale={locale} format="rectangle" />}
              </section>
            ))}

            {post.sources && <section id="sources" className="article-sources"><span className="section-index">↗</span><h2>{isTr ? "Kaynaklar ve doğrulama" : "Sources and verification"}</h2><p>{isTr ? "Bu rehber hazırlanırken aşağıdaki birincil ve resmî belgeler kontrol edildi. Bağlantıların güncel sürüm ve değişiklik tarihlerini ayrıca inceleyin." : "The following primary and official documentation was checked for this guide. Review each source's current version and change date as well."}</p><ol>{post.sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title[locale]} <span aria-hidden="true">↗</span></a></li>)}</ol></section>}

            <section className="article-related-tools" aria-labelledby="article-related-tools-title">
              <span className="kicker">{isTr ? "İLGİLİ ARAÇLAR" : "RELATED TOOLS"}</span>
              <h2 id="article-related-tools-title">{isTr ? "Bu rehberi uygulamaya dönüştürün" : "Put this guide into practice"}</h2>
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
              <strong>{isTr ? "Editoryal yöntem" : "Editorial method"}</strong>
              <p>{isTr ? "İçerik, görünür ByteQuant ürün davranışı ve varsa listelenen birincil kaynaklarla karşılaştırılarak hazırlanır. Genel bilgilendirmedir; hukuki veya güvenlik danışmanlığı değildir." : "Content is checked against visible ByteQuant product behavior and the listed primary sources where available. It is general information, not legal or security advice."}</p>
            </div>
            <div className="article-cta">
              <div><span>{isTr ? "Bilgiyi uygulamaya dönüştürün" : "Turn guidance into action"}</span><h2>{isTr ? `${tools.length} araçla cihazınızda çalışmaya başlayın` : `Start working on-device with ${tools.length} tools`}</h2></div>
              <Link className="light-button" href={pathFor(locale, "tools")}>{isTr ? "Araçları keşfet" : "Explore tools"} →</Link>
            </div>
          </div>
        </div>
      </article>

      <section className="section related-posts">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="kicker">{isTr ? "SONRAKİ OKUMA" : "READ NEXT"}</span><h2>{isTr ? "İlgili rehberler" : "Related guides"}</h2></div>
            <Link className="text-link" href={pathFor(locale, "blog")}>{isTr ? "Tüm rehberler" : "All guides"} →</Link>
          </div>
          <div className="post-grid">
            {relatedPosts.map((item) => (
              <article className="post-card" key={item.slug}>
                <span>{item.category[locale]} · {item.readTime[locale]}</span>
                <h3><Link href={postPath(locale, item.slug)}>{item.title[locale]}</Link></h3>
                <p>{item.excerpt[locale]}</p>
                <Link className="text-link" href={postPath(locale, item.slug)}>{isTr ? "Rehberi oku" : "Read guide"} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
