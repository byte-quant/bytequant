import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { posts } from "../app/lib/posts.ts";
import { localizedGuides } from "../app/lib/localized-guides.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de", "zh"];
const routePrefix = { tr: "araclar", en: "en/tools", de: "de/tools", zh: "zh/tools" };
const guidePrefix = { tr: "blog", en: "en/blog", de: "de/blog", zh: "zh/blog" };
const languageTag = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const readOut = (relative) => readFile(path.join(root, "out", relative, "index.html"), "utf8");
const words = (text, locale) => [...new Intl.Segmenter(languageTag[locale], { granularity: "word" }).segment(text)].filter((part) => part.isWordLike).length;
const toolBySlug = new Map(publicTools.map((tool) => [tool.slug, tool]));

assert.equal(publicTools.length, 327, "editorial audit expects 327 canonical tools");
for (const locale of locales) {
  for (const field of ["title", "short", "description"]) {
    const values = publicTools.map((tool) => tool[field][locale]);
    assert.equal(new Set(values).size, values.length, `${locale} tool ${field} copy must be unique`);
  }
}

for (const tool of publicTools) {
  for (const locale of locales) {
    assert.ok(words(tool.description[locale], locale) >= 12, `${locale}/${tool.slug} needs a substantive description`);
    assert.equal(tool.steps[locale].length, 3, `${locale}/${tool.slug} must expose three usage steps`);
    assert.equal(tool.useCases[locale].length, 3, `${locale}/${tool.slug} must expose three use cases`);
  }
  const categoryPosts = posts.filter((post) => post.relatedTools.some((slug) => toolBySlug.get(slug)?.category === tool.category));
  const categoryLocalized = localizedGuides.filter((guide) => guide.relatedTools.some((slug) => toolBySlug.get(slug)?.category === tool.category));
  assert.ok(categoryPosts.length, `${tool.slug} needs an editorial guide path for TR/EN`);
  assert.ok(categoryLocalized.length, `${tool.slug} needs a localized editorial guide path for DE/ZH`);
}

for (const post of posts) {
  assert.ok(post.relatedTools.length, `${post.slug} needs at least one related tool`);
  assert.ok(post.relatedTools.every((slug) => toolBySlug.has(slug)), `${post.slug} references an unknown tool`);
  for (const locale of ["tr", "en"]) {
    assert.ok(post.sections[locale].length >= 3, `${locale}/${post.slug} needs at least three sections`);
    assert.ok(post.sections[locale].reduce((count, section) => count + section.paragraphs.length, 0) >= 6, `${locale}/${post.slug} needs at least six explanatory paragraphs`);
  }
}

for (const guide of localizedGuides) {
  assert.ok(guide.relatedTools.length, `${guide.slug} needs at least one related tool`);
  assert.ok(guide.relatedTools.every((slug) => toolBySlug.has(slug)), `${guide.slug} references an unknown tool`);
  for (const locale of ["de", "zh"]) {
    assert.ok(guide.copy[locale].sections.length >= 3, `${locale}/${guide.slug} needs at least three sections`);
    assert.ok(guide.copy[locale].sections.reduce((count, section) => count + section.paragraphs.length, 0) >= 6, `${locale}/${guide.slug} needs at least six explanatory paragraphs`);
  }
}

for (const locale of locales) {
  for (const tool of publicTools) {
    const html = await readOut(`${routePrefix[locale]}/${tool.slug}`);
    assert.match(html, /data-editorial-depth="applied"/, `${locale}/${tool.slug} lacks an applied quality passport`);
    assert.match(html, /data-guide-links="editorial"/, `${locale}/${tool.slug} lacks an editorial guide path`);
    assert.match(html, /FAQPage/, `${locale}/${tool.slug} lacks visible-matched FAQ schema`);
    assert.match(html, /HowTo/, `${locale}/${tool.slug} lacks visible-matched HowTo schema`);
  }
}

for (const post of posts) {
  for (const locale of ["tr", "en"]) {
    const html = await readOut(`${guidePrefix[locale]}/${post.slug}`);
    assert.match(html, /data-guide-validation="applied"/, `${locale}/${post.slug} lacks the applied verification worksheet`);
  }
}
for (const guide of localizedGuides) {
  for (const locale of ["de", "zh"]) {
    const html = await readOut(`${guidePrefix[locale]}/${guide.slug}`);
    assert.match(html, /data-guide-validation="applied"/, `${locale}/${guide.slug} lacks the localized verification worksheet`);
  }
}

console.log(`Editorial depth audit: PASS (${publicTools.length} tools, ${posts.length} TR/EN guides, ${localizedGuides.length} DE/ZH guides)`);
console.log("Every canonical tool has unique four-language copy, an applied acceptance path, and a topic-relevant guide route.");
