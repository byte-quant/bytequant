"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/site";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem("bq-theme"); } catch { /* Theme follows the system when storage is unavailable. */ }
    const next = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const frame = window.requestAnimationFrame(() => {
      setDark(next);
      document.documentElement.dataset.theme = next ? "dark" : "light";
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { window.localStorage.setItem("bq-theme", next ? "dark" : "light"); } catch { /* The visual change still applies for this page view. */ }
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={{ tr: "Renk temasını değiştir", en: "Change color theme", de: "Farbschema ändern", zh: "切换颜色主题" }[locale]} title={{ tr: "Tema", en: "Theme", de: "Design", zh: "主题" }[locale]}>
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
    </button>
  );
}
