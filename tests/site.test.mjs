import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("exports the complete Turkish and English site", async () => {
  const [home, english, sitemap, robots] = await Promise.all([read("index.html"), read("en/index.html"), read("sitemap.xml"), read("robots.txt")]);
  assert.match(home, /Hassas verileriniz tarayıcıdan çıkmadan/);
  assert.match(english, /without sensitive data leaving your browser/);
  assert.match(home, /18 açıklanabilir araç/);
  assert.match(sitemap, /araclar\/prompt-kalite-denetimi/);
  assert.match(sitemap, /en\/tools\/prompt-kalite-denetimi/);
  assert.match(robots, /sitemap\.xml/i);
  assert.doesNotMatch(home, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("exports all tool and guide routes", async () => {
  const [turkishTools, englishTools, turkishPosts, englishPosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 18);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 18);
  assert.ok(turkishPosts.length >= 8);
  assert.ok(englishPosts.length >= 8);
  await access(new URL("gizlilik-politikasi/index.html", root));
  await access(new URL("en/privacy/index.html", root));
});

test("tool pages explain local processing and expose structured data", async () => {
  const page = await read("araclar/kvkk-veri-maskeleyici/index.html");
  assert.match(page, /Girdi bu sayfadan ayrılmaz/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /FAQPage/);
  assert.doesNotMatch(page, /pagead2\.googlesyndication\.com|fetch\(|axios/i);
});

