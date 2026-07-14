import Link from "next/link";
import { posts } from "../lib/posts";
import { pathFor, postPath, siteUrl, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function BlogIndex({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const alternateHref = locale === "tr" ? "/en/blog" : "/blog";
  const schema = { "@context": "https://schema.org", "@type": "Blog", name: isTr ? "ByteQuant Rehberleri" : "ByteQuant Guides", url: `${siteUrl}${pathFor(locale, "blog")}`, inLanguage: locale, description: isTr ? "Gizlilik, prompt mühendisliği ve veri güvenliği rehberleri." : "Guides to privacy, prompt engineering, and data security.", blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title[locale], url: `${siteUrl}${postPath(locale, post.slug)}`, datePublished: post.date })) };
  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <section className="page-hero editorial-hero"><div className="container"><nav className="breadcrumbs"><Link href={pathFor(locale, "home")}>{isTr ? "Ana sayfa" : "Home"}</Link><span>/</span><span>{isTr ? "Rehberler" : "Guides"}</span></nav><span className="eyebrow"><i />{isTr ? "Uygulamaya dönük, açık yöntemler" : "Practical guidance with transparent methods"}</span><h1>{isTr ? "Daha güvenli ve daha bilinçli dijital çalışma rehberleri" : "Guides for safer, more deliberate digital work"}</h1><p>{isTr ? "Gizlilik, prompt mühendisliği, tarayıcı içi araçlar ve veri güvenliği konularını abartısız, uygulanabilir ve teknik temeli görünür biçimde ele alıyoruz." : "Clear, practical writing on privacy, prompt engineering, in-browser tools, and data security—without inflated claims."}</p></div></section>
      <section className="section blog-list-section"><div className="container"><article className="featured-post"><div className="featured-copy"><span>{posts[0].category[locale]} · {posts[0].readTime[locale]}</span><h2><Link href={postPath(locale, posts[0].slug)}>{posts[0].title[locale]}</Link></h2><p>{posts[0].excerpt[locale]}</p><Link className="primary-button" href={postPath(locale, posts[0].slug)}>{isTr ? "Rehberi okumaya başlayın" : "Start reading"} →</Link></div><div className="featured-visual" aria-hidden="true"><div className="diagram-device"><span>{isTr ? "Tarayıcı" : "Browser"}</span><strong>LOCAL</strong><small>{isTr ? "Girdi · İşlem · Sonuç" : "Input · Process · Result"}</small></div><div className="blocked-path"><b>×</b><span>{isTr ? "Uzak sunucu" : "Remote server"}</span></div></div></article><div className="post-list-grid">{posts.slice(1).map((post, index) => <article className="guide-card" key={post.slug}><div className={`guide-number guide-color-${index % 4}`}>{String(index + 2).padStart(2, "0")}</div><div><span>{post.category[locale]} · {post.readTime[locale]}</span><h2><Link href={postPath(locale, post.slug)}>{post.title[locale]}</Link></h2><p>{post.excerpt[locale]}</p><Link className="text-link" href={postPath(locale, post.slug)}>{isTr ? "Rehberi oku" : "Read guide"} →</Link></div></article>)}</div></div></section>
      <div className="container"><AdSlot locale={locale} /></div>
      <section className="section editorial-policy"><div className="container"><div><span className="kicker">{isTr ? "EDİTORYAL YAKLAŞIM" : "EDITORIAL APPROACH"}</span><h2>{isTr ? "İddia değil yöntem gösteriyoruz" : "We show the method, not just the claim"}</h2></div><div className="editorial-points"><p><strong>01</strong>{isTr ? "Teknik kavramları gündelik dille açıklarız; önemli ayrımları gizlemeyiz." : "We explain technical ideas in plain language without hiding important distinctions."}</p><p><strong>02</strong>{isTr ? "Hukuki ve güvenlik konularında otomatik uygunluk garantisi vermeyiz." : "We do not promise automatic legal or security compliance."}</p><p><strong>03</strong>{isTr ? "İçerikleri ürün davranışı değiştiğinde gözden geçirir, düzeltme taleplerini açık tutarız." : "We review content when product behavior changes and welcome correction requests."}</p></div></div></section>
    </SiteShell>
  );
}

