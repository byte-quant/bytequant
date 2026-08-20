import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("guided Workstation keeps outcome switching available after a flow starts", async () => {
  const [client, styles] = await Promise.all([
    read("app/components/WorkstationClient.tsx"),
    read("app/globals.css"),
  ]);

  for (const label of ["Başka bir akış seç", "Choose another flow", "Anderen Ablauf wählen", "选择其他流程"]) {
    assert.match(client, new RegExp(label));
  }
  assert.match(client, /function replaceWithTemplate/);
  assert.match(client, /window\.confirm\(guided\.confirmReplace\)/);
  assert.match(client, /workspace-journey/);
  assert.match(client, /workspace-guided-picker/);
  assert.match(styles, /\.workspace-journey/);
  assert.match(styles, /\.workspace-guided-picker/);
});

test("community is feed-first on small screens and exposes familiar social destinations", async () => {
  const [network, styles] = await Promise.all([
    read("app/components/CommunityNetwork.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(network, /community-mobile-tabs/);
  for (const target of ["#community-feed", "#community-compose", "#community-topics", "#community-profile"]) {
    assert.match(network, new RegExp(`href=\\"${target}`));
  }
  assert.match(network, /community-feed-masthead/);
  assert.match(network, /Public Nostr feed/);
  assert.match(network, /Herkese açık Nostr akışı/);
  assert.match(styles, /grid-template-areas:"feed" "aside" "profile"/);
  assert.match(styles, /\.community-mobile-tabs/);
});

test("home keeps the standalone visual studio visible while clarifying local AI privacy", async () => {
  const home = await read("app/components/HomePage.tsx");
  assert.match(home, /#agent-visual/);
  assert.match(home, /No remote AI service/);
  assert.match(home, /Kein entfernter KI-Dienst/);
  assert.match(home, /无需远程 AI 服务/);
});
