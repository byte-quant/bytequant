import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pageLanguageHrefs, pathFor, postLanguageHrefs } from "../app/lib/site.ts";

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("tool library has a stable, locale-specific route in all four languages", () => {
  assert.deepEqual(pageLanguageHrefs("tools"), {
    tr: "/araclar",
    en: "/en/tools",
    de: "/de/tools",
    zh: "/zh/tools",
  });
  assert.equal(pathFor("tr", "tools"), "/araclar");
});

test("language switching keeps users on an equivalent page instead of the homepage", async () => {
  assert.deepEqual(pageLanguageHrefs("about"), {
    tr: "/hakkimizda",
    en: "/en/about",
    de: "/de/about",
    zh: "/zh/about",
  });
  assert.deepEqual(postLanguageHrefs("ornek-rehber", false), {
    tr: "/blog/ornek-rehber",
    en: "/en/blog/ornek-rehber",
    de: "/de/blog",
    zh: "/zh/blog",
  });
  const [blog, info, article] = await Promise.all([
    readSource("app/components/BlogIndex.tsx"),
    readSource("app/components/InfoPage.tsx"),
    readSource("app/components/ArticlePage.tsx"),
  ]);
  assert.match(blog, /pageLanguageHrefs\("blog"\)/);
  assert.match(info, /pageLanguageHrefs\(pageKey\)/);
  assert.match(article, /postLanguageHrefs\(post\.slug, isFourLanguageGuide\)/);
});

test("homepage presents a curated set while the dedicated library remains complete", async () => {
  const [home, library, sitemap] = await Promise.all([
    readSource("app/components/HomePage.tsx"),
    readSource("app/components/ToolLibraryPage.tsx"),
    readSource("app/sitemap.ts"),
  ]);
  assert.match(home, /home-featured-tools/);
  assert.match(home, /featuredTools\.map/);
  assert.doesNotMatch(home, /tools\.filter\(\(tool\) => tool\.category === key\)\.map\(\(tool\) => <ToolCard/);
  assert.match(library, /publicTools\.filter\(\(tool\) => tool\.category === key\)\.map/);
  assert.match(sitemap, /"home", "tools", "agent"/);
});

test("AdSense verification files are outside the Stage 1 implementation surface", async () => {
  const shell = await readSource("app/components/SiteShell.tsx");
  assert.doesNotMatch(shell, /adsbygoogle|pagead2/);
});
