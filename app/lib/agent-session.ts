import type { AgentSession } from "./agent-core";

export const AGENT_VERSION = "BQ-Agent 4.1";
export const AGENT_SESSION_KEY = "bytequant:local-agent:v1";
export const AGENT_AUTO_PREPARE_KEY = "bytequant:local-agent:auto-prepare:v1";
export const AGENT_SESSION_LIMIT = 200_000;

export function readAgentPlan(raw: string | null): AgentSession["plan"] | null {
  if (!raw || raw.length > AGENT_SESSION_LIMIT) return null;
  try {
    const plan = JSON.parse(raw) as AgentSession["plan"];
    if (plan?.version !== AGENT_VERSION || !(["tr", "en", "de", "zh"] as string[]).includes(plan.locale) || typeof plan.goal !== "string" || plan.goal.length > 20_000 || !Array.isArray(plan.steps) || plan.steps.length < 1 || plan.steps.length > 6) return null;
    const validSteps = plan.steps.every((step) => typeof step?.id === "string" && /^step-[1-6]-[a-z0-9-]+$/.test(step.id) && typeof step.toolSlug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(step.toolSlug) && typeof step.title === "string" && step.title.length <= 180 && typeof step.reason === "string" && step.reason.length <= 600 && ["goal", "previous", "manual"].includes(step.inputMode) && typeof step.requiresFile === "boolean" && Array.isArray(step.parameterHints) && step.parameterHints.length <= 5 && step.parameterHints.every((hint) => typeof hint === "string" && hint.length <= 500));
    if (!validSteps || typeof plan.response !== "string" || plan.response.length > 2_000 || !Array.isArray(plan.alternativeSlugs) || plan.alternativeSlugs.length > 3 || plan.alternativeSlugs.some((slug) => typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) return null;
    if (!["strong", "review"].includes(plan.matchQuality) || !Array.isArray(plan.clarifyingQuestions) || plan.clarifyingQuestions.length > 3 || plan.clarifyingQuestions.some((item) => typeof item !== "string" || item.length > 300) || !Array.isArray(plan.nextActions) || plan.nextActions.length > 4 || plan.nextActions.some((item) => typeof item !== "string" || item.length > 300)) return null;
    if (!plan.goalFrame || Object.values(plan.goalFrame).some((item) => typeof item !== "string" || item.length > 500) || !Array.isArray(plan.planReview) || plan.planReview.length > 4 || plan.planReview.some((item) => typeof item !== "string" || item.length > 500)) return null;
    if (!plan.conversation || typeof plan.conversation.isFollowUp !== "boolean" || typeof plan.conversation.intentSummary !== "string" || plan.conversation.intentSummary.length > 300 || typeof plan.conversation.contextNote !== "string" || plan.conversation.contextNote.length > 500 || !Array.isArray(plan.conversation.suggestedReplies) || plan.conversation.suggestedReplies.length > 3 || plan.conversation.suggestedReplies.some((item) => typeof item !== "string" || item.length > 300)) return null;
    return plan;
  } catch { return null; }
}

export function readAgentSession(raw: string | null): AgentSession | null {
  if (!raw || raw.length > AGENT_SESSION_LIMIT) return null;
  try {
    const value = JSON.parse(raw) as AgentSession;
    const plan = readAgentPlan(JSON.stringify(value?.plan));
    if (!plan || !Number.isInteger(value.currentStep) || typeof value.stepOutputs !== "object" || value.stepOutputs === null || Array.isArray(value.stepOutputs)) return null;
    const outputEntries = Object.entries(value.stepOutputs);
    if (outputEntries.length > 6 || outputEntries.some(([key, output]) => !plan.steps.some((step) => step.id === key) || typeof output !== "string" || output.length > AGENT_SESSION_LIMIT)) return null;
    const completedStepIds = Array.isArray(value.completedStepIds) ? value.completedStepIds.filter((id): id is string => typeof id === "string" && plan.steps.some((step) => step.id === id)).slice(0, 6) : [];
    const preparedInput = typeof value.preparedInput === "string" && value.preparedInput.length <= 180_000 ? value.preparedInput : undefined;
    return { ...value, plan, currentStep: Math.max(0, Math.min(value.currentStep, plan.steps.length - 1)), stepOutputs: Object.fromEntries(outputEntries), completedStepIds, preparedInput };
  } catch { return null; }
}
