"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AGENT_SESSION_KEY,
  AGENT_VERSION,
  createAgentPlan,
  readAgentSession,
  semanticToolSearch,
  translateAgentError,
  type AgentPlan,
} from "../lib/agent-core";
import { WORKSPACE_AGENT_GOAL_KEY } from "../lib/workspace-handoff";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { categories, tools } from "../lib/tools";

type Mode = "plan" | "search" | "error";
type VoiceState = "idle" | "listening" | "unsupported" | "unavailable" | "denied";

type LocalSpeechResult = { results: ArrayLike<{ 0: { transcript: string } }> };
type LocalSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  processLocally: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: LocalSpeechResult) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};
type LocalSpeechRecognitionConstructor = {
  new(): LocalSpeechRecognition;
  available?: (options: { langs: string[]; processLocally: boolean }) => Promise<"available" | "downloadable" | "downloading" | "unavailable">;
};

const languageTags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };

function copy(locale: Locale) {
  return {
    tr: {
      plan: "Akış planla", search: "Semantik araç ara", error: "Hatayı açıkla", goal: "Hedefinizi doğal dille yazın",
      goalHint: "Örn. CSV dosyamdaki kişisel verileri maskele, JSON'a dönüştür ve indir.", build: "Yerel plan oluştur",
      voice: "Cihaz içi sesle yaz", voiceListening: "Dinleniyor…", voiceUnavailable: "Bu tarayıcıda doğrulanmış cihaz içi konuşma tanıma yok; ses uzak servise gönderilmedi.",
      model: "Yerel hibrit karar modeli", modelDetail: "Sürüm kontrollü semantik puanlama + açıklanabilir plan kuralları. Ağ isteği, uzak model ve gizli düşünce zinciri yok.",
      transparency: "Karar özeti", confidence: "Plan güveni", extracted: "Çıkarılan parametreler", signals: "Kullanılan sinyaller", limits: "Sınırlar",
      start: "İlk adımı aç", continue: "Adımı aç", file: "Dosya seçimi gerekli", previous: "Önceki çıktıyı devralır", goalInput: "Hedef metnini kullanır",
      searchPlaceholder: "Ne yapmak istiyorsunuz? Örn. güvenlik başlıklarını denetle", results: "Semantik eşleşmeler", noResult: "Yeterli eşleşme bulunamadı.", open: "Aracı aç",
      errorPlaceholder: "Kişisel veri ve sırları çıkardıktan sonra hata mesajını yapıştırın…", explain: "Hatayı yerelde açıkla", actions: "Önerilen kontroller", suggested: "İlgili araçlar",
      session: "Plan yalnızca bu sekmenin sessionStorage alanında tutulur; araç girdileri localStorage'a yazılmaz.", workstation: "Görsel İş İstasyonunda düzenle", workstationHint: "Plan hedefini güvenli sekme içi aktarım ile görsel düğümlere dönüştürün.",
    },
    en: {
      plan: "Plan workflow", search: "Semantic tool search", error: "Explain an error", goal: "Describe your goal in natural language",
      goalHint: "Example: Mask personal data in my CSV, convert it to JSON, and download it.", build: "Create local plan",
      voice: "Type with on-device voice", voiceListening: "Listening…", voiceUnavailable: "Verified on-device speech recognition is unavailable in this browser; no audio was sent to a remote service.",
      model: "Local hybrid decision model", modelDetail: "Versioned semantic scoring plus explainable planning rules. No network request, remote model, or hidden chain-of-thought.",
      transparency: "Decision summary", confidence: "Plan confidence", extracted: "Extracted parameters", signals: "Signals used", limits: "Limits",
      start: "Open first step", continue: "Open step", file: "File selection required", previous: "Uses previous output", goalInput: "Uses goal text",
      searchPlaceholder: "What do you need? Example: audit security headers", results: "Semantic matches", noResult: "No strong match was found.", open: "Open tool",
      errorPlaceholder: "Remove personal data and secrets, then paste the error message…", explain: "Explain locally", actions: "Suggested checks", suggested: "Related tools",
      session: "The plan stays only in this tab's sessionStorage; tool input is never written to localStorage.", workstation: "Edit in Visual Workstation", workstationHint: "Turn this goal into visual nodes through a safe tab-scoped handoff.",
    },
    de: {
      plan: "Ablauf planen", search: "Semantisch suchen", error: "Fehler erklären", goal: "Ziel in natürlicher Sprache beschreiben",
      goalHint: "Beispiel: Personendaten in CSV maskieren, in JSON umwandeln und herunterladen.", build: "Lokalen Plan erstellen",
      voice: "Mit lokaler Spracheingabe", voiceListening: "Hört zu…", voiceUnavailable: "Verifizierte lokale Spracherkennung ist nicht verfügbar; Audio wurde an keinen Remote-Dienst gesendet.",
      model: "Lokales hybrides Entscheidungsmodell", modelDetail: "Versionierte semantische Bewertung plus nachvollziehbare Planregeln. Kein Netzwerk, Remote-Modell oder verborgene Gedankenkette.",
      transparency: "Entscheidungsübersicht", confidence: "Plansicherheit", extracted: "Extrahierte Parameter", signals: "Verwendete Signale", limits: "Grenzen",
      start: "Ersten Schritt öffnen", continue: "Schritt öffnen", file: "Dateiauswahl erforderlich", previous: "Übernimmt vorherige Ausgabe", goalInput: "Verwendet Zieltext",
      searchPlaceholder: "Was möchten Sie tun? Beispiel: Sicherheitsheader prüfen", results: "Semantische Treffer", noResult: "Kein starker Treffer gefunden.", open: "Werkzeug öffnen",
      errorPlaceholder: "Personendaten und Geheimnisse entfernen, dann Fehlermeldung einfügen…", explain: "Lokal erklären", actions: "Empfohlene Prüfungen", suggested: "Passende Werkzeuge",
      session: "Der Plan bleibt nur im sessionStorage dieses Tabs; Werkzeugeingaben werden nie in localStorage geschrieben.", workstation: "In visueller Workstation bearbeiten", workstationHint: "Ziel per sicherer Tab-Übergabe in visuelle Knoten umwandeln.",
    },
    zh: {
      plan: "规划流程", search: "语义搜索工具", error: "解释错误", goal: "用自然语言描述目标",
      goalHint: "例如：遮蔽 CSV 中的个人数据，转换为 JSON 并下载。", build: "创建本地计划",
      voice: "使用设备端语音输入", voiceListening: "正在聆听…", voiceUnavailable: "此浏览器没有可验证的设备端语音识别；音频未发送到远程服务。",
      model: "本地混合决策模型", modelDetail: "版本化语义评分与可解释规划规则；无网络请求、远程模型或隐藏思维链。",
      transparency: "决策摘要", confidence: "计划置信度", extracted: "提取的参数", signals: "使用的信号", limits: "限制",
      start: "打开第一步", continue: "打开步骤", file: "需要手动选择文件", previous: "接收上一步输出", goalInput: "使用目标文本",
      searchPlaceholder: "您想做什么？例如：审计安全响应头", results: "语义匹配", noResult: "未找到足够强的匹配。", open: "打开工具",
      errorPlaceholder: "移除个人数据与秘密后粘贴错误消息…", explain: "在本地解释", actions: "建议检查", suggested: "相关工具",
      session: "计划只保留在当前标签页的 sessionStorage 中；工具输入不会写入 localStorage。", workstation: "在可视化工作站中编辑", workstationHint: "通过当前标签页内的安全交接把目标转换为可视化节点。",
    },
  }[locale];
}

export function AgenticAssistant({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const [mode, setMode] = useState<Mode>("plan");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<AgentPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);
  const searchResults = useMemo(() => semanticToolSearch(searchQuery, tools, locale, 8), [searchQuery, locale]);
  const errorResult = useMemo(() => errorText.trim() ? translateAgentError(errorText, locale) : null, [errorText, locale]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onresult = null; recognition.onerror = null; recognition.onend = null;
    try { recognition.stop(); } catch { /* recognition may already be stopped */ }
    recognitionRef.current = null;
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const session = readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY));
      if (session) {
        const localizedPlan = session.plan.locale === locale ? session.plan : createAgentPlan(session.plan.goal, tools, locale);
        setPlan(localizedPlan); setGoal(localizedPlan.goal);
        if (localizedPlan !== session.plan) {
          try { sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan: localizedPlan, currentStep: 0, stepOutputs: {}, completedStepIds: [] })); } catch { /* continue without persistence */ }
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const makePlan = () => {
    if (!goal.trim()) return;
    const nextPlan = createAgentPlan(goal, tools, locale);
    setPlan(nextPlan);
    try { sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan: nextPlan, currentStep: 0, stepOutputs: {}, completedStepIds: [] })); } catch { /* session quota or privacy mode: UI still works */ }
  };

  const beginVoice = async () => {
    const Constructor = (window as typeof window & { SpeechRecognition?: LocalSpeechRecognitionConstructor }).SpeechRecognition;
    if (!Constructor || !Constructor.available) { setVoiceState("unsupported"); return; }
    try {
      const availability = await Constructor.available({ langs: [languageTags[locale]], processLocally: true });
      if (availability !== "available") { setVoiceState("unavailable"); return; }
      const recognition = new Constructor();
      if (!("processLocally" in recognition)) { setVoiceState("unsupported"); return; }
      recognition.processLocally = true;
      recognition.lang = languageTags[locale]; recognition.continuous = false; recognition.interimResults = false;
      recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript?.trim(); if (transcript) setGoal((value) => value ? `${value} ${transcript}` : transcript); };
      recognition.onerror = (event) => setVoiceState(event.error === "not-allowed" ? "denied" : "unavailable");
      recognition.onend = () => { recognitionRef.current = null; setVoiceState((value) => value === "listening" ? "idle" : value); };
      recognitionRef.current = recognition;
      setVoiceState("listening"); recognition.start();
    } catch { setVoiceState("unavailable"); }
  };

  return <div className="agent-console">
    <header className="agent-console-header">
      <div><span className="agent-status-dot" /><span>{AGENT_VERSION}</span><strong>{t.model}</strong></div>
      <p>{t.modelDetail}</p>
    </header>
    <nav className="agent-tabs" aria-label={t.model}>
      {(["plan", "search", "error"] as const).map((item) => <button type="button" key={item} className={mode === item ? "active" : ""} aria-pressed={mode === item} onClick={() => setMode(item)}>{t[item]}</button>)}
    </nav>

    {mode === "plan" && <div className="agent-panel">
      <section className="agent-input-card">
        <label><span>{t.goal}</span><textarea value={goal} onChange={(event) => setGoal(event.target.value)} placeholder={t.goalHint} maxLength={20_000} rows={7} /></label>
        <div className="agent-input-actions"><button type="button" className="secondary-button" onClick={beginVoice} disabled={voiceState === "listening"}>{voiceState === "listening" ? t.voiceListening : t.voice}</button><button type="button" className="primary-button" onClick={makePlan} disabled={!goal.trim()}>{t.build}<span>→</span></button></div>
        {(["unsupported", "unavailable", "denied"] as VoiceState[]).includes(voiceState) && <p className="agent-voice-note" role="status">{t.voiceUnavailable}</p>}
        <small>{t.session}</small>
      </section>
      {plan && <section className="agent-plan" aria-live="polite">
        <div className="agent-plan-summary"><span>{t.confidence}<strong>{Math.round(plan.confidence * 100)}%</strong></span><span>{plan.steps.length}<strong>{locale === "zh" ? "个步骤" : locale === "de" ? " Schritte" : locale === "tr" ? " adım" : " steps"}</strong></span><span>0<strong>{locale === "zh" ? " 次网络请求" : locale === "de" ? " Netzaufrufe" : locale === "tr" ? " ağ isteği" : " network calls"}</strong></span></div>
        <Link className="agent-workstation-link" href={pathFor(locale, "workstation")} onClick={() => { try { sessionStorage.setItem(WORKSPACE_AGENT_GOAL_KEY, plan.goal); } catch { /* workstation can still be opened without handoff */ } }}><span><strong>{t.workstation}</strong><small>{t.workstationHint}</small></span><b>IDE →</b></Link>
        <ol className="agent-step-list">{plan.steps.map((step, index) => <li key={step.id}><span className="agent-step-number">{String(index + 1).padStart(2, "0")}</span><div><div className="agent-step-title"><strong>{step.title}</strong><small>{step.requiresFile ? t.file : step.inputMode === "previous" ? t.previous : t.goalInput}</small></div><p>{step.reason}</p>{step.parameterHints.length > 0 && <div className="agent-hints">{step.parameterHints.map((hint) => <span key={hint}>{hint}</span>)}</div>}</div><Link href={toolPath(locale, step.toolSlug)} onClick={() => { try { const existing = readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY)); sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify(existing?.plan.goal === plan.goal ? { ...existing, currentStep: index } : { plan, currentStep: index, stepOutputs: {}, completedStepIds: [] })); } catch { /* continue without bridge */ } }}>{index === 0 ? t.start : t.continue} →</Link></li>)}</ol>
        <details className="agent-reasoning" open><summary>{t.transparency}<span>+</span></summary><div><h3>{t.signals}</h3><ul>{plan.signals.map((item) => <li key={item}>{item}</li>)}</ul>{plan.extracted.length > 0 && <><h3>{t.extracted}</h3><dl>{plan.extracted.map((item, index) => <div key={`${item.kind}-${index}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></>}<h3>{t.limits}</h3><ul>{plan.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></details>
      </section>}
    </div>}

    {mode === "search" && <div className="agent-panel agent-search-panel">
      <label className="agent-search-box"><span>⌕</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.searchPlaceholder} autoComplete="off" /></label>
      <section><div className="agent-section-title"><h2>{t.results}</h2><span>{searchResults.length}</span></div>{searchQuery.trim() && searchResults.length === 0 && <p className="agent-empty">{t.noResult}</p>}<div className="agent-search-results">{searchResults.map((result) => <article key={result.tool.slug}><span className={`tool-mark category-${result.tool.category}`}>{result.tool.mark}</span><div><small>{categories[result.tool.category].label[locale]}</small><h3>{result.tool.title[locale]}</h3><p>{result.tool.short[locale]}</p><div>{result.matched.map((word) => <span key={word}>{word}</span>)}</div></div><Link href={toolPath(locale, result.tool.slug)}>{t.open} →</Link></article>)}</div></section>
    </div>}

    {mode === "error" && <div className="agent-panel agent-error-panel">
      <section className="agent-input-card"><label><span>{t.error}</span><textarea value={errorInput} onChange={(event) => setErrorInput(event.target.value)} placeholder={t.errorPlaceholder} maxLength={30_000} rows={8} /></label><button type="button" className="primary-button" onClick={() => setErrorText(errorInput.trim())} disabled={!errorInput.trim()}>{t.explain}<span>→</span></button></section>
      {errorResult && <section className="agent-error-result" aria-live="polite"><span>!</span><div><h2>{errorResult.title}</h2><p>{errorResult.explanation}</p><h3>{t.actions}</h3><ol>{errorResult.actions.map((action) => <li key={action}>{action}</li>)}</ol>{errorResult.suggestedSlugs.length > 0 && <><h3>{t.suggested}</h3><div className="agent-related-tools">{errorResult.suggestedSlugs.map((slug) => { const tool = tools.find((item) => item.slug === slug); return tool ? <Link href={toolPath(locale, slug)} key={slug}>{tool.title[locale]} →</Link> : null; })}</div></>}<small>{errorResult.boundary}</small></div></section>}
    </div>}
  </div>;
}
