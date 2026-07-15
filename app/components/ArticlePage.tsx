import Link from "next/link";
import type { Post } from "../lib/posts";
import { posts } from "../lib/posts";
import { getTool, tools, type Tool } from "../lib/tools";
import { pathFor, postPath, siteUrl, toolPath, type Locale } from "../lib/site";
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
  const languageTag = isTr ? "tr-TR" : "en-US";
  const alternateHref = postPath(isTr ? "en" : "tr", post.slug);
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => postRelevance(post, b) - postRelevance(post, a))
    .slice(0, 3);
  const relatedTools = post.relatedTools
    .map((slug) => getTool(slug))
    .filter((tool): tool is Tool => Boolean(tool));
  const primaryTool = relatedTools[0];
  const formattedDate = new Intl.DateTimeFormat(languageTag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.date}T00:00:00.000Z`));
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title[locale],
    description: post.description[locale],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: languageTag,
    mainEntityOfPage: `${siteUrl}${postPath(locale, post.slug)}`,
    about: relatedTools.map((tool) => ({ "@type": "SoftwareApplication", name: tool.title[locale], url: `${siteUrl}${toolPath(locale, tool.slug)}` })),
    author: { "@type": "Organization", name: "ByteQuant Editorial", url: `${siteUrl}${pathFor(locale, "about")}` },
    publisher: { "@type": "Organization", name: "ByteQuant", url: siteUrl },
    image: `${siteUrl}/og.png`,
  };

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
            </div>
            <h1>{post.title[locale]}</h1>
            <p>{post.excerpt[locale]}</p>
            <div className="byline">
              <BrandLogo />
              <div><strong>ByteQuant Editorial</strong><small>{isTr ? "Teknik inceleme ve ürün doğrulaması" : "Technical review and product verification"}</small></div>
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
              <strong>{isTr ? "Editoryal not" : "Editorial note"}</strong>
              <p>{isTr ? `Görsel önerisi: ${post.visualSuggestion.tr} Bu içerik genel bilgilendirme amaçlıdır; hukuki veya güvenlik danışmanlığı değildir.` : `Visual suggestion: ${post.visualSuggestion.en} This article is general information, not legal or security advice.`}</p>
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
