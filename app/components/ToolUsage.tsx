"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, tools, type Tool } from "../lib/tools";
import { consentChangeEvent, hasPreferenceConsent, openPrivacySettings, usageStorageKey } from "../lib/consent";
import { toolPath, type Locale } from "../lib/site";

const fallbackSlugs = ["json-bicimlendirici", "kvkk-veri-maskeleyici", "prompt-kalite-denetimi"];
const usageLifetimeMs = 180 * 24 * 60 * 60 * 1000;

type UsageEntry = { count: number; lastUsed: number };
type UsageMap = Record<string, UsageEntry>;

function readUsage(): UsageMap {
  if (!hasPreferenceConsent()) return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(usageStorageKey) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    const cutoff = Date.now() - usageLifetimeMs;
    const cleaned = Object.fromEntries(Object.entries(parsed as UsageMap).filter(([, entry]) => Number(entry?.count) > 0 && Number(entry?.lastUsed) >= cutoff));
    if (Object.keys(cleaned).length !== Object.keys(parsed as UsageMap).length) window.localStorage.setItem(usageStorageKey, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return {};
  }
}

export function ToolUsageTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    const track = () => {
      if (tracked.current || !hasPreferenceConsent()) return;
      try {
        const usage = readUsage();
        const current = usage[slug];
        usage[slug] = { count: Math.min(999999, Math.max(0, Number(current?.count) || 0) + 1), lastUsed: Date.now() };
        window.localStorage.setItem(usageStorageKey, JSON.stringify(usage));
        tracked.current = true;
        window.dispatchEvent(new Event("bq-tool-usage"));
      } catch {
        // The tool still works when storage is disabled or full.
      }
    };
    track();
    window.addEventListener(consentChangeEvent, track);
    return () => window.removeEventListener(consentChangeEvent, track);
  }, [slug]);
  return null;
}

export function PopularTools({ locale }: { locale: Locale }) {
  const labels = {
    tr: { kicker: "KİŞİSEL KISA YOL", title: "En Çok Kullanılan Araçlar", history: "Bu cihazdaki ziyaretlerinize göre en sık açtığınız üç araç. Sayaç yalnızca tarayıcınızda tutulur.", starting: "Kullanım geçmişiniz oluşana kadar iyi başlangıç noktalarını gösteriyoruz.", off: "Yerel kullanım sayacı kapalı; aşağıda yalnızca genel başlangıç önerileri gösteriliyor.", manage: "Yerel kısayolları yönet", open: "Aracı aç", opened: "açıldı" },
    en: { kicker: "PERSONAL SHORTCUT", title: "Most Used Tools", history: "Your three most frequently opened tools on this device. Counts stay only in your browser.", starting: "Useful starting points are shown until you build local usage history.", off: "Local usage counting is off; only general starting suggestions appear below.", manage: "Manage local shortcuts", open: "Open tool", opened: "opened" },
    de: { kicker: "PERSÖNLICHE ABKÜRZUNG", title: "Meistgenutzte Werkzeuge", history: "Ihre drei am häufigsten geöffneten Werkzeuge auf diesem Gerät. Zähler bleiben nur im Browser.", starting: "Bis eine lokale Nutzungshistorie entsteht, zeigen wir gute Einstiegspunkte.", off: "Der lokale Nutzungszähler ist aus; unten erscheinen nur allgemeine Empfehlungen.", manage: "Lokale Abkürzungen verwalten", open: "Werkzeug öffnen", opened: "geöffnet" },
    zh: { kicker: "个人快捷方式", title: "最常用工具", history: "根据本设备的访问记录显示最常打开的三个工具。计数仅保留在浏览器中。", starting: "在形成本地使用记录前，我们会显示实用的起点。", off: "本地使用计数已关闭；下方仅显示通用建议。", manage: "管理本地快捷方式", open: "打开工具", opened: "次打开" },
  }[locale];
  const [usage, setUsage] = useState<UsageMap>({});
  const [consented, setConsented] = useState(false);
  useEffect(() => {
    const refresh = () => {
      const allowed = hasPreferenceConsent();
      setConsented(allowed);
      setUsage(allowed ? readUsage() : {});
    };
    refresh(); window.addEventListener("storage", refresh); window.addEventListener("bq-tool-usage", refresh); window.addEventListener(consentChangeEvent, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("bq-tool-usage", refresh); window.removeEventListener(consentChangeEvent, refresh); };
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
        <div className="section-heading split-heading"><div><span className="kicker">{labels.kicker}</span><h2 id={`popular-tools-${locale}`}>{labels.title}</h2></div><div className="popular-tools-explainer"><p>{hasHistory ? labels.history : consented ? labels.starting : labels.off}</p>{!consented && <button type="button" className="inline-privacy-button" onClick={openPrivacySettings}>{labels.manage}</button>}</div></div>
        <div className="popular-tool-grid">{ranked.map((tool, index) => <article key={tool.slug}><div><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><small>{categories[tool.category].label[locale]}</small></div><h3><Link href={toolPath(locale, tool.slug)}>{tool.title[locale]}</Link></h3><p>{tool.short[locale]}</p><footer><Link className="text-link" href={toolPath(locale, tool.slug)}>{labels.open} →</Link><span>{usage[tool.slug]?.count ? `${usage[tool.slug].count}× ${labels.opened}` : `#${index + 1}`}</span></footer></article>)}</div>
      </div>
    </section>
  );
}
