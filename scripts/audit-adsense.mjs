import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [layout, adSlot, home, tool, article, blog, agent, workstation, community, privacy, cookies, adsTxt, robots, worker, headers] = await Promise.all([
  read("app/layout.tsx"),
  read("app/components/AdSlot.tsx"), read("app/components/HomePage.tsx"), read("app/components/ToolPage.tsx"),
  read("app/components/ArticlePage.tsx"), read("app/components/BlogIndex.tsx"), read("app/components/AgenticAssistant.tsx"),
  read("app/components/WorkstationClient.tsx"), read("app/components/CommunityPage.tsx"), read("app/lib/info.ts"), read("app/components/ConsentManager.tsx"),
  read("public/ads.txt"), read("app/robots.ts"), read("worker/index.ts"), read("public/_headers"),
]);

const publisherId = "ca-pub-4158794981134847";
assert.equal((layout.match(new RegExp(publisherId, "g")) ?? []).length, 3, "publisher ID must match in metadata, explicit meta, and the script URL");
assert.match(layout, /<Script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive"/);
assert.match(layout, /name="google-adsense-account" content="ca-pub-4158794981134847"/);
assert.equal(adsTxt.trim(), "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0");
assert.match(robots, /Mediapartners-Google/);
for (const source of [layout, worker, headers]) {
  assert.match(source, /googlesyndication\.com/);
  assert.match(source, /doubleclick\.net/);
  assert.match(source, /frame-src/);
}
assert.match(adSlot, /data-ad-status="auto-ads-eligible"/);
assert.match(adSlot, /Advertisement/);
assert.match(home, /home-library/);
assert.match(home, /home-editorial/);
assert.match(tool, /tool-after-guide/);
assert.match(article, /guide-in-article/);
assert.match(blog, /guide-index/);
for (const [name, source] of Object.entries({ agent, workstation, community })) assert.doesNotMatch(source, /<AdSlot/, `${name}: interactive/private surfaces must not contain ads`);
assert.match(privacy, /Google-certified CMP|Google sertifikalı CMP/);
assert.match(privacy, /ca-pub-4158794981134847/);
assert.match(privacy, /ads\.txt/);
assert.match(cookies, /optional|isteğe bağlı|Einwilligung|可选/i);

console.log("AdSense static readiness: PASS");
console.log("Publisher tag and ads.txt: ACTIVE for ca-pub-4158794981134847");
console.log("External account checks remain: Google-certified CMP/TCF publication, page exclusions, site review, and Policy Center status.");
