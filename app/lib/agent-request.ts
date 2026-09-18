import { createAgentPlan, extractAgentPayload, type AgentPlan } from "./agent-core";
import { isLikelyWorkflowRequest } from "./local-ai";
import type { Locale } from "./site";
import type { Tool } from "./tools";

const reference = /(?:bunu|şunu|sonucu|önceki|aynı|this|that|result|previous|dies|ergebnis|vorher|这个|结果|刚才)/iu;
const decode = /(?:çöz|coz|decode|dekod|解码)/iu;
const encode = /(?:kodla|encode|kodier|编码)/iu;

/** Only explicit data boundaries resume a waiting task; ordinary chat stays chat. */
function isDataReply(text: string, plan: AgentPlan) {
  if (/^```[\s\S]*```$/u.test(text) || /^(?:girdi|veri|input|data|eingabe|daten|输入|数据)\s*:/iu.test(text)) return true;
  try { const value: unknown = JSON.parse(text); if (value && typeof value === "object") return true; } catch { /* not JSON */ }
  const lines = text.split(/\r?\n/u);
  if (lines.length > 1 && lines.slice(0, 2).every((line) => /[,;\t]/u.test(line))) return true;
  if (plan.steps.length === 1 && plan.steps[0].toolSlug === "base64-kodlayici" && plan.steps[0].operation === "decode"
    && text.length >= 4 && /^[A-Za-z0-9+/_-]+={0,2}$/u.test(text)) {
    try {
      const source = text.replace(/-/g, "+").replace(/_/g, "/");
      const bytes = Uint8Array.from(atob(source.padEnd(Math.ceil(source.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return true;
    } catch { /* not a valid text-encoded Base64 reply */ }
  }
  return false;
}

export function resolveAgentRequest(text: string, catalog: Tool[], locale: Locale, previous: AgentPlan | null, waitingForInput: boolean, hasAttachment = false) {
  const trimmed = text.trim();
  const active = previous?.locale === locale ? previous : null;
  const dataReply = Boolean(active && waitingForInput && active.matchQuality === "strong" && isDataReply(trimmed, active));
  if (dataReply && active) {
    return {
      workflow: true, inheritInput: false,
      payload: /^(?:```|(?:girdi|veri|input|data|eingabe|daten|输入|数据)\s*:)/iu.test(trimmed) ? extractAgentPayload(trimmed) || trimmed : trimmed,
      plan: { ...active, conversation: { ...active.conversation, isFollowUp: true } },
    };
  }
  // A short operation change refers to the active codec, not a fresh catalog guess.
  const codec = active?.steps.length === 1 && ["base64-kodlayici", "url-kodlayici"].includes(active.steps[0].toolSlug) ? active.steps[0] : null;
  const codecReply = codec && trimmed.length < 100 && reference.test(trimmed) && (decode.test(trimmed) || encode.test(trimmed))
    && !/(?:jwt|json|csv|pdf)/iu.test(trimmed);
  const goal = codecReply ? `${codec.toolSlug === "base64-kodlayici" ? "Base64" : "URL"} ${decode.test(trimmed) ? "decode" : "encode"}` : trimmed;
  const workflow = Boolean(dataReply || codecReply || hasAttachment || isLikelyWorkflowRequest(goal));
  const plan = createAgentPlan(goal, catalog, locale, workflow ? active : null);
  if (codecReply) plan.conversation.isFollowUp = true;
  return { workflow, plan, payload: extractAgentPayload(trimmed), inheritInput: Boolean(active && workflow && (codecReply || (plan.conversation.isFollowUp && reference.test(trimmed)))) };
}
