import Link from "next/link";
import { posts } from "../lib/posts";
import { absoluteUrl, languageTag, pathFor, postPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { localizedGuides } from "../lib/localized-guides";

export function LocalizedBlogIndex({ locale }: { locale: "de" | "zh" }) {
  const isDe = locale === "de";
  const url = absoluteUrl(pathFor(locale, "blog"));
  const ordered = posts.map((post, index) => ({ post, index })).sort((a, b) => b.post.date.localeCompare(a.post.date) || b.index - a.index).map(({ post }) => post);
  const englishOnly = ordered.filter((post) => !localizedGuides.some((guide) => guide.slug === post.slug));
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#page", name: isDe ? "ByteQuant Ratgeber" : "ByteQuant 指南", description: isDe ? "Redaktionell lokalisierte und klar gekennzeichnete englische Ratgeber zu Browser-Werkzeugen, Datenschutz und Sicherheit." : "关于浏览器工具、隐私与安全的编辑本地化指南及清晰标注的英文资料。", url, inLanguage: languageTag(locale), isPartOf: { "@id": websiteId }, mainEntity: { "@type": "ItemList", numberOfItems: localizedGuides.length + englishOnly.length, itemListElement: [...localizedGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(postPath(locale, guide.slug)), name: guide.copy[locale].title })), ...englishOnly.map((post, index) => ({ "@type": "ListItem", position: localizedGuides.length + index + 1, url: absoluteUrl(postPath("en", post.slug)), name: post.title.en }))] } };
  return (
    <SiteShell locale={locale} alternateHref="/en/blog" languageHrefs={{ tr: "/blog", en: "/en/blog", de: "/de/blog", zh: "/zh/blog" }}>
      <SchemaScript data={schema} />
      <section className="page-hero"><div className="container narrow-container"><span className="kicker">{isDe ? "BYTEQUANT RATGEBER" : "BYTEQUANT 指南"}</span><h1>{isDe ? "Methoden, Grenzen und sichere Arbeitsabläufe" : "方法、限制与安全工作流程"}</h1><p>{isDe ? "Neue Arbeitsabläufe werden redaktionell auf Deutsch erklärt. Weitere etablierte Fachartikel bleiben als transparent gekennzeichnete englische Originale zugänglich." : "新的工作流已完成中文编辑本地化；其他成熟专业文章仍以清晰标注的英文原文提供。"}</p></div></section>
      <section className="section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isDe ? "LOKALISIERTE RATGEBER" : "本地化指南"}</span><h2>{localizedGuides.length} {isDe ? "ausführliche Arbeitsabläufe" : "篇详细工作流"}</h2></div><p>{isDe ? "Redaktionell lokalisierte Methoden, Grenzen und Prüfschritte – einschließlich aller 27 neuen Werkzeuge in jeder Kategorie." : "经过编辑本地化的方法、限制与核验步骤，包含各分类全部 27 个新增工具。"}</p></div><div className="post-grid">{localizedGuides.map((guide, index) => { const copy = guide.copy[locale]; return <article className={"post-card post-card-" + (index % 3 + 1)} key={guide.slug}><span>{copy.category} · {copy.readTime}</span><h3><Link href={postPath(locale, guide.slug)}>{copy.title}</Link></h3><p>{copy.excerpt}</p><Link className="text-link" href={postPath(locale, guide.slug)}>{isDe ? "Ratgeber lesen" : "阅读指南"} →</Link></article>; })}</div></div></section>
      <section className="section subtle-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isDe ? "ENGLISCHE FACHARTIKEL" : "英文专业文章"}</span><h2>{englishOnly.length} {isDe ? "weitere ausführliche Ratgeber" : "篇更多详细指南"}</h2></div><p>{isDe ? "Englische Originale sind mit Sprachhinweisen versehen; nur redaktionell lokalisierte Inhalte werden als deutsch ausgewiesen." : "英文原文均有语言标识；只有完成编辑本地化的内容才会标记为中文。"}</p></div><div className="post-grid">{englishOnly.map((post, index) => <article className={"post-card post-card-" + (index % 3 + 1)} key={post.slug}><span lang="en">{post.category.en} · {post.readTime.en}</span><h3 lang="en"><Link href={postPath("en", post.slug)} hrefLang="en">{post.title.en}</Link></h3><p lang="en">{post.excerpt.en}</p><Link className="text-link" href={postPath("en", post.slug)} hrefLang="en">{isDe ? "Englischen Ratgeber lesen" : "阅读英文指南"} →</Link></article>)}</div></div></section>
    </SiteShell>
  );
}
