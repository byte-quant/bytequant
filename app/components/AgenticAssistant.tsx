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
import { WORKSPACE_AGENT_GOAL_KEY, WORKSPACE_AGENT_PLAN_KEY } from "../lib/workspace-handoff";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { categories, tools } from "../lib/tools";

type Mode = "plan" | "search" | "error";
type VoiceState = "idle" | "listening" | "unsupported" | "unavailable" | "denied";
type AgentTurn = { goal: string; response: string; tools: string[]; createdAt: number };

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
const historyKey = "bytequant:local-agent-conversation:v2";

const memoryCopy = {
  tr: { title: "Bu sekmedeki konuşma belleği", body: "Son 20 hedef, yanıt özeti ve seçilen araçlar tutulur; “az önceki akışı…” gibi devam cümleleri önceki planı gerçekten bağlama alır.", clear: "Belleği temizle", empty: "İlk planınızdan sonra konuşma izi burada görünecek.", recent: "Son hedef", follow: "Şimdi ne yapmak istersiniz?", options: ["Az önceki akışı güvenlik açısından kontrol et", "Sonucu paylaşmaya hazır hale getir", "Bu planı daha az adımla sadeleştir"] },
  en: { title: "Conversation memory in this tab", body: "The last 20 goals, response summaries, and selected tools are retained, so follow-ups such as “review the flow we just made” use the previous plan as real context.", clear: "Clear memory", empty: "Your conversation trail appears here after the first plan.", recent: "Latest goal", follow: "What would you like to do next?", options: ["Check the previous flow for privacy risks", "Prepare the result for safe sharing", "Simplify this plan into fewer steps"] },
  de: { title: "Gesprächsgedächtnis in diesem Tab", body: "Die letzten 20 Ziele, Antwortzusammenfassungen und Werkzeuge bleiben erhalten, damit Folgefragen den vorigen Plan als echten Kontext nutzen.", clear: "Gedächtnis leeren", empty: "Nach dem ersten Plan erscheint hier der Gesprächsverlauf.", recent: "Letztes Ziel", follow: "Wie möchten Sie fortfahren?", options: ["Vorigen Ablauf auf Datenschutzrisiken prüfen", "Ergebnis zum sicheren Teilen vorbereiten", "Diesen Plan auf weniger Schritte kürzen"] },
  zh: { title: "当前标签页的对话记忆", body: "保留最近 20 个目标、回答摘要与所选工具，使后续指令真正以上一个计划为语境。", clear: "清除记忆", empty: "生成第一个计划后，这里会显示对话轨迹。", recent: "最近目标", follow: "接下来想做什么？", options: ["检查刚才流程的隐私风险", "把结果整理为可安全分享", "把计划简化为更少步骤"] },
} as const;

const experienceCopy = {
  tr: { start: "Bir hedef seçin veya kendi cümlenizi yazın", startBody: "Teknik terim bilmeniz gerekmez. Sonucu tarif edin; Ajan uygun araçları ve güvenli sırayı önersin.", examples: [["Kişisel veriyi temizle", "CSV dosyamdaki kişisel verileri maskele ve paylaşılabilir JSON hazırla"], ["JSON teslimini kontrol et", "JSON'u biçimlendir, şemaya göre denetle ve sürümleri karşılaştır"], ["PDF işini tamamla", "PDF dosyalarını birleştir, sayfaları kontrol et ve indir"], ["Promptu güvenli hale getir", "Sistem promptunu netlik, persona tutarlılığı ve enjeksiyon riski açısından kontrol et"]], strong: "Güçlü eşleşme", review: "Bir ayrıntı daha gerekli", clarify: "Daha iyi plan için kısa bir ayrıntı ekleyin", next: "Güvenli sonraki adımlar", history: "Son konuşmalar" },
  en: { start: "Choose an outcome or write it in your own words", startBody: "No technical vocabulary is required. Describe the result and the Agent will suggest suitable tools and a safe order.", examples: [["Clean personal data", "Mask personal data in my CSV and prepare shareable JSON"], ["Check a JSON delivery", "Format JSON, validate it against a schema, and compare versions"], ["Finish a PDF task", "Merge PDF files, review the pages, and download the result"], ["Make a prompt safer", "Review a system prompt for clarity, persona consistency, and injection risk"]], strong: "Strong match", review: "One more detail needed", clarify: "Add one short detail for a better plan", next: "Safe next steps", history: "Recent conversation" },
  de: { start: "Ziel wählen oder in eigenen Worten beschreiben", startBody: "Technische Begriffe sind nicht nötig. Beschreiben Sie das Ergebnis; der Agent schlägt Werkzeuge und eine sichere Reihenfolge vor.", examples: [["Personendaten bereinigen", "Personendaten in meiner CSV maskieren und teilbares JSON erstellen"], ["JSON-Ausgabe prüfen", "JSON formatieren, per Schema prüfen und Versionen vergleichen"], ["PDF-Aufgabe erledigen", "PDF-Dateien zusammenführen, Seiten prüfen und Ergebnis laden"], ["Prompt sicherer machen", "System-Prompt auf Klarheit, Persona-Konsistenz und Injection-Risiko prüfen"]], strong: "Starker Treffer", review: "Eine Angabe fehlt noch", clarify: "Für einen besseren Plan kurz ergänzen", next: "Sichere nächste Schritte", history: "Letzte Unterhaltung" },
  zh: { start: "选择目标，或用自己的话描述", startBody: "无需技术术语。描述想要的结果，助手会推荐合适工具与安全顺序。", examples: [["清理个人数据", "遮蔽 CSV 中的个人数据并生成可分享的 JSON"], ["检查 JSON 交付", "格式化 JSON、按 Schema 验证并比较版本"], ["完成 PDF 任务", "合并 PDF、检查页面并下载结果"], ["让提示词更安全", "检查系统提示词的清晰度、角色一致性与注入风险"]], strong: "匹配度高", review: "还需一个细节", clarify: "补充一个简短信息以优化计划", next: "安全的后续步骤", history: "最近对话" },
} as const;

const conversationUi = {
  tr: { welcome: "Merhaba, ben ByteQuant’ın cihazınızda çalışan akış yardımcısıyım.", welcomeBody: "Bana sonucu anlatın; teknik araç adlarını bilmeniz gerekmez. Önce ihtiyacı netleştirir, sonra çalıştırabileceğiniz güvenli bir yol öneririm.", you: "Siz", agent: "Yerel Ajan", follow: "Aynı konuşmada devam edin", fresh: "Yeni konuşma", context: "Bağlam kullanıldı", private: "Bu sohbet yalnızca bu sekmede", placeholder: "Örn. Az önceki akışı iki adıma indir ve sonucu paylaşmaya hazırla" },
  en: { welcome: "Hi, I’m ByteQuant’s on-device workflow assistant.", welcomeBody: "Tell me the outcome; you do not need to know tool names. I will clarify the need first, then suggest a safe path you can run.", you: "You", agent: "Local Agent", follow: "Continue the same conversation", fresh: "New conversation", context: "Context used", private: "This conversation stays in this tab", placeholder: "Example: Reduce the previous flow to two steps and prepare it for sharing" },
  de: { welcome: "Hallo, ich bin der lokale Ablauf-Assistent von ByteQuant.", welcomeBody: "Beschreiben Sie das Ergebnis; Werkzeugnamen sind nicht nötig. Ich kläre zuerst den Bedarf und schlage dann einen sicheren, ausführbaren Weg vor.", you: "Sie", agent: "Lokaler Agent", follow: "Im selben Gespräch fortfahren", fresh: "Neues Gespräch", context: "Kontext verwendet", private: "Dieses Gespräch bleibt in diesem Tab", placeholder: "Beispiel: Vorigen Ablauf auf zwei Schritte kürzen und zum Teilen vorbereiten" },
  zh: { welcome: "您好，我是 ByteQuant 的设备端流程助手。", welcomeBody: "只需说明想要的结果，无需知道工具名称。我会先澄清需求，再给出由您执行的安全路径。", you: "您", agent: "本地助手", follow: "继续当前对话", fresh: "新对话", context: "已使用语境", private: "此对话仅保留在当前标签页", placeholder: "例如：把刚才的流程缩减为两步，并整理为可分享结果" },
} as const;

const specialistCopy = {
  tr: { title: "Yerel uzman kontrolleri", body: "Üç bağımsız kural rolü aynı planı farklı risklerle inceler; bunlar ayrı LLM'ler değildir.", planner: "Akış mimarı", plannerBody: "Araç sırasını, veri aktarımını ve durdurma koşullarını kontrol etti.", privacy: "Gizlilik gözden geçireni", privacyBody: "Hassas veri, paylaşım ve dosya seçimi sınırlarını plana ekledi.", qa: "Teslim kalite kontrolü", qaBody: "Başarı ölçütü, geri alma ve bağımsız doğrulama adımlarını kontrol etti." },
  en: { title: "Local specialist checks", body: "Three independent rule roles inspect the same plan from different risk angles; they are not separate LLMs.", planner: "Workflow architect", plannerBody: "Checked tool order, data handoffs, and stop conditions.", privacy: "Privacy reviewer", privacyBody: "Added boundaries for sensitive data, sharing, and file selection.", qa: "Delivery QA", qaBody: "Checked acceptance evidence, rollback, and independent verification." },
  de: { title: "Lokale Fachprüfungen", body: "Drei unabhängige Regelrollen prüfen denselben Plan aus unterschiedlichen Risikoperspektiven; es sind keine separaten LLMs.", planner: "Ablaufarchitekt", plannerBody: "Werkzeugreihenfolge, Datenübergaben und Abbruchbedingungen geprüft.", privacy: "Datenschutzprüfung", privacyBody: "Grenzen für sensible Daten, Teilen und Dateiauswahl ergänzt.", qa: "Übergabe-Qualität", qaBody: "Abnahmenachweis, Rücknahme und unabhängige Prüfung kontrolliert." },
  zh: { title: "本地专家检查", body: "三个独立规则角色从不同风险角度检查同一计划；它们并非独立 LLM。", planner: "工作流架构", plannerBody: "检查工具顺序、数据交接与停止条件。", privacy: "隐私审核", privacyBody: "补充敏感数据、分享与文件选择边界。", qa: "交付质量", qaBody: "检查验收证据、回滚与独立核验步骤。" },
} as const;

function copy(locale: Locale) {
  return {
    tr: {
      plan: "Akış planla", search: "Semantik araç ara", error: "Hatayı açıkla", goal: "Hedefinizi doğal dille yazın",
      goalHint: "Örn. CSV dosyamdaki kişisel verileri maskele, JSON'a dönüştür ve indir.", build: "Yerel plan oluştur",
      voice: "Cihaz içi sesle yaz", voiceListening: "Dinleniyor…", voiceUnavailable: "Bu tarayıcıda doğrulanmış cihaz içi konuşma tanıma yok; ses uzak servise gönderilmedi.",
      model: "Yerel hibrit karar modeli", modelDetail: "Sürüm kontrollü semantik puanlama + açıklanabilir plan kuralları. Ağ isteği, uzak model ve gizli düşünce zinciri yok.",
      transparency: "Karar özeti", confidence: "Plan güveni", extracted: "Çıkarılan parametreler", signals: "Kullanılan sinyaller", limits: "Sınırlar", frame: "Ajanın hedef çerçevesi", reviewTitle: "Planın kendi kontrolü", outcome: "Sonuç", inputFrame: "Girdi", delivery: "Teslim", safety: "Güvenlik",
      start: "İlk adımı aç", continue: "Adımı aç", file: "Dosya seçimi gerekli", previous: "Önceki çıktıyı devralır", goalInput: "Hedef metnini kullanır",
      searchPlaceholder: "Ne yapmak istiyorsunuz? Örn. güvenlik başlıklarını denetle", results: "Semantik eşleşmeler", noResult: "Yeterli eşleşme bulunamadı.", open: "Aracı aç",
      errorPlaceholder: "Kişisel veri ve sırları çıkardıktan sonra hata mesajını yapıştırın…", explain: "Hatayı yerelde açıkla", actions: "Önerilen kontroller", suggested: "İlgili araçlar",
      session: "Plan ve kısa konuşma belleği yalnızca bu sekmenin sessionStorage alanında tutulur; araç girdileri localStorage'a yazılmaz.", workstation: "Planı İş İstasyonuna aktar", workstationHint: "Seçilen araçlar, sıraları ve hedef tek tıkla görsel düğümlere dönüştürülür.", speak: "Yanıtı seslendir", stop: "Sesi durdur", answer: "Ajanın önerisi", flow: "Plan akışı", alternatives: "Desteklenmeyen biçimler için yakın alternatifler", planning: "Plan hazırlanıyor…",
    },
    en: {
      plan: "Plan workflow", search: "Semantic tool search", error: "Explain an error", goal: "Describe your goal in natural language",
      goalHint: "Example: Mask personal data in my CSV, convert it to JSON, and download it.", build: "Create local plan",
      voice: "Type with on-device voice", voiceListening: "Listening…", voiceUnavailable: "Verified on-device speech recognition is unavailable in this browser; no audio was sent to a remote service.",
      model: "Local hybrid decision model", modelDetail: "Versioned semantic scoring plus explainable planning rules. No network request, remote model, or hidden chain-of-thought.",
      transparency: "Decision summary", confidence: "Plan confidence", extracted: "Extracted parameters", signals: "Signals used", limits: "Limits", frame: "Agent goal frame", reviewTitle: "Plan self-check", outcome: "Outcome", inputFrame: "Input", delivery: "Delivery", safety: "Safety",
      start: "Open first step", continue: "Open step", file: "File selection required", previous: "Uses previous output", goalInput: "Uses goal text",
      searchPlaceholder: "What do you need? Example: audit security headers", results: "Semantic matches", noResult: "No strong match was found.", open: "Open tool",
      errorPlaceholder: "Remove personal data and secrets, then paste the error message…", explain: "Explain locally", actions: "Suggested checks", suggested: "Related tools",
      session: "The plan and short conversation memory stay only in this tab's sessionStorage; tool input is never written to localStorage.", workstation: "Send plan to Workstation", workstationHint: "Turn the selected tools, order, and goal into visual nodes with one click.", speak: "Read response aloud", stop: "Stop voice", answer: "Agent recommendation", flow: "Plan flow", alternatives: "Closest alternatives for unsupported formats", planning: "Building the plan…",
    },
    de: {
      plan: "Ablauf planen", search: "Semantisch suchen", error: "Fehler erklären", goal: "Ziel in natürlicher Sprache beschreiben",
      goalHint: "Beispiel: Personendaten in CSV maskieren, in JSON umwandeln und herunterladen.", build: "Lokalen Plan erstellen",
      voice: "Mit lokaler Spracheingabe", voiceListening: "Hört zu…", voiceUnavailable: "Verifizierte lokale Spracherkennung ist nicht verfügbar; Audio wurde an keinen Remote-Dienst gesendet.",
      model: "Lokales hybrides Entscheidungsmodell", modelDetail: "Versionierte semantische Bewertung plus nachvollziehbare Planregeln. Kein Netzwerk, Remote-Modell oder verborgene Gedankenkette.",
      transparency: "Entscheidungsübersicht", confidence: "Plansicherheit", extracted: "Extrahierte Parameter", signals: "Verwendete Signale", limits: "Grenzen", frame: "Zielrahmen des Agenten", reviewTitle: "Plan-Selbstprüfung", outcome: "Ergebnis", inputFrame: "Eingabe", delivery: "Ausgabe", safety: "Sicherheit",
      start: "Ersten Schritt öffnen", continue: "Schritt öffnen", file: "Dateiauswahl erforderlich", previous: "Übernimmt vorherige Ausgabe", goalInput: "Verwendet Zieltext",
      searchPlaceholder: "Was möchten Sie tun? Beispiel: Sicherheitsheader prüfen", results: "Semantische Treffer", noResult: "Kein starker Treffer gefunden.", open: "Werkzeug öffnen",
      errorPlaceholder: "Personendaten und Geheimnisse entfernen, dann Fehlermeldung einfügen…", explain: "Lokal erklären", actions: "Empfohlene Prüfungen", suggested: "Passende Werkzeuge",
      session: "Plan und kurzes Gesprächsgedächtnis bleiben nur im sessionStorage dieses Tabs; Werkzeugeingaben gelangen nie in localStorage.", workstation: "Plan an Workstation übergeben", workstationHint: "Ausgewählte Werkzeuge, Reihenfolge und Ziel mit einem Klick in visuelle Knoten umwandeln.", speak: "Antwort vorlesen", stop: "Stimme stoppen", answer: "Empfehlung des Agenten", flow: "Planablauf", alternatives: "Nahe Alternativen für nicht unterstützte Formate", planning: "Plan wird erstellt…",
    },
    zh: {
      plan: "规划流程", search: "语义搜索工具", error: "解释错误", goal: "用自然语言描述目标",
      goalHint: "例如：遮蔽 CSV 中的个人数据，转换为 JSON 并下载。", build: "创建本地计划",
      voice: "使用设备端语音输入", voiceListening: "正在聆听…", voiceUnavailable: "此浏览器没有可验证的设备端语音识别；音频未发送到远程服务。",
      model: "本地混合决策模型", modelDetail: "版本化语义评分与可解释规划规则；无网络请求、远程模型或隐藏思维链。",
      transparency: "决策摘要", confidence: "计划置信度", extracted: "提取的参数", signals: "使用的信号", limits: "限制", frame: "助手目标框架", reviewTitle: "计划自检", outcome: "结果", inputFrame: "输入", delivery: "交付", safety: "安全",
      start: "打开第一步", continue: "打开步骤", file: "需要手动选择文件", previous: "接收上一步输出", goalInput: "使用目标文本",
      searchPlaceholder: "您想做什么？例如：审计安全响应头", results: "语义匹配", noResult: "未找到足够强的匹配。", open: "打开工具",
      errorPlaceholder: "移除个人数据与秘密后粘贴错误消息…", explain: "在本地解释", actions: "建议检查", suggested: "相关工具",
      session: "计划与简短对话记忆只保留在当前标签页的 sessionStorage 中；工具输入不会写入 localStorage。", workstation: "把计划发送到工作站", workstationHint: "一键把所选工具、顺序与目标转换为可视化节点。", speak: "朗读回答", stop: "停止朗读", answer: "助手建议", flow: "计划流程", alternatives: "不支持格式的相近替代工具", planning: "正在生成计划…",
    },
  }[locale];
}

export function AgenticAssistant({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const conversation = conversationUi[locale];
  const [mode, setMode] = useState<Mode>("plan");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<AgentPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [planning, setPlanning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const searchResults = useMemo(() => semanticToolSearch(searchQuery, tools, locale, 8), [searchQuery, locale]);
  const errorResult = useMemo(() => errorText.trim() ? translateAgentError(errorText, locale) : null, [errorText, locale]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null; recognition.onerror = null; recognition.onend = null;
      try { recognition.stop(); } catch { /* recognition may already be stopped */ }
      recognitionRef.current = null;
    }
    window.speechSynthesis?.cancel();
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
      try {
        const parsed: unknown = JSON.parse(sessionStorage.getItem(historyKey) ?? "[]");
        if (Array.isArray(parsed)) setTurns(parsed.filter((item): item is AgentTurn => Boolean(item) && typeof item === "object" && typeof (item as AgentTurn).goal === "string" && typeof (item as AgentTurn).response === "string" && Array.isArray((item as AgentTurn).tools) && Number.isFinite((item as AgentTurn).createdAt)).slice(-20));
      } catch { /* conversation memory is optional */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const makePlan = () => {
    if (!goal.trim()) return;
    setPlanning(true);
    window.setTimeout(() => {
      const nextPlan = createAgentPlan(goal, tools, locale, plan);
      const nextTurns = [...turns, { goal: nextPlan.goal, response: nextPlan.response, tools: nextPlan.steps.map((step) => step.title), createdAt: Date.now() }].slice(-20);
      setPlan(nextPlan); setTurns(nextTurns); setPlanning(false);
      try {
        sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan: nextPlan, currentStep: 0, stepOutputs: {}, completedStepIds: [] }));
        sessionStorage.setItem(historyKey, JSON.stringify(nextTurns));
      } catch { /* session quota or privacy mode: UI still works */ }
    }, 0);
  };

  const speakPlan = () => {
    if (!plan || !("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(plan.response);
    utterance.lang = languageTags[locale]; utterance.rate = 1; utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setSpeaking(true);
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
      <section className="agent-chat-timeline" aria-label={memoryCopy[locale].title}>
        <header><div><span className="agent-status-dot" /><strong>{conversation.agent}</strong><small>{conversation.private}</small></div>{turns.length > 0 && <button type="button" onClick={() => { setTurns([]); setPlan(null); setGoal(""); try { sessionStorage.removeItem(historyKey); sessionStorage.removeItem(AGENT_SESSION_KEY); } catch { /* optional session memory */ } inputRef.current?.focus(); }}>{conversation.fresh}</button>}</header>
        {turns.length === 0 ? <div className="agent-welcome-message"><span className="agent-avatar" aria-hidden="true">BQ</span><div><strong>{conversation.welcome}</strong><p>{conversation.welcomeBody}</p></div></div> : <ol>{turns.slice(-4).map((turn) => <li key={`${turn.createdAt}-${turn.goal}`}><div className="agent-chat-user"><small>{conversation.you}</small><p>{turn.goal}</p></div><div className="agent-chat-assistant"><span className="agent-avatar" aria-hidden="true">BQ</span><div><small>{conversation.agent}</small><p>{turn.response}</p><span>{turn.tools.join(" → ")}</span></div></div></li>)}</ol>}
      </section>
      {turns.length === 0 && <section className="agent-starters" aria-labelledby="agent-starters-title"><div><span className="kicker">START HERE</span><h2 id="agent-starters-title">{experienceCopy[locale].start}</h2><p>{experienceCopy[locale].startBody}</p></div><div>{experienceCopy[locale].examples.map(([title, prompt]) => <button type="button" key={title} onClick={() => { setGoal(prompt); setPlan(null); inputRef.current?.focus(); }}><span>→</span><strong>{title}</strong><small>{prompt}</small></button>)}</div></section>}
      <section className="agent-input-card">
        <label><span>{turns.length ? conversation.follow : t.goal}</span><textarea ref={inputRef} value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && goal.trim() && !planning) { event.preventDefault(); makePlan(); } }} placeholder={turns.length ? conversation.placeholder : t.goalHint} maxLength={20_000} rows={6} /></label>
        <div className="agent-input-actions"><button type="button" className="secondary-button" onClick={beginVoice} disabled={voiceState === "listening"}>{voiceState === "listening" ? t.voiceListening : t.voice}</button><button type="button" className="primary-button" onClick={makePlan} disabled={!goal.trim() || planning}>{planning ? t.planning : t.build}<span>→</span></button></div>
        {(["unsupported", "unavailable", "denied"] as VoiceState[]).includes(voiceState) && <p className="agent-voice-note" role="status">{t.voiceUnavailable}</p>}
        <small>{t.session}</small>
      </section>
      {plan && <section className="agent-plan" aria-live="polite">
        <div className="agent-conversation"><span className="agent-avatar" aria-hidden="true">BQ</span><div><small>{t.answer}</small><p>{plan.response}</p><div className="agent-conversation-meta"><span>{plan.conversation.intentSummary}</span>{plan.conversation.isFollowUp && <span>↻ {conversation.context}</span>}</div><small>{plan.conversation.contextNote}</small><button type="button" onClick={speakPlan}>{speaking ? t.stop : t.speak}</button></div></div>
        <section className="agent-specialists"><header><div><strong>{specialistCopy[locale].title}</strong><small>{specialistCopy[locale].body}</small></div><span>3/3</span></header><div><article><span>01</span><strong>{specialistCopy[locale].planner}</strong><p>{specialistCopy[locale].plannerBody}</p></article><article><span>02</span><strong>{specialistCopy[locale].privacy}</strong><p>{specialistCopy[locale].privacyBody}</p></article><article><span>03</span><strong>{specialistCopy[locale].qa}</strong><p>{specialistCopy[locale].qaBody}</p></article></div></section>
        <div className={`agent-match-quality quality-${plan.matchQuality}`}><span>{plan.matchQuality === "strong" ? "✓" : "?"}</span><strong>{plan.matchQuality === "strong" ? experienceCopy[locale].strong : experienceCopy[locale].review}</strong><small>{Math.round(plan.confidence * 100)}% {t.confidence.toLocaleLowerCase(languageTags[locale])}</small></div>
        <div className="agent-goal-frame"><header><span>◎</span><strong>{t.frame}</strong></header><dl><div><dt>{t.outcome}</dt><dd>{plan.goalFrame.outcome}</dd></div><div><dt>{t.inputFrame}</dt><dd>{plan.goalFrame.input}</dd></div><div><dt>{t.delivery}</dt><dd>{plan.goalFrame.delivery}</dd></div><div><dt>{t.safety}</dt><dd>{plan.goalFrame.safety}</dd></div></dl></div>
        {plan.clarifyingQuestions.length > 0 && <div className="agent-clarifying"><strong>{experienceCopy[locale].clarify}</strong><div>{plan.clarifyingQuestions.map((question) => <button type="button" key={question} onClick={() => { setGoal(`${goal.trim()}\n${question}: `); document.querySelector<HTMLTextAreaElement>(".agent-input-card textarea")?.focus(); }}>{question}</button>)}</div></div>}
        <div className="agent-plan-summary"><span>{t.confidence}<strong>{Math.round(plan.confidence * 100)}%</strong></span><span>{plan.steps.length}<strong>{locale === "zh" ? "个步骤" : locale === "de" ? " Schritte" : locale === "tr" ? " adım" : " steps"}</strong></span><span>0<strong>{locale === "zh" ? " 次网络请求" : locale === "de" ? " Netzaufrufe" : locale === "tr" ? " ağ isteği" : " network calls"}</strong></span></div>
        <div className="agent-flow-preview" aria-label={t.flow}><strong>{t.flow}</strong><div>{plan.steps.map((step, index) => <span key={step.id}><i>{index + 1}</i><b>{step.title}</b>{index < plan.steps.length - 1 && <em aria-hidden="true">→</em>}</span>)}</div></div>
        <Link className="agent-workstation-link" href={pathFor(locale, "workstation")} onClick={() => { try { sessionStorage.setItem(WORKSPACE_AGENT_GOAL_KEY, plan.goal); sessionStorage.setItem(WORKSPACE_AGENT_PLAN_KEY, JSON.stringify(plan)); } catch { /* workstation can still be opened without handoff */ } }}><span><strong>{t.workstation}</strong><small>{t.workstationHint}</small></span><b>IDE →</b></Link>
        <ol className="agent-step-list">{plan.steps.map((step, index) => <li key={step.id}><span className="agent-step-number">{String(index + 1).padStart(2, "0")}</span><div><div className="agent-step-title"><strong>{step.title}</strong><small>{step.requiresFile ? t.file : step.inputMode === "previous" ? t.previous : t.goalInput}</small></div><p>{step.reason}</p>{step.parameterHints.length > 0 && <div className="agent-hints">{step.parameterHints.map((hint) => <span key={hint}>{hint}</span>)}</div>}</div><Link href={toolPath(locale, step.toolSlug)} onClick={() => { try { const existing = readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY)); sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify(existing?.plan.goal === plan.goal ? { ...existing, currentStep: index } : { plan, currentStep: index, stepOutputs: {}, completedStepIds: [] })); } catch { /* continue without bridge */ } }}>{index === 0 ? t.start : t.continue} →</Link></li>)}</ol>
        <div className="agent-next-actions"><strong>{experienceCopy[locale].next}</strong><ol>{plan.nextActions.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ol></div>
        <div className="agent-plan-review"><strong>{t.reviewTitle}</strong><ul>{plan.planReview.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul></div>
        <details className="agent-reasoning"><summary>{t.transparency}<span>+</span></summary><div><h3>{t.signals}</h3><ul>{plan.signals.map((item) => <li key={item}>{item}</li>)}</ul>{plan.extracted.length > 0 && <><h3>{t.extracted}</h3><dl>{plan.extracted.map((item, index) => <div key={`${item.kind}-${index}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></>}<h3>{t.limits}</h3><ul>{plan.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></details>
        {plan.alternativeSlugs.length > 0 && <div className="agent-alternatives"><strong>{t.alternatives}</strong>{plan.alternativeSlugs.map((slug) => { const tool = tools.find((item) => item.slug === slug); return tool ? <Link key={slug} href={toolPath(locale, slug)}>{tool.title[locale]} →</Link> : null; })}</div>}
        <div className="agent-followups"><strong>{memoryCopy[locale].follow}</strong><div>{plan.conversation.suggestedReplies.map((option) => <button type="button" key={option} onClick={() => { setGoal(option); inputRef.current?.focus(); }}>{option}</button>)}</div></div>
      </section>}
      <details className="agent-memory"><summary><span>{turns.length}/20</span><strong id="agent-memory-title">{memoryCopy[locale].title}</strong><b>+</b></summary><div className="agent-memory-content"><p>{memoryCopy[locale].body}</p><button type="button" onClick={() => { setTurns([]); try { sessionStorage.removeItem(historyKey); } catch { /* memory is optional */ } }}>{memoryCopy[locale].clear}</button>{turns.length ? <><strong className="agent-history-label">{experienceCopy[locale].history}</strong><ol className="agent-history-preview">{turns.slice(-3).map((turn) => <li key={`${turn.createdAt}-${turn.goal}`}><span>{new Date(turn.createdAt).toLocaleTimeString(languageTags[locale], { hour: "2-digit", minute: "2-digit" })}</span><strong>{turn.goal}</strong><small>{turn.tools.join(" → ")}</small></li>)}</ol><details><summary>{memoryCopy[locale].recent}: {turns.at(-1)?.goal}</summary><ol>{turns.map((turn) => <li key={`${turn.createdAt}-${turn.goal}`}><span>{new Date(turn.createdAt).toLocaleTimeString(languageTags[locale], { hour: "2-digit", minute: "2-digit" })}</span><strong>{turn.goal}</strong><small>{turn.tools.join(" → ")}</small></li>)}</ol></details></> : <small>{memoryCopy[locale].empty}</small>}</div></details>
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
