import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("AI 7.4 presents conversation before optional model controls without removing capabilities", async () => {
  const [conversation, styles] = await Promise.all([
    source("app/components/AgentConversation.tsx"),
    source("app/globals.css"),
  ]);
  assert.match(conversation, /agent-conversation-welcome/);
  assert.match(conversation, /agent-model-drawer/);
  assert.match(conversation, /agent-local-ai-panel/);
  assert.match(conversation, /327 aracı çalıştır/);
  assert.match(conversation, /AgentVisualStudioLoader/);
  assert.match(conversation, /WORKSPACE_AGENT_PLAN_KEY/);
  assert.match(styles, /ByteQuant AI 7\.4: conversation first/);
  assert.match(styles, /\.agent-model-drawer/);
  assert.match(styles, /\.agent-composer\{position:sticky/);
});

test("Community 5.0 keeps the Nostr feature set in a responsive social timeline", async () => {
  const [network, page, styles] = await Promise.all([
    source("app/components/CommunityNetwork.tsx"),
    source("app/components/CommunityPage.tsx"),
    source("app/globals.css"),
  ]);
  assert.match(network, /community-network community-x-app/);
  assert.match(network, /community-trust-drawer/);
  assert.match(network, /community-social-left[\s\S]*community-social-nav[\s\S]*community-social-main/);
  assert.match(network, /publishPost/);
  assert.match(network, /deletePost/);
  assert.match(network, /toggleFollowing/);
  assert.match(network, /react\(event, 7\)/);
  assert.match(network, /react\(event, 6\)/);
  assert.match(page, /community-x-intro/);
  assert.match(styles, /Community 5\.0: a familiar social timeline architecture/);
  assert.match(styles, /grid-template-areas:"profile feed aside"/);
  assert.match(styles, /grid-template-areas:"feed" "profile" "aside"/);
  assert.match(styles, /community-mobile-tabs\{position:fixed/);
});
