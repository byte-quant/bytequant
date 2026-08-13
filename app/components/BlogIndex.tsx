import Link from "next/link";
import { posts, type EditorialLocale } from "../lib/posts";
import { absoluteUrl, languageTag, organizationId, pageLanguageHrefs, pathFor, postPath, websiteId } from "../lib/site";
import { GuideExplorer, type GuideExplorerItem } from "./GuideExplorer";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const blogUi = {
  tr: { home: "Ana sayfa", guides: "Rehberler", schemaName: "ByteQuant Rehberleri", schemaDescription: "Gizlilik, tarayıcı içi araçlar, uluslararası SEO ve veri güvenliği için kaynaklı uygulama rehberleri.", eyebrow: "Birincil kaynak · gerçek iş akışı · görünür sınırlar", title: "Arama, gizlilik ve tarayıcı içi işler için kanıta dayalı rehberler", intro: "Kısa cevapla başlayıp yöntemi, sınırı ve doğrulama adımlarını gösteriyoruz. Teknik SEO’dan PDF iş akışına kadar her rehber gerçek bir kullanıcı görevini tamamlamaya odaklanır.", depth: "ayrıntılı rehber", topics: "konu alanı", languages: "4 dilde tam içerik", clusters: "İçerik kümeleri", rss: "Rehber RSS akışını aç", latest: "YENİ REHBER", start: "Rehberi okumaya başlayın", research: "Araştır", apply: "Uygula · Ölç · Güncelle", sourced: "Kaynaklı yöntem", approach: "EDİTORYAL YAKLAŞIM", methodTitle: "İddia değil yöntem gösteriyoruz", points: ["Teknik kavramları gündelik dille açıklarız; önemli ayrımları gizlemeyiz.", "Hukuki ve güvenlik konularında otomatik uygunluk garantisi vermeyiz.", "İçerikleri ürün davranışı değiştiğinde gözden geçirir, düzeltme taleplerini açık tutarız."] },
  en: { home: "Home", guides: "Guides", schemaName: "ByteQuant Guides", schemaDescription: "Sourced, practical guides to privacy, in-browser tools, international SEO, and data security.", eyebrow: "Primary sources · real workflows · visible limitations", title: "Evidence-led guides to search, privacy, and in-browser work", intro: "We start with the useful answer, then show method, limitation, and verification. Every guide—from technical SEO to PDF workflows—focuses on completing a real task.", depth: "in-depth guides", topics: "topic areas", languages: "full content in 4 languages", clusters: "Topic clusters", rss: "Open the guides RSS feed", latest: "LATEST GUIDE", start: "Start reading", research: "Research", apply: "Apply · Measure · Update", sourced: "Sourced method", approach: "EDITORIAL APPROACH", methodTitle: "We show the method, not just the claim", points: ["We explain technical ideas in plain language without hiding important distinctions.", "We do not promise automatic legal or security compliance.", "We review content when product behavior changes and welcome correction requests."] },
} as const;

export function BlogIndex({ locale }: { locale: EditorialLocale }) {
  const ui = blogUi[locale];
  const currentLanguage = languageTag(locale);
  const alternateHref = locale === "tr" ? "/en/blog" : "/blog";
  const orderedPosts = posts.map((post, index) => ({ post, index })).sort((left, right) => right.post.date.localeCompare(left.post.date) || right.index - left.index).map(({ post }) => post);
  const featured = orderedPosts[0]!;
  const remaining = orderedPosts.slice(1);
  const categories = [...new Set(orderedPosts.map((post) => post.category[locale]))];
  const formatDate = (date: string) => new Intl.DateTimeFormat(currentLanguage, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00.000Z`));
  const explorerItems: GuideExplorerItem[] = remaining.map((post) => ({
    slug: post.slug,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    category: post.category[locale],
    readTime: post.readTime[locale],
    date: post.date,
    formattedDate: formatDate(post.date),
    href: postPath(locale, post.slug),
    kind: "localized",
  }));
  const blogUrl = absoluteUrl(pathFor(locale, "blog"));
  const schema = [
    { "@context": "https://schema.org", "@type": "Blog", "@id": `${blogUrl}#blog`, name: ui.schemaName, url: blogUrl, inLanguage: currentLanguage, description: ui.schemaDescription, publisher: { "@id": organizationId }, isPartOf: { "@id": websiteId }, blogPost: orderedPosts.map((post) => ({ "@id": `${absoluteUrl(postPath(locale, post.slug))}#article` })) },
    { "@context": "https://schema.org", "@type": "ItemList", "@id": `${blogUrl}#guide-list`, name: ui.schemaName, numberOfItems: orderedPosts.length, itemListElement: orderedPosts.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(postPath(locale, post.slug)), name: post.title[locale] })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${blogUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: ui.guides, item: blogUrl }] },
  ];
  return (
    <SiteShell locale={locale} alternateHref={alternateHref} languageHrefs={pageLanguageHrefs("blog")}>
      <SchemaScript data={schema} />
      <section className="page-hero editorial-hero"><div className="container"><nav className="breadcrumbs" aria-label={locale === "tr" ? "Sayfa yolu" : "Breadcrumb"}><Link href={pathFor(locale, "home")}>{ui.home}</Link><span aria-hidden="true">/</span><span aria-current="page">{ui.guides}</span></nav><span className="eyebrow"><i />{ui.eyebrow}</span><h1>{ui.title}</h1><p>{ui.intro}</p><div className="blog-proof"><span><strong>{orderedPosts.length}</strong> {ui.depth}</span><span><strong>{categories.length}</strong> {ui.topics}</span><span><strong>TR · EN · DE · ZH</strong> {ui.languages}</span></div></div></section>
      <section className="blog-topic-strip" aria-label={ui.clusters}><div className="container"><strong>{ui.clusters}</strong><div tabIndex={0}>{categories.slice(0, 8).map((category) => <span key={category}>{category}<small>{orderedPosts.filter((post) => post.category[locale] === category).length}</small></span>)}</div><a href={locale === "tr" ? "/feed.xml" : `/${locale}/feed.xml`} aria-label={ui.rss}>RSS ↗</a></div></section>
      <section id="guides" className="section blog-list-section"><div className="container"><article className="featured-post"><div className="featured-copy"><span>{ui.latest} · {featured.category[locale]} · {featured.readTime[locale]}</span><time dateTime={featured.date}>{formatDate(featured.date)}</time><h2><Link href={postPath(locale, featured.slug)}>{featured.title[locale]}</Link></h2><p>{featured.excerpt[locale]}</p><Link className="primary-button" href={postPath(locale, featured.slug)}>{ui.start} →</Link></div><div className="featured-visual" aria-hidden="true"><div className="diagram-device"><span>{ui.research}</span><strong>VERIFY</strong><small>{ui.apply}</small></div><div className="blocked-path"><b>✓</b><span>{ui.sourced}</span></div></div></article><GuideExplorer items={explorerItems} locale={locale} /></div></section>
      <section className="section editorial-policy"><div className="container"><div><span className="kicker">{ui.approach}</span><h2>{ui.methodTitle}</h2></div><div className="editorial-points">{ui.points.map((point, index) => <p key={point}><strong>{String(index + 1).padStart(2, "0")}</strong>{point}</p>)}</div></div></section>
    </SiteShell>
  );
}
