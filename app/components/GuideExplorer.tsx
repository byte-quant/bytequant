"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ExplorerLocale = "tr" | "en" | "de" | "zh";
type GuideKind = "localized" | "english";

export type GuideExplorerItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date?: string;
  formattedDate?: string;
  href: string;
  hrefLang?: string;
  languageLabel?: string;
  kind?: GuideKind;
};

const copy = {
  tr: {
    searchLabel: "Rehberlerde ara",
    searchPlaceholder: "Örn. PDF, KVKK, JSON veya erişilebilirlik",
    categoryLabel: "Konu seçin",
    allCategories: "Tüm konular",
    scopeLabel: "İçerik dili",
    allScopes: "Tümü",
    localized: "Türkçe",
    english: "İngilizce özgün",
    result: "rehber bulundu",
    visible: "gösteriliyor",
    clear: "Filtreleri temizle",
    emptyTitle: "Bu aramayla eşleşen rehber yok",
    emptyText: "Daha kısa bir ifade deneyin veya konu filtresini temizleyin.",
    read: "Rehberi oku",
    more: "Daha fazla rehber göster",
  },
  en: {
    searchLabel: "Search the guides",
    searchPlaceholder: "Try PDF, GDPR, JSON, or accessibility",
    categoryLabel: "Choose a topic",
    allCategories: "All topics",
    scopeLabel: "Content language",
    allScopes: "All",
    localized: "English",
    english: "English original",
    result: "guides found",
    visible: "shown",
    clear: "Clear filters",
    emptyTitle: "No guide matches this search",
    emptyText: "Try a shorter phrase or clear the topic filter.",
    read: "Read guide",
    more: "Show more guides",
  },
  de: {
    searchLabel: "Ratgeber durchsuchen",
    searchPlaceholder: "Zum Beispiel PDF, DSGVO, JSON oder Barrierefreiheit",
    categoryLabel: "Thema auswählen",
    allCategories: "Alle Themen",
    scopeLabel: "Inhaltssprache",
    allScopes: "Alle",
    localized: "Deutsch",
    english: "Englisches Original",
    result: "Ratgeber gefunden",
    visible: "angezeigt",
    clear: "Filter zurücksetzen",
    emptyTitle: "Kein Ratgeber passt zu dieser Suche",
    emptyText: "Versuchen Sie einen kürzeren Begriff oder setzen Sie den Themenfilter zurück.",
    read: "Ratgeber lesen",
    more: "Weitere Ratgeber anzeigen",
  },
  zh: {
    searchLabel: "搜索指南",
    searchPlaceholder: "例如 PDF、隐私、JSON 或无障碍",
    categoryLabel: "选择主题",
    allCategories: "全部主题",
    scopeLabel: "内容语言",
    allScopes: "全部",
    localized: "简体中文",
    english: "英文原文",
    result: "篇指南",
    visible: "篇已显示",
    clear: "清除筛选",
    emptyTitle: "没有符合条件的指南",
    emptyText: "请尝试更短的关键词，或清除主题筛选。",
    read: "阅读指南",
    more: "显示更多指南",
  },
} satisfies Record<ExplorerLocale, Record<string, string>>;

const localeTags: Record<ExplorerLocale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };

export function GuideExplorer({ items, locale, initialVisible = 18 }: { items: GuideExplorerItem[]; locale: ExplorerLocale; initialVisible?: number }) {
  const text = copy[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [scope, setScope] = useState<"all" | GuideKind>("all");
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))].sort((a, b) => a.localeCompare(b, localeTags[locale])), [items, locale]);
  const hasLanguageScopes = items.some((item) => item.kind === "english") && items.some((item) => item.kind === "localized");
  const normalizedQuery = query.trim().toLocaleLowerCase(localeTags[locale]);
  const filtered = useMemo(() => items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesScope = scope === "all" || item.kind === scope;
    const haystack = `${item.title} ${item.excerpt} ${item.category}`.toLocaleLowerCase(localeTags[locale]);
    return matchesCategory && matchesScope && (!normalizedQuery || haystack.includes(normalizedQuery));
  }), [category, items, locale, normalizedQuery, scope]);
  const shown = Math.min(visibleCount, filtered.length);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setScope("all");
    setVisibleCount(initialVisible);
  };

  return (
    <div className="guide-explorer" data-guide-explorer="progressive">
      <div className="guide-explorer-toolbar">
        <label className="guide-search-field">
          <span>{text.searchLabel}</span>
          <span className="guide-search-control">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              placeholder={text.searchPlaceholder}
              onChange={(event) => { setQuery(event.target.value); setVisibleCount(initialVisible); }}
              autoComplete="off"
            />
          </span>
        </label>
        <label className="guide-category-field">
          <span>{text.categoryLabel}</span>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleCount(initialVisible); }}>
            <option value="all">{text.allCategories}</option>
            {categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {hasLanguageScopes ? (
        <div className="guide-scope-row" role="group" aria-label={text.scopeLabel}>
          {(["all", "localized", "english"] as const).map((value) => (
            <button
              type="button"
              key={value}
              className={scope === value ? "is-active" : undefined}
              aria-pressed={scope === value}
              onClick={() => { setScope(value); setVisibleCount(initialVisible); }}
            >
              {value === "all" ? text.allScopes : text[value]}
            </button>
          ))}
        </div>
      ) : null}
      <div className="guide-explorer-summary">
        <p role="status" aria-live="polite"><strong>{filtered.length}</strong> {text.result} · <strong>{shown}</strong> {text.visible}</p>
        {(query || category !== "all" || scope !== "all") ? <button type="button" onClick={reset}>{text.clear}</button> : null}
      </div>
      {filtered.length ? (
        <div className="post-list-grid guide-explorer-grid">
          {filtered.map((item, index) => (
            <article className="guide-card guide-explorer-card" hidden={index >= visibleCount} key={`${item.kind ?? "guide"}-${item.slug}`} data-guide-entry={item.slug}>
              <div className={`guide-number guide-color-${index % 4}`}>{String(index + 1).padStart(2, "0")}</div>
              <div>
                <span>
                  {item.category} · {item.readTime}
                  {item.formattedDate ? <> · <time dateTime={item.date}>{item.formattedDate}</time></> : null}
                  {item.languageLabel ? <> · <b className="guide-language-badge">{item.languageLabel}</b></> : null}
                </span>
                <h2 lang={item.hrefLang}><Link href={item.href} hrefLang={item.hrefLang}>{item.title}</Link></h2>
                <p lang={item.hrefLang}>{item.excerpt}</p>
                <Link className="text-link" href={item.href} hrefLang={item.hrefLang}>{text.read} →</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="guide-explorer-empty" role="status"><span aria-hidden="true">⌕</span><div><h2>{text.emptyTitle}</h2><p>{text.emptyText}</p></div><button type="button" onClick={reset}>{text.clear}</button></div>
      )}
      {filtered.length > visibleCount ? <button className="guide-show-more" type="button" onClick={() => setVisibleCount((count) => count + initialVisible)}>{text.more}<span aria-hidden="true">↓</span></button> : null}
    </div>
  );
}
