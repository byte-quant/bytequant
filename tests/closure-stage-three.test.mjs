import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { localizedGuides } from "../app/lib/localized-guides.ts";
import { posts } from "../app/lib/posts.ts";
import { publicTools } from "../app/lib/tools.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Stage 3 keeps the protected AdSense identity byte-for-byte", async () => {
  const [ads, layout] = await Promise.all([read("public/ads.txt"), read("app/layout.tsx")]);
  assert.equal(ads, "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n");
  assert.equal(createHash("sha256").update(ads).digest("hex"), "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61");
  assert.match(layout, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847/);
});

test("tool decision guidance is specific, multilingual, and scenario based", async () => {
  const source = await read("app/components/ToolEditorialReview.tsx");
  assert.equal(publicTools.length, 317);
  assert.match(source, /data-content-depth="task-specific"/);
  assert.match(source, /tool\.useCases\[locale\]\.map/);
  assert.match(source, /tool\.steps\[locale\]\[0\]/);
  assert.match(source, /guidance\.output\[locale\]/);
  assert.match(source, /guidance\.verification\[locale\]/);
  assert.match(source, /guidance\.boundary\[locale\]/);
  for (const locale of ["tr", "en", "de", "zh"]) {
    assert.equal(new Set(publicTools.map((tool) => tool.description[locale])).size, publicTools.length);
    assert.ok(publicTools.every((tool) => tool.useCases[locale].length === 3 && tool.steps[locale].length === 3));
  }
});

test("guide depth is connected to real related tools instead of generic warnings", async () => {
  const [lab, article, localizedArticle] = await Promise.all([read("app/components/GuideValidationLab.tsx"), read("app/components/ArticlePage.tsx"), read("app/components/LocalizedGuidePage.tsx")]);
  assert.match(lab, /data-guide-content-depth="tool-specific"/);
  assert.match(lab, /getToolGuidanceDetails\(tool\)/);
  assert.match(lab, /guideSummary/);
  assert.doesNotMatch(lab, /legal, financial, medical, or security-significant decision/);
  assert.match(article, /guideValidationText/);
  assert.match(localizedArticle, /guideValidationText/);
  assert.ok(posts.length >= 90);
  assert.ok(localizedGuides.length >= 60);
  for (const guide of [...posts, ...localizedGuides]) assert.ok(guide.relatedTools.length > 0);
});
