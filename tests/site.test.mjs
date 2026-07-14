import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("exports the complete Turkish and English site", async () => {
  const [home, english, sitemap, robots] = await Promise.all([read("index.html"), read("en/index.html"), read("sitemap.xml"), read("robots.txt")]);
  assert.match(home, /Hassas verileriniz tarayıcıdan çıkmadan/);
  assert.match(english, /without sensitive data leaving your browser/);
  assert.match(home, /29 açıklanabilir araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(home, /En Çok Kullanılan Araçlar/);
  assert.match(english, /Most Used Tools/);
  assert.match(sitemap, /araclar\/prompt-kalite-denetimi/);
  assert.match(sitemap, /en\/tools\/prompt-kalite-denetimi/);
  assert.match(sitemap, /araclar\/exif-meta-veri-temizleyici/);
  assert.match(sitemap, /en\/tools\/qr-kod-olusturucu/);
  assert.match(robots, /sitemap\.xml/i);
  assert.doesNotMatch(home, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("exports all tool and guide routes", async () => {
  const [turkishTools, englishTools, turkishPosts, englishPosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 29);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 29);
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
  assert.match(page, /HowTo/);
  assert.match(page, /İLGİLİ ARAÇLAR/);
  assert.doesNotMatch(page, /pagead2\.googlesyndication\.com|fetch\(|axios/i);
});

test("exports the new bilingual tool package", async () => {
  const [fewShot, markdown, jwt, qr, exif, password, englishCron] = await Promise.all([
    read("araclar/few-shot-ornek-olusturucu/index.html"),
    read("araclar/markdown-onizleyici/index.html"),
    read("araclar/jwt-decoder/index.html"),
    read("araclar/qr-kod-olusturucu/index.html"),
    read("araclar/exif-meta-veri-temizleyici/index.html"),
    read("araclar/sifre-gucu-testi/index.html"),
    read("en/tools/cron-ifadesi-aciklayici/index.html"),
  ]);
  assert.match(fewShot, /Few-shot Örnek Oluşturucu/);
  assert.match(markdown, /Markdown Önizleyici/);
  assert.match(jwt, /JWT Decoder/);
  assert.match(qr, /QR Kod Oluşturucu/);
  assert.match(exif, /EXIF \/ Meta Veri Temizleyici/);
  assert.match(password, /Şifre Gücü Test Aracı/);
  assert.match(englishCron, /Cron Expression Explainer/);
  for (const page of [fewShot, markdown, jwt, qr, exif, password, englishCron]) {
    assert.match(page, /HowTo/);
    assert.doesNotMatch(page, /pagead2\.googlesyndication\.com|axios/i);
  }
});
