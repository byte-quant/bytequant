import { WORKSPACE_MAX_TEXT, validateWorkspaceDocument, type WorkspaceDocument } from "./workspace-types";

export const WORKSPACE_HANDOFF_KEY = "bytequant:workstation-handoff:v1";
export const WORKSPACE_ACTIVE_KEY = "bytequant:workstation-active:v1";

export type WorkspaceHandoff = {
  version: 1;
  workspaceId: string;
  nodeId: string;
  toolSlug: string;
  input: string;
  output: string;
  returnPath: string;
  completed: boolean;
};

export function readWorkspaceHandoff(raw: string | null): WorkspaceHandoff | null {
  if (!raw || raw.length > WORKSPACE_MAX_TEXT * 2) return null;
  try {
    const value = JSON.parse(raw) as WorkspaceHandoff;
    if (value?.version !== 1 || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value.workspaceId) || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value.nodeId)
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.toolSlug) || typeof value.input !== "string" || value.input.length > WORKSPACE_MAX_TEXT
      || typeof value.output !== "string" || value.output.length > WORKSPACE_MAX_TEXT || typeof value.completed !== "boolean"
      || typeof value.returnPath !== "string" || !/^\/(?!\/)[a-z0-9/?=&._-]*$/i.test(value.returnPath)) return null;
    return value;
  } catch { return null; }
}

export function readActiveWorkspace(raw: string | null): WorkspaceDocument | null {
  if (!raw || raw.length > 3_500_000) return null;
  try { const value = JSON.parse(raw) as unknown; return validateWorkspaceDocument(value) ? value : null; }
  catch { return null; }
}
