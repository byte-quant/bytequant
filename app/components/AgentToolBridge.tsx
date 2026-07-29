"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AgentSession } from "../lib/agent-core";
import { AGENT_AUTO_PREPARE_KEY, AGENT_SESSION_KEY, AGENT_SESSION_LIMIT, readAgentSession } from "../lib/agent-session";
import { pathFor, toolPath, type Locale } from "../lib/site";

const copy = {
  tr: { label: "Yerel ajan akışı", step: "Aktif adım", input: "Girdiyi bu araca aktar", capture: "Çıktıyı al ve ilerle", manual: "Bu adım dosya veya özel ayar gerektiriyor. Seçimi araçta siz yapın.", applied: "Girdi aktarıldı. Ayarları doğrulayıp aracı çalıştırın.", missing: "Bu araçta otomatik aktarılabilecek metin alanı bulunamadı; adımı araç arayüzünde tamamlayın.", noOutput: "Henüz okunabilir bir çıktı bulunamadı. Aracı çalıştırdıktan sonra tekrar deneyin.", saved: "Çıktı yalnızca bu sekmedeki plana aktarıldı.", next: "Sonraki adımı aç", open: "Planı görüntüle", privacy: "Otomatik indirme, dosya seçimi veya ağ isteği yapılmaz." },
  en: { label: "Local agent workflow", step: "Active step", input: "Pass input to this tool", capture: "Capture output and continue", manual: "This step needs a file or specific settings. Make that selection in the tool.", applied: "Input applied. Review settings, then run the tool.", missing: "No text field can be filled safely; complete this step in the tool interface.", noOutput: "No readable output was found yet. Run the tool, then try again.", saved: "Output was passed only to this tab's plan.", next: "Open next step", open: "View plan", privacy: "The bridge never downloads, selects a file, or makes a network request automatically." },
  de: { label: "Lokaler Agentenablauf", step: "Aktiver Schritt", input: "Eingabe an Werkzeug übergeben", capture: "Ausgabe übernehmen und fortfahren", manual: "Dieser Schritt erfordert eine Datei oder besondere Einstellungen. Treffen Sie die Auswahl im Werkzeug.", applied: "Eingabe übernommen. Einstellungen prüfen und Werkzeug starten.", missing: "Kein Textfeld kann sicher befüllt werden; führen Sie den Schritt im Werkzeug aus.", noOutput: "Noch keine lesbare Ausgabe gefunden. Werkzeug starten und erneut versuchen.", saved: "Die Ausgabe wurde nur an den Plan dieses Tabs übergeben.", next: "Nächsten Schritt öffnen", open: "Plan anzeigen", privacy: "Keine automatischen Downloads, Dateiauswahl oder Netzwerkanfragen." },
  zh: { label: "本地助手工作流", step: "当前步骤", input: "把输入传给此工具", capture: "获取输出并继续", manual: "此步骤需要文件或专门设置，请在工具中手动选择。", applied: "输入已填入。请核对设置后运行工具。", missing: "未找到可安全填入的文本框，请在工具界面中完成此步骤。", noOutput: "尚未找到可读取的输出。运行工具后再试。", saved: "输出只传入当前标签页的计划。", next: "打开下一步", open: "查看计划", privacy: "不会自动下载、选择文件或发出网络请求。" },
} as const;

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  const applied = element.value === value;
  if (applied) element.focus({ preventScroll: true });
  return applied;
}

type ApplyInputResult = "applied" | "waiting" | "rejected";

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
  const inputValue = session && step ? step.inputMode === "previous" && stepIndex > 0
    ? session.stepOutputs[session.plan.steps[stepIndex - 1].id] ?? ""
    : session.preparedInput ?? session.plan.goal : "";
  const nextStep = session?.plan.steps[stepIndex + 1];

  const applyInput = useCallback((announce = true): ApplyInputResult => {
    const reject = (message: string) => { if (announce) setNotice(message); return "rejected" as const; };
    if (!step) return "waiting";
    if (step.requiresFile) return reject(t.manual);
    const scope = document.querySelector<HTMLElement>(".tool-workbench, .workbench");
    if (!scope) return announce ? reject(t.missing) : "waiting";
    const contractScope = scope?.querySelector<HTMLElement>("[data-agent-contract]");
    const contractFields = Array.from(contractScope?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-agent-input][data-agent-key]") ?? []);
    const operationField = scope?.querySelector<HTMLSelectElement>("[data-agent-mode]");
    const desiredOperation = step.operation === "decode" ? "decode" : step.operation === "csv-to-json" ? "csv-to-json" : step.operation === "minify" ? "minify" : step.operation === "deduplicate" ? "stable-unique" : step.operation === "sort" ? "alpha" : step.operation === "encode" || step.operation === "json-to-csv" || step.operation === "format" ? "default" : "";
    if (operationField && desiredOperation && Array.from(operationField.options).some((option) => option.value === desiredOperation)) setNativeValue(operationField, desiredOperation);
    if (contractFields.length) {
      let mapped: Record<string, string> | undefined;
      try {
        const parsed: unknown = JSON.parse(inputValue);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) mapped = Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string | number | boolean] => ["string", "number", "boolean"].includes(typeof entry[1])).map(([key, value]) => [key, String(value)]));
      } catch { /* plain text is a valid first-field handoff */ }
      let populated = 0;
      if (mapped) {
        contractFields.forEach((field) => {
          const key = field.dataset.agentKey;
          if (key && Object.hasOwn(mapped, key) && setNativeValue(field, mapped[key])) populated += 1;
        });
      } else if (inputValue && setNativeValue(contractFields[0], inputValue.slice(0, AGENT_SESSION_LIMIT))) populated = 1;
      if (!populated) return reject(t.missing);
      window.dispatchEvent(new CustomEvent("bytequant:agent-input", { detail: mapped ? { fields: mapped } : { value: inputValue.slice(0, AGENT_SESSION_LIMIT) } }));
      contractFields[0].scrollIntoView({ behavior: "smooth", block: "center" });
      if (announce) setNotice(t.applied);
      return "applied";
    }
    const field = scope?.querySelector<HTMLTextAreaElement>("[data-agent-input]:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled])")
      ?? scope?.querySelector<HTMLInputElement>('input:not([type="file"]):not([type="hidden"]):not([type="password"]):not([readonly]):not([disabled])');
    if (!field) return announce ? reject(t.missing) : "waiting";
    if (!inputValue || !setNativeValue(field, inputValue.slice(0, AGENT_SESSION_LIMIT))) return reject(t.missing);
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    if (announce) setNotice(t.applied);
    return "applied";
  }, [inputValue, step, t.applied, t.manual, t.missing]);

  useEffect(() => {
    if (!session || !step || !inputValue) return;
    try {
      const raw = sessionStorage.getItem(AGENT_AUTO_PREPARE_KEY);
      const request = raw ? JSON.parse(raw) as { slug?: string; createdAt?: number } : null;
      if (request?.slug !== slug || !Number.isFinite(request.createdAt) || Date.now() - Number(request.createdAt) > 120_000) return;
      let cancelled = false;
      let timeout: number | undefined;
      const deadline = performance.now() + 4_000;
      const attempt = () => {
        if (cancelled) return;
        const result = applyInput(false);
        if (result === "applied") {
          sessionStorage.removeItem(AGENT_AUTO_PREPARE_KEY);
          setNotice(t.applied);
          return;
        }
        if (result === "rejected" || performance.now() >= deadline) {
          sessionStorage.removeItem(AGENT_AUTO_PREPARE_KEY);
          void applyInput(true);
          return;
        }
        timeout = window.setTimeout(attempt, 80);
      };
      const frame = requestAnimationFrame(attempt);
      return () => { cancelled = true; cancelAnimationFrame(frame); if (timeout !== undefined) window.clearTimeout(timeout); };
    } catch { sessionStorage.removeItem(AGENT_AUTO_PREPARE_KEY); }
  }, [applyInput, inputValue, session, slug, step, t.applied]);

  if (!session || !step) return null;

  const captureOutput = () => {
    const scope = document.querySelector<HTMLElement>(".tool-workbench, .workbench");
    const contracted = Array.from(scope?.querySelectorAll<HTMLElement>('[data-agent-output][data-ready="true"]') ?? []).reverse();
    const legacy = Array.from(scope?.querySelectorAll<HTMLElement>('[data-agent-output]:not([data-ready]), output:not([data-ready])') ?? []).reverse();
    const candidates = contracted.length ? contracted : legacy;
    const renderedOutput = candidates.map((item) => item.innerText.trim()).find((value) => value.length > 0 && value.length <= AGENT_SESSION_LIMIT);
    if (!renderedOutput) { setNotice(t.noOutput); return; }
    // Inspection validates the CSV but its visible report is not the next
    // tool's data. Preserve the edited source after a successful run so a
    // masker/converter receives the records instead of the schema summary.
    const sourceField = scope?.querySelector<HTMLTextAreaElement>("[data-agent-input]:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled])");
    const output = step.toolSlug === "csv-inceleyici" && sourceField?.value.trim()
      ? sourceField.value.slice(0, AGENT_SESSION_LIMIT)
      : renderedOutput;
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
    <div className="agent-bridge-actions"><button type="button" className="secondary-button" onClick={() => { void applyInput(true); }}>{t.input}</button><button type="button" className="primary-button" onClick={captureOutput}>{t.capture}</button>{nextStep && session.completedStepIds.includes(step.id) && <Link className="text-link" href={toolPath(locale, nextStep.toolSlug)} onClick={() => { try { sessionStorage.setItem(AGENT_AUTO_PREPARE_KEY, JSON.stringify({ slug: nextStep.toolSlug, createdAt: Date.now() })); } catch { /* the next tool can still be filled manually */ } }}>{t.next} →</Link>}</div>
    {notice && <p className="agent-bridge-notice" role="status">{notice}</p>}
    <small>{t.privacy}</small>
  </aside>;
}
