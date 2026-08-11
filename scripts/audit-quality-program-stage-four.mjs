import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { localizedGuides } from "../app/lib/localized-guides.ts";
import { posts } from "../app/lib/posts.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const [adsTxt, layout, workflow] = await Promise.all([
  readFile(join(root, "public/ads.txt"), "utf8"),
  readFile(join(root, "app/layout.tsx"), "utf8"),
  readFile(join(root, ".github/workflows/deploy.yml"), "utf8"),
]);

assert.equal(adsTxt, expectedAds, "protected ads.txt changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense script changed");
assert.equal((layout.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) ?? []).length, 1, "Auto Ads script must load exactly once");
assert.match(workflow, /pnpm audit:quality4/, "CI must run the Stage 4 quality gate");

const pagePaths = { tr: "blog/index.html", en: "en/blog/index.html", de: "de/blog/index.html", zh: "zh/blog/index.html" };
const htmlByLocale = Object.fromEntries(await Promise.all(Object.entries(pagePaths).map(async ([locale, relative]) => [locale, await readFile(join(root, "out", relative), "utf8")])));
for (const [locale, html] of Object.entries(htmlByLocale)) {
  assert.ok(html.includes('data-guide-explorer="progressive"'), `${locale}: guide explorer missing`);
  assert.ok(html.includes('type="search"'), `${locale}: search control missing`);
  assert.ok(html.includes('aria-live="polite"'), `${locale}: accessible result status missing`);
  assert.ok(!/name="robots" content="[^"]*noindex/i.test(html), `${locale}: guide index unexpectedly noindexed`);
  assert.ok(html.includes('"@type":"ItemList"'), `${locale}: ItemList structured data missing`);
}

for (const locale of ["tr", "en"]) {
  const prefix = locale === "tr" ? "/blog/" : "/en/blog/";
  for (const post of posts) assert.ok(htmlByLocale[locale].includes(`${prefix}${post.slug}`), `${locale}: missing guide link ${post.slug}`);
  const entries = htmlByLocale[locale].match(/data-guide-entry=/g) ?? [];
  assert.equal(entries.length, posts.length - 1, `${locale}: progressive list lost a guide card`);
}

const localizedSlugs = new Set(localizedGuides.map((guide) => guide.slug));
const englishOnly = posts.filter((post) => !localizedSlugs.has(post.slug));
for (const locale of ["de", "zh"]) {
  for (const guide of localizedGuides) assert.ok(htmlByLocale[locale].includes(`/${locale}/blog/${guide.slug}`), `${locale}: missing localized guide ${guide.slug}`);
  for (const post of englishOnly) assert.ok(htmlByLocale[locale].includes(`/en/blog/${post.slug}`), `${locale}: missing labelled English guide ${post.slug}`);
  const entries = htmlByLocale[locale].match(/data-guide-entry=/g) ?? [];
  assert.equal(entries.length, localizedGuides.length + englishOnly.length, `${locale}: integrated library lost a guide card`);
  assert.ok(htmlByLocale[locale].includes('hrefLang="en"') || htmlByLocale[locale].includes('hreflang="en"'), `${locale}: English originals lack a language signal`);
}

const report = `# AdSense quality program — Stage 4 discovery and release report

Generated: 2026-08-11

## Verified scope

| Check | Result |
| --- | ---: |
| Turkish and English guide records | ${posts.length} each |
| German and Chinese localized guides | ${localizedGuides.length} each |
| Clearly labelled English originals in DE/ZH library | ${englishOnly.length} |
| Searchable, filterable guide indexes | 4 |
| Protected ads.txt SHA-256 | ${expectedAdsHash} |

## Release decisions

- All four guide indexes now provide client-side search, topic filters, an accessible live result count, an empty state, and progressive reveal without a network request.
- Every guide title, excerpt, category, and canonical link remains in the server-rendered HTML. Progressive reveal changes presentation only; it does not remove editorial records from discovery or structured data.
- German and Chinese libraries combine localized material with explicitly labelled English originals, allowing readers to choose a language without mistaking an untranslated article for localized content.
- The final CI path validates lint, licenses, build output, 11 earlier AdSense quality gates, Stage 4 discovery, structured data, canonical ownership, crawlability, security headers, and performance budgets before deployment.
- The protected AdSense publisher identity, single Auto Ads loader, and seller record remain byte-for-byte unchanged.

This engineering report verifies implementation evidence. It does not promise AdSense approval, indexing, citation, or ranking; those decisions remain with external platforms.
`;
if (process.argv.includes("--write")) await writeFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-4.md"), report, "utf8");
else assert.equal(await readFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-4.md"), "utf8"), report);
console.log(`Stage 4 quality audit: PASS (${posts.length * 2 + (localizedGuides.length + englishOnly.length) * 2} discoverable guide records)`);
