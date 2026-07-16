import Link from "next/link";
import { posts } from "../lib/posts";
import { absoluteUrl, languageTag, pathFor, postPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

export function LocalizedBlogIndex({ locale }: { locale: "de" | "zh" }) {
  const isDe = locale === "de";
  const url = absoluteUrl(pathFor(locale, "blog"));
  const ordered = posts.map((post, index) => ({ post, index })).sort((a, b) => b.post.date.localeCompare(a.post.date) || b.index - a.index).map(({ post }) => post);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#page", name: isDe ? "ByteQuant Ratgeber" : "ByteQuant 指南", description: isDe ? "Türkische und englische Langform-Ratgeber zu Datenschutz, Browser-Werkzeugen, SEO und Datensicherheit." : "关于隐私、浏览器工具、SEO 与数据安全的土耳其语和英语长篇指南。", url, inLanguage: languageTag(locale), isPartOf: { "@id": websiteId }, mainEntity: { "@type": "ItemList", numberOfItems: ordered.length, itemListElement: ordered.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(postPath("en", post.slug)), name: post.title.en })) } };
  return (
    <SiteShell locale={locale} alternateHref="/en/blog" languageHrefs={{ tr: "/blog", en: "/en/blog", de: "/de/blog", zh: "/zh/blog" }}>
      <SchemaScript data={schema} />
      <section className="page-hero"><div className="container narrow-container"><span className="kicker">{isDe ? "BYTEQUANT RATGEBER" : "BYTEQUANT 指南"}</span><h1>{isDe ? "Methoden, Grenzen und sichere Arbeitsabläufe" : "方法、限制与安全工作流程"}</h1><p>{isDe ? "Die Werkzeugoberfläche ist auf Deutsch verfügbar. Die ausführlichen redaktionellen Ratgeber bleiben vorerst in Türkisch und Englisch; die folgenden Links öffnen transparent gekennzeichnete englische Fassungen." : "工具界面已提供中文。现有长篇编辑指南暂时保留土耳其语和英语；以下链接会明确打开英文版本。"}</p></div></section>
      <section className="section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isDe ? "ENGLISCHE LANGFORM-INHALTE" : "英文长篇内容"}</span><h2>{ordered.length} {isDe ? "ausführliche Ratgeber" : "篇详细指南"}</h2></div><p>{isDe ? "Keine automatische oder ungeprüfte Maschinenübersetzung: fachliche Langform-Inhalte werden erst nach redaktioneller Lokalisierung als deutsch gekennzeichnet." : "不使用未经审校的自动长文翻译；只有完成编辑本地化后，内容才会标记为中文。"}</p></div><div className="post-grid">{ordered.map((post, index) => <article className={"post-card post-card-" + (index % 3 + 1)} key={post.slug}><span lang="en">{post.category.en} · {post.readTime.en}</span><h3 lang="en"><Link href={postPath("en", post.slug)} hrefLang="en">{post.title.en}</Link></h3><p lang="en">{post.excerpt.en}</p><Link className="text-link" href={postPath("en", post.slug)} hrefLang="en">{isDe ? "Englischen Ratgeber lesen" : "阅读英文指南"} →</Link></article>)}</div></div></section>
    </SiteShell>
  );
}
