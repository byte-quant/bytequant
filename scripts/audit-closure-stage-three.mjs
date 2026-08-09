import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { localizedGuides } from "../app/lib/localized-guides.ts";
import { posts } from "../app/lib/posts.ts";
import { publicTools } from "../app/lib/tools.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const reportUrl = new URL("../docs/ADSENSE-CLOSURE-STAGE-3-REPORT.md", import.meta.url);
const locales = ["tr", "en", "de", "zh"];
const tags = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const toolPrefixes = { tr: "araclar", en: "en/tools", de: "de/tools", zh: "zh/tools" };
const guidePrefixes = { tr: "blog", en: "en/blog", de: "de/blog", zh: "zh/blog" };
const toolMinimum = { tr: 180, en: 180, de: 180, zh: 105 };
const guideMinimum = { tr: 125, en: 125, de: 125, zh: 75 };

const read = (relative) => readFile(join(root, relative), "utf8");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const decode = (value) => value
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&(?:nbsp|#160);/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/\s+/g, " ")
  .trim();
const words = (value, locale) => [...new Intl.Segmenter(tags[locale], { granularity: "word" }).segment(value)].filter((part) => part.isWordLike).length;
const markedSection = (html, marker) => {
  const markerIndex = html.indexOf(marker);
  assert.ok(markerIndex >= 0, `missing ${marker}`);
  const start = html.lastIndexOf("<section", markerIndex);
  const end = html.indexOf("</section>", markerIndex);
  assert.ok(start >= 0 && end > markerIndex, `cannot isolate ${marker}`);
  return html.slice(start, end + "</section>".length);
};

const [adsTxt, layout, editorialSource, validationSource, articleSource, localizedArticleSource] = await Promise.all([
  read("public/ads.txt"), read("app/layout.tsx"), read("app/components/ToolEditorialReview.tsx"), read("app/components/GuideValidationLab.tsx"), read("app/components/ArticlePage.tsx"), read("app/components/LocalizedGuidePage.tsx"),
]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(hash(adsTxt), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");
assert.match(editorialSource, /data-content-depth="task-specific"/);
assert.match(editorialSource, /tool\.useCases\[locale\]\.map/);
assert.match(editorialSource, /guidance\.boundary\[locale\]/);
assert.match(validationSource, /data-guide-content-depth="tool-specific"/);
assert.match(validationSource, /getToolGuidanceDetails\(tool\)/);
assert.match(articleSource, /guideValidationText/);
assert.match(localizedArticleSource, /guideValidationText/);
assert.doesNotMatch(validationSource, /legal, financial, medical, or security-significant decision/);

assert.equal(publicTools.length, 309, "closure audit expects 309 canonical tools");
const toolMinima = {};
const guideMinima = {};
for (const locale of locales) {
  const signatures = new Set();
  let minimum = Number.POSITIVE_INFINITY;
  for (const tool of publicTools) {
    const html = await read(join("out", toolPrefixes[locale], tool.slug, "index.html"));
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${locale}/${tool.slug} must remain indexable`);
    const section = markedSection(html, 'data-content-depth="task-specific"');
    const text = decode(section);
    const count = words(text, locale);
    assert.ok(count >= toolMinimum[locale], `${locale}/${tool.slug} task-specific guide is too thin (${count})`);
    for (const useCase of tool.useCases[locale]) assert.ok(text.includes(useCase), `${locale}/${tool.slug} omits use case: ${useCase}`);
    assert.ok(text.includes(tool.title[locale]), `${locale}/${tool.slug} omits its own title`);
    signatures.add(hash(text));
    minimum = Math.min(minimum, count);
  }
  assert.equal(signatures.size, publicTools.length, `${locale} tool decision guides must be unique`);
  toolMinima[locale] = minimum;
}

const guideCollections = { tr: posts, en: posts, de: localizedGuides, zh: localizedGuides };
for (const locale of locales) {
  const signatures = new Set();
  let minimum = Number.POSITIVE_INFINITY;
  for (const guide of guideCollections[locale]) {
    const html = await read(join("out", guidePrefixes[locale], guide.slug, "index.html"));
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${locale}/${guide.slug} must remain indexable`);
    const section = markedSection(html, 'data-guide-content-depth="tool-specific"');
    const text = decode(section);
    const count = words(text, locale);
    assert.ok(count >= guideMinimum[locale], `${locale}/${guide.slug} applied guide is too thin (${count})`);
    const title = locale === "tr" || locale === "en" ? guide.title[locale] : guide.copy[locale].title;
    assert.ok(text.includes(title), `${locale}/${guide.slug} validation omits guide title`);
    for (const slug of guide.relatedTools) {
      const tool = publicTools.find((candidate) => candidate.slug === slug);
      assert.ok(tool, `${locale}/${guide.slug} references missing tool ${slug}`);
      assert.ok(text.includes(tool.title[locale]), `${locale}/${guide.slug} omits ${tool.title[locale]}`);
    }
    signatures.add(hash(text));
    minimum = Math.min(minimum, count);
  }
  assert.equal(signatures.size, guideCollections[locale].length, `${locale} applied guide sections must be unique`);
  guideMinima[locale] = minimum;
}

const report = `# AdSense closure plan — Stage 3 report

Generated: 2026-08-09

## Scope closed

Stage 3 addresses the highest-risk rejection theme: content quality and depth. It replaces repeated publication boilerplate with task-specific decision guidance and makes every guide's applied review depend on the actual tools, inputs, methods, outputs, verification steps, and stop conditions it discusses. It does not claim or guarantee AdSense approval; Google alone makes the review decision.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |

The gate fails immediately if any protected value changes.

## Measured content evidence

| Measure | Result |
| --- | ---: |
| Canonical tools with unique four-language decision guides | ${publicTools.length} |
| Indexable localized tool decision guides inspected | ${publicTools.length * locales.length} |
| TR/EN editorial guides with applied tool-specific review | ${posts.length * 2} |
| DE/ZH editorial guides with applied tool-specific review | ${localizedGuides.length * 2} |
| Smallest TR/EN/DE/ZH tool decision guide | ${locales.map((locale) => `${locale.toUpperCase()} ${toolMinima[locale]}`).join(" · ")} words |
| Smallest TR/EN/DE/ZH applied guide review | ${locales.map((locale) => `${locale.toUpperCase()} ${guideMinima[locale]}`).join(" · ")} words |

## Editorial repairs

- Every canonical tool now explains its accepted input, disclosed method, expected output, three real use cases, acceptance signals, tool-specific stop condition, and safe next step in all four languages.
- Generic “unique canonical URL” copy was removed from the visible quality passport. The replacement is written around the actual tool task and remains unique across all 309 tools per locale.
- Guide validation blocks now use the real related tools and their input, method, output, verification, and boundary text. The same broad legal/medical/financial warning is no longer repeated on unrelated guides.
- BlogPosting word counts now include the visible applied verification material, so structured data reflects the article readers actually receive.
- Canonical tools and editorial guides remain indexable; no discoverable content was removed or blanket-noindexed.

## Gate result

Stage 3 content-depth, static-export, and protected-AdSense checks: **PASS**. Policy Center state, CMP configuration, traffic quality, and the final AdSense decision remain account-side evidence that repository automation cannot infer.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated closure Stage 3 report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "closure Stage 3 report is stale; run pnpm closure3:generate");
  console.log(`Closure Stage 3 audit: PASS (${publicTools.length * locales.length} localized tool guides, ${posts.length * 2 + localizedGuides.length * 2} localized editorial guides)`);
  console.log(`Minimum tool depth: ${JSON.stringify(toolMinima)}; minimum guide depth: ${JSON.stringify(guideMinima)}`);
}
