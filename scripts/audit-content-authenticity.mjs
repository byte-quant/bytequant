import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { info } from "../app/lib/info.ts";
import { localizedInfo } from "../app/lib/localized-info.ts";
import { publishingStandards } from "../app/lib/publishing-standards.ts";
import { studioToolDeepDiveSlugs } from "../app/lib/studio-tool-deep-dives.ts";
import { studioGuidanceSlugs, studioToolGuidance } from "../app/lib/studio-tool-guidance.ts";
import { studioToolSlugs } from "../app/lib/studio-tools.ts";
import { getToolDeepDive, toolDeepDiveSlugs } from "../app/lib/tool-deep-dives.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { publicTools } from "../app/lib/tools.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de", "zh"];
const unfinished = /(?:lorem ipsum|coming soon|under construction|placeholder content|yakında eklenecek|yapım aşamasında|demnächst verfügbar|即将推出)/iu;
const normalise = (value) => value.normalize("NFKC").replace(/\s+/gu, " ").trim();
const localeText = (sections) => sections.map((section) => `${section.heading ?? section.title} ${section.paragraphs.join(" ")} ${(section.bullets ?? section.checks ?? []).join(" ")}`).join(" ");

assert.equal(publicTools.length, 327, "canonical tool inventory changed without editorial review");
for (const locale of locales) {
  for (const field of ["title", "short", "description"]) {
    const values = publicTools.map((tool) => normalise(tool[field][locale]));
    assert.equal(new Set(values).size, publicTools.length, `${locale}/${field} contains duplicate canonical tool copy`);
    for (const [index, value] of values.entries()) {
      const minimum = field === "description" ? (locale === "zh" ? 28 : 75) : field === "title" ? 4 : (locale === "zh" ? 4 : 12);
      assert.ok(value.length >= minimum, `${publicTools[index].slug}/${locale}/${field} is too shallow`);
      assert.doesNotMatch(value, unfinished, `${publicTools[index].slug}/${locale}/${field} looks unfinished`);
    }
  }
  assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.useCases[locale]))).size, publicTools.length, `${locale}/useCases must be task-specific`);
  assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.steps[locale]))).size, publicTools.length, `${locale}/steps must be task-specific`);
}

for (const tool of publicTools) {
  const details = getToolGuidanceDetails(tool);
  for (const locale of locales) for (const field of ["input", "method", "output", "verification", "boundary"]) {
    const value = normalise(details[field][locale]);
    assert.ok(value.length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}/${field} lacks an actionable content contract`);
    assert.doesNotMatch(value, unfinished, `${tool.slug}/${locale}/${field} looks unfinished`);
  }
}

const studio = [...studioToolSlugs].sort();
assert.deepEqual([...studioGuidanceSlugs].sort(), studio, "studio tool-specific guidance coverage is incomplete");
assert.deepEqual([...studioToolDeepDiveSlugs].sort(), studio, "studio worked-example coverage is incomplete");
for (const locale of locales) {
  assert.equal(new Set(studio.map((slug) => studioToolGuidance[slug].input[locale])).size, studio.length, `${locale}/studio input contracts repeat`);
  assert.equal(new Set(studio.map((slug) => getToolDeepDive(slug)?.fixture[locale])).size, studio.length, `${locale}/studio fixtures repeat`);
}
assert.ok(toolDeepDiveSlugs.length >= 29, "high-intent worked-example library regressed");

for (const locale of ["tr", "en"]) {
  const about = info.about.sections[locale];
  const content = localeText(about);
  assert.ok(about.length >= 7, `${locale}/about must explain who, how, why, accountability, and completed tasks`);
  assert.ok(content.length >= 3600, `${locale}/about is not substantively complete`);
  assert.doesNotMatch(content, unfinished, `${locale}/about looks unfinished`);
}
for (const locale of ["de", "zh"]) {
  const about = localizedInfo[locale].about.sections;
  const content = localeText(about);
  assert.ok(about.length >= 7, `${locale}/about must explain who, how, why, accountability, and completed tasks`);
  assert.ok(content.length >= (locale === "zh" ? 900 : 3000), `${locale}/about is not substantively complete`);
  assert.doesNotMatch(content, unfinished, `${locale}/about looks unfinished`);
}
for (const locale of locales) {
  const standards = publishingStandards[locale];
  const content = localeText(standards.sections);
  assert.ok(standards.sections.length >= 6, `${locale}/publishing standards lost a required section`);
  assert.ok(content.length >= (locale === "zh" ? 1100 : locale === "de" ? 3800 : 4200), `${locale}/publishing standards are too shallow`);
  assert.equal(standards.sources.filter((source) => source.href.startsWith("https://")).length, standards.sources.length, `${locale}/publishing sources must be secure`);
}

const ads = await readFile(path.join(root, "public", "ads.txt"), "utf8");
const layout = await readFile(path.join(root, "app", "layout.tsx"), "utf8");
assert.equal(ads.trim(), "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0");
assert.match(layout, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847/);

const stripMarkup = (value) => value
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/&(?:nbsp|amp|quot|#39|lt|gt);/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();
const prefixes = { tr: "araclar", en: "en/tools", de: "de/tools", zh: "zh/tools" };
for (const locale of locales) for (const slug of studio) {
  const file = path.join(root, "out", prefixes[locale], slug, "index.html");
  const html = await readFile(file, "utf8");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/iu)?.[1] ?? html;
  const visible = stripMarkup(main);
  const paragraphs = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/giu)]
    .map((match) => normalise(stripMarkup(match[1])))
    .filter((paragraph) => paragraph.length >= (locale === "zh" ? 45 : 100));
  const duplicates = [...new Set(paragraphs.filter((paragraph, index) => paragraphs.indexOf(paragraph) !== index))];
  assert.ok(visible.length >= (locale === "zh" ? 2600 : 6000), `${slug}/${locale} rendered page is too shallow`);
  assert.ok(duplicates.length <= 1, `${slug}/${locale} repeats long paragraphs: ${duplicates.join(" | ")}`);
  assert.match(main, /id="worked-example"/u, `${slug}/${locale} lacks a rendered worked example`);
  assert.doesNotMatch(visible, unfinished, `${slug}/${locale} rendered page looks unfinished`);
}

console.log(`Content authenticity audit: PASS (${publicTools.length} canonical tools, ${toolDeepDiveSlugs.length} worked examples, four complete publisher locales).`);
