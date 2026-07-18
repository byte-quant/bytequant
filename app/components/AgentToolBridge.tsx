"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AgentSession } from "../lib/agent-core";
import { AGENT_SESSION_KEY, AGENT_SESSION_LIMIT, readAgentSession } from "../lib/agent-session";
import { pathFor, toolPath, type Locale } from "../lib/site";

const copy = {
  tr: { label: "Yerel ajan akışı", step: "Aktif adım", input: "Girdiyi bu araca aktar", capture: "Çıktıyı al ve ilerle", manual: "Bu adım dosya veya özel ayar gerektiriyor. Seçimi araçta siz yapın.", applied: "Girdi aktarıldı. Ayarları doğrulayıp aracı çalıştırın.", missing: "Bu araçta otomatik aktarılabilecek metin alanı bulunamadı; adımı araç arayüzünde tamamlayın.", noOutput: "Henüz okunabilir bir çıktı bulunamadı. Aracı çalıştırdıktan sonra tekrar deneyin.", saved: "Çıktı yalnızca bu sekmedeki plana aktarıldı.", next: "Sonraki adımı aç", open: "Planı görüntüle", privacy: "Otomatik indirme, dosya seçimi veya ağ isteği yapılmaz." },
  en: { label: "Local agent workflow", step: "Active step", input: "Pass input to this tool", capture: "Capture output and continue", manual: "This step needs a file or specific settings. Make that selection in the tool.", applied: "Input applied. Review settings, then run the tool.", missing: "No text field can be filled safely; complete this step in the tool interface.", noOutput: "No readable output was found yet. Run the tool, then try again.", saved: "Output was passed only to this tab's plan.", next: "Open next step", open: "View plan", privacy: "The bridge never downloads, selects a file, or makes a network request automatically." },
  de: { label: "Lokaler Agentenablauf", step: "Aktiver Schritt", input: "Eingabe an Werkzeug übergeben", capture: "Ausgabe übernehmen und fortfahren", manual: "Dieser Schritt erfordert eine Datei oder besondere Einstellungen. Treffen Sie die Auswahl im Werkzeug.", applied: "Eingabe übernommen. Einstellungen prüfen und Werkzeug starten.", missing: "Kein Textfeld kann sicher befüllt werden; führen Sie den Schritt im Werkzeug aus.", noOutput: "Noch keine lesbare Ausgabe gefunden. Werkzeug starten und erneut versuchen.", saved: "Die Ausgabe wurde nur an den Plan dieses Tabs übergeben.", next: "Nächsten Schritt öffnen", open: "Plan anzeigen", privacy: "Keine automatischen Downloads, Dateiauswahl oder Netzwerkanfragen." },
  zh: { label: "本地助手工作流", step: "当前步骤", input: "把输入传给此工具", capture: "获取输出并继续", manual: "此步骤需要文件或专门设置，请在工具中手动选择。", applied: "输入已填入。请核对设置后运行工具。", missing: "未找到可安全填入的文本框，请在工具界面中完成此步骤。", noOutput: "尚未找到可读取的输出。运行工具后再试。", saved: "输出只传入当前标签页的计划。", next: "打开下一步", open: "查看计划", privacy: "不会自动下载、选择文件或发出网络请求。" },
} as const;

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.focus({ preventScroll: true });
}

function saveSession(session: AgentSession) {
  const value = JSON.stringify(session);
  if (value.length > AGENT_SESSION_LIMIT) throw new Error("agent-session-limit");
  sessionStorage.setItem(AGENT_SESSION_KEY, value);
}

export function AgentToolBridge({ slug, locale }: { slug: string; locale: Locale }) {
  const t = copy[locale];
  const [session, setSession] = useState<AgentSession | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSession(readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY))));
    return () => cancelAnimationFrame(frame);
  }, []);
  const stepIndex = useMemo(() => session?.plan.steps.findIndex((item) => item.toolSlug === slug) ?? -1, [session, slug]);
  const step = stepIndex >= 0 ? session?.plan.steps[stepIndex] : undefined;
  if (!session || !step) return null;

  const inputValue = step.inputMode === "previous" && stepIndex > 0
    ? session.stepOutputs[session.plan.steps[stepIndex - 1].id] ?? ""
    : session.plan.goal;
  const nextStep = session.plan.steps[stepIndex + 1];

  const applyInput = () => {
    if (step.requiresFile) { setNotice(t.manual); return; }
    const scope = document.querySelector<HTMLElement>(".workbench");
    const field = scope?.querySelector<HTMLTextAreaElement>("textarea:not([readonly]):not([disabled])")
      ?? scope?.querySelector<HTMLInputElement>('input:not([type="file"]):not([type="hidden"]):not([type="password"]):not([readonly]):not([disabled])');
    if (!field || !inputValue) { setNotice(step.requiresFile ? t.manual : t.missing); return; }
    setNativeValue(field, inputValue.slice(0, AGENT_SESSION_LIMIT));
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    setNotice(t.applied);
  };

  const captureOutput = () => {
    const scope = document.querySelector<HTMLElement>(".workbench");
    const candidates = Array.from(scope?.querySelectorAll<HTMLElement>("[data-agent-output], pre, output") ?? []).reverse();
    const output = candidates.map((item) => item.innerText.trim()).find((value) => value.length > 0 && value.length <= AGENT_SESSION_LIMIT);
    if (!output) { setNotice(t.noOutput); return; }
    const nextSession: AgentSession = {
      ...session,
      currentStep: Math.min(stepIndex + 1, session.plan.steps.length - 1),
      stepOutputs: { ...session.stepOutputs, [step.id]: output },
      completedStepIds: Array.from(new Set([...session.completedStepIds, step.id])),
    };
    try { saveSession(nextSession); setSession(nextSession); setNotice(t.saved); } catch { setNotice(t.noOutput); }
  };

  return <aside className="agent-tool-bridge" aria-label={t.label}>
    <div className="agent-bridge-title"><span className="agent-status-dot" /><div><small>{t.label}</small><strong>{t.step} {stepIndex + 1}/{session.plan.steps.length}: {step.title}</strong></div><Link href={pathFor(locale, "agent")}>{t.open} →</Link></div>
    <p>{step.reason}</p>
    <div className="agent-bridge-actions"><button type="button" className="secondary-button" onClick={applyInput}>{t.input}</button><button type="button" className="primary-button" onClick={captureOutput}>{t.capture}</button>{nextStep && session.completedStepIds.includes(step.id) && <Link className="text-link" href={toolPath(locale, nextStep.toolSlug)}>{t.next} →</Link>}</div>
    {notice && <p className="agent-bridge-notice" role="status">{notice}</p>}
    <small>{t.privacy}</small>
  </aside>;
}
