import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("PWA presents one honest action and an accessible fallback guide", async () => {
  const source = await read("app/components/PwaInstall.tsx");
  assert.match(source, /options: "Kurulum seçenekleri"/);
  assert.match(source, /options: "Install options"/);
  assert.match(source, /options: "Installationsoptionen"/);
  assert.match(source, /options: "安装选项"/);
  assert.match(source, /manualStatus:/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /aria-describedby="pwa-guide-description"/);
  assert.match(source, /data-pwa-install-mode=/);
  assert.doesNotMatch(source, /install-actions[\s\S]{0,900}className="text-button"/);
});

test("Local Agent keeps automatic preparation and Workstation handoff reachable", async () => {
  const [agent, bridge] = await Promise.all([read("app/components/AgentConversation.tsx"), read("app/components/AgentToolBridge.tsx")]);
  assert.match(agent, /preparedInput/);
  assert.match(agent, /t\.start/);
  assert.match(agent, /t\.workstation/);
  assert.match(agent, /runAgentAutomation/);
  assert.match(bridge, /data-agent-contract/);
  assert.match(bridge, /AGENT_AUTO_PREPARE_KEY/);
});

test("Workstation retains professional navigation and reversible editing", async () => {
  const source = await read("app/components/WorkstationClient.tsx");
  for (const marker of ["workspace-canvas-controls", "workspace-minimap", "workspace-onboarding", "undo", "redo", "workspace-port"]) assert.match(source, new RegExp(marker));
});

test("Community remains opt-in and Updates remove navigation boilerplate", async () => {
  const [community, news, sync, github] = await Promise.all([
    read("app/components/CommunityNetwork.tsx"),
    read("app/components/NewsFeedClient.tsx"),
    read("scripts/sync-news.mjs"),
    read("app/components/GitHubActivity.tsx"),
  ]);
  assert.match(community, /Connect global feed|Global akışa bağlan/);
  assert.match(community, /relay/i);
  assert.match(community, /IP address|IP adres/);
  assert.match(news, /readableSummary/);
  assert.match(news, /feedNavigationBoilerplate/);
  assert.match(sync, /boilerplateSummary/);
  assert.doesNotMatch(github, /August 2, 2026|2 Ağustos 2026|2\. August 2026|2026 年 8 月 2 日/);
});
