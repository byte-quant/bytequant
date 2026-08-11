import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { localizedGuides } from "../app/lib/localized-guides.ts";
import { posts } from "../app/lib/posts.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Stage 4 adds an accessible, privacy-preserving guide explorer", async () => {
  const [explorer, blogIndex, localizedIndex, styles] = await Promise.all([
    read("app/components/GuideExplorer.tsx"),
    read("app/components/BlogIndex.tsx"),
    read("app/components/LocalizedBlogIndex.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(explorer, /data-guide-explorer="progressive"/);
  assert.match(explorer, /type="search"/);
  assert.match(explorer, /aria-live="polite"/);
  assert.match(explorer, /aria-pressed=\{scope === value\}/);
  assert.match(explorer, /hidden=\{index >= visibleCount\}/);
  assert.match(explorer, /toLocaleLowerCase\(localeTags\[locale\]\)/);
  assert.doesNotMatch(explorer, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB/iu);
  assert.match(blogIndex, /<GuideExplorer items=\{explorerItems\} locale=\{locale\}/);
  assert.match(localizedIndex, /<GuideExplorer items=\{explorerItems\} locale=\{locale\}/);
  assert.match(styles, /\.guide-explorer-card\[hidden\]/);
  assert.match(styles, /\.guide-explorer-toolbar/);
});

test("Stage 4 preserves every editorial record and language distinction", () => {
  assert.ok(posts.length >= 100, "TR/EN guide inventory unexpectedly shrank");
  assert.ok(localizedGuides.length >= 70, "DE/ZH localized guide inventory unexpectedly shrank");
  const localizedSlugs = new Set(localizedGuides.map((guide) => guide.slug));
  assert.equal(localizedSlugs.size, localizedGuides.length, "localized guide slugs must remain unique");
  assert.ok(posts.some((post) => !localizedSlugs.has(post.slug)), "language-labelled English originals should remain available");
  for (const guide of localizedGuides) {
    assert.ok(guide.copy.de.title.length > 20, `${guide.slug}: shallow German title`);
    assert.ok(guide.copy.zh.title.length > 6, `${guide.slug}: shallow Chinese title`);
  }
});
