"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";
import type { NewsItem } from "../lib/generated-news";

const copy = {
  tr: { all: "Tümü", science: "Bilim", technology: "Teknoloji", security: "Siber güvenlik", standards: "Standartlar", search: "Başlık ve kaynakta ara", save: "Kaydet", saved: "Kaydedildi", share: "Paylaş", open: "Kaynağı aç", more: "Daha fazla göster", empty: "Bu filtrede içerik bulunamadı.", local: "Kaydedilenler yalnızca bu cihazda tutulur.", source: "Resmî kaynağa gider" },
  en: { all: "All", science: "Science", technology: "Technology", security: "Cybersecurity", standards: "Standards", search: "Search titles and sources", save: "Save", saved: "Saved", share: "Share", open: "Open source", more: "Show more", empty: "No item matches this filter.", local: "Saved items stay only on this device.", source: "Opens the official source" },
  de: { all: "Alle", science: "Wissenschaft", technology: "Technologie", security: "Cybersicherheit", standards: "Standards", search: "Titel und Quellen durchsuchen", save: "Speichern", saved: "Gespeichert", share: "Teilen", open: "Quelle öffnen", more: "Mehr anzeigen", empty: "Keine Meldung entspricht dem Filter.", local: "Gespeicherte Einträge bleiben nur auf diesem Gerät.", source: "Öffnet die offizielle Quelle" },
  zh: { all: "全部", science: "科学", technology: "技术", security: "网络安全", standards: "标准", search: "搜索标题和来源", save: "收藏", saved: "已收藏", share: "分享", open: "打开来源", more: "显示更多", empty: "该筛选条件下没有内容。", local: "收藏仅保存在此设备。", source: "打开官方来源" },
} as const;
const key = "bytequant:news-favorites:v1";

export function NewsFeedClient({ locale, items }: { locale: Locale; items: NewsItem[] }) {
  const t = copy[locale]; const [filter, setFilter] = useState<"all" | NewsItem["category"]>("all"); const [query, setQuery] = useState(""); const [limit, setLimit] = useState(12); const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(-200) : [];
    } catch { return []; }
  });
  const filtered = useMemo(() => items.filter((item) => filter === "all" || item.category === filter).filter((item) => `${item.title} ${item.source}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [filter, items, query]);
  const visible = filtered.slice(0, limit);
  function toggle(id: string) { setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-200); try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* optional preference */ } return next; }); }
  async function share(item: NewsItem) { if (navigator.share) { try { await navigator.share({ title: item.title, url: item.url }); return; } catch { return; } } try { await navigator.clipboard.writeText(`${item.title}\n${item.url}`); } catch { /* the original link remains available */ } }
  const filters: Array<[typeof filter, string]> = [["all", t.all], ["science", t.science], ["technology", t.technology], ["security", t.security], ["standards", t.standards]];
  return <section className="news-feed"><div className="news-controls"><div>{filters.map(([value, label]) => <button type="button" className={filter === value ? "active" : ""} key={value} onClick={() => { setFilter(value); setLimit(12); }}>{label}</button>)}</div><label><span>⌕</span><input type="search" value={query} placeholder={t.search} onChange={(event) => { setQuery(event.target.value); setLimit(12); }} /></label></div><small className="news-local-note">◉ {t.local}</small><div className="news-grid">{visible.map((item) => <article key={item.id}><header><span>{t[item.category]}</span><small>{item.source}</small></header><h2>{item.title}</h2><time dateTime={item.date}>{new Date(`${item.date}T12:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</time><footer><button type="button" className={favorites.includes(item.id) ? "active" : ""} aria-pressed={favorites.includes(item.id)} onClick={() => toggle(item.id)}>☆ {favorites.includes(item.id) ? t.saved : t.save}</button><button type="button" onClick={() => void share(item)}>↗ {t.share}</button><a href={item.url} target="_blank" rel="noreferrer noopener">{t.open} ↗<small>{t.source}</small></a></footer></article>)}{!visible.length && <p className="news-empty">{t.empty}</p>}</div>{visible.length < filtered.length && <button className="news-more" type="button" onClick={() => setLimit((value) => value + 12)}>{t.more} ↓</button>}</section>;
}
