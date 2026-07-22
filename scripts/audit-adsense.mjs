import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [adSlot, home, tool, article, blog, agent, workstation, community, privacy, cookies] = await Promise.all([
  read("app/components/AdSlot.tsx"), read("app/components/HomePage.tsx"), read("app/components/ToolPage.tsx"),
  read("app/components/ArticlePage.tsx"), read("app/components/BlogIndex.tsx"), read("app/components/AgenticAssistant.tsx"),
  read("app/components/WorkstationClient.tsx"), read("app/components/CommunityPage.tsx"), read("app/lib/info.ts"), read("app/components/ConsentManager.tsx"),
]);

const activeTag = /pagead2\.googlesyndication\.com|adsbygoogle|ca-pub-/i;
for (const [name, source] of Object.entries({ adSlot, home, tool, article, blog, agent, workstation, community, privacy, cookies })) {
  assert.doesNotMatch(source, activeTag, `${name}: AdSense must remain inactive until publisher ID and certified CMP are configured`);
}
assert.match(adSlot, /data-ad-status="reserved"/);
assert.match(adSlot, /Advertisement/);
assert.match(home, /home-library/);
assert.match(home, /home-editorial/);
assert.match(tool, /tool-after-guide/);
assert.match(article, /guide-in-article/);
assert.match(blog, /guide-index/);
for (const [name, source] of Object.entries({ agent, workstation, community })) assert.doesNotMatch(source, /<AdSlot/, `${name}: interactive/private surfaces must not contain ads`);
assert.match(privacy, /Google-certified CMP|Google sertifikalı CMP/);
assert.match(privacy, /ads\.txt/);
assert.match(cookies, /optional|isteğe bağlı|Einwilligung|可选/i);

console.log("AdSense static readiness: PASS");
console.log("Activation gate: PENDING — verified publisher ID, ads.txt, Google-certified CMP/TCF, and live-account review are external prerequisites.");
