"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { categories, tools } from "../lib/tools";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { ToolIcon } from "./ToolIcon";

const fold = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

export function HeroToolSearch({ locale }: { locale: Locale }) {
  const t = {
    tr: { label: "Araçlarda anında ara", placeholder: "JSON, PDF, KVKK, regex…", hint: "Yazmaya başlayın; sonuçlar cihazınızda anında filtrelenir.", all: "Tüm araçları göster", empty: "Bu ifadeyle eşleşen araç bulunamadı. Daha kısa bir terim deneyin." },
    en: { label: "Search tools instantly", placeholder: "JSON, PDF, privacy, regex…", hint: "Start typing; results are filtered instantly on your device.", all: "View every tool", empty: "No tool matched that phrase. Try a shorter term." },
    de: { label: "Werkzeuge sofort durchsuchen", placeholder: "JSON, PDF, Datenschutz, Regex…", hint: "Einfach tippen; Ergebnisse werden sofort auf dem Gerät gefiltert.", all: "Alle Werkzeuge", empty: "Kein Werkzeug passt. Versuchen Sie einen kürzeren Begriff." },
    zh: { label: "即时搜索工具", placeholder: "JSON、PDF、隐私、正则…", hint: "开始输入，结果会立即在设备上筛选。", all: "查看全部工具", empty: "没有匹配工具，请尝试更短的关键词。" },
  }[locale];
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const results = useMemo(() => {
    const terms = fold(deferred).trim().split(/\s+/u).filter(Boolean);
    if (!terms.length) return [];
    return tools.map((tool) => {
      const title = fold(tool.title[locale]);
      const haystack = `${title} ${fold(tool.slug)} ${fold(tool.short[locale])} ${fold(categories[tool.category].label[locale])}`;
      const exact = terms.reduce((score, term) => score + (title.startsWith(term) ? 8 : title.includes(term) ? 5 : haystack.includes(term) ? 2 : -20), 0);
      return { tool, score: exact };
    }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score || a.tool.title[locale].localeCompare(b.tool.title[locale])).slice(0, 7);
  }, [deferred, locale]);
  const active = query.trim().length > 0;
  return <div className="hero-tool-search" role="search">
    <label><span aria-hidden="true">⌕</span><span className="sr-only">{t.label}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.placeholder} autoComplete="off" aria-controls="hero-tool-results" /><kbd>⌘ K</kbd></label>
    <small>{t.hint}</small>
    {active && <div className="hero-tool-results" id="hero-tool-results" aria-live="polite">{results.length ? <>{results.map(({ tool }) => <Link key={tool.slug} href={toolPath(locale, tool.slug)}><ToolIcon tool={tool} size="sm" /><span><strong>{tool.title[locale]}</strong><small>{categories[tool.category].label[locale]}</small></span><b>→</b></Link>)}<Link className="hero-search-all" href={pathFor(locale, "tools")}>{t.all} · {tools.length} →</Link></> : <p>{t.empty}</p>}</div>}
  </div>;
}
