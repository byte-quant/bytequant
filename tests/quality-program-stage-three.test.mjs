import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { stageThreePosts, stageThreeLocalizedGuides } from "../app/lib/stage-three-guides.ts";
import { publicTools } from "../app/lib/tools.ts";

const locales = ["tr", "en", "de", "zh"];
const toolSlugs = new Set(publicTools.map((tool) => tool.slug));
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Stage 3 publishes four original, actionable guides in every language", () => {
  assert.equal(stageThreePosts.length, 4);
  assert.equal(stageThreeLocalizedGuides.length, 4);
  assert.deepEqual(new Set(stageThreePosts.map((post) => post.slug)), new Set(stageThreeLocalizedGuides.map((guide) => guide.slug)));
  for (const post of stageThreePosts) {
    assert.equal(post.relatedTools.length, 4, `${post.slug}: expected four workflow tools`);
    assert.equal(new Set(post.relatedTools).size, 4, `${post.slug}: duplicate workflow tool`);
    for (const slug of post.relatedTools) assert.ok(toolSlugs.has(slug), `${post.slug}: missing tool ${slug}`);
    for (const locale of ["tr", "en"]) {
      const sections = post.sections[locale];
      const prose = sections.flatMap((section) => section.paragraphs).join(" ");
      assert.equal(sections.length, 5, `${post.slug}/${locale}: incomplete guide structure`);
      assert.ok(prose.length >= (locale === "tr" ? 1700 : 1450), `${post.slug}/${locale}: guide lacks depth`);
      assert.equal(new Set(sections.map((section) => section.heading)).size, sections.length, `${post.slug}/${locale}: duplicate headings`);
    }
    const localized = stageThreeLocalizedGuides.find((guide) => guide.slug === post.slug);
    assert.ok(localized, `${post.slug}: missing DE/ZH record`);
    for (const locale of ["de", "zh"]) {
      const sections = localized.copy[locale].sections;
      const prose = sections.flatMap((section) => section.paragraphs).join(" ");
      assert.equal(sections.length, 5, `${post.slug}/${locale}: incomplete guide structure`);
      assert.ok(prose.length >= (locale === "zh" ? 500 : 1150), `${post.slug}/${locale}: guide lacks depth`);
      assert.equal(new Set(sections.map((section) => section.heading)).size, sections.length, `${post.slug}/${locale}: duplicate headings`);
    }
  }
  assert.deepEqual(locales, ["tr", "en", "de", "zh"]);
});

test("every guide page exposes a private interactive action plan", async () => {
  const [plan, article, localized, styles] = await Promise.all([
    read("app/components/GuideActionPlan.tsx"),
    read("app/components/ArticlePage.tsx"),
    read("app/components/LocalizedGuidePage.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(plan, /data-guide-action-plan="interactive"/);
  assert.match(plan, /aria-pressed=\{checked\}/);
  assert.match(plan, /navigator\.clipboard\.writeText/);
  assert.doesNotMatch(plan, /localStorage|sessionStorage|indexedDB/iu);
  assert.match(article, /<GuideActionPlan/);
  assert.match(localized, /<GuideActionPlan/);
  assert.match(styles, /\.guide-action-plan/);
  for (const locale of locales) assert.match(plan, new RegExp(`\\b${locale}: \\{`));
});
