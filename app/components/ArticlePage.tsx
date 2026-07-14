import Link from "next/link";
import type { Post } from "../lib/posts";
import { posts } from "../lib/posts";
import { tools } from "../lib/tools";
import { pathFor, postPath, siteUrl, toolPath, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function ArticlePage({ post, locale }: { post: Post; locale: Locale }) {
  const isTr = locale === "tr";
  const alternateHref = postPath(locale === "tr" ? "en" : "tr", post.slug);
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title[locale], description: post.description[locale], datePublished: post.date, dateModified: post.date, inLanguage: locale, mainEntityOfPage: `${siteUrl}${postPath(locale, post.slug)}`, author: { "@type": "Organization", name: "ByteQuant Editorial", url: `${siteUrl}${pathFor(locale, "about")}` }, publisher: { "@type": "Organization", name: "ByteQuant", url: siteUrl }, image: `${siteUrl}/og.png` };
  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <article className="article-page">
        <header className="article-header"><div className="container article-header-inner"><nav className="breadcrumbs"><Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link><span>/</span><Link href={pathFor(locale, "blog")}>{isTr ? "Rehberler" : "Guides"}</Link><span>/</span><span>{post.category[locale]}</span></nav><div className="article-meta"><span>{post.category[locale]}</span><span>·</span><time dateTime={post.date}>{isTr ? "14 Temmuz 2026" : "July 14, 2026"}</time><span>·</span><span>{post.readTime[locale]}</span></div><h1>{post.title[locale]}</h1><p>{post.excerpt[locale]}</p><div className="byline"><span className="brand-mark">BQ</span><div><strong>ByteQuant Editorial</strong><small>{isTr ? "Teknik inceleme ve ürün doğrulaması" : "Technical review and product verification"}</small></div></div></div></header>
        <div className="container article-layout"><aside className="article-toc"><strong>{isTr ? "Bu rehberde" : "In this guide"}</strong>{post.sections[locale].map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}<Link className="toc-tool" href={toolPath(locale, "kvkk-veri-maskeleyici")}><b>{isTr ? "Aracı deneyin" : "Try a tool"}</b><span>{isTr ? "KVKK / GDPR Veri Maskeleyici" : "KVKK / GDPR Data Masker"} →</span></Link></aside><div className="article-body"><div className="article-summary"><strong>{isTr ? "Kısa cevap" : "Short answer"}</strong><p>{post.description[locale]}</p></div>{post.sections[locale].map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><span className="section-index">{String(index + 1).padStart(2, "0")}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{index === 1 && <AdSlot locale={locale} format="rectangle" />}</section>)}<div className="article-note"><strong>{isTr ? "Editoryal not" : "Editorial note"}</strong><p>{isTr ? `Görsel önerisi: ${post.visualSuggestion.tr} Bu içerik genel bilgilendirme amaçlıdır; hukuki veya güvenlik danışmanlığı değildir.` : `Visual suggestion: ${post.visualSuggestion.en} This article is general information, not legal or security advice.`}</p></div><div className="article-cta"><div><span>{isTr ? "Bilgiyi uygulamaya dönüştürün" : "Turn guidance into action"}</span><h2>{isTr ? `${tools.length} araçla cihazınızda çalışmaya başlayın` : `Start working on-device with ${tools.length} tools`}</h2></div><Link className="light-button" href={pathFor(locale, "tools")}>{isTr ? "Araçları keşfet" : "Explore tools"} →</Link></div></div></div>
      </article>
      <section className="section related-posts"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isTr ? "SONRAKİ OKUMA" : "READ NEXT"}</span><h2>{isTr ? "İlgili rehberler" : "Related guides"}</h2></div><Link className="text-link" href={pathFor(locale, "blog")}>{isTr ? "Tüm rehberler" : "All guides"} →</Link></div><div className="post-grid">{related.map((item) => <article className="post-card" key={item.slug}><span>{item.category[locale]} · {item.readTime[locale]}</span><h3><Link href={postPath(locale, item.slug)}>{item.title[locale]}</Link></h3><p>{item.excerpt[locale]}</p><Link className="text-link" href={postPath(locale, item.slug)}>{isTr ? "Rehberi oku" : "Read guide"} →</Link></article>)}</div></div></section>
    </SiteShell>
  );
}
