"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, tools, type Tool } from "../lib/tools";
import { consentChangeEvent, favoritesStorageKey, hasPreferenceConsent, openPrivacySettings, usageStorageKey } from "../lib/consent";
import { toolPath, type Locale } from "../lib/site";
import { ToolIcon } from "./ToolIcon";

const fallbackSlugs = ["json-bicimlendirici", "kvkk-veri-maskeleyici", "prompt-kalite-denetimi", "pdf-birlestirme", "metin-temizleyici", "json-csv-donusturucu"];
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
  } catch { return {}; }
}

function readFavorites() {
  if (!hasPreferenceConsent()) return [] as string[];
  try { const value: unknown = JSON.parse(localStorage.getItem(favoritesStorageKey) ?? "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 12) : []; }
  catch { return []; }
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
        const usage = readUsage(); const current = usage[slug];
        usage[slug] = { count: Math.min(999999, Math.max(0, Number(current?.count) || 0) + 1), lastUsed: Date.now() };
        window.localStorage.setItem(usageStorageKey, JSON.stringify(usage)); tracked.current = true; window.dispatchEvent(new Event("bq-tool-usage"));
      } catch { /* Tool operation never depends on preference storage. */ }
    };
    track(); window.addEventListener(consentChangeEvent, track); return () => window.removeEventListener(consentChangeEvent, track);
  }, [slug]);
  return null;
}

export function PersonalToolsHub({ locale }: { locale: Locale }) {
  const l = {
    tr: { kicker: "SİZE GÖRE BYTEQUANT", title: "Sabitlenenler ve sık kullanılanlar, tek araç kutusunda", body: "Önemli araçları sabitleyin; izin verirseniz ByteQuant son 180 gündeki yerel açılma sayılarından yararlı kısa yolları öne çıkarsın. İki liste de yalnızca bu cihazda kalır.", private: "Girdi, çıktı ve dosya içeriği hiçbir zaman bu sayaçlara yazılmaz.", offTitle: "Kişisel araç kutusu isteğe bağlıdır", off: "Gizlilik tercihiniz kapalıyken hiçbir kullanım geçmişi veya sabitlenen araç listesi tutulmaz. Açmak için Gizlilik Tercihleri'nde ‘Yerel kişiselleştirme’ seçeneğini etkinleştirin.", manage: "Gizlilik tercihlerini aç", pinned: "Sabitlenen araçlar", frequent: "Sık kullanılanlar ve öneriler", empty: "Henüz sabitlediğiniz araç yok. Aşağıdaki önerilerdeki yıldızla ilk kısa yolunuzu oluşturun.", pin: "Sabitle", unpin: "Sabitlemeyi kaldır", open: "Aracı aç", opened: "açılış", count: "sabit", local: "Yalnızca bu cihaz" },
    en: { kicker: "BYTEQUANT, YOUR WAY", title: "Pinned and frequently used tools in one toolbox", body: "Pin important tools and—if you opt in—let ByteQuant surface useful shortcuts from local opens over the last 180 days. Both lists stay on this device.", private: "Input, output, and file contents are never written to these counters.", offTitle: "Your personal toolbox is optional", off: "No usage history or pinned list is stored while the preference is off. Enable ‘Local personalization’ in Privacy Choices to turn it on.", manage: "Open privacy choices", pinned: "Pinned tools", frequent: "Frequently used and suggested", empty: "Nothing is pinned yet. Use the star on a suggestion below to create your first shortcut.", pin: "Pin", unpin: "Unpin", open: "Open tool", opened: "opens", count: "pinned", local: "This device only" },
    de: { kicker: "BYTEQUANT NACH IHREN WÜNSCHEN", title: "Angeheftete und häufig genutzte Werkzeuge in einer Box", body: "Heften Sie wichtige Werkzeuge an. Mit Ihrer Einwilligung priorisiert ByteQuant lokale Aufrufe der letzten 180 Tage. Beide Listen bleiben auf diesem Gerät.", private: "Eingaben, Ausgaben und Dateiinhalte werden nie in diesen Zählern gespeichert.", offTitle: "Die persönliche Werkzeugbox ist optional", off: "Solange die Präferenz aus ist, werden weder Nutzungshistorie noch angeheftete Werkzeuge gespeichert. Aktivieren Sie „Lokale Personalisierung“ in der Datenschutzauswahl.", manage: "Datenschutzauswahl öffnen", pinned: "Angeheftete Werkzeuge", frequent: "Häufig genutzt und empfohlen", empty: "Noch nichts angeheftet. Nutzen Sie den Stern eines Vorschlags für Ihre erste Abkürzung.", pin: "Anheften", unpin: "Lösen", open: "Werkzeug öffnen", opened: "Aufrufe", count: "angeheftet", local: "Nur dieses Gerät" },
    zh: { kicker: "专属 BYTEQUANT", title: "将固定工具与常用工具整合到一个工具箱", body: "固定重要工具；在您同意后，ByteQuant 会根据过去 180 天的本地打开次数推荐快捷入口。两类数据都只保存在本设备。", private: "输入、输出和文件内容绝不会写入这些计数器。", offTitle: "个人工具箱为可选功能", off: "偏好关闭时不会保存使用历史或固定列表。请在隐私选项中启用“本地个性化”。", manage: "打开隐私选项", pinned: "固定工具", frequent: "常用与推荐", empty: "尚未固定工具。点击下方建议上的星标创建第一个快捷入口。", pin: "固定", unpin: "取消固定", open: "打开工具", opened: "次打开", count: "已固定", local: "仅限本设备" },
  }[locale];
  const [usage, setUsage] = useState<UsageMap>({}); const [slugs, setSlugs] = useState<string[]>([]); const [consented, setConsented] = useState(false);
  useEffect(() => {
    const refresh = () => { const allowed = hasPreferenceConsent(); setConsented(allowed); setUsage(allowed ? readUsage() : {}); setSlugs(allowed ? readFavorites() : []); };
    refresh(); ["storage", "bq-tool-usage", "bq-favorites-change", consentChangeEvent].forEach((event) => window.addEventListener(event, refresh));
    return () => ["storage", "bq-tool-usage", "bq-favorites-change", consentChangeEvent].forEach((event) => window.removeEventListener(event, refresh));
  }, []);
  const pinned = useMemo(() => slugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool)), [slugs]);
  const suggestions = useMemo(() => {
    const used = tools.filter((tool) => usage[tool.slug]?.count > 0).sort((a, b) => (usage[b.slug].count - usage[a.slug].count) || (usage[b.slug].lastUsed - usage[a.slug].lastUsed));
    const fallback = fallbackSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is Tool => Boolean(tool));
    return [...used, ...fallback].filter((tool, index, all) => all.findIndex((item) => item.slug === tool.slug) === index && !slugs.includes(tool.slug)).slice(0, 6);
  }, [slugs, usage]);
  const pin = (slug: string) => { if (!consented) { openPrivacySettings(); return; } try { toggleFavorite(slug); } catch { /* Storage may be disabled. */ } };
  const Card = ({ tool, isPinned }: { tool: Tool; isPinned: boolean }) => <article className={`personal-tool-card ${isPinned ? "is-pinned" : ""}`}><header><ToolIcon tool={tool} size="md" /><span>{categories[tool.category].label[locale]}</span><button type="button" className="personal-pin-button" aria-pressed={isPinned} aria-label={`${isPinned ? l.unpin : l.pin}: ${tool.title[locale]}`} onClick={() => pin(tool.slug)}>{isPinned ? "★" : "☆"}</button></header><h3><Link href={toolPath(locale, tool.slug)}>{tool.title[locale]}</Link></h3><p>{tool.short[locale]}</p><footer><Link href={toolPath(locale, tool.slug)}>{l.open} →</Link>{usage[tool.slug]?.count ? <span>{usage[tool.slug].count}× {l.opened}</span> : <span>{l.local}</span>}</footer></article>;
  return <section className="section personal-tools-section" aria-labelledby={`personal-tools-${locale}`}><div className="container"><div className="section-heading split-heading personal-tools-heading"><div><span className="kicker">{l.kicker}</span><h2 id={`personal-tools-${locale}`}>{l.title}</h2></div><div><p>{l.body}</p><small>◇ {l.private}</small></div></div>{!consented ? <div className="personal-tools-consent"><span aria-hidden="true">◇</span><div><strong>{l.offTitle}</strong><p>{l.off}</p></div><button type="button" onClick={openPrivacySettings}>{l.manage} →</button></div> : <><div className="personal-tools-subheading"><div><strong>{l.pinned}</strong><span>{pinned.length}/12 {l.count}</span></div><small>{l.local}</small></div>{pinned.length ? <div className="personal-tool-grid pinned-grid">{pinned.map((tool) => <Card key={tool.slug} tool={tool} isPinned />)}</div> : <div className="personal-tools-empty"><span>☆</span><p>{l.empty}</p></div>}<div className="personal-tools-subheading suggestion-heading"><div><strong>{l.frequent}</strong><span>{suggestions.length}</span></div><small>{l.private}</small></div><div className="personal-tool-grid">{suggestions.map((tool) => <Card key={tool.slug} tool={tool} isPinned={false} />)}</div></>}</div></section>;
}
