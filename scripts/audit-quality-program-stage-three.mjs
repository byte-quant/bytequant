import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { stageThreePosts, stageThreeLocalizedGuides } from "../app/lib/stage-three-guides.ts";
import { publicTools } from "../app/lib/tools.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const locales = ["tr", "en", "de", "zh"];
const prefixes = { tr: "", en: "/en", de: "/de", zh: "/zh" };
const segments = { tr: "blog", en: "blog", de: "blog", zh: "blog" };
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const [adsTxt, layout] = await Promise.all([readFile(join(root, "public/ads.txt"), "utf8"), readFile(join(root, "app/layout.tsx"), "utf8")]);
assert.equal(adsTxt, expectedAds, "protected ads.txt changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense script changed");
assert.equal(stageThreePosts.length, 4);
assert.equal(stageThreeLocalizedGuides.length, 4);

const toolSlugs = new Set(publicTools.map((tool) => tool.slug));
let localizedPages = 0;
let paragraphs = 0;
for (const post of stageThreePosts) {
  assert.equal(post.relatedTools.length, 4, `${post.slug}: four related tools required`);
  assert.equal(new Set(post.relatedTools).size, 4, `${post.slug}: repeated related tool`);
  post.relatedTools.forEach((slug) => assert.ok(toolSlugs.has(slug), `${post.slug}: unknown tool ${slug}`));
  const localized = stageThreeLocalizedGuides.find((guide) => guide.slug === post.slug);
  assert.ok(localized, `${post.slug}: DE/ZH localization missing`);
  for (const locale of locales) {
    const sections = locale === "tr" || locale === "en" ? post.sections[locale] : localized.copy[locale].sections;
    const prose = sections.flatMap((section) => section.paragraphs).join(" ");
    assert.equal(sections.length, 5, `${post.slug}/${locale}: expected five focused sections`);
    assert.ok(prose.length >= (locale === "zh" ? 500 : locale === "de" ? 1150 : locale === "tr" ? 1700 : 1450), `${post.slug}/${locale}: shallow prose`);
    paragraphs += sections.flatMap((section) => section.paragraphs).length;
    const outputPath = join(root, "out", ...`${prefixes[locale]}/${segments[locale]}/${post.slug}/index.html`.split("/").filter(Boolean));
    const html = await readFile(outputPath, "utf8");
    assert.ok(html.includes('data-guide-action-plan="interactive"'), `${post.slug}/${locale}: action plan missing`);
    assert.ok(html.includes('"@type":"BlogPosting"'), `${post.slug}/${locale}: BlogPosting schema missing`);
    assert.ok(!html.includes('name="robots" content="noindex'), `${post.slug}/${locale}: guide unexpectedly noindexed`);
    for (const slug of post.relatedTools) assert.ok(html.includes(slug), `${post.slug}/${locale}: related tool ${slug} missing`);
    localizedPages += 1;
  }
}

const report = `# AdSense quality program — Stage 3 editorial utility report

Generated: 2026-08-11

## Verified scope

| Check | Result |
| --- | ---: |
| Original workflow guides | ${stageThreePosts.length} |
| Fully localized guide pages | ${localizedPages} |
| Editorial paragraphs reviewed | ${paragraphs} |
| Existing tools connected per guide | 4 |
| Protected ads.txt SHA-256 | ${expectedAdsHash} |

## Quality decisions

- Four distinct guides cover multilingual redaction QA, offline incident-evidence handover, spreadsheet import contracts, and accessible publishing release gates.
- Each language version contains task-specific decisions, edge cases, acceptance boundaries, and four links to implemented tools; no thin translation placeholder is used.
- Every guide now includes an interactive, keyboard-accessible action plan. Its checkmarks remain in React memory for the current tab and are never persisted or sent to a server.
- Guide pages remain public and indexable, publish BlogPosting structured data, and connect editorial claims to visible product behavior.
- The protected AdSense publisher identity and seller record remain byte-for-byte unchanged.

This engineering report verifies implementation evidence. It does not promise AdSense approval or search ranking.
`;
if (process.argv.includes("--write")) await writeFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-3.md"), report, "utf8");
else assert.equal(await readFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-3.md"), "utf8"), report);
console.log(`Stage 3 quality audit: PASS (${localizedPages} localized guide pages)`);
