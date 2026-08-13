import Link from "next/link";
import { posts } from "../lib/posts";
import { absoluteUrl, languageTag, pathFor, postPath, websiteId } from "../lib/site";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { localizedGuides } from "../lib/localized-guides";
import { GuideExplorer, type GuideExplorerItem } from "./GuideExplorer";

export function LocalizedBlogIndex({ locale }: { locale: "de" | "zh" }) {
  const isDe = locale === "de";
  const url = absoluteUrl(pathFor(locale, "blog"));
  const ordered = posts.map((post, index) => ({ post, index })).sort((a, b) => b.post.date.localeCompare(a.post.date) || b.index - a.index).map(({ post }) => post);
  const englishOnly = ordered.filter((post) => !localizedGuides.some((guide) => guide.slug === post.slug));
  const explorerItems: GuideExplorerItem[] = [
    ...localizedGuides.map((guide) => ({
      slug: guide.slug,
      title: guide.copy[locale].title,
      excerpt: guide.copy[locale].excerpt,
      category: guide.copy[locale].category,
      readTime: guide.copy[locale].readTime,
      href: postPath(locale, guide.slug),
      kind: "localized" as const,
      languageLabel: isDe ? "DE" : "简中",
    })),
    ...englishOnly.map((post) => ({
      slug: post.slug,
      title: post.title.en,
      excerpt: post.excerpt.en,
      category: post.category.en,
      readTime: post.readTime.en,
      href: postPath("en", post.slug),
      hrefLang: "en",
      kind: "english" as const,
      languageLabel: "EN",
    })),
  ];
  const schema = [{ "@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#page", name: isDe ? "ByteQuant Ratgeber" : "ByteQuant 指南", description: isDe ? "Redaktionell lokalisierte und klar gekennzeichnete englische Ratgeber zu Browser-Werkzeugen, Datenschutz und Sicherheit." : "关于浏览器工具、隐私与安全的编辑本地化指南及清晰标注的英文资料。", url, inLanguage: languageTag(locale), isPartOf: { "@id": websiteId }, mainEntity: { "@type": "ItemList", numberOfItems: localizedGuides.length + englishOnly.length, itemListElement: [...localizedGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(postPath(locale, guide.slug)), name: guide.copy[locale].title })), ...englishOnly.map((post, index) => ({ "@type": "ListItem", position: localizedGuides.length + index + 1, url: absoluteUrl(postPath("en", post.slug)), name: post.title.en }))] } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: isDe ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: isDe ? "Ratgeber" : "指南", item: url }] }];
  return (
    <SiteShell locale={locale} alternateHref="/en/blog" languageHrefs={{ tr: "/blog", en: "/en/blog", de: "/de/blog", zh: "/zh/blog" }}>
      <SchemaScript data={schema} />
      <section className="page-hero editorial-hero"><div className="container"><nav className="breadcrumbs" aria-label={isDe ? "Brotkrumen" : "面包屑导航"}><Link href={pathFor(locale, "home")}>{isDe ? "Startseite" : "首页"}</Link><span aria-hidden="true">/</span><span aria-current="page">{isDe ? "Ratgeber" : "指南"}</span></nav><span className="eyebrow"><i />{isDe ? "PRAXIS · GRENZEN · PRÜFUNG" : "实用方法 · 明确边界 · 可验证"}</span><h1>{isDe ? "Methoden, Grenzen und sichere Arbeitsabläufe" : "方法、限制与安全工作流程"}</h1><p>{isDe ? "Neue Arbeitsabläufe werden redaktionell auf Deutsch erklärt. Weitere etablierte Fachartikel bleiben als transparent gekennzeichnete englische Originale zugänglich." : "新的工作流已完成中文编辑本地化；其他成熟专业文章仍以清晰标注的英文原文提供。"}</p><div className="blog-proof"><span><strong>{localizedGuides.length}</strong>{isDe ? " redaktionell lokalisierte Ratgeber" : " 篇编辑本地化指南"}</span><span><strong>{englishOnly.length}</strong>{isDe ? " klar markierte englische Originale" : " 篇清晰标注的英文原文"}</span><span><strong>RSS</strong><a className="text-link" href={locale === "de" ? "/de/feed.xml" : "/zh/feed.xml"} aria-label={isDe ? "Ratgeber-RSS-Feed öffnen" : "打开指南 RSS 订阅源"}>{isDe ? "Feed öffnen" : "打开订阅源"} ↗</a></span></div></div></section>
      <section className="section localized-guide-library"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isDe ? "DURCHSUCHBARE BIBLIOTHEK" : "可搜索指南库"}</span><h2>{explorerItems.length} {isDe ? "Ratgeber mit klarer Sprachkennzeichnung" : "篇带有清晰语言标识的指南"}</h2></div><p>{isDe ? `${localizedGuides.length} redaktionell lokalisierte Ratgeber und ${englishOnly.length} klar gekennzeichnete englische Originale. Suche, Thema und Sprache lassen sich ohne Seitenwechsel filtern.` : `${localizedGuides.length} 篇经过编辑本地化的中文指南，以及 ${englishOnly.length} 篇清晰标注的英文原文。无需离开页面即可按关键词、主题和语言筛选。`}</p></div><GuideExplorer items={explorerItems} locale={locale} /></div></section>
    </SiteShell>
  );
}
