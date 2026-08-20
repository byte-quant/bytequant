"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { canAutomatePlan, runAgentAutomation, type AgentAutomationResult } from "../lib/agent-automation";
import { AGENT_SESSION_KEY, AGENT_VERSION, createAgentPlan, extractAgentPayload, prepareAgentInput, readAgentSession, semanticToolSearch, translateAgentError, type AgentPlan } from "../lib/agent-core";
import { AGENT_AUTO_PREPARE_KEY } from "../lib/agent-session";
import { acquireLocalAIEngine, buildLocalAIMessages, compactLocalAIConversationHistory, createFastConversationResponse, disposePooledLocalAIEngine, explainLocalAIError, inspectLocalAIEnvironment, isLikelyWorkflowRequest, LOCAL_AI_MODEL_ID, LOCAL_AI_PROFILES, readLocalAIAttachmentFile, readLocalAIConversationHistory, selectLocalAIConversationContext, streamLocalAI, supportsLocalAI, type LocalAIAttachment, type LocalAIConversationTurn, type LocalAIEnvironment, type LocalAILease, type LocalAIProfileId } from "../lib/local-ai";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { publicTools as tools } from "../lib/tools";
import { detectVisualIntent, VISUAL_MAX_FILE_BYTES } from "../lib/visual-studio";
import { WORKSPACE_AGENT_GOAL_KEY, WORKSPACE_AGENT_INPUT_KEY, WORKSPACE_AGENT_PLAN_KEY } from "../lib/workspace-handoff";
import { AgentVisualStudioLoader } from "./AgentVisualStudioLoader";

type Turn = LocalAIConversationTurn;
type VoiceState = "idle" | "listening" | "unavailable";
type AIStatus = "idle" | "unsupported" | "loading" | "ready" | "error";
type LocalSpeechRecognition = { lang: string; continuous: boolean; interimResults: boolean; processLocally: boolean; start(): void; stop(): void; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
type LocalSpeechRecognitionConstructor = { new(): LocalSpeechRecognition; available?: (options: { langs: string[]; processLocally: boolean }) => Promise<string> };

const tags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const historyKey = (locale: Locale) => `bytequant:local-agent-conversation:v6:${locale}`;
const localAIOptInKey = "bytequant:local-agent:ai-opt-in:v2";
const activeLeaseIdleMs = 90_000;

const ui = {
  tr: {
    hello: "Merhaba, ben ByteQuant AI.", helloBody: "Sonucu günlük dille anlatın. Gerekirse önce tek bir netleştirme sorusu sorar, sonra en kısa uygulanabilir akışı kurarım.", placeholder: "Örn. Bu CSV'deki e-postaları temizle, tekrarları kaldır ve JSON olarak hazırla", send: "Gönder", thinking: "Uygun yolu hazırlıyorum…", private: "Bu konuşma bu sekmede kalır", memory: "Bağlam açık", newChat: "Yeni sohbet", voice: "Sesle yaz", listening: "Dinliyorum…", examples: [["Veri temizle", "CSV dosyamdaki kişisel verileri maskele ve paylaşılabilir JSON hazırla"], ["Liste düzenle", "E-posta listesini temizle, tekrarları kaldır ve alfabetik sırala"], ["Hata çöz", "JSON.parse Unexpected token hatasını açıkla ve doğru aracı öner"], ["Prompt denetle", "Sistem promptumu netlik, tutarlılık ve enjeksiyon riski açısından kontrol et"]],
    plan: "Önerdiğim akış", why: "Bunu öneriyorum çünkü", start: "Aracı aç ve girdiyi hazırla", workstation: "Görsel akışa aktar", details: "Planın ayrıntıları ve sınırları", confidence: "Eşleşme", experts: "3 yerel kontrol", expertText: "Akış sırası, gizlilik ve teslim kalitesi ayrı kurallarla denetlendi.", dataRun: "Metin verisini burada çalıştır", dataIntro: "Bu planın bütün adımları metin üzerinde otomatik çalışabilir. Gerçek kişisel veri yerine önce sentetik örnek kullanın.", dataPlaceholder: "İşlenecek metin, CSV veya JSON…", run: "Planı cihazda çalıştır", running: "Çalıştırılıyor…", output: "Otomatik çalışma sonucu", copy: "Çıktıyı kopyala", copied: "Kopyalandı", unavailable: "Bu akış dosya seçimi veya görsel kontrol gerektiriyor; güvenli biçimde otomatik çalıştırılamaz.", voiceUnavailable: "Bu tarayıcı cihaz içi ses tanımayı doğrulamadı; metin alanını kullanabilirsiniz.", utilities: "Araç bul veya hata açıkla", find: "Araç bul", findPlaceholder: "Örn. güvenlik başlıklarını kontrol et", error: "Hata açıkla", errorPlaceholder: "Kişisel veri ve sırları çıkardıktan sonra hata metnini yapıştırın", clear: "Sohbeti temizle", previous: "Az önceki konuşmayı dikkate aldım.", network: "0 dış model isteği", prepared: "Girdi algılandı", autoComplete: "Desteklenen adımlar cihazınızda otomatik tamamlandı",
  },
  en: {
    hello: "Hi, I’m ByteQuant AI.", helloBody: "Describe the outcome in everyday language. I will ask one focused question when needed, then build the shortest practical workflow.", placeholder: "Example: Clean this email list, remove duplicates, and prepare JSON", send: "Send", thinking: "Building a practical path…", private: "This conversation stays in this tab", memory: "Context on", newChat: "New chat", voice: "Voice input", listening: "Listening…", examples: [["Clean data", "Mask personal data in my CSV and prepare shareable JSON"], ["Tidy a list", "Clean an email list, remove duplicates, and sort it alphabetically"], ["Fix an error", "Explain a JSON.parse Unexpected token error and recommend the right tool"], ["Review a prompt", "Check my system prompt for clarity, consistency, and injection risk"]],
    plan: "Suggested workflow", why: "Why this path", start: "Open tool and prepare input", workstation: "Send to visual workflow", details: "Plan details and limits", confidence: "Match", experts: "3 local checks", expertText: "Tool order, privacy, and delivery quality were reviewed by separate rule sets.", dataRun: "Run text data here", dataIntro: "Every step in this plan can run automatically on text. Start with synthetic data instead of real personal data.", dataPlaceholder: "Text, CSV, or JSON to process…", run: "Run plan on this device", running: "Running…", output: "Automated result", copy: "Copy output", copied: "Copied", unavailable: "This workflow needs file selection or visual review and cannot be safely automated.", voiceUnavailable: "This browser did not verify on-device speech recognition; you can keep using the text box.", utilities: "Find a tool or explain an error", find: "Find a tool", findPlaceholder: "Example: audit security headers", error: "Explain an error", errorPlaceholder: "Remove personal data and secrets before pasting an error", clear: "Clear conversation", previous: "I used the previous conversation as context.", network: "0 remote-model calls", prepared: "Input detected", autoComplete: "Supported steps finished automatically on this device",
  },
  de: {
    hello: "Hallo, ich bin ByteQuant AI.", helloBody: "Beschreiben Sie das Ergebnis in Alltagssprache. Falls nötig stelle ich eine gezielte Frage und erstelle dann den kürzesten praktischen Ablauf.", placeholder: "Beispiel: E-Mail-Liste bereinigen, Duplikate entfernen und JSON erstellen", send: "Senden", thinking: "Praktischen Weg erstellen…", private: "Dieses Gespräch bleibt im Tab", memory: "Kontext aktiv", newChat: "Neues Gespräch", voice: "Spracheingabe", listening: "Hört zu…", examples: [["Daten bereinigen", "Personendaten in CSV maskieren und teilbares JSON erstellen"], ["Liste ordnen", "E-Mail-Liste bereinigen, Duplikate entfernen und alphabetisch sortieren"], ["Fehler lösen", "JSON.parse Unexpected token erklären und passendes Werkzeug empfehlen"], ["Prompt prüfen", "System-Prompt auf Klarheit, Konsistenz und Injection-Risiko prüfen"]],
    plan: "Vorgeschlagener Ablauf", why: "Warum dieser Weg", start: "Werkzeug öffnen und Eingabe vorbereiten", workstation: "An visuellen Ablauf senden", details: "Plandetails und Grenzen", confidence: "Treffer", experts: "3 lokale Prüfungen", expertText: "Reihenfolge, Datenschutz und Ausgabequalität wurden getrennt geprüft.", dataRun: "Textdaten hier ausführen", dataIntro: "Alle Schritte dieses Plans können Text automatisch verarbeiten. Zuerst synthetische statt echter Personendaten verwenden.", dataPlaceholder: "Zu verarbeitender Text, CSV oder JSON…", run: "Plan auf diesem Gerät ausführen", running: "Wird ausgeführt…", output: "Automatisches Ergebnis", copy: "Ausgabe kopieren", copied: "Kopiert", unavailable: "Dieser Ablauf benötigt Dateiauswahl oder visuelle Prüfung und kann nicht sicher automatisiert werden.", voiceUnavailable: "Dieser Browser bestätigt keine lokale Spracherkennung; verwenden Sie bitte das Textfeld.", utilities: "Werkzeug finden oder Fehler erklären", find: "Werkzeug finden", findPlaceholder: "Beispiel: Sicherheitsheader prüfen", error: "Fehler erklären", errorPlaceholder: "Personendaten und Geheimnisse vor dem Einfügen entfernen", clear: "Gespräch löschen", previous: "Der vorherige Gesprächskontext wurde verwendet.", network: "0 Remote-Modellaufrufe", prepared: "Eingabe erkannt", autoComplete: "Unterstützte Schritte wurden lokal automatisch abgeschlossen",
  },
  zh: {
    hello: "您好，我是 ByteQuant AI。", helloBody: "请用日常语言描述结果。必要时我会先问一个明确问题，再生成最短的可执行流程。", placeholder: "例如：清理邮件列表、去重并生成 JSON", send: "发送", thinking: "正在生成可执行路径…", private: "对话仅保留在当前标签页", memory: "语境已开启", newChat: "新对话", voice: "语音输入", listening: "正在聆听…", examples: [["清理数据", "遮蔽 CSV 中的个人数据并生成可分享 JSON"], ["整理列表", "清理邮件列表、去重并按字母排序"], ["解决错误", "解释 JSON.parse Unexpected token 错误并推荐合适工具"], ["检查提示词", "检查系统提示词的清晰度、一致性与注入风险"]],
    plan: "建议流程", why: "推荐理由", start: "打开工具并准备输入", workstation: "发送到可视化流程", details: "计划详情与限制", confidence: "匹配度", experts: "3 项本地检查", expertText: "工具顺序、隐私与交付质量由独立规则检查。", dataRun: "在此运行文本数据", dataIntro: "此计划的全部步骤都可自动处理文本。请先使用合成数据，而非真实个人数据。", dataPlaceholder: "待处理文本、CSV 或 JSON…", run: "在此设备运行计划", running: "正在运行…", output: "自动运行结果", copy: "复制输出", copied: "已复制", unavailable: "此流程需要选择文件或进行视觉检查，无法安全自动运行。", voiceUnavailable: "此浏览器未确认设备端语音识别；您仍可使用文本输入框。", utilities: "查找工具或解释错误", find: "查找工具", findPlaceholder: "例如：检查安全响应头", error: "解释错误", errorPlaceholder: "粘贴前请移除个人数据和机密", clear: "清除对话", previous: "已使用之前的对话作为语境。", network: "0 次远程模型调用", prepared: "已识别输入", autoComplete: "支持的步骤已在此设备自动完成",
  },
} as const;

const assistCopy = {
  tr: { next: "Bundan sonra güvenle yapabilecekleriniz", reply: "Devam etmek için bir seçenek seçin", speak: "Yanıtı sesli oku" },
  en: { next: "Safe next steps", reply: "Choose an option to continue", speak: "Read the answer aloud" },
  de: { next: "Sichere nächste Schritte", reply: "Wählen Sie eine Option zum Fortfahren", speak: "Antwort vorlesen" },
  zh: { next: "安全的后续步骤", reply: "选择一个选项继续", speak: "朗读回答" },
} as const;

const modeCopy = {
  tr: { instant: "Anında yanıt", local: "Cihazdaki model", idle: "Kullanılmadığında belleği otomatik boşaltır", retry: "Yeniden dene" },
  en: { instant: "Instant response", local: "On-device model", idle: "Automatically frees memory when idle", retry: "Try again" },
  de: { instant: "Sofortantwort", local: "Modell auf dem Gerät", idle: "Gibt ungenutzten Speicher automatisch frei", retry: "Erneut versuchen" },
  zh: { instant: "即时回答", local: "设备端模型", idle: "闲置时自动释放内存", retry: "重试" },
} as const;

const stateCopy = {
  tr: { coverage: "Anladığım işlemler", needsInfo: "Devam etmeden önce bir ayrıntı gerekli", provisional: "Aşağıdan kısa bir yanıt seçin", completed: "adım cihazınızda tamamlandı", inherited: "Önceki yerel çıktı bu adıma aktarıldı", resultReady: "İşlem tamamlandı. Sonuç aşağıda hazır; isterseniz bir sonraki araca aktarabilir veya indirebilirsiniz." },
  en: { coverage: "Operations I understood", needsInfo: "One detail is needed before continuing", provisional: "Choose a short answer below", completed: "steps finished on this device", inherited: "The previous local result was passed into this step", resultReady: "The task is complete. Your result is ready below; you can continue with another tool or download it." },
  de: { coverage: "Verstandene Vorgänge", needsInfo: "Vor dem Fortfahren fehlt eine Angabe", provisional: "Wählen Sie unten eine kurze Antwort", completed: "Schritte wurden lokal abgeschlossen", inherited: "Das vorige lokale Ergebnis wurde an diesen Schritt übergeben", resultReady: "Der Vorgang ist abgeschlossen. Das Ergebnis steht unten bereit und kann weiterverarbeitet oder heruntergeladen werden." },
  zh: { coverage: "我理解的操作", needsInfo: "继续前还需要一项信息", provisional: "请从下方选择简短回答", completed: "个步骤已在此设备完成", inherited: "上一项本地结果已传入此步骤", resultReady: "处理已完成。结果已在下方准备好，您可以继续交给其他工具或下载。" },
} as const;

const aiCopy = {
  tr: { automatic: "ByteQuant AI · Otomatik", intro: "İsteğinizi anında anlar; cihazınızda hazır bir yerel model varsa daha doğal yanıtları otomatik kullanır.", improve: "Yanıtları güçlendir", enabled: "Gelişmiş yanıtlar hazır", loading: "Yanıt motoru bu cihazda hazırlanıyor", cancelLoad: "İptal", stop: "Durdur", stopModel: "Yerel modeli durdur", unsupported: "Bu cihaz gelişmiş yerel modeli desteklemiyor; araç planlama ve otomasyon çalışmaya devam eder.", failed: "Gelişmiş yanıt motoru başlatılamadı; ByteQuant AI kesintisiz devam ediyor.", settings: "Yanıt kalitesi ve cihaz ayarları", lite: "Hafif", liteText: "Daha az indirme, daha hızlı başlangıç", balanced: "Dengeli", balancedText: "Daha doğal ve tutarlı yanıtlar", recommended: "Bu cihaz için önerilen", cached: "Bu cihazda hazır", disclosure: "Açık kaynak Qwen3 · Apache-2.0 · cihaz içi Web Worker · uzak çıkarım yok", attach: "Dosya ekle", remove: "Dosyayı kaldır", attached: "eklendi", truncated: "güvenli sınırda kısaltıldı", fileReadFailed: "Dosya okunamadı. Metin tabanlı ve daha küçük bir dosya deneyin.", generating: "Yanıt cihazınızda üretiliyor…", download: "İlk etkinleştirme seçtiğiniz model paketini indirir. Sohbetiniz indirme isteğine veya uzak bir yapay zekâ servisine gönderilmez." },
  en: { automatic: "ByteQuant AI · Automatic", intro: "It understands the request instantly and automatically uses a cached on-device model when one is ready.", improve: "Improve responses", enabled: "Enhanced responses ready", loading: "Preparing the response engine on this device", cancelLoad: "Cancel", stop: "Stop", stopModel: "Stop local model", unsupported: "This device cannot run the enhanced local model; tool planning and automation remain available.", failed: "The enhanced response engine could not start; ByteQuant AI remains available.", settings: "Response quality and device settings", lite: "Light", liteText: "Smaller download and faster start", balanced: "Balanced", balancedText: "More natural and consistent answers", recommended: "Recommended for this device", cached: "Ready on this device", disclosure: "Open-source Qwen3 · Apache-2.0 · on-device Web Worker · no remote inference", attach: "Attach file", remove: "Remove file", attached: "attached", truncated: "shortened at the safe limit", fileReadFailed: "The file could not be read. Try a smaller text-based file.", generating: "Generating on your device…", download: "First activation downloads the selected model pack. Your conversation is not added to that download or sent to a remote AI service." },
  de: { automatic: "ByteQuant AI · Automatisch", intro: "Versteht die Anfrage sofort und nutzt automatisch ein lokal vorhandenes Modell, wenn es bereit ist.", improve: "Antworten verbessern", enabled: "Erweiterte Antworten bereit", loading: "Antwortmodul wird auf diesem Gerät vorbereitet", cancelLoad: "Abbrechen", stop: "Stoppen", stopModel: "Lokales Modell stoppen", unsupported: "Dieses Gerät unterstützt das erweiterte lokale Modell nicht; Planung und Automatisierung bleiben verfügbar.", failed: "Das erweiterte Antwortmodul konnte nicht starten; ByteQuant AI bleibt verfügbar.", settings: "Antwortqualität und Geräteeinstellungen", lite: "Leicht", liteText: "Kleinerer Download und schnellerer Start", balanced: "Ausgewogen", balancedText: "Natürlichere und konsistentere Antworten", recommended: "Für dieses Gerät empfohlen", cached: "Auf diesem Gerät bereit", disclosure: "Open-Source Qwen3 · Apache-2.0 · lokaler Web Worker · keine Remote-Inferenz", attach: "Datei anhängen", remove: "Datei entfernen", attached: "angehängt", truncated: "am sicheren Limit gekürzt", fileReadFailed: "Die Datei konnte nicht gelesen werden. Versuchen Sie eine kleinere Textdatei.", generating: "Antwort entsteht auf Ihrem Gerät…", download: "Bei der ersten Aktivierung wird das gewählte Modellpaket geladen. Das Gespräch wird weder angefügt noch an einen entfernten KI-Dienst gesendet." },
  zh: { automatic: "ByteQuant AI · 自动", intro: "立即理解请求；若设备上已有本地模型，则自动使用它生成更自然的回答。", improve: "增强回答", enabled: "增强回答已就绪", loading: "正在此设备准备回答引擎", cancelLoad: "取消", stop: "停止", stopModel: "停止本地模型", unsupported: "此设备无法运行增强本地模型；工具规划与自动化仍可使用。", failed: "增强回答引擎无法启动；ByteQuant AI 仍可继续使用。", settings: "回答质量与设备设置", lite: "轻量", liteText: "下载更小，启动更快", balanced: "均衡", balancedText: "回答更自然、更一致", recommended: "为此设备推荐", cached: "此设备已就绪", disclosure: "开源 Qwen3 · Apache-2.0 · 设备端 Web Worker · 无远程推理", attach: "添加文件", remove: "移除文件", attached: "已添加", truncated: "已按安全上限截短", fileReadFailed: "无法读取文件。请尝试更小的文本文件。", generating: "正在您的设备上生成回答…", download: "首次启用会下载所选模型包。对话不会加入下载请求，也不会发送到远程 AI 服务。" },
} as const;

const visualCopy = {
  tr: { defaultEdit: "Bu görseli düzenle", readyEdit: "Görselinizi ve talimatınızı anladım. Düzenleme stüdyosunu konuşmanın içinde hazırladım; ayarları kontrol edip işlemi başlatabilirsiniz.", readyCreate: "İsteminizi anladım. Düzenlenebilir yerel SVG taslağını hazırlamak için görsel stüdyoyu konuşmanın içinde açtım.", imageTooLarge: "Görsel 25 MB sınırını aşıyor. Daha küçük bir PNG, JPG veya WebP seçin." },
  en: { defaultEdit: "Edit this image", readyEdit: "I understood the image and instruction. Visual Studio is ready inside the conversation; review the controls and start processing.", readyCreate: "I understood the prompt. Visual Studio is open inside the conversation to create an editable local SVG draft.", imageTooLarge: "The image exceeds the 25 MB limit. Choose a smaller PNG, JPG, or WebP." },
  de: { defaultEdit: "Dieses Bild bearbeiten", readyEdit: "Bild und Anweisung wurden erkannt. Das Bildstudio ist direkt im Gespräch bereit; prüfen Sie die Regler und starten Sie die Verarbeitung.", readyCreate: "Der Prompt wurde erkannt. Das Bildstudio ist im Gespräch geöffnet und erstellt einen lokal bearbeitbaren SVG-Entwurf.", imageTooLarge: "Das Bild überschreitet 25 MB. Wählen Sie eine kleinere PNG-, JPG- oder WebP-Datei." },
  zh: { defaultEdit: "编辑这张图片", readyEdit: "我已识别图片和要求。视觉工作室已在对话中准备好；请检查设置后开始处理。", readyCreate: "我已理解提示词。视觉工作室已在对话中打开，可创建本地可编辑的 SVG 草稿。", imageTooLarge: "图片超过 25 MB 限制。请选择更小的 PNG、JPG 或 WebP。" },
} as const;

export function AgentConversation({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const assist = assistCopy[locale];
  const state = stateCopy[locale];
  const ai = aiCopy[locale];
  const modeText = modeCopy[locale];
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
  const [aiStatus, setAIStatus] = useState<AIStatus>("idle");
  const [aiProgress, setAIProgress] = useState({ progress: 0, text: "" });
  const [aiError, setAIError] = useState("");
  const [aiEnvironment, setAIEnvironment] = useState<LocalAIEnvironment | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<LocalAIProfileId>("lite");
  const [activeProfile, setActiveProfile] = useState<LocalAIProfileId | null>(null);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [streamingGoal, setStreamingGoal] = useState("");
  const [attachment, setAttachment] = useState<LocalAIAttachment | null>(null);
  const [visualFile, setVisualFile] = useState<File | null>(null);
  const [visualRequest, setVisualRequest] = useState<{ id: number; command: string; file: File | null } | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [showWorkflowPlan, setShowWorkflowPlan] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const primaryActionsRef = useRef<HTMLDivElement | null>(null);
  const prefillHandledRef = useRef(false);
  const recognitionRef = useRef<LocalSpeechRecognition | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const aiLeaseRef = useRef<LocalAILease | null>(null);
  const aiInitAbortRef = useRef<AbortController | null>(null);
  const aiLeaseIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWorkflowPlanRef = useRef<AgentPlan | null>(null);
  const generationRef = useRef(0);
  const activePromptRef = useRef("");
  const utilityResults = useMemo(() => semanticToolSearch(utilityQuery, tools, locale, 4), [locale, utilityQuery]);
  const errorResult = useMemo(() => errorQuery.trim() ? translateAgentError(errorQuery, locale) : null, [errorQuery, locale]);
  const automatable = plan ? canAutomatePlan(plan) : false;
  const aiIssue = useMemo(() => aiError ? explainLocalAIError(aiError, locale) : null, [aiError, locale]);

  const scheduleLeaseIdleRelease = useCallback(() => {
    if (aiLeaseIdleTimerRef.current !== null) clearTimeout(aiLeaseIdleTimerRef.current);
    aiLeaseIdleTimerRef.current = setTimeout(() => {
      aiLeaseIdleTimerRef.current = null;
      aiLeaseRef.current?.release();
      aiLeaseRef.current = null;
    }, activeLeaseIdleMs);
  }, []);

  const enableLocalAI = useCallback(async (profileId: LocalAIProfileId) => {
    if (aiLeaseRef.current || aiInitAbortRef.current) return;
    const capability = supportsLocalAI();
    if (!capability.supported) { setAIStatus("unsupported"); return; }
    const controller = new AbortController();
    aiInitAbortRef.current = controller;
    setAIStatus("loading"); setAIError(""); setAIProgress({ progress: 0, text: ai.loading });
    try {
      const lease = await acquireLocalAIEngine(setAIProgress, controller.signal, profileId);
      if (controller.signal.aborted) { lease.release(); return; }
      aiLeaseRef.current = lease;
      setActiveProfile(lease.profileId);
      setAIStatus("ready"); setAIProgress({ progress: 1, text: ai.enabled });
      scheduleLeaseIdleRelease();
      try { sessionStorage.setItem(localAIOptInKey, lease.profileId); } catch { /* optional warm-up preference */ }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setAIStatus("error"); setAIError(error instanceof Error ? error.message : ai.failed);
    } finally {
      if (aiInitAbortRef.current === controller) aiInitAbortRef.current = null;
    }
  }, [ai.enabled, ai.failed, ai.loading, scheduleLeaseIdleRelease]);

  useEffect(() => {
    if (prefillHandledRef.current) return;
    prefillHandledRef.current = true;
    const frame = requestAnimationFrame(() => {
      const query = new URLSearchParams(window.location.search).get("q")?.trim();
      if (query) setGoal(query.slice(0, 20_000));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const session = readAgentSession(sessionStorage.getItem(AGENT_SESSION_KEY));
        if (session) {
          const restoredPlan = session.plan.locale === locale ? session.plan : createAgentPlan(session.plan.goal, tools, locale);
          setPlan(restoredPlan);
          lastWorkflowPlanRef.current = restoredPlan;
          setPreparedInput(session.preparedInput ?? "");
          setData(session.preparedInput ?? "");
        }
        setTurns(readLocalAIConversationHistory(sessionStorage.getItem(historyKey(locale)), locale));
      } catch { /* memory is optional */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  useEffect(() => {
    let disposed = false;
    const frame = requestAnimationFrame(() => {
      void inspectLocalAIEnvironment().then((environment) => {
        if (disposed) return;
        setAIEnvironment(environment);
        setSelectedProfile(environment.recommendedProfile);
        if (!environment.supported) { setAIStatus("unsupported"); return; }
        let preferred: LocalAIProfileId | null = null;
        try {
          const stored = sessionStorage.getItem(localAIOptInKey);
          if (stored === "lite" || stored === "balanced") preferred = stored;
          else if (stored === LOCAL_AI_MODEL_ID) preferred = "lite";
        } catch { /* preference is optional */ }
        const cached = preferred && environment.cachedProfiles.includes(preferred)
          ? preferred
          : environment.cachedProfiles.includes(environment.recommendedProfile)
            ? environment.recommendedProfile
            : environment.cachedProfiles[0];
        if (cached) { setSelectedProfile(cached); void enableLocalAI(cached); }
      });
    });
    return () => { disposed = true; cancelAnimationFrame(frame); };
  }, [enableLocalAI]);

  useEffect(() => () => {
    generationRef.current += 1;
    aiInitAbortRef.current?.abort();
    aiInitAbortRef.current = null;
    if (aiLeaseIdleTimerRef.current !== null) clearTimeout(aiLeaseIdleTimerRef.current);
    aiLeaseRef.current?.engine.interruptGenerate();
    aiLeaseRef.current?.release();
    aiLeaseRef.current = null;
  }, []);

  useEffect(() => () => { try { recognitionRef.current?.stop(); } catch { /* already stopped */ } window.speechSynthesis?.cancel(); }, []);

  useEffect(() => {
    if (!plan || busy) return;
    const frame = requestAnimationFrame(() => {
      primaryActionsRef.current?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [busy, plan]);

  function disableLocalAI() {
    generationRef.current += 1;
    aiInitAbortRef.current?.abort(); aiInitAbortRef.current = null;
    if (aiLeaseIdleTimerRef.current !== null) clearTimeout(aiLeaseIdleTimerRef.current);
    aiLeaseIdleTimerRef.current = null;
    const lease = aiLeaseRef.current; aiLeaseRef.current = null;
    lease?.engine.interruptGenerate(); lease?.release();
    void disposePooledLocalAIEngine();
    try { sessionStorage.removeItem(localAIOptInKey); } catch { /* preference is optional */ }
    setActiveProfile(null); setAIStatus(supportsLocalAI().supported ? "idle" : "unsupported"); setAIProgress({ progress: 0, text: "" }); setStreamingResponse(""); setBusy(false);
  }

  function stopGeneration() {
    generationRef.current += 1; aiLeaseRef.current?.engine.interruptGenerate();
    if (activePromptRef.current) setGoal(activePromptRef.current);
    setStreamingGoal(""); setStreamingResponse(""); setBusy(false);
  }

  async function submit() {
    const text = goal.trim();
    if (!text || busy) return;
    const visualIntent = detectVisualIntent(text, Boolean(visualFile));
    if (visualIntent.kind !== "none") {
      const answer = visualIntent.kind === "create" ? visualCopy[locale].readyCreate : visualCopy[locale].readyEdit;
      const displayGoal = visualFile ? `${text}\n🖼 ${visualFile.name}` : text;
      const nextTurns = compactLocalAIConversationHistory([...turns, { locale, goal: displayGoal, answer, tools: [], time: Date.now(), mode: "fast", intent: "conversation", usedContext: false }]);
      setTurns(nextTurns); setPlan(null); setShowWorkflowPlan(false); setVisualRequest({ id: Date.now(), command: text, file: visualFile }); setVisualFile(null); setAttachment(null); setGoal(""); setAutomation(null); setAutomationError("");
      try { sessionStorage.setItem(historyKey(locale), JSON.stringify(nextTurns)); sessionStorage.removeItem(AGENT_SESSION_KEY); } catch { /* continue without optional memory */ }
      return;
    }
    const submittedAttachment = attachment;
    const displayGoal = submittedAttachment ? `${text}\n📎 ${submittedAttachment.name}` : text;
    const workflow = isLikelyWorkflowRequest(text) || Boolean(submittedAttachment);
    const runId = ++generationRef.current;
    activePromptRef.current = text; setBusy(true); setStreamingGoal(displayGoal); setStreamingResponse(""); setAutomation(null); setAutomationError(""); setGoal("");
    try {
      const next = createAgentPlan(text, tools, locale, workflow ? lastWorkflowPlanRef.current : null);
      const intent = workflow ? "workflow" : "conversation";
      const conversationContext = selectLocalAIConversationContext(turns, locale, text, intent);
      setShowWorkflowPlan(workflow);
      const extractedInput = extractAgentPayload(text);
      const inheritedInput = workflow && !extractedInput && !submittedAttachment?.text && next.conversation.isFollowUp ? automation?.output || preparedInput : "";
      const sourceInput = extractedInput || submittedAttachment?.text || inheritedInput;
      const detectedInput = workflow ? prepareAgentInput(text, next, sourceInput) : "";
      let answer = workflow ? next.response : createFastConversationResponse(locale, text, turns);
      let mode: Turn["mode"] = "fast";
      if (aiLeaseIdleTimerRef.current !== null) clearTimeout(aiLeaseIdleTimerRef.current);
      aiLeaseIdleTimerRef.current = null;
      let lease = aiLeaseRef.current;
      if (!lease && aiStatus === "ready" && activeProfile) {
        try {
          lease = await acquireLocalAIEngine(setAIProgress, undefined, activeProfile);
          if (runId !== generationRef.current) { lease.release(); return; }
          aiLeaseRef.current = lease;
        } catch (error) {
          try { sessionStorage.removeItem(localAIOptInKey); } catch { /* optional preference */ }
          setActiveProfile(null); setAIStatus("error"); setAIError(error instanceof Error ? error.message : ai.failed);
          lease = null;
        }
      }
      if (lease && aiStatus === "ready") {
        try {
          const generated = await streamLocalAI(
            lease.engine,
            buildLocalAIMessages(locale, text, next, conversationContext, workflow, submittedAttachment),
            setStreamingResponse,
            workflow ? "workflow" : "conversation",
            `${locale}:${lease.profileId}`,
          );
          if (runId !== generationRef.current) return;
          if (generated) { answer = generated; mode = "ai"; }
        } catch (error) {
          if (runId !== generationRef.current) return;
          aiLeaseRef.current = null;
          lease.release();
          await disposePooledLocalAIEngine();
          try { sessionStorage.removeItem(localAIOptInKey); } catch { /* avoid repeated failing warm-up */ }
          setActiveProfile(null); setAIStatus("error"); setAIError(error instanceof Error ? error.message : ai.failed);
        }
      }
      if (aiLeaseRef.current) scheduleLeaseIdleRelease();
      let automaticResult: AgentAutomationResult | null = null;
      if (workflow && detectedInput && canAutomatePlan(next)) {
        try {
          automaticResult = runAgentAutomation(next, detectedInput, locale);
          answer = `${answer}\n\n${state.resultReady}`;
        } catch (error) {
          const value = error as Error & { steps?: AgentAutomationResult["steps"]; output?: string };
          if (value.steps && typeof value.output === "string") automaticResult = { steps: value.steps, output: value.output };
          setAutomationError(value.message);
        }
      }
      const finalPlan = { ...next, response: answer };
      const nextTurns = compactLocalAIConversationHistory([...turns, { locale, goal: displayGoal, answer, tools: workflow ? finalPlan.steps.map((step) => step.title) : [], time: Date.now(), mode, intent, usedContext: conversationContext.length > 0 || next.conversation.isFollowUp }]);
      if (workflow) lastWorkflowPlanRef.current = finalPlan;
      setPlan(workflow ? finalPlan : null); setTurns(nextTurns); setPreparedInput(detectedInput); setData(detectedInput); setInputInherited(Boolean(inheritedInput)); setStreamingGoal(""); setStreamingResponse(""); setBusy(false); setAttachment(null);
      setAutomation(automaticResult);
      try {
        if (workflow) sessionStorage.setItem(AGENT_SESSION_KEY, JSON.stringify({ plan: finalPlan, currentStep: 0, stepOutputs: {}, completedStepIds: [], preparedInput: detectedInput || undefined }));
        else sessionStorage.removeItem(AGENT_SESSION_KEY);
        sessionStorage.setItem(historyKey(locale), JSON.stringify(nextTurns));
      } catch { /* keep working without memory */ }
    } catch (error) {
      if (runId !== generationRef.current) return;
      setAIError(error instanceof Error ? error.message : ai.failed);
      const answer = createFastConversationResponse(locale, text, turns);
      const fallbackTurn: Turn = { locale, goal: displayGoal, answer, tools: [], time: Date.now(), mode: "fast", intent: "conversation", usedContext: selectLocalAIConversationContext(turns, locale, text, "conversation").length > 0 };
      const nextTurns = compactLocalAIConversationHistory([...turns, fallbackTurn]);
      setPlan(null); setTurns(nextTurns); setStreamingGoal(""); setStreamingResponse(""); setBusy(false);
      try { sessionStorage.setItem(historyKey(locale), JSON.stringify(nextTurns)); } catch { /* keep working without memory */ }
    }
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
    window.setTimeout(() => {
      try { setAutomation(runAgentAutomation(plan, data, locale)); }
      catch (error) {
        const value = error as Error & { steps?: AgentAutomationResult["steps"]; output?: string };
        if (value.steps && typeof value.output === "string") setAutomation({ steps: value.steps, output: value.output });
        setAutomationError(value.message);
      } finally { setAutomationBusy(false); }
    });
  }

  function reset() {
    generationRef.current += 1; aiLeaseRef.current?.engine.interruptGenerate();
    setGoal(""); setPlan(null); setTurns([]); setData(""); setPreparedInput(""); setAutomation(null); setAutomationError(""); setAutomationBusy(false); setInputInherited(false); setStreamingGoal(""); setStreamingResponse(""); setAttachment(null); setVisualFile(null); setVisualRequest(null); setAttachmentError("");
    lastWorkflowPlanRef.current = null;
    try { sessionStorage.removeItem(historyKey(locale)); sessionStorage.removeItem(AGENT_SESSION_KEY); sessionStorage.removeItem(AGENT_AUTO_PREPARE_KEY); } catch { /* optional */ }
    inputRef.current?.focus();
  }

  const selectedModel = LOCAL_AI_PROFILES[selectedProfile];
  const selectedIsCached = aiEnvironment?.cachedProfiles.includes(selectedProfile) ?? false;
  const activeModelLabel = activeProfile === "balanced" ? ai.balanced : ai.lite;

  return <section className="agent-chat-app" aria-label={t.hello}>
    <header className="agent-chat-bar"><div><span className="agent-avatar">BQ</span><div><strong>{t.hello}</strong><small><i />{AGENT_VERSION} · {ai.automatic}</small></div></div><div><span>{aiStatus === "ready" ? `${ai.enabled} · ${activeModelLabel}` : turns.length ? t.memory : ai.automatic}</span><button type="button" onClick={reset}>{t.newChat}</button></div></header>
    {!turns.length && <div className="agent-capability-path" aria-label={locale === "tr" ? "Ajan çalışma biçimi" : locale === "de" ? "Arbeitsweise des Agenten" : locale === "zh" ? "助手工作方式" : "How the Agent works"}><span><b>1</b>{locale === "tr" ? "İsteği anlatın" : locale === "de" ? "Ziel beschreiben" : locale === "zh" ? "描述目标" : "Describe"}</span><i>→</i><span><b>2</b>{locale === "tr" ? "Planı görün" : locale === "de" ? "Plan prüfen" : locale === "zh" ? "查看计划" : "Review"}</span><i>→</i><span><b>3</b>{locale === "tr" ? "Onaylayın" : locale === "de" ? "Bestätigen" : locale === "zh" ? "确认执行" : "Approve"}</span></div>}

    <section className={`agent-local-ai-panel agent-ai-auto ${aiStatus}`} aria-label={ai.automatic}>
      <div><span aria-hidden="true">✦</span><div><strong>{ai.automatic}</strong><small>{aiStatus === "unsupported" ? ai.unsupported : aiStatus === "error" ? ai.failed : aiStatus === "ready" ? `${ai.enabled} · ${activeModelLabel}` : ai.intro}</small></div></div>
      {aiStatus === "loading" ? <><div className="agent-ai-progress" role="status"><span><i style={{ width: `${Math.round(aiProgress.progress * 100)}%` }} /></span><small>{Math.round(aiProgress.progress * 100)}% · {aiProgress.text || ai.loading}</small></div><button type="button" onClick={disableLocalAI}>{ai.cancelLoad}</button></> : aiStatus === "ready" ? <span className="agent-ai-ready-badge">✓ {ai.enabled}</span> : aiStatus !== "unsupported" ? <button type="button" onClick={() => void enableLocalAI(selectedProfile)}>{ai.improve}</button> : null}
      <details className="agent-ai-settings"><summary>{ai.settings}<span>+</span></summary><div>
        <div className="agent-ai-profile-grid">
          {(["lite", "balanced"] as LocalAIProfileId[]).map((profileId) => {
            const profile = LOCAL_AI_PROFILES[profileId];
            const profileLabel = profileId === "balanced" ? ai.balanced : ai.lite;
            const profileText = profileId === "balanced" ? ai.balancedText : ai.liteText;
            return <button type="button" key={profileId} className={selectedProfile === profileId ? "selected" : ""} aria-pressed={selectedProfile === profileId} disabled={aiStatus === "loading" || aiStatus === "ready"} onClick={() => setSelectedProfile(profileId)}><span><strong>{profileLabel}</strong><small>{profileText}</small></span><b>{profile.downloadLabel}</b>{aiEnvironment?.recommendedProfile === profileId && <em>{ai.recommended}</em>}{aiEnvironment?.cachedProfiles.includes(profileId) && <em>{ai.cached}</em>}</button>;
          })}
        </div>
        <p>ⓘ {ai.download} {selectedIsCached ? ai.cached : selectedModel.downloadLabel}</p>
        <small className="agent-ai-disclosure">{ai.disclosure}</small>
        {aiStatus === "ready" && <button type="button" className="agent-ai-stop-model" onClick={disableLocalAI}>{ai.stopModel}</button>}
        {aiIssue && aiStatus === "error" && <section className="agent-ai-friendly-error" role="alert"><strong>{aiIssue.title}</strong><p>{aiIssue.message}</p><small>{aiIssue.action}</small><button type="button" onClick={() => void enableLocalAI(selectedProfile)}>{modeText.retry}</button><details><summary>{locale === "tr" ? "Teknik ayrıntı" : locale === "de" ? "Technisches Detail" : locale === "zh" ? "技术详情" : "Technical detail"}</summary><code title={aiError}>{aiError.slice(0, 240)}</code></details></section>}
      </div></details>
    </section>

    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{busy ? (aiStatus === "ready" ? ai.generating : t.thinking) : turns.at(-1)?.answer ?? ""}</div>
    <div className="agent-chat-stream">
      <article className="agent-message assistant"><span className="agent-avatar">BQ</span><div><p>{t.helloBody}</p></div></article>
      {turns.slice(-6).map((turn, index) => <div className="agent-turn" key={`${turn.time}-${index}`}><article className="agent-message user"><div><p>{turn.goal}</p></div></article><article className="agent-message assistant"><span className="agent-avatar">BQ</span><div><small className={`agent-response-mode ${turn.mode === "ai" ? "local" : "instant"}`}><i />{turn.mode === "ai" ? modeText.local : modeText.instant}</small><p>{turn.answer}</p>{turn.usedContext && <small>↳ {t.previous}</small>}</div></article></div>)}
      {busy && <div className="agent-turn current"><article className="agent-message user"><div><p>{streamingGoal}</p></div></article><article className="agent-message assistant thinking"><span className="agent-avatar">BQ</span><div><p>{streamingResponse || (aiStatus === "ready" ? ai.generating : t.thinking)}</p>{!streamingResponse && <i />}</div></article></div>}

      {plan && !busy && showWorkflowPlan && <article className="agent-answer-card">
        <header><div><span>✓</span><div><small>{t.plan}</small><h2>{plan.conversation.intentSummary}</h2></div></div><strong>{Math.round(plan.confidence * 100)}%</strong></header>
        {plan.coverage.requested.length > 0 && <div className="agent-goal-coverage"><strong>{state.coverage}</strong><div>{plan.coverage.requested.map((item) => <span key={item}>✓ {item}</span>)}</div></div>}
        <div className="agent-answer-flow">{plan.steps.map((step, index) => <div key={step.id}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.reason}</p></div>{index < plan.steps.length - 1 && <i>↓</i>}</div>)}</div>
        <div className="agent-next-actions"><strong>{assist.next}</strong><ol>{plan.nextActions.slice(0, 3).map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ol></div>
        {preparedInput && <div className="agent-prepared-input"><span>✓</span><div><strong>{t.prepared}</strong><small>{preparedInput.length.toLocaleString(tags[locale])} · {automation ? `${automation.steps.filter((step) => step.status === "completed").length}/${plan.steps.length} ${state.completed}` : inputInherited ? state.inherited : plan.steps[0].title}</small></div><code>{preparedInput.slice(0, 110)}{preparedInput.length > 110 ? "…" : ""}</code></div>}
        {plan.clarifyingQuestions.length > 0 && <div className="agent-inline-questions" role="status"><strong>{state.needsInfo}</strong><p>{plan.clarifyingQuestions[0]}</p><small>{state.provisional}</small></div>}
        <div className="agent-primary-actions" ref={primaryActionsRef}>
          {plan.matchQuality === "strong" && !plan.coverage.missing.length ? <><Link className="primary-button" href={toolPath(locale, plan.steps[0].toolSlug)} onClick={() => startGuided(0)}>{t.start} →</Link>
          <Link className="secondary-button" href={pathFor(locale, "workstation")} onClick={() => { try { sessionStorage.setItem(WORKSPACE_AGENT_GOAL_KEY, plan.goal); sessionStorage.setItem(WORKSPACE_AGENT_PLAN_KEY, JSON.stringify(plan)); if (preparedInput) sessionStorage.setItem(WORKSPACE_AGENT_INPUT_KEY, preparedInput); else sessionStorage.removeItem(WORKSPACE_AGENT_INPUT_KEY); } catch { /* open without handoff */ } }}>{t.workstation} ↗</Link></> : <button type="button" className="primary-button" onClick={() => inputRef.current?.focus()}>{state.provisional} ↓</button>}
          <button type="button" className="agent-speak-button" aria-label={assist.speak} title={assist.speak} onClick={() => { if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(plan.response); utterance.lang = tags[locale]; window.speechSynthesis.speak(utterance); }}><span aria-hidden="true">🔊</span></button>
        </div>
        <div className="agent-followup-strip"><strong>{assist.reply}</strong><div>{plan.conversation.suggestedReplies.slice(0, 3).map((option) => <button type="button" key={option} onClick={() => { setGoal(option); inputRef.current?.focus(); }}>{option}</button>)}</div></div>
        {automatable ? <details className="agent-inline-run" open={Boolean(automation || automationError)}><summary><span>▶</span><strong>{t.dataRun}</strong><b>+</b></summary><div><p>{t.dataIntro}</p><textarea aria-label={t.dataRun} value={data} onChange={(event) => { setData(event.target.value); setPreparedInput(event.target.value); setAutomation(null); setAutomationError(""); setInputInherited(false); }} placeholder={t.dataPlaceholder} rows={7} maxLength={200_000} /><button type="button" className="primary-button" disabled={!data.trim() || automationBusy} onClick={runHere}>{automationBusy ? t.running : t.run}</button>{automationError && <p className="error-block" role="alert">{automationError}</p>}{automation && <section className="agent-automation-result"><header><strong>{t.output}</strong><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(automation.output); setCopied(true); window.setTimeout(() => setCopied(false), 2_000); } catch { setCopied(false); } }}>{copied ? t.copied : t.copy}</button></header><ol>{automation.steps.map((step) => <li className={step.status} key={step.toolSlug}><span>{step.status === "completed" ? "✓" : "!"}</span><div><strong>{step.title}</strong><small>{step.note} · {step.outputLength}</small></div></li>)}</ol><pre>{automation.output}</pre></section>}</div></details> : <small className="agent-automation-boundary">ⓘ {t.unavailable}</small>}
        <details className="agent-answer-details"><summary>{t.details}<span>+</span></summary><div className="agent-detail-grid"><article><strong>{t.confidence}</strong><p>{Math.round(plan.confidence * 100)}% · {plan.matchQuality}</p></article><article><strong>{t.experts}</strong><p>{t.expertText}</p></article><article><strong>{t.why}</strong><p>{plan.signals.slice(0, 3).join(" · ")}</p></article><article><strong>{t.network}</strong><p>{plan.goalFrame.safety}</p></article></div><ul>{plan.limitations.map((item) => <li key={item}>{item}</li>)}</ul></details>
      </article>}
      {visualRequest && <section className="agent-inline-visual" aria-label={visualRequest.command}><AgentVisualStudioLoader key={visualRequest.id} locale={locale} initialCommand={visualRequest.command} initialFile={visualRequest.file} openOnMount embedded onClose={() => setVisualRequest(null)} /></section>}
    </div>

    {!turns.length && <div className="agent-starter-grid">{t.examples.map(([title, prompt]) => <button type="button" key={title} onClick={() => { setGoal(prompt); inputRef.current?.focus(); }}><span>↗</span><strong>{title}</strong><small>{prompt}</small></button>)}</div>}
    <div className="agent-composer"><textarea aria-label={t.hello} ref={inputRef} value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder={t.placeholder} rows={3} maxLength={20_000} />{attachment && <div className="agent-attachment"><span>📎 {attachment.name} · {attachment.text.length.toLocaleString(tags[locale])}{attachment.truncated ? ` · ${ai.truncated}` : ""}</span><button type="button" onClick={() => { setAttachment(null); setAttachmentError(""); }} aria-label={ai.remove}>×</button></div>}{visualFile && <div className="agent-attachment visual"><span>🖼 {visualFile.name} · {(visualFile.size / 1024 / 1024).toFixed(2)} MiB</span><button type="button" onClick={() => { setVisualFile(null); setAttachmentError(""); }} aria-label={ai.remove}>×</button></div>}{attachmentError && <small className="agent-voice-boundary" role="alert">ⓘ {attachmentError}</small>}{voice === "unavailable" && <small className="agent-voice-boundary" role="status">ⓘ {t.voiceUnavailable}</small>}<div><span>◉ {t.private} · {modeText.idle}</span><input aria-label={ai.attach} ref={fileRef} type="file" hidden accept=".txt,.md,.csv,.json,.xml,.yaml,.yml,.png,.jpg,.jpeg,.webp,text/plain,text/csv,application/json,image/png,image/jpeg,image/webp" onChange={async (event) => { const file = event.target.files?.[0]; event.target.value = ""; if (!file) return; setAttachmentError(""); if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) { if (file.size > VISUAL_MAX_FILE_BYTES) { setVisualFile(null); setAttachmentError(visualCopy[locale].imageTooLarge); return; } setAttachment(null); setVisualFile(file); setGoal((current) => current.trim() ? current : visualCopy[locale].defaultEdit); return; } setVisualFile(null); try { setAttachment(await readLocalAIAttachmentFile(file)); } catch { setAttachment(null); setAttachmentError(ai.fileReadFailed); } }} /><button type="button" onClick={() => fileRef.current?.click()}>＋ {ai.attach}</button><button type="button" onClick={() => void beginVoice()} disabled={voice === "listening"}>{voice === "listening" ? t.listening : `◌ ${t.voice}`}</button>{busy && aiStatus === "ready" ? <button type="button" className="agent-stop-button" onClick={stopGeneration}>■ {ai.stop}</button> : <button type="button" className="primary-button" onClick={() => void submit()} disabled={!goal.trim() || busy}>{busy ? t.thinking : t.send} ↑</button>}</div></div>

    <details className="agent-utilities"><summary>{t.utilities}<span>+</span></summary><div><section><label><span>{t.find}</span><input value={utilityQuery} onChange={(event) => setUtilityQuery(event.target.value)} placeholder={t.findPlaceholder} /></label>{utilityResults.map((result) => <Link href={toolPath(locale, result.tool.slug)} key={result.tool.slug}><strong>{result.tool.title[locale]}</strong><small>{result.tool.short[locale]}</small><span>→</span></Link>)}</section><section><label><span>{t.error}</span><textarea value={errorQuery} onChange={(event) => setErrorQuery(event.target.value)} placeholder={t.errorPlaceholder} rows={4} maxLength={30_000} /></label>{errorResult && <div className="agent-mini-error"><strong>{errorResult.title}</strong><p>{errorResult.explanation}</p><ol>{errorResult.actions.slice(0, 3).map((action) => <li key={action}>{action}</li>)}</ol></div>}</section></div></details>
  </section>;
}
