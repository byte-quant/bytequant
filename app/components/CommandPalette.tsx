"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { referenceCopy, referencePath, references } from "../lib/references";
import { toolPath, type Locale } from "../lib/site";
import { categories, tools } from "../lib/tools";

function searchable(value: string, locale: Locale) {
  return value.toLocaleLowerCase({ tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" }[locale]).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function CommandPalette({ locale }: { locale: Locale }) {
  const labels = {
    tr: { aria: "Araç ve referans ara", placeholder: `${tools.length} araç ve ${references.length} referansta ara…`, close: "Kapat", quick: "Hızlı geçiş", result: "sonuç", empty: "Bu aramayla eşleşen hedef yok.", select: "seç", open: "aç", search: "Ara" },
    en: { aria: "Search tools and references", placeholder: `Search ${tools.length} tools and ${references.length} references…`, close: "Close", quick: "Quick navigation", result: "results", empty: "No destination matches this search.", select: "select", open: "open", search: "Search" },
    de: { aria: "Werkzeuge und Referenzen durchsuchen", placeholder: `${tools.length} Werkzeuge und ${references.length} Referenzen durchsuchen…`, close: "Schließen", quick: "Schnellnavigation", result: "Ergebnisse", empty: "Kein Ziel entspricht dieser Suche.", select: "auswählen", open: "öffnen", search: "Suchen" },
    zh: { aria: "搜索工具和参考资料", placeholder: `搜索 ${tools.length} 个工具和 ${references.length} 个参考资料…`, close: "关闭", quick: "快速导航", result: "个结果", empty: "没有匹配的目标。", select: "选择", open: "打开", search: "搜索" },
  }[locale];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const entries = useMemo(() => [
    ...tools.map((tool) => ({
      id: `tool-${tool.slug}`,
      href: toolPath(locale, tool.slug),
      title: tool.title[locale],
      detail: categories[tool.category].label[locale],
      mark: tool.mark,
      search: `${tool.slug} ${tool.title.tr} ${tool.title.en} ${tool.short[locale]} ${categories[tool.category].label[locale]}`,
    })),
    ...references.map((guide) => ({
      id: `reference-${guide.slug}`,
      href: referencePath(locale, guide.slug),
      title: referenceCopy(guide, locale).title,
      detail: { tr: "Referans", en: "Reference", de: "Referenz", zh: "参考" }[locale],
      mark: "↗",
      search: `${guide.slug} ${guide.title.tr} ${guide.title.en} ${referenceCopy(guide, locale).description} cheat sheet`,
    })),
  ], [locale]);
  const results = useMemo(() => {
    const term = searchable(query.trim(), locale);
    return (term ? entries.filter((entry) => searchable(entry.search, locale).includes(term)) : entries).slice(0, 12);
  }, [entries, query, locale]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); }
      else if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) { document.body.classList.add("palette-open"); requestAnimationFrame(() => inputRef.current?.focus()); }
    else document.body.classList.remove("palette-open");
    return () => document.body.classList.remove("palette-open");
  }, [open]);

  const close = () => { setOpen(false); setQuery(""); setActive(0); };
  const overlay = open ? <div className="palette-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <section className="command-palette" role="dialog" aria-modal="true" aria-label={labels.aria}>
      <div className="palette-search"><span>⌕</span><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={(event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
        if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
        if (event.key === "Enter") { const link = document.getElementById(results[active]?.id) as HTMLAnchorElement | null; link?.click(); }
      }} placeholder={labels.placeholder} aria-controls="palette-results" /><button type="button" onClick={close} aria-label={labels.close}>Esc</button></div>
      <div className="palette-meta"><span>{labels.quick}</span><small>{results.length} {labels.result}</small></div>
      <div id="palette-results" className="palette-results" role="listbox">{results.map((entry, index) => <Link id={entry.id} role="option" aria-selected={active === index} className={active === index ? "active" : ""} key={entry.id} href={entry.href} onMouseEnter={() => setActive(index)} onClick={close}><span className="palette-mark">{entry.mark}</span><span><strong>{entry.title}</strong><small>{entry.detail}</small></span><b>↵</b></Link>)}{results.length === 0 && <p>{labels.empty}</p>}</div>
      <footer><span>↑↓ {labels.select}</span><span>↵ {labels.open}</span><span>Esc {labels.close.toLocaleLowerCase()}</span></footer>
    </section>
  </div> : null;

  return <><button className="palette-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={labels.aria}><span>⌕</span><b>{labels.search}</b><kbd>⌘ K</kbd></button>{overlay && createPortal(overlay, document.body)}</>;
}
