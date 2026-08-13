import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const client = readFileSync(new URL("../app/components/WorkstationClient.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/components/WorkstationPage.tsx", import.meta.url), "utf8");
const experience = readFileSync(new URL("../app/components/ToolExperience.tsx", import.meta.url), "utf8");
const handoff = readFileSync(new URL("../app/lib/workspace-handoff.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("Workstation defaults to a focused next-action experience in four languages", () => {
  for (const text of ["Şimdi ne yapmalıyım?", "What should I do now?", "Was ist jetzt zu tun?", "现在该做什么？"]) assert.match(client, new RegExp(text.replace(/[?？]/g, "\\$&")));
  assert.match(client, /workspace-guided-dashboard/);
  assert.match(client, /workspace-guided-steps/);
  assert.match(client, /workspace-guided-action/);
  assert.match(client, /const \[guidedMode, setGuidedMode\] = useState\(true\)/);
  assert.match(client, /\(!guidedMode \|\| showMap\)/);
  assert.doesNotMatch(client, /setOnboardingOpen\(!alreadyStarted/);
});

test("advanced canvas capabilities remain available without crowding the first view", () => {
  for (const capability of ["undo", "redo", "layoutWorkspaceGraph", "workspace-minimap", "WorkspaceP2PPanel", "createShareLink"]) assert.match(client, new RegExp(capability));
  assert.match(client, /!guidedMode && <div className="workspace-commandbar"/);
  assert.match(client, /!guidedMode && <div className="workspace-lower-grid"/);
  assert.match(css, /workspace-guided-layout/);
  assert.match(css, /@media\(max-width:620px\)/);
});

test("every completed tool result can start a validated visual flow", () => {
  assert.match(experience, /WORKSPACE_TOOL_START_KEY/);
  assert.match(experience, /transferToWorkspace/);
  assert.match(experience, /Continue in a visual flow/);
  assert.match(client, /readWorkspaceToolStart/);
  assert.match(client, /toolStart\.input/);
  assert.match(handoff, /Date\.now\(\) - value\.createdAt > 20 \* 60 \* 1000/);
  assert.match(handoff, /value\.input\.length > WORKSPACE_MAX_TEXT/);
});

test("public Workstation copy leads with outcomes instead of implementation jargon", () => {
  assert.match(page, /Turn repeated tasks into visual flows that are easy to follow/);
  assert.match(page, /Tekrarlanan işleri, takip etmesi kolay görsel akışlara dönüştürün/);
  assert.match(page, /把重复任务变成清晰易懂的可视化流程/);
  assert.doesNotMatch(page, /badges: \["No heavy canvas code on first load"/);
  assert.doesNotMatch(page, /badges: \["IndexedDB \+ Web Crypto"/);
});
