"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { referencePath, references } from "../lib/references";
import { toolPath, type Locale } from "../lib/site";
import { categories, tools } from "../lib/tools";

function searchable(value: string, locale: Locale) {
  return value.toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function CommandPalette({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
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
      title: guide.title[locale],
      detail: isTr ? "Referans" : "Reference",
      mark: "↗",
      search: `${guide.slug} ${guide.title.tr} ${guide.title.en} ${guide.description[locale]} cheat sheet`,
    })),
  ], [locale, isTr]);
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
    <section className="command-palette" role="dialog" aria-modal="true" aria-label={isTr ? "Araç ve referans ara" : "Search tools and references"}>
      <div className="palette-search"><span>⌕</span><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={(event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
        if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
        if (event.key === "Enter") { const link = document.getElementById(results[active]?.id) as HTMLAnchorElement | null; link?.click(); }
      }} placeholder={isTr ? "33 araç ve 2 referansta ara…" : "Search 33 tools and 2 references…"} aria-controls="palette-results" /><button type="button" onClick={close} aria-label={isTr ? "Kapat" : "Close"}>Esc</button></div>
      <div className="palette-meta"><span>{isTr ? "Hızlı geçiş" : "Quick navigation"}</span><small>{results.length} {isTr ? "sonuç" : "results"}</small></div>
      <div id="palette-results" className="palette-results" role="listbox">{results.map((entry, index) => <Link id={entry.id} role="option" aria-selected={active === index} className={active === index ? "active" : ""} key={entry.id} href={entry.href} onMouseEnter={() => setActive(index)} onClick={close}><span className="palette-mark">{entry.mark}</span><span><strong>{entry.title}</strong><small>{entry.detail}</small></span><b>↵</b></Link>)}{results.length === 0 && <p>{isTr ? "Bu aramayla eşleşen hedef yok." : "No destination matches this search."}</p>}</div>
      <footer><span>↑↓ {isTr ? "seç" : "select"}</span><span>↵ {isTr ? "aç" : "open"}</span><span>Esc {isTr ? "kapat" : "close"}</span></footer>
    </section>
  </div> : null;

  return <><button className="palette-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={isTr ? "33 araç ve 2 referansta ara" : "Search 33 tools and 2 references"}><span>⌕</span><b>{isTr ? "Ara" : "Search"}</b><kbd>⌘ K</kbd></button>{overlay && createPortal(overlay, document.body)}</>;
}
