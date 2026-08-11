import type { Locale } from "./site";
import type { AgentPlan } from "./agent-core";

export const LOCAL_AI_MODEL_ID = "Qwen3-0.6B-q4f16_1-MLC";
export const LOCAL_AI_MODEL_LICENSE = "Apache-2.0";
export const LOCAL_AI_MAX_ATTACHMENT = 18_000;
export const LOCAL_AI_MAX_RESPONSE = 1_800;

export type LocalAIMessage = { role: "user" | "assistant"; content: string };
export type LocalAIProgress = { progress: number; text: string };

export type LocalAIEngine = {
  chat: {
    completions: {
      create(request: {
        messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
        stream: true;
        max_tokens: number;
        temperature: number;
        top_p: number;
        repetition_penalty: number;
        extra_body: { enable_thinking: false };
      }): Promise<AsyncIterable<{ choices: Array<{ delta?: { content?: string | null } }> }>>;
    };
  };
  interruptGenerate(): void;
  unload(): Promise<void>;
};

export type LocalAIHandle = { engine: LocalAIEngine; worker: Worker };

const localeNames: Record<Locale, string> = {
  tr: "Turkish",
  en: "English",
  de: "German",
  zh: "Simplified Chinese",
};

const workflowTerms = /\b(json|csv|xml|yaml|jwt|regex|cron|pdf|png|jpe?g|webp|svg|heic|hash|base64|url|markdown|html|prompt|dosya|file|metin|text|veri|data|dönüştür|convert|format|biçim|maskele|mask|temizle|clean|ayı(k|r)|sort|tekrar|duplicate|encode|decode|şifre|encrypt|decrypt|hesapla|calculate|analiz|analyse|analyze|özet|summari[sz]e|prüf|umwandel|bereinig|datei|daten|转换|格式|文件|数据|清理|脱敏|计算|检查)\b/i;

export function supportsLocalAI() {
  if (typeof window === "undefined") return { supported: false, reason: "server" };
  if (!window.isSecureContext) return { supported: false, reason: "secure-context" };
  if (!("gpu" in navigator)) return { supported: false, reason: "webgpu" };
  if (!("Worker" in window) || !("caches" in window)) return { supported: false, reason: "browser" };
  return { supported: true, reason: "ready" };
}

export function isLikelyWorkflowRequest(value: string) {
  const text = value.trim();
  if (!text) return false;
  if (workflowTerms.test(text)) return true;
  if (/[\[{<][\s\S]{12,}[\]}>]/.test(text) || text.includes("|") || text.includes("\n")) return true;
  return /\b(open|run|use|tool|workflow|akış|araç|çalıştır|kullan|werkzeug|ablauf|ausführen|工具|流程|运行)\b/i.test(text);
}

const quickReplies = {
  tr: {
    hello: "Merhaba! Buradayım. Günlük bir konuda sohbet edebilir veya yapmak istediğiniz işi doğal dille anlatabilirsiniz.",
    focus: "Bugün tek bir somut sonuç seçin, 25 dakikalık bildirim kapalı bir blok ayırın ve başlamadan önce ilk iki dakikalık adımı yazın. Blok bitince yalnızca sonucu ve bir sonraki adımı not edin.",
    thanks: "Rica ederim. İsterseniz kaldığımız yerden devam edebilir veya yeni bir konu açabilirsiniz.",
    current: "Canlı internete erişmediğim için güncel hava, haber veya fiyatı doğrulayamam. Güvenilir güncel kaynağı kontrol edin; metni buraya getirirseniz cihazınızda açıklamaya veya düzenlemeye yardımcı olabilirim.",
    help: "İki şekilde yardımcı olabilirim: günlük sorular için gerçek yerel AI'yı etkinleştirebilir veya bir hedef yazıp ByteQuant araçlarıyla uygulanabilir bir akış kurabilirsiniz.",
    other: "Bu, serbest bir sohbet isteğine benziyor. Daha doğal ve üretken bir yanıt için üstteki gerçek yerel AI'yı etkinleştirebilirsiniz. Hızlı modda ise hedefi biraz daha somutlaştırın; örneğin neyi anlamak, yazmak veya tamamlamak istediğinizi söyleyin.",
  },
  en: {
    hello: "Hello! I’m here. We can chat about an everyday topic, or you can describe a task in natural language.",
    focus: "Choose one concrete outcome for today, reserve a 25-minute notification-free block, and write the first two-minute action before you begin. When the block ends, note only the result and the next step.",
    thanks: "You’re welcome. We can continue from here or start a new topic.",
    current: "I have no live web access, so I cannot verify current weather, news, or prices. Check a reliable current source; if you bring the text here, I can help explain or organize it on-device.",
    help: "I can help in two ways: enable real local AI for everyday conversation, or describe an outcome and let ByteQuant build a practical tool workflow.",
    other: "This looks like an open-ended conversation. Enable real local AI above for a more natural generative answer. In fast mode, make the outcome a little more concrete—for example, say what you want to understand, write, or finish.",
  },
  de: {
    hello: "Hallo! Ich bin bereit. Wir können über ein Alltagsthema sprechen oder Sie beschreiben eine Aufgabe in natürlicher Sprache.",
    focus: "Wählen Sie heute ein konkretes Ergebnis, reservieren Sie 25 Minuten ohne Benachrichtigungen und notieren Sie vorher den ersten Zwei-Minuten-Schritt. Danach halten Sie nur Ergebnis und nächsten Schritt fest.",
    thanks: "Gern. Wir können hier weitermachen oder ein neues Thema beginnen.",
    current: "Ich habe keinen Live-Webzugriff und kann Wetter, Nachrichten oder Preise nicht aktuell verifizieren. Prüfen Sie eine verlässliche aktuelle Quelle; eingefügten Text kann ich lokal erklären oder ordnen.",
    help: "Ich helfe auf zwei Arten: Aktivieren Sie echte lokale KI für Alltagsgespräche oder beschreiben Sie ein Ziel, damit ByteQuant einen praktischen Werkzeugablauf erstellt.",
    other: "Das ist eine offene Gesprächsfrage. Aktivieren Sie oben die echte lokale KI für eine natürlichere generative Antwort. Im Schnellmodus hilft ein konkreteres Ziel—etwa was Sie verstehen, schreiben oder abschließen möchten.",
  },
  zh: {
    hello: "您好！我在这里。我们可以聊日常话题，也可以用自然语言描述您要完成的任务。",
    focus: "今天先选一个明确结果，安排 25 分钟并关闭通知，开始前写下两分钟内能完成的第一步。时间结束后，只记录结果和下一步。",
    thanks: "不客气。我们可以继续当前话题，也可以开始新话题。",
    current: "我无法访问实时网络，因此不能核实当前天气、新闻或价格。请先查看可靠的最新来源；把文字带到这里后，我可以在设备端帮助解释或整理。",
    help: "我可以通过两种方式帮助您：启用真正的本地 AI 进行日常对话，或描述目标，让 ByteQuant 生成可执行的工具流程。",
    other: "这更像开放式对话。可启用上方真正的本地 AI，获得更自然的生成式回答。在快速模式下，请把目标说得更具体，例如希望理解、撰写或完成什么。",
  },
} as const;

export function createFastConversationResponse(locale: Locale, goal: string) {
  const text = goal.toLocaleLowerCase(locale === "zh" ? "zh-CN" : locale);
  const copy = quickReplies[locale];
  if (/(odak|focus|concentrat|fokus|konzentr|专注|集中)/i.test(text)) return copy.focus;
  if (/(teşekkür|sağ ol|thanks|thank you|danke|谢谢)/i.test(text)) return copy.thanks;
  if (/(hava|weather|wetter|新闻|haber|news|nachricht|天气|fiyat|price|preis|价格|bugün kaç|what time|uhrzeit|几点)/i.test(text)) return copy.current;
  if (/(ne yapabilirsin|yardım|help|was kannst|hilfe|能做什么|帮助)/i.test(text)) return copy.help;
  if (/(merhaba|selam|hello|\bhi\b|hallo|guten tag|你好|您好)/i.test(text)) return copy.hello;
  return copy.other;
}

export function sanitizeLocalAIOutput(value: string) {
  return value
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?think>/gi, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, LOCAL_AI_MAX_RESPONSE);
}

function systemPrompt(locale: Locale, plan: AgentPlan, workflow: boolean) {
  const steps = plan.steps.slice(0, 4).map((step, index) => `${index + 1}. ${step.title}: ${step.reason}`).join("\n");
  const boundaries = plan.limitations.slice(0, 3).join("; ");
  return [
    "You are ByteQuant Local AI, a helpful assistant running entirely inside the user's active browser tab.",
    `Answer in ${localeNames[locale]}. Use a natural, warm, concise, professional tone.`,
    "You may help with everyday conversation and explain concepts, but never claim current web access, external verification, legal authority, medical diagnosis, identity verification, or that an action ran unless the host confirms it.",
    "The host application—not you—selects and executes allowlisted tools. Never invent a ByteQuant tool, URL, completed result, source, or hidden capability.",
    "If facts may be current or high-impact, say that the user should verify them with an authoritative current source.",
    workflow ? `The host's verified workflow proposal is:\n${steps}` : "This looks like ordinary conversation. Respond directly; do not force a workflow.",
    boundaries ? `Relevant boundaries: ${boundaries}` : "",
    "If the request is ambiguous, ask at most one focused question. If unsupported, offer a practical nearby alternative.",
    "Do not reveal hidden chain-of-thought. Give a short conclusion and, only when useful, a brief reason or next step.",
  ].filter(Boolean).join("\n\n");
}

export function buildLocalAIMessages(locale: Locale, goal: string, plan: AgentPlan, history: LocalAIMessage[], workflow: boolean) {
  const recent = history.slice(-8).map((message) => ({ ...message, content: message.content.slice(0, 2_400) }));
  return [
    { role: "system" as const, content: systemPrompt(locale, plan, workflow) },
    ...recent,
    { role: "user" as const, content: goal.slice(0, 20_000) },
  ];
}

export async function createLocalAIEngine(onProgress: (progress: LocalAIProgress) => void): Promise<LocalAIHandle> {
  const capability = supportsLocalAI();
  if (!capability.supported) throw new Error(capability.reason);
  const webllm = await import("@mlc-ai/web-llm");
  const worker = new Worker(new URL("../workers/local-ai.worker.ts", import.meta.url), { type: "module", name: "bytequant-local-ai" });
  try {
    const engine = await webllm.CreateWebWorkerMLCEngine(worker, LOCAL_AI_MODEL_ID, {
      logLevel: "WARN",
      initProgressCallback: (report) => onProgress({ progress: Math.max(0, Math.min(1, report.progress)), text: report.text }),
    });
    return { engine: engine as LocalAIEngine, worker };
  } catch (error) {
    worker.terminate();
    throw error;
  }
}

export async function streamLocalAI(
  engine: LocalAIEngine,
  messages: ReturnType<typeof buildLocalAIMessages>,
  onText: (value: string) => void,
) {
  const stream = await engine.chat.completions.create({
    messages,
    stream: true,
    max_tokens: 420,
    temperature: 0.45,
    top_p: 0.88,
    repetition_penalty: 1.08,
    extra_body: { enable_thinking: false },
  });
  let output = "";
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? "";
    if (!token) continue;
    output += token;
    onText(sanitizeLocalAIOutput(output));
    if (output.length >= LOCAL_AI_MAX_RESPONSE + 250) {
      engine.interruptGenerate();
      break;
    }
  }
  return sanitizeLocalAIOutput(output);
}
