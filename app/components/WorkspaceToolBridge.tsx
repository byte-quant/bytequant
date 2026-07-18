"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WORKSPACE_HANDOFF_KEY, readWorkspaceHandoff, type WorkspaceHandoff } from "../lib/workspace-handoff";
import { WORKSPACE_MAX_TEXT } from "../lib/workspace-types";
import type { Locale } from "../lib/site";

const copy = {
  tr: { label: "İş istasyonu düğümü", input: "Düğüm girdisini araca aktar", capture: "Çıktıyı düğüme kaydet", back: "Çalışma alanına dön", applied: "Girdi aktarıldı. Ayarları doğrulayıp aracı siz çalıştırın.", missing: "Güvenle doldurulabilecek bir metin alanı bulunamadı.", noOutput: "Önce aracı çalıştırın; okunabilir çıktı henüz bulunamadı.", saved: "Çıktı geçici aktarım alanına alındı. Çalışma istasyonuna dönünce sonraki bağlı düğüme iletilecek.", privacy: "Köprü dosya seçmez, aracı çalıştırmaz, indirme veya ağ isteği başlatmaz." },
  en: { label: "Workstation node", input: "Pass node input to this tool", capture: "Save output to the node", back: "Return to workspace", applied: "Input applied. Review settings and run the tool yourself.", missing: "No text field can be filled safely.", noOutput: "Run the tool first; no readable output is available yet.", saved: "Output is in the temporary handoff. It will reach the next connected node when you return.", privacy: "The bridge never selects files, runs tools, downloads, or starts network requests." },
  de: { label: "Workstation-Knoten", input: "Knoteneingabe an Werkzeug übergeben", capture: "Ausgabe im Knoten speichern", back: "Zum Arbeitsbereich", applied: "Eingabe übernommen. Einstellungen prüfen und Werkzeug selbst starten.", missing: "Kein Textfeld kann sicher befüllt werden.", noOutput: "Werkzeug zuerst starten; noch keine lesbare Ausgabe.", saved: "Ausgabe liegt in der temporären Übergabe und wird nach der Rückkehr an den nächsten Knoten weitergegeben.", privacy: "Die Brücke wählt keine Dateien, startet keine Werkzeuge, Downloads oder Netzwerkanfragen." },
  zh: { label: "工作站节点", input: "将节点输入传给此工具", capture: "把输出保存到节点", back: "返回工作区", applied: "输入已填入。请检查设置并自行运行工具。", missing: "未找到可安全填充的文本字段。", noOutput: "请先运行工具；目前没有可读取的输出。", saved: "输出已进入临时交接区；返回工作站后会传给下一个连接节点。", privacy: "桥接器不会选择文件、运行工具、下载内容或发起网络请求。" },
} as const;

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.focus({ preventScroll: true });
}

export function WorkspaceToolBridge({ slug, locale }: { slug: string; locale: Locale }) {
  const t = copy[locale];
  const [handoff, setHandoff] = useState<WorkspaceHandoff | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = readWorkspaceHandoff(sessionStorage.getItem(WORKSPACE_HANDOFF_KEY));
      if (value?.toolSlug === slug) setHandoff(value);
    });
    return () => cancelAnimationFrame(frame);
  }, [slug]);
  if (!handoff) return null;

  const applyInput = () => {
    const scope = document.querySelector<HTMLElement>(".workbench");
    const field = scope?.querySelector<HTMLTextAreaElement>("textarea:not([readonly]):not([disabled])")
      ?? scope?.querySelector<HTMLInputElement>('input:not([type="file"]):not([type="hidden"]):not([type="password"]):not([readonly]):not([disabled])');
    if (!field || !handoff.input) { setNotice(t.missing); return; }
    setNativeValue(field, handoff.input.slice(0, WORKSPACE_MAX_TEXT));
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    setNotice(t.applied);
  };

  const capture = () => {
    const scope = document.querySelector<HTMLElement>(".workbench");
    const candidates = Array.from(scope?.querySelectorAll<HTMLElement>("[data-agent-output], pre, output") ?? []).reverse();
    const output = candidates.map((item) => item.innerText.trim()).find((value) => value.length > 0 && value.length <= WORKSPACE_MAX_TEXT);
    if (!output) { setNotice(t.noOutput); return; }
    const next = { ...handoff, output, completed: true };
    sessionStorage.setItem(WORKSPACE_HANDOFF_KEY, JSON.stringify(next));
    setHandoff(next); setNotice(t.saved);
  };

  return <aside className="workspace-tool-bridge" aria-label={t.label}>
    <div><span className="workspace-live-dot" /><strong>{t.label}</strong><small>{handoff.nodeId}</small></div>
    <div className="workspace-bridge-actions"><button type="button" className="secondary-button" onClick={applyInput}>{t.input}</button><button type="button" className="primary-button" onClick={capture}>{t.capture}</button><Link className="text-link" href={handoff.returnPath}>{t.back} →</Link></div>
    {notice && <p role="status">{notice}</p>}<small>{t.privacy}</small>
  </aside>;
}
