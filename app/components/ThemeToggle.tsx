"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/site";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("bq-theme");
    const next = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("bq-theme", next ? "dark" : "light");
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label={locale === "tr" ? "Renk temasını değiştir" : "Change color theme"} title={locale === "tr" ? "Tema" : "Theme"}>
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
    </button>
  );
}

