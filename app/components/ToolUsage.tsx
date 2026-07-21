"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, tools, type Tool } from "../lib/tools";
import { consentChangeEvent, favoritesStorageKey, hasPreferenceConsent, openPrivacySettings, usageStorageKey } from "../lib/consent";
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

function readFavorites() {
  if (!hasPreferenceConsent()) return [] as string[];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(favoritesStorageKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 12) : [];
  } catch { return []; }
}

function toggleFavorite(slug: string) {
  const current = readFavorites();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug].slice(-12);
  localStorage.setItem(favoritesStorageKey, JSON.stringify(next));
  window.dispatchEvent(new Event("bq-favorites-change"));
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
    tr: { kicker: "KİŞİSEL KISA YOL", title: "En Çok Kullanılan Araçlar", history: "Bu cihazdaki ziyaretlerinize göre en sık açtığınız üç araç. Sayaç yalnızca tarayıcınızda tutulur.", starting: "Kullanım geçmişiniz oluşana kadar iyi başlangıç noktalarını gösteriyoruz.", off: "Sayaç gizlilik gereği varsayılan olarak kapalıdır. Açarsanız yalnızca araç kimliği, açılma sayısı ve son kullanım zamanı bu cihazda tutulur; girdi ve çıktı asla kaydedilmez.", why: "Neden kapalı? İsteğe bağlı kişiselleştirme açık onay gerektirir. Aşağıdaki düğme gizlilik tercihlerini açar; ‘Yerel kişiselleştirme’ seçeneğini etkinleştirip kaydedebilirsiniz.", manage: "Sayacı nasıl açacağımı göster", open: "Aracı aç", opened: "açıldı" },
    en: { kicker: "PERSONAL SHORTCUT", title: "Most Used Tools", history: "Your three most frequently opened tools on this device. Counts stay only in your browser.", starting: "Useful starting points are shown until you build local usage history.", off: "The counter is off by default for privacy. If enabled, only tool ID, open count, and last-used time stay on this device; input and output are never saved.", why: "Why is it off? Optional personalization needs your clear choice. Open privacy choices below, enable ‘Local personalization,’ and save.", manage: "Show me how to enable it", open: "Open tool", opened: "opened" },
    de: { kicker: "PERSÖNLICHE ABKÜRZUNG", title: "Meistgenutzte Werkzeuge", history: "Ihre drei am häufigsten geöffneten Werkzeuge auf diesem Gerät. Zähler bleiben nur im Browser.", starting: "Bis eine lokale Nutzungshistorie entsteht, zeigen wir gute Einstiegspunkte.", off: "Der Zähler ist aus Datenschutzgründen standardmäßig aus. Aktiviert speichert er nur Werkzeugkennung, Öffnungszahl und letzte Nutzung auf diesem Gerät – niemals Ein- oder Ausgabe.", why: "Warum aus? Optionale Personalisierung benötigt Ihre klare Auswahl. Öffnen Sie unten die Datenschutzauswahl, aktivieren Sie „Lokale Personalisierung“ und speichern Sie.", manage: "Aktivierung anzeigen", open: "Werkzeug öffnen", opened: "geöffnet" },
    zh: { kicker: "个人快捷方式", title: "最常用工具", history: "根据本设备的访问记录显示最常打开的三个工具。计数仅保留在浏览器中。", starting: "在形成本地使用记录前，我们会显示实用的起点。", off: "为保护隐私，计数器默认关闭。启用后只在本设备保存工具标识、打开次数和最后使用时间，绝不保存输入或输出。", why: "为何关闭？可选个性化需要您的明确选择。请打开下方隐私选项，启用“本地个性化”并保存。", manage: "查看如何启用", open: "打开工具", opened: "次打开" },
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
        <div className="section-heading split-heading"><div><span className="kicker">{labels.kicker}</span><h2 id={`popular-tools-${locale}`}>{labels.title}</h2></div><div className={`popular-tools-explainer ${!consented ? "counter-off-card" : ""}`}><p>{hasHistory ? labels.history : consented ? labels.starting : labels.off}</p>{!consented && <><small>{labels.why}</small><button type="button" className="inline-privacy-button" onClick={openPrivacySettings}>{labels.manage} →</button></>}</div></div>
        <div className="popular-tool-grid">{ranked.map((tool, index) => <article key={tool.slug}><div><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><small>{categories[tool.category].label[locale]}</small></div><h3><Link href={toolPath(locale, tool.slug)}>{tool.title[locale]}</Link></h3><p>{tool.short[locale]}</p><footer><Link className="text-link" href={toolPath(locale, tool.slug)}>{labels.open} →</Link><span>{usage[tool.slug]?.count ? `${usage[tool.slug].count}× ${labels.opened}` : `#${index + 1}`}</span></footer></article>)}</div>
      </div>
    </section>
  );
}

export function FavoriteTools({ locale }: { locale: Locale }) {
  const labels = {
    tr: { kicker: "SİZİN ARAÇ KUTUNUZ", title: "Sabitlenen araçlar", body: "Günlük araçlarınızı tek dokunuşta ekleyin. Liste yalnızca bu cihazda tutulur ve istediğiniz an değiştirilebilir.", empty: "Başlamak için aşağıdaki önerilerden birini sabitleyin; önce araç sayfasını açmanız gerekmiyor.", starter: "Hızlı başlangıç", pin: "Sabitle", manage: "Yerel kişiselleştirmeyi aç", open: "Aracı aç", limit: "En fazla 12 araç sabitlenebilir." },
    en: { kicker: "YOUR TOOLBOX", title: "Pinned tools", body: "Add everyday tools in one tap. The list stays only on this device and can be changed any time.", empty: "Pin one of the suggestions below to get started—there is no need to open the tool first.", starter: "Quick start", pin: "Pin", manage: "Enable local personalization", open: "Open tool", limit: "You can pin up to 12 tools." },
    de: { kicker: "IHRE WERKZEUGKISTE", title: "Angeheftete Werkzeuge", body: "Alltagswerkzeuge mit einem Tippen hinzufügen. Die Liste bleibt auf diesem Gerät und ist jederzeit änderbar.", empty: "Heften Sie einen Vorschlag unten direkt an; die Werkzeugseite muss vorher nicht geöffnet werden.", starter: "Schnellstart", pin: "Anheften", manage: "Lokale Personalisierung aktivieren", open: "Werkzeug öffnen", limit: "Bis zu 12 Werkzeuge sind möglich." },
    zh: { kicker: "您的工具箱", title: "固定工具", body: "一键添加常用工具。列表只保存在本设备，可随时修改。", empty: "从下方建议中直接固定一个工具，无需先打开工具页面。", starter: "快速开始", pin: "固定", manage: "启用本地个性化", open: "打开工具", limit: "最多可固定 12 个工具。" },
  }[locale];
  const [slugs, setSlugs] = useState<string[]>([]);
  const [consented, setConsented] = useState(false);
  useEffect(() => {
    const refresh = () => {
      const allowed = hasPreferenceConsent(); setConsented(allowed);
      if (!allowed) { setSlugs([]); return; }
      try {
        setSlugs(readFavorites());
      } catch { setSlugs([]); }
    };
    refresh(); window.addEventListener("bq-favorites-change", refresh); window.addEventListener(consentChangeEvent, refresh); window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("bq-favorites-change", refresh); window.removeEventListener(consentChangeEvent, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const favorites = slugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool));
  const starters = fallbackSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool)).filter((tool) => !slugs.includes(tool.slug));
  const pin = (slug: string) => { if (!consented) { openPrivacySettings(); return; } try { toggleFavorite(slug); } catch { /* storage may be unavailable */ } };
  return <section className="section favorite-tools-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{labels.kicker}</span><h2>{labels.title}</h2></div><div className="popular-tools-explainer"><p>{labels.body}</p><small>{labels.limit}</small>{!consented && <button type="button" className="inline-privacy-button" onClick={openPrivacySettings}>{labels.manage} →</button>}</div></div>{favorites.length ? <div className="favorite-tool-grid">{favorites.map((tool) => <div className="favorite-tool-item" key={tool.slug}><Link href={toolPath(locale, tool.slug)}><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><span><strong>{tool.title[locale]}</strong><small>{categories[tool.category].label[locale]}</small></span><b>{labels.open} →</b></Link><button type="button" aria-label={`${labels.pin}: ${tool.title[locale]}`} onClick={() => pin(tool.slug)}>×</button></div>)}</div> : <div className="favorite-empty-state"><p>{labels.empty}</p><span>{labels.starter}</span><div>{starters.map((tool) => <button type="button" key={tool.slug} onClick={() => pin(tool.slug)}><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><span><strong>{tool.title[locale]}</strong><small>{labels.pin} +</small></span></button>)}</div></div>}</div></section>;
}
