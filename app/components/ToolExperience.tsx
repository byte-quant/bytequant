"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { consentChangeEvent, favoritesStorageKey, hasPreferenceConsent, openPrivacySettings } from "../lib/consent";
import { toolPath, type Locale } from "../lib/site";

type RelatedTool = { slug: string; title: string };
type OperationState = "ready" | "processing" | "complete" | "error";
type TransferRecord = { version: 1; fromSlug: string; targetSlug: string; value: string; createdAt: number };

const transferKey = "bytequant:tool-transfer:v1";
const maxTransferLength = 200_000;
const transferLifetime = 20 * 60 * 1000;

const copy = {
  tr: { ready: "Hazır", processing: "İşleniyor", complete: "Tamamlandı", error: "Kontrol gerekiyor", status: "İşlem durumu", favorite: "Sık kullanılanlara sabitle", unfavorite: "Sabitlenenlerden çıkar", consent: "Favoriler için yerel kişiselleştirmeyi açın.", updated: "Son güncelleme: 21 Temmuz 2026", local: "Tamamen tarayıcıda çalışır", next: "Bu sonucu şimdi başka bir araçta işleyin", choose: "Sonraki aracı seçin", transfer: "Sonucu aktar", noOutput: "Aktarılabilecek bir çıktı henüz yok.", transferred: "Önceki araçtaki çıktı güvenli sekme içi aktarım ile yüklendi.", privacy: "Bu işlem tamamen cihazınızda gerçekleşti", privacyBody: "Girdi ve çıktı ByteQuant sunucusuna gönderilmedi. İndirme veya başka araca aktarım yalnızca sizin eyleminizle yapılır.", compare: "Önce / Sonra", before: "Önce", after: "Sonra", refresh: "Karşılaştırmayı güncelle", frequent: "Bu araçla sık kullanılanlar", bridge: "Aktarım yalnızca bu sekmenin sessionStorage alanında, en fazla 20 dakika tutulur." },
  en: { ready: "Ready", processing: "Processing", complete: "Completed", error: "Review needed", status: "Operation status", favorite: "Pin to favorites", unfavorite: "Remove from favorites", consent: "Enable local personalization to use favorites.", updated: "Last updated: July 21, 2026", local: "Runs entirely in your browser", next: "Process this result with another tool", choose: "Choose the next tool", transfer: "Transfer result", noOutput: "There is no transferable output yet.", transferred: "Output from the previous tool was loaded through a safe same-tab handoff.", privacy: "This operation happened entirely on your device", privacyBody: "Input and output were not sent to a ByteQuant server. Download or transfer happens only when you choose it.", compare: "Before / After", before: "Before", after: "After", refresh: "Refresh comparison", frequent: "Frequently used with this tool", bridge: "The transfer stays only in this tab's sessionStorage for up to 20 minutes." },
  de: { ready: "Bereit", processing: "Verarbeitung", complete: "Abgeschlossen", error: "Prüfung nötig", status: "Vorgangsstatus", favorite: "Zu Favoriten hinzufügen", unfavorite: "Aus Favoriten entfernen", consent: "Aktivieren Sie lokale Personalisierung für Favoriten.", updated: "Zuletzt aktualisiert: 21. Juli 2026", local: "Läuft vollständig im Browser", next: "Ergebnis mit einem weiteren Werkzeug verarbeiten", choose: "Nächstes Werkzeug wählen", transfer: "Ergebnis übergeben", noOutput: "Noch keine übertragbare Ausgabe vorhanden.", transferred: "Die vorherige Ausgabe wurde über eine sichere Übergabe im selben Tab geladen.", privacy: "Dieser Vorgang fand vollständig auf Ihrem Gerät statt", privacyBody: "Ein- und Ausgabe wurden nicht an ByteQuant gesendet. Download oder Übergabe erfolgen nur durch Ihre Aktion.", compare: "Vorher / Nachher", before: "Vorher", after: "Nachher", refresh: "Vergleich aktualisieren", frequent: "Häufig zusammen verwendet", bridge: "Die Übergabe bleibt höchstens 20 Minuten im sessionStorage dieses Tabs." },
  zh: { ready: "就绪", processing: "处理中", complete: "已完成", error: "需要检查", status: "处理状态", favorite: "固定到收藏", unfavorite: "从收藏移除", consent: "请启用本地个性化以使用收藏。", updated: "最后更新：2026 年 7 月 21 日", local: "完全在浏览器内运行", next: "将此结果交给另一个工具继续处理", choose: "选择下一个工具", transfer: "传递结果", noOutput: "目前没有可传递的输出。", transferred: "上一工具的输出已通过同一标签页内的安全交接载入。", privacy: "此处理完全在您的设备上完成", privacyBody: "输入与输出未发送到 ByteQuant 服务器；下载或传递只会由您的操作触发。", compare: "处理前 / 处理后", before: "处理前", after: "处理后", refresh: "更新对比", frequent: "常与此工具搭配使用", bridge: "传递内容只在当前标签页的 sessionStorage 中保留，最长 20 分钟。" },
} as const;

function readFavorites() {
  if (!hasPreferenceConsent()) return [] as string[];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(favoritesStorageKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item)).slice(0, 24) : [];
  } catch { return []; }
}

function firstInput(scope: HTMLElement | null) {
  return scope?.querySelector<HTMLTextAreaElement>("textarea:not([readonly]):not([disabled])")
    ?? scope?.querySelector<HTMLInputElement>('input:not([type="file"]):not([type="password"]):not([type="hidden"]):not([readonly]):not([disabled])')
    ?? null;
}

function readableOutput(scope: HTMLElement | null) {
  const candidates = Array.from(scope?.querySelectorAll<HTMLElement>("[data-agent-output], output, .result-panel pre.has-output, .rich-result-panel pre, .diff-output, .markdown-preview") ?? []).reverse();
  return candidates.map((item) => (item.innerText || item.textContent || "").trim()).find((value) => value.length > 0 && value.length <= maxTransferLength) ?? "";
}

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

export function ToolExperience({ slug, locale, related, compare }: { slug: string; locale: Locale; related: RelatedTool[]; compare: boolean }) {
  const t = copy[locale];
  const [state, setState] = useState<OperationState>("ready");
  const [favorite, setFavorite] = useState(false);
  const [notice, setNotice] = useState("");
  const [target, setTarget] = useState(related[0]?.slug ?? "");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const stateLabel = t[state];
  const relatedMap = useMemo(() => new Map(related.map((item) => [item.slug, item])), [related]);

  useEffect(() => {
    const refresh = () => setFavorite(readFavorites().includes(slug));
    refresh();
    window.addEventListener(consentChangeEvent, refresh);
    window.addEventListener("bq-favorites-change", refresh);
    return () => { window.removeEventListener(consentChangeEvent, refresh); window.removeEventListener("bq-favorites-change", refresh); };
  }, [slug]);

  useEffect(() => {
    const scope = document.querySelector<HTMLElement>(".workbench");
    if (!scope) return;
    let completionTimer = 0;
    const inspect = () => {
      if (scope.querySelector(".tool-notice.error, [role=alert]")) { setState("error"); return; }
      const output = readableOutput(scope);
      if (output) {
        setState("complete"); setAfter(output);
        const input = firstInput(scope)?.value.trim(); if (input) setBefore(input);
      }
    };
    const onClick = (event: Event) => {
      const button = (event.target as Element | null)?.closest("button");
      if (!button || button.disabled || button.closest(".output-actions") || button.matches(".demo-button,.ghost-button")) return;
      setState("processing"); setNotice("");
      window.clearTimeout(completionTimer);
      completionTimer = window.setTimeout(inspect, 80);
    };
    const onInput = () => setState("ready");
    const observer = new MutationObserver(inspect);
    scope.addEventListener("click", onClick, true); scope.addEventListener("input", onInput, true);
    observer.observe(scope, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "aria-busy"] });
    return () => { window.clearTimeout(completionTimer); observer.disconnect(); scope.removeEventListener("click", onClick, true); scope.removeEventListener("input", onInput, true); };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = sessionStorage.getItem(transferKey); if (!raw) return;
        const value = JSON.parse(raw) as TransferRecord;
        if (value?.version !== 1 || value.targetSlug !== slug || Date.now() - value.createdAt > transferLifetime || typeof value.value !== "string" || value.value.length > maxTransferLength) { sessionStorage.removeItem(transferKey); return; }
        const field = firstInput(document.querySelector<HTMLElement>(".workbench"));
        if (!field) return;
        setNativeValue(field, value.value); sessionStorage.removeItem(transferKey); setNotice(t.transferred); setState("ready");
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch { sessionStorage.removeItem(transferKey); }
    });
    return () => cancelAnimationFrame(frame);
  }, [slug, t.transferred]);

  function toggleFavorite() {
    if (!hasPreferenceConsent()) { setNotice(t.consent); openPrivacySettings(); return; }
    const current = readFavorites();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current].slice(0, 24);
    try { localStorage.setItem(favoritesStorageKey, JSON.stringify(next)); setFavorite(next.includes(slug)); window.dispatchEvent(new Event("bq-favorites-change")); }
    catch { setNotice(t.consent); }
  }

  function refreshComparison() {
    const scope = document.querySelector<HTMLElement>(".workbench");
    setBefore(firstInput(scope)?.value.trim() ?? ""); setAfter(readableOutput(scope));
  }

  function transfer() {
    const value = readableOutput(document.querySelector<HTMLElement>(".workbench"));
    if (!value || !target || !relatedMap.has(target)) { setNotice(t.noOutput); return; }
    const record: TransferRecord = { version: 1, fromSlug: slug, targetSlug: target, value, createdAt: Date.now() };
    try { sessionStorage.setItem(transferKey, JSON.stringify(record)); window.location.assign(toolPath(locale, target)); }
    catch { setNotice(t.noOutput); }
  }

  return <>
    <section className="tool-experience-bar" aria-label={t.status}>
      <div className={`tool-operation-state state-${state}`} role="status" aria-live="polite"><i /><span>{t.status}</span><strong>{stateLabel}</strong></div>
      <div className="tool-version-badges"><span>✓ {t.local}</span><time dateTime="2026-07-22">{{ tr: "Son güncelleme: 22 Temmuz 2026", en: "Last updated: July 22, 2026", de: "Zuletzt aktualisiert: 22. Juli 2026", zh: "最后更新：2026 年 7 月 22 日" }[locale]}</time></div>
      <button type="button" className={favorite ? "favorite-button active" : "favorite-button"} aria-pressed={favorite} onClick={toggleFavorite}><span aria-hidden="true">{favorite ? "★" : "☆"}</span>{favorite ? t.unfavorite : t.favorite}</button>
    </section>
    {notice && <p className="tool-experience-notice" role="status">{notice}</p>}
    {state === "complete" && <aside className="local-trust-card"><span aria-hidden="true">✓</span><div><strong>{t.privacy}</strong><p>{t.privacyBody}</p></div></aside>}
    {compare && (before || after) && <section className="before-after-panel"><header><div><span className="kicker">COMPARE</span><h2>{t.compare}</h2></div><button type="button" onClick={refreshComparison}>{t.refresh}</button></header><div><article><strong>{t.before}</strong><pre>{before || "—"}</pre></article><article><strong>{t.after}</strong><pre>{after || "—"}</pre></article></div></section>}
    <section className="tool-next-actions"><div><span className="kicker">SMART NEXT STEP</span><h2>{t.next}</h2><p>{t.bridge}</p></div><div className="tool-transfer-control"><label><span>{t.choose}</span><select value={target} onChange={(event) => setTarget(event.target.value)}>{related.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label><button type="button" className="primary-button" onClick={transfer}>{t.transfer} →</button></div><nav aria-label={t.frequent}><strong>{t.frequent}</strong>{related.map((item) => <Link key={item.slug} href={toolPath(locale, item.slug)}>{item.title} →</Link>)}</nav></section>
  </>;
}
