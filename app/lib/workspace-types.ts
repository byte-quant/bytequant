import type { Locale } from "./site";

export const WORKSPACE_VERSION = 1 as const;
export const WORKSPACE_MAX_NODES = 48;
export const WORKSPACE_MAX_EDGES = 96;
export const WORKSPACE_MAX_TEXT = 200_000;
export const WORKSPACE_MAX_BYTES = 2_500_000;

export type WorkspaceNodeStatus = "idle" | "ready" | "complete" | "error";

export type WorkspaceNode = {
  id: string;
  toolSlug: string;
  title: string;
  x: number;
  y: number;
  input: string;
  output: string;
  status: WorkspaceNodeStatus;
};

export type WorkspaceEdge = {
  id: string;
  from: string;
  to: string;
};

export type WorkspaceDocument = {
  version: typeof WORKSPACE_VERSION;
  id: string;
  name: string;
  locale: Locale;
  createdAt: string;
  updatedAt: string;
  nodes: WorkspaceNode[];
  edges: WorkspaceEdge[];
};

export type WorkspaceRecipe = {
  version: typeof WORKSPACE_VERSION;
  name: string;
  locale: Locale;
  nodes: Array<Pick<WorkspaceNode, "id" | "toolSlug" | "title" | "x" | "y" | "input">>;
  edges: WorkspaceEdge[];
};

const localeSet = new Set<Locale>(["tr", "en", "de", "zh"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const idPattern = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function workspaceId(prefix = "ws") {
  const random = globalThis.crypto?.randomUUID?.().replaceAll("-", "") ?? `${Date.now()}${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random.slice(0, 24)}`;
}

export function createWorkspace(locale: Locale, name?: string): WorkspaceDocument {
  const now = new Date().toISOString();
  return {
    version: WORKSPACE_VERSION,
    id: workspaceId(),
    name: name?.trim().slice(0, 100) || ({ tr: "Yeni çalışma alanı", en: "New workspace", de: "Neuer Arbeitsbereich", zh: "新工作区" } as const)[locale],
    locale,
    createdAt: now,
    updatedAt: now,
    nodes: [],
    edges: [],
  };
}

function finiteCoordinate(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 20_000;
}

function validNode(value: unknown): value is WorkspaceNode {
  if (!value || typeof value !== "object") return false;
  const node = value as WorkspaceNode;
  return idPattern.test(node.id) && slugPattern.test(node.toolSlug) && typeof node.title === "string" && node.title.length <= 180
    && finiteCoordinate(node.x) && finiteCoordinate(node.y) && typeof node.input === "string" && node.input.length <= WORKSPACE_MAX_TEXT
    && typeof node.output === "string" && node.output.length <= WORKSPACE_MAX_TEXT && ["idle", "ready", "complete", "error"].includes(node.status);
}

function validEdge(value: unknown, nodeIds: Set<string>): value is WorkspaceEdge {
  if (!value || typeof value !== "object") return false;
  const edge = value as WorkspaceEdge;
  return idPattern.test(edge.id) && nodeIds.has(edge.from) && nodeIds.has(edge.to) && edge.from !== edge.to;
}

export function validateWorkspaceDocument(value: unknown): value is WorkspaceDocument {
  if (!value || typeof value !== "object") return false;
  const document = value as WorkspaceDocument;
  if (document.version !== WORKSPACE_VERSION || !idPattern.test(document.id) || typeof document.name !== "string" || document.name.length < 1 || document.name.length > 100
    || !localeSet.has(document.locale) || !Number.isFinite(Date.parse(document.createdAt)) || !Number.isFinite(Date.parse(document.updatedAt))
    || !Array.isArray(document.nodes) || document.nodes.length > WORKSPACE_MAX_NODES || !Array.isArray(document.edges) || document.edges.length > WORKSPACE_MAX_EDGES
    || !document.nodes.every(validNode)) return false;
  const nodeIds = new Set(document.nodes.map((node) => node.id));
  if (nodeIds.size !== document.nodes.length || !document.edges.every((edge) => validEdge(edge, nodeIds))) return false;
  if (new Set(document.edges.map((edge) => edge.id)).size !== document.edges.length) return false;
  try { return new TextEncoder().encode(JSON.stringify(document)).length <= WORKSPACE_MAX_BYTES; } catch { return false; }
}

export function validateWorkspaceRecipe(value: unknown): value is WorkspaceRecipe {
  if (!value || typeof value !== "object") return false;
  const recipe = value as WorkspaceRecipe;
  if (recipe.version !== WORKSPACE_VERSION || typeof recipe.name !== "string" || recipe.name.length < 1 || recipe.name.length > 100 || !localeSet.has(recipe.locale)
    || !Array.isArray(recipe.nodes) || recipe.nodes.length > WORKSPACE_MAX_NODES || !Array.isArray(recipe.edges) || recipe.edges.length > WORKSPACE_MAX_EDGES) return false;
  const normalizedNodes: WorkspaceNode[] = recipe.nodes.map((node) => ({ ...node, output: "", status: "idle" }));
  const nodeIds = new Set(normalizedNodes.map((node) => node.id));
  return normalizedNodes.every(validNode) && nodeIds.size === normalizedNodes.length && recipe.edges.every((edge) => validEdge(edge, nodeIds));
}

export function documentFromRecipe(recipe: WorkspaceRecipe): WorkspaceDocument {
  const now = new Date().toISOString();
  return {
    version: WORKSPACE_VERSION,
    id: workspaceId(),
    name: recipe.name,
    locale: recipe.locale,
    createdAt: now,
    updatedAt: now,
    nodes: recipe.nodes.map((node) => ({ ...node, output: "", status: node.input ? "ready" : "idle" })),
    edges: recipe.edges,
  };
}

export function updateWorkspace(document: WorkspaceDocument, patch: Partial<Omit<WorkspaceDocument, "version" | "id" | "createdAt">>): WorkspaceDocument {
  return { ...document, ...patch, updatedAt: new Date().toISOString() };
}

export function propagateWorkspaceOutput(document: WorkspaceDocument, nodeId: string, output: string): WorkspaceDocument {
  const bounded = output.slice(0, WORKSPACE_MAX_TEXT);
  const downstream = new Set(document.edges.filter((edge) => edge.from === nodeId).map((edge) => edge.to));
  return updateWorkspace(document, {
    nodes: document.nodes.map((node) => node.id === nodeId
      ? { ...node, output: bounded, status: "complete" }
      : downstream.has(node.id) ? { ...node, input: bounded, status: "ready" } : node),
  });
}
