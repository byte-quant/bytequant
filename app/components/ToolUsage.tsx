"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, tools, type Tool } from "../lib/tools";
import { toolPath, type Locale } from "../lib/site";

const storageKey = "bq-tool-usage-v1";
const fallbackSlugs = ["json-bicimlendirici", "kvkk-veri-maskeleyici", "prompt-kalite-denetimi"];

type UsageEntry = { count: number; lastUsed: number };
type UsageMap = Record<string, UsageEntry>;

function readUsage(): UsageMap {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function ToolUsageTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const usage = readUsage();
      const current = usage[slug];
      usage[slug] = { count: Math.min(999999, Math.max(0, Number(current?.count) || 0) + 1), lastUsed: Date.now() };
      window.localStorage.setItem(storageKey, JSON.stringify(usage));
      window.dispatchEvent(new Event("bq-tool-usage"));
    } catch {
      // The tool still works when storage is disabled or full.
    }
  }, [slug]);
  return null;
}

export function PopularTools({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [usage, setUsage] = useState<UsageMap>({});
  useEffect(() => {
    const refresh = () => setUsage(readUsage());
    refresh(); window.addEventListener("storage", refresh); window.addEventListener("bq-tool-usage", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("bq-tool-usage", refresh); };
  }, []);
  const ranked = useMemo(() => {
    const used = tools.filter((tool) => usage[tool.slug]?.count > 0).sort((a, b) => (usage[b.slug].count - usage[a.slug].count) || (usage[b.slug].lastUsed - usage[a.slug].lastUsed));
    const fallback = fallbackSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool)).filter((tool) => !used.some((item) => item.slug === tool.slug));
    return [...used, ...fallback].slice(0, 3);
  }, [usage]);
  const hasHistory = Object.values(usage).some((item) => item.count > 0);
  return (
    <section className="section popular-tools-section" aria-labelledby={`popular-tools-${locale}`}>
      <div className="container">
        <div className="section-heading split-heading"><div><span className="kicker">{isTr ? "KİŞİSEL KISA YOL" : "PERSONAL SHORTCUT"}</span><h2 id={`popular-tools-${locale}`}>{isTr ? "En Çok Kullanılan Araçlar" : "Most Used Tools"}</h2></div><p>{hasHistory ? (isTr ? "Bu cihazdaki ziyaretlerinize göre en sık açtığınız üç araç. Sayaç yalnızca tarayıcınızda tutulur." : "Your three most frequently opened tools on this device. Counts stay only in your browser.") : (isTr ? "Kullanım geçmişiniz oluşana kadar iyi başlangıç noktalarını gösteriyoruz." : "Useful starting points are shown until you build local usage history.")}</p></div>
        <div className="popular-tool-grid">{ranked.map((tool, index) => <article key={tool.slug}><div><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><small>{categories[tool.category].label[locale]}</small></div><h3><Link href={toolPath(locale, tool.slug)}>{tool.title[locale]}</Link></h3><p>{tool.short[locale]}</p><footer><Link className="text-link" href={toolPath(locale, tool.slug)}>{isTr ? "Aracı aç" : "Open tool"} →</Link><span>{usage[tool.slug]?.count ? `${usage[tool.slug].count}× ${isTr ? "açıldı" : "opened"}` : `#${index + 1}`}</span></footer></article>)}</div>
      </div>
    </section>
  );
}
