"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { Locale } from "../lib/site";

const LoadedCommandPalette = lazy(() => import("./CommandPalette").then((module) => ({ default: module.CommandPalette })));

/** Keep the 317-tool search index off the initial page path until Ctrl/Cmd+K is requested. */
export function LazyCommandPalette({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(false);
  const label = { tr: "Ara", en: "Search", de: "Suchen", zh: "搜索" }[locale];

  useEffect(() => {
    if (active) return;
    const activate = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      setActive(true);
    };
    window.addEventListener("keydown", activate);
    return () => window.removeEventListener("keydown", activate);
  }, [active]);

  // A real, lightweight trigger keeps this client boundary hydrated in static
  // exports while the 317-tool index remains outside the initial bundle.
  if (!active) return <button className="nav-more-search" type="button" onClick={() => setActive(true)} aria-haspopup="dialog"><span aria-hidden="true">⌕</span><b>{label}</b><small>Ctrl K</small></button>;
  return <Suspense fallback={<span className="nav-more-search-loading" role="status">{label}…</span>}><LoadedCommandPalette locale={locale} initialOpen /></Suspense>;
}
