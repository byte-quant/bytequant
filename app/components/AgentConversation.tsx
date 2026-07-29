"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { canAutomatePlan, runAgentAutomation, type AgentAutomationResult } from "../lib/agent-automation";
import { AGENT_SESSION_KEY, AGENT_VERSION, createAgentPlan, extractAgentPayload, prepareAgentInput, readAgentSession, semanticToolSearch, translateAgentError, type AgentPlan } from "../lib/agent-core";
import { AGENT_AUTO_PREPARE_KEY } from "../lib/agent-session";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { publicTools as tools } from "../lib/tools";
import { WORKSPACE_AGENT_GOAL_KEY, WORKSPACE_AGENT_PLAN_KEY } from "../lib/workspace-handoff";

type Turn = { goal: string; answer: string; tools: string[]; time: number };
type VoiceState = "idle" | "listening" | "unavailable";
type LocalSpeechRecognition = { lang: string; continuous: boolean; interimResults: boolean; processLocally: boolean; start(): void; stop(): void; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
type LocalSpeechRecognitionConstructor = { new(): LocalSpeechRecognition; available?: (options: { langs: string[]; processLocally: boolean }) => Promise<string> };

const tags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const historyKey = "bytequant:local-agent-conversation:v4";

const ui = {
  tr: {
    hello: "Merhaba, ben ByteQuant Yerel Ajan.", helloBody: "Sonucu günlük dille anlatın. Gerekirse önce tek bir netleştirme sorusu sorar, sonra en kısa uygulanabilir akışı kurarım.", placeholder: "Örn. Bu CSV'deki e-postaları temizle, tekrarları kaldır ve JSON olarak hazırla", send: "Gönder", thinking: "Uygun yolu hazırlıyorum…", private: "Bu konuşma bu sekmede kalır", memory: "Bağlam açık", newChat: "Yeni sohbet", voice: "Sesle yaz", listening: "Dinliyorum…", examples: [["Veri temizle", "CSV dosyamdaki kişisel verileri maskele ve paylaşılabilir JSON hazırla"], ["Liste düzenle", "E-posta listesini temizle, tekrarları kaldır ve alfabetik sırala"], ["Hata çöz", "JSON.parse Unexpected token hatasını açıkla ve doğru aracı öner"], ["Prompt denetle", "Sistem promptumu netlik, tutarlılık ve enjeksiyon riski açısından kontrol et"]],
    plan: "Önerdiğim akış", why: "Bunu öneriyorum çünkü", start: "Aracı aç ve girdiyi hazırla", workstation: "Görsel akışa aktar", details: "Planın ayrıntıları ve sınırları", confidence: "Eşleşme", experts: "3 yerel kontrol", expertText: "Akış sırası, gizlilik ve teslim kalitesi ayrı kurallarla denetlendi.", dataRun: "Metin verisini burada çalıştır", dataIntro: "Bu planın bütün adımları metin üzerinde otomatik çalışabilir. Gerçek kişisel veri yerine önce sentetik örnek kullanın.", dataPlaceholder: "İşlenecek metin, CSV veya JSON…", run: "Planı cihazda çalıştır", running: "Çalıştırılıyor…", output: "Otomatik çalışma sonucu", copy: "Çıktıyı kopyala", copied: "Kopyalandı", unavailable: "Bu akış dosya seçimi veya görsel kontrol gerektiriyor; güvenli biçimde otomatik çalıştırılamaz.", voiceUnavailable: "Bu tarayıcı cihaz içi ses tanımayı doğrulamadı; metin alanını kullanabilirsiniz.", utilities: "Araç bul veya hata açıkla", find: "Araç bul", findPlaceholder: "Örn. güvenlik başlıklarını kontrol et", error: "Hata açıkla", errorPlaceholder: "Kişisel veri ve sırları çıkardıktan sonra hata metnini yapıştırın", clear: "Sohbeti temizle", previous: "Az önceki konuşmayı dikkate aldım.", network: "0 dış model isteği", prepared: "Girdi algılandı", autoComplete: "Desteklenen adımlar cihazınızda otomatik tamamlandı",
  },
  en: {
    hello: "Hi, I’m ByteQuant Local Agent.", helloBody: "Describe the outcome in everyday language. I will ask one focused question when needed, then build the shortest practical workflow.", placeholder: "Example: Clean this email list, remove duplicates, and prepare JSON", send: "Send", thinking: "Building a practical path…", private: "This conversation stays in this tab", memory: "Context on", newChat: "New chat", voice: "Voice input", listening: "Listening…", examples: [["Clean data", "Mask personal data in my CSV and prepare shareable JSON"], ["Tidy a list", "Clean an email list, remove duplicates, and sort it alphabetically"], ["Fix an error", "Explain a JSON.parse Unexpected token error and recommend the right tool"], ["Review a prompt", "Check my system prompt for clarity, consistency, and injection risk"]],
    plan: "Suggested workflow", why: "Why this path", start: "Open tool and prepare input", workstation: "Send to visual workflow", details: "Plan details and limits", confidence: "Match", experts: "3 local checks", expertText: "Tool order, privacy, and delivery quality were reviewed by separate rule sets.", dataRun: "Run text data here", dataIntro: "Every step in this plan can run automatically on text. Start with synthetic data instead of real personal data.", dataPlaceholder: "Text, CSV, or JSON to process…", run: "Run plan on this device", running: "Running…", output: "Automated result", copy: "Copy output", copied: "Copied", unavailable: "This workflow needs file selection or visual review and cannot be safely automated.", voiceUnavailable: "This browser did not verify on-device speech recognition; you can keep using the text box.", utilities: "Find a tool or explain an error", find: "Find a tool", findPlaceholder: "Example: audit security headers", error: "Explain an error", errorPlaceholder: "Remove personal data and secrets before pasting an error", clear: "Clear conversation", previous: "I used the previous conversation as context.", network: "0 remote-model calls", prepared: "Input detected", autoComplete: "Supported steps finished automatically on this device",
  },
  de: {
    hello: "Hallo, ich bin der lokale ByteQuant-Agent.", helloBody: "Beschreiben Sie das Ergebnis in Alltagssprache. Falls nötig stelle ich eine gezielte Frage und erstelle dann den kürzesten praktischen Ablauf.", placeholder: "Beispiel: E-Mail-Liste bereinigen, Duplikate entfernen und JSON erstellen", send: "Senden", thinking: "Praktischen Weg erstellen…", private: "Dieses Gespräch bleibt im Tab", memory: "Kontext aktiv", newChat: "Neues Gespräch", voice: "Spracheingabe", listening: "Hört zu…", examples: [["Daten bereinigen", "Personendaten in CSV maskieren und teilbares JSON erstellen"], ["Liste ordnen", "E-Mail-Liste bereinigen, Duplikate entfernen und alphabetisch sortieren"], ["Fehler lösen", "JSON.parse Unexpected token erklären und passendes Werkzeug empfehlen"], ["Prompt prüfen", "System-Prompt auf Klarheit, Konsistenz und Injection-Risiko prüfen"]],
    plan: "Vorgeschlagener Ablauf", why: "Warum dieser Weg", start: "Werkzeug öffnen und Eingabe vorbereiten", workstation: "An visuellen Ablauf senden", details: "Plandetails und Grenzen", confidence: "Treffer", experts: "3 lokale Prüfungen", expertText: "Reihenfolge, Datenschutz und Ausgabequalität wurden getrennt geprüft.", dataRun: "Textdaten hier ausführen", dataIntro: "Alle Schritte dieses Plans können Text automatisch verarbeiten. Zuerst synthetische statt echter Personendaten verwenden.", dataPlaceholder: "Zu verarbeitender Text, CSV oder JSON…", run: "Plan auf diesem Gerät ausführen", running: "Wird ausgeführt…", output: "Automatisches Ergebnis", copy: "Ausgabe kopieren", copied: "Kopiert", unavailable: "Dieser Ablauf benötigt Dateiauswahl oder visuelle Prüfung und kann nicht sicher automatisiert werden.", voiceUnavailable: "Dieser Browser bestätigt keine lokale Spracherkennung; verwenden Sie bitte das Textfeld.", utilities: "Werkzeug finden oder Fehler erklären", find: "Werkzeug finden", findPlaceholder: "Beispiel: Sicherheitsheader prüfen", error: "Fehler erklären", errorPlaceholder: "Personendaten und Geheimnisse vor dem Einfügen entfernen", clear: "Gespräch löschen", previous: "Der vorherige Gesprächskontext wurde verwendet.", network: "0 Remote-Modellaufrufe", prepared: "Eingabe erkannt", autoComplete: "Unterstützte Schritte wurden lokal automatisch abgeschlossen",
  },
  zh: {
    hello: "您好，我是 ByteQuant 本地助手。", helloBody: "请用日常语言描述结果。必要时我会先问一个明确问题，再生成最短的可执行流程。", placeholder: "例如：清理邮件列表、去重并生成 JSON", send: "发送", thinking: "正在生成可执行路径…", private: "对话仅保留在当前标签页", memory: "语境已开启", newChat: "新对话", voice: "语音输入", listening: "正在聆听…", examples: [["清理数据", "遮蔽 CSV 中的个人数据并生成可分享 JSON"], ["整理列表", "清理邮件列表、去重并按字母排序"], ["解决错误", "解释 JSON.parse Unexpected token 错误并推荐合适工具"], ["检查提示词", "检查系统提示词的清晰度、一致性与注入风险"]],
    plan: "建议流程", why: "推荐理由", start: "打开工具并准备输入", workstation: "发送到可视化流程", details: "计划详情与限制", confidence: "匹配度", experts: "3 项本地检查", expertText: "工具顺序、隐私与交付质量由独立规则检查。", dataRun: "在此运行文本数据", dataIntro: "此计划的全部步骤都可自动处理文本。请先使用合成数据，而非真实个人数据。", dataPlaceholder: "待处理文本、CSV 或 JSON…", run: "在此设备运行计划", running: "正在运行…", output: "自动运行结果", copy: "复制输出", copied: "已复制", unavailable: "此流程需要选择文件或进行视觉检查，无法安全自动运行。", voiceUnavailable: "此浏览器未确认设备端语音识别；您仍可使用文本输入框。", utilities: "查找工具或解释错误", find: "查找工具", findPlaceholder: "例如：检查安全响应头", error: "解释错误", errorPlaceholder: "粘贴前请移除个人数据和机密", clear: "清除对话", previous: "已使用之前的对话作为语境。", network: "0 次远程模型调用", prepared: "已识别输入", autoComplete: "支持的步骤已在此设备自动完成",
  },
} as const;

const assistCopy = {
  tr: { next: "Bundan sonra güvenle yapabilecekleriniz", reply: "Devam etmek için bir seçenek seçin", speak: "Yanıtı sesli oku" },
  en: { next: "Safe next steps", reply: "Choose an option to continue", speak: "Read the answer aloud" },
  de: { next: "Sichere nächste Schritte", reply: "Wählen Sie eine Option zum Fortfahren", speak: "Antwort vorlesen" },
  zh: { next: "安全的后续步骤", reply: "选择一个选项继续", speak: "朗读回答" },
} as const;

const stateCopy = {
  tr: { coverage: "Anladığım işlemler", needsInfo: "Devam etmeden önce bir ayrıntı gerekli", provisional: "Aşağıdan kısa bir yanıt seçin", completed: "adım cihazınızda tamamlandı", inherited: "Önceki yerel çıktı bu adıma aktarıldı" },
  en: { coverage: "Operations I understood", needsInfo: "One detail is needed before continuing", provisional: "Choose a short answer below", completed: "steps finished on this device", inherited: "The previous local result was passed into this step" },
  de: { coverage: "Verstandene Vorgänge", needsInfo: "Vor dem Fortfahren fehlt eine Angabe", provisional: "Wählen Sie unten eine kurze Antwort", completed: "Schritte wurden lokal abgeschlossen", inherited: "Das vorige lokale Ergebnis wurde an diesen Schritt übergeben" },
  zh: { coverage: "我理解的操作", needsInfo: "继续前还需要一项信息", provisional: "请从下方选择简短回答", completed: "个步骤已在此设备完成", inherited: "上一项本地结果已传入此步骤" },
} as const;

export function AgentConversation({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const assist = assistCopy[locale];
  const state = stateCopy[locale];
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<AgentPlan | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [voice, setVoice] = useState<VoiceState>("idle");
  const [data, setData] = useState("");
  const [preparedInput, setPreparedInput] = useState("");
  const [automation, setAutomation] = useState<AgentAutomationResult | null>(null);
  const [automationError, setAutomationError] = useState("");
  const [automationBusy, setAutomationBusy] = useState(false);
  const [inputInherited, setInputInherited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [utilityQuery, setUtilityQuery] = useState("");
  const [errorQuery, setErrorQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);
  const utilityResults = useMemo(() => semanticToolSearch(utilityQuery, tools, locale, 4), [locale, utilityQuery]);
  const errorResult = useMemo(() => errorQuery.trim() ? translateAgentError(errorQuery, locale) : null, [errorQuery, locale]);
  const automatable = plan ? canAutomatePlan(plan) : false;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const session = readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY));
        if (session) {
          setPlan(session.plan.locale === locale ? session.plan : createAgentPlan(session.plan.goal, tools, locale));
          setPreparedInput(session.preparedInput ?? "");
          setData(session.preparedInput ?? "");
        }
        const saved: unknown = JSON.parse(sessionStorage.getItem(historyKey) ?? "[]");
        if (Array.isArray(saved)) setTurns(saved.filter((item): item is Turn => Boolean(item) && typeof item === "object" && typeof (item as Turn).goal === "string" && typeof (item as Turn).answer === "string" && Array.isArray((item as Turn).tools) && Number.isFinite((item as Turn).time)).slice(-12));
      } catch { /* memory is optional */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  useEffect(() => () => { try { recognitionRef.current?.stop(); } catch { /* already stopped */ } window.speechSynthesis?.cancel(); }, []);

  function submit() {
    const text = goal.trim();
    if (!text || busy) return;
    setBusy(true); setAutomation(null); setAutomationError("");
    requestAnimationFrame(() => {
      const next = createAgentPlan(text, tools, locale, plan);
      const extractedInput = extractAgentPayload(text);
      const inheritedInput = !extractedInput && next.conversation.isFollowUp ? automation?.output || preparedInput : "";
      const detectedInput = prepareAgentInput(text, next, extractedInput || inheritedInput);
      const nextTurns = [...turns, { goal: text, answer: next.response, tools: next.steps.map((step) => step.title), time: Date.now() }].slice(-12);
      setPlan(next); setTurns(nextTurns); setPreparedInput(detectedInput); setData(detectedInput); setInputInherited(Boolean(inheritedInput)); setGoal(""); setBusy(false);
      if (detectedInput && canAutomatePlan(next)) {
        try { setAutomation(runAgentAutomation(next, detectedInput, locale)); }
        catch (error) { setAutomationError((error as Error).message); }
      }
      try {
        sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan: next, currentStep: 0, stepOutputs: {}, completedStepIds: [], preparedInput: detectedInput || undefined }));
        sessionStorage.setItem(historyKey, JSON.stringify(nextTurns));
      } catch { /* keep working without memory */ }
    });
  }

  async function beginVoice() {
    const Constructor = (window as typeof window & { SpeechRecognition?: LocalSpeechRecognitionConstructor }).SpeechRecognition;
    if (!Constructor?.available) { setVoice("unavailable"); return; }
    try {
      if (await Constructor.available({ langs: [tags[locale]], processLocally: true }) !== "available") { setVoice("unavailable"); return; }
      const recognition = new Constructor(); recognition.lang = tags[locale]; recognition.processLocally = true; recognition.continuous = false; recognition.interimResults = false;
      recognition.onresult = (event) => { const transcript = event.results[0]?.[0]?.transcript?.trim(); if (transcript) setGoal((current) => current ? `${current} ${transcript}` : transcript); };
      recognition.onerror = () => setVoice("unavailable"); recognition.onend = () => setVoice((current) => current === "listening" ? "idle" : current); recognitionRef.current = recognition; setVoice("listening"); recognition.start();
    } catch { setVoice("unavailable"); }
  }

  function startGuided(index = 0) {
    if (!plan) return;
    try {
      sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan, currentStep: index, stepOutputs: {}, completedStepIds: [], preparedInput: preparedInput || undefined }));
      if (preparedInput && index === 0) sessionStorage.setItem(AGENT_AUTO_PREPARE_KEY, JSON.stringify({ slug: plan.steps[0].toolSlug, createdAt: Date.now() }));
    } catch { /* tool still opens */ }
  }

  function runHere() {
    if (!plan) return;
    setAutomationError(""); setAutomation(null); setAutomationBusy(true);
    requestAnimationFrame(() => {
      try { setAutomation(runAgentAutomation(plan, data, locale)); }
      catch (error) {
        const value = error as Error & { steps?: AgentAutomationResult["steps"]; output?: string };
        if (value.steps && typeof value.output === "string") setAutomation({ steps: value.steps, output: value.output });
        setAutomationError(value.message);
      } finally { setAutomationBusy(false); }
    });
  }

  function reset() {
    setGoal(""); setPlan(null); setTurns([]); setData(""); setPreparedInput(""); setAutomation(null); setAutomationError(""); setAutomationBusy(false); setInputInherited(false);
    try { sessionStorage.removeItem(historyKey); sessionStorage.removeItem(AGENT_SESSION_KEY); sessionStorage.removeItem(AGENT_AUTO_PREPARE_KEY); } catch { /* optional */ }
    inputRef.current?.focus();
  }

  return <section className="agent-chat-app" aria-label={t.hello}>
    <header className="agent-chat-bar"><div><span className="agent-avatar">BQ</span><div><strong>{t.hello}</strong><small><i />{AGENT_VERSION} · {t.private}</small></div></div><div><span>{turns.length ? t.memory : t.network}</span><button type="button" onClick={reset}>{t.newChat}</button></div></header>
    {!turns.length && <div className="agent-capability-path" aria-label={locale === "tr" ? "Ajan çalışma biçimi" : locale === "de" ? "Arbeitsweise des Agenten" : locale === "zh" ? "助手工作方式" : "How the Agent works"}><span><b>1</b>{locale === "tr" ? "İsteği anlatın" : locale === "de" ? "Ziel beschreiben" : locale === "zh" ? "描述目标" : "Describe"}</span><i>→</i><span><b>2</b>{locale === "tr" ? "Planı görün" : locale === "de" ? "Plan prüfen" : locale === "zh" ? "查看计划" : "Review"}</span><i>→</i><span><b>3</b>{locale === "tr" ? "Onaylayın" : locale === "de" ? "Bestätigen" : locale === "zh" ? "确认执行" : "Approve"}</span></div>}

    <div className="agent-chat-stream" aria-live="polite">
      <article className="agent-message assistant"><span className="agent-avatar">BQ</span><div><p>{t.helloBody}</p></div></article>
      {turns.slice(-6).map((turn, index) => <div className="agent-turn" key={`${turn.time}-${index}`}><article className="agent-message user"><div><p>{turn.goal}</p></div></article><article className="agent-message assistant"><span className="agent-avatar">BQ</span><div><p>{turn.answer}</p>{index > 0 && <small>↳ {t.previous}</small>}</div></article></div>)}
      {busy && <article className="agent-message assistant thinking"><span className="agent-avatar">BQ</span><div><p>{t.thinking}</p><i /></div></article>}

      {plan && !busy && <article className="agent-answer-card">
        <header><div><span>✓</span><div><small>{t.plan}</small><h2>{plan.conversation.intentSummary}</h2></div></div><strong>{Math.round(plan.confidence * 100)}%</strong></header>
        {plan.coverage.requested.length > 0 && <div className="agent-goal-coverage"><strong>{state.coverage}</strong><div>{plan.coverage.requested.map((item) => <span key={item}>✓ {item}</span>)}</div></div>}
        <div className="agent-answer-flow">{plan.steps.map((step, index) => <div key={step.id}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.reason}</p></div>{index < plan.steps.length - 1 && <i>↓</i>}</div>)}</div>
        <div className="agent-next-actions"><strong>{assist.next}</strong><ol>{plan.nextActions.slice(0, 3).map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ol></div>
        {preparedInput && <div className="agent-prepared-input"><span>✓</span><div><strong>{t.prepared}</strong><small>{preparedInput.length.toLocaleString(tags[locale])} · {automation ? `${automation.steps.filter((step) => step.status === "completed").length}/${plan.steps.length} ${state.completed}` : inputInherited ? state.inherited : plan.steps[0].title}</small></div><code>{preparedInput.slice(0, 110)}{preparedInput.length > 110 ? "…" : ""}</code></div>}
        {plan.clarifyingQuestions.length > 0 && <div className="agent-inline-questions" role="status"><strong>{state.needsInfo}</strong><p>{plan.clarifyingQuestions[0]}</p><small>{state.provisional}</small></div>}
        <div className="agent-primary-actions">
          {plan.matchQuality === "strong" && !plan.coverage.missing.length ? <><Link className="primary-button" href={toolPath(locale, plan.steps[0].toolSlug)} onClick={() => startGuided(0)}>{t.start} →</Link>
          <Link className="secondary-button" href={pathFor(locale, "workstation")} onClick={() => { try { sessionStorage.setItem(WORKSPACE_AGENT_GOAL_KEY, plan.goal); sessionStorage.setItem(WORKSPACE_AGENT_PLAN_KEY, JSON.stringify(plan)); } catch { /* open without handoff */ } }}>{t.workstation} ↗</Link></> : <button type="button" className="primary-button" onClick={() => inputRef.current?.focus()}>{state.provisional} ↓</button>}
          <button type="button" className="agent-speak-button" aria-label={assist.speak} title={assist.speak} onClick={() => { if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(plan.response); utterance.lang = tags[locale]; window.speechSynthesis.speak(utterance); }}>◖</button>
        </div>
        <div className="agent-followup-strip"><strong>{assist.reply}</strong><div>{plan.conversation.suggestedReplies.slice(0, 3).map((option) => <button type="button" key={option} onClick={() => { setGoal(option); inputRef.current?.focus(); }}>{option}</button>)}</div></div>
        {automatable ? <details className="agent-inline-run" open={Boolean(automation || automationError)}><summary><span>▶</span><strong>{t.dataRun}</strong><b>+</b></summary><div><p>{t.dataIntro}</p><textarea value={data} onChange={(event) => { setData(event.target.value); setPreparedInput(event.target.value); setAutomation(null); setAutomationError(""); setInputInherited(false); }} placeholder={t.dataPlaceholder} rows={7} maxLength={200_000} /><button type="button" className="primary-button" disabled={!data.trim() || automationBusy} onClick={runHere}>{automationBusy ? t.running : t.run}</button>{automationError && <p className="error-block" role="alert">{automationError}</p>}{automation && <section className="agent-automation-result"><header><strong>{t.output}</strong><button type="button" onClick={async () => { await navigator.clipboard.writeText(automation.output); setCopied(true); }}>{copied ? t.copied : t.copy}</button></header><ol>{automation.steps.map((step) => <li className={step.status} key={step.toolSlug}><span>{step.status === "completed" ? "✓" : "!"}</span><div><strong>{step.title}</strong><small>{step.note} · {step.outputLength}</small></div></li>)}</ol><pre>{automation.output}</pre></section>}</div></details> : <small className="agent-automation-boundary">ⓘ {t.unavailable}</small>}
        <details className="agent-answer-details"><summary>{t.details}<span>+</span></summary><div className="agent-detail-grid"><article><strong>{t.confidence}</strong><p>{Math.round(plan.confidence * 100)}% · {plan.matchQuality}</p></article><article><strong>{t.experts}</strong><p>{t.expertText}</p></article><article><strong>{t.why}</strong><p>{plan.signals.slice(0, 3).join(" · ")}</p></article><article><strong>{t.network}</strong><p>{plan.goalFrame.safety}</p></article></div><ul>{plan.limitations.map((item) => <li key={item}>{item}</li>)}</ul></details>
      </article>}
    </div>

    {!turns.length && <div className="agent-starter-grid">{t.examples.map(([title, prompt]) => <button type="button" key={title} onClick={() => { setGoal(prompt); inputRef.current?.focus(); }}><span>↗</span><strong>{title}</strong><small>{prompt}</small></button>)}</div>}
    <div className="agent-composer"><textarea ref={inputRef} value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder={t.placeholder} rows={3} maxLength={20_000} />{voice === "unavailable" && <small className="agent-voice-boundary" role="status">ⓘ {t.voiceUnavailable}</small>}<div><span>◉ {t.private}</span><button type="button" onClick={() => void beginVoice()} disabled={voice === "listening"}>{voice === "listening" ? t.listening : `◌ ${t.voice}`}</button><button type="button" className="primary-button" onClick={submit} disabled={!goal.trim() || busy}>{busy ? t.thinking : t.send} ↑</button></div></div>

    <details className="agent-utilities"><summary>{t.utilities}<span>+</span></summary><div><section><label><span>{t.find}</span><input value={utilityQuery} onChange={(event) => setUtilityQuery(event.target.value)} placeholder={t.findPlaceholder} /></label>{utilityResults.map((result) => <Link href={toolPath(locale, result.tool.slug)} key={result.tool.slug}><strong>{result.tool.title[locale]}</strong><small>{result.tool.short[locale]}</small><span>→</span></Link>)}</section><section><label><span>{t.error}</span><textarea value={errorQuery} onChange={(event) => setErrorQuery(event.target.value)} placeholder={t.errorPlaceholder} rows={4} maxLength={30_000} /></label>{errorResult && <div className="agent-mini-error"><strong>{errorResult.title}</strong><p>{errorResult.explanation}</p><ol>{errorResult.actions.slice(0, 3).map((action) => <li key={action}>{action}</li>)}</ol></div>}</section></div></details>
  </section>;
}
