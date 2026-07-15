import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("exports the complete Turkish and English site", async () => {
  const [home, english, sitemap, robots, llms] = await Promise.all([read("index.html"), read("en/index.html"), read("sitemap.xml"), read("robots.txt"), read("llms.txt")]);
  assert.match(home, /Hassas verileriniz tarayıcıdan çıkmadan/);
  assert.match(english, /without sensitive data leaving your browser/);
  assert.match(home, /38 açıklanabilir araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(home, /En Çok Kullanılan Araçlar/);
  assert.match(english, /Most Used Tools/);
  assert.match(home, /<title>ByteQuant ·/);
  assert.match(home, /hrefLang="tr-TR"/);
  assert.match(home, /hrefLang="en-US"/);
  assert.match(home, /hrefLang="x-default"/);
  assert.match(sitemap, /araclar\/prompt-kalite-denetimi/);
  assert.match(sitemap, /en\/tools\/prompt-kalite-denetimi/);
  assert.match(sitemap, /araclar\/exif-meta-veri-temizleyici/);
  assert.match(sitemap, /en\/tools\/qr-kod-olusturucu/);
  assert.match(sitemap, /araclar\/arac-zinciri-pipeline/);
  assert.match(sitemap, /en\/tools\/json-diff-karsilastirma/);
  assert.match(sitemap, /araclar\/gorsel-format-donusturucu/);
  assert.match(sitemap, /en\/tools\/pdf-birlestirme/);
  assert.match(sitemap, /referanslar\/regex-cheat-sheet/);
  assert.match(sitemap, /en\/references\/cron-cheat-sheet/);
  assert.match(sitemap, /cerez-politikasi/);
  assert.match(sitemap, /en\/cookies/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.match(robots, /sitemap\.xml/i);
  for (const crawler of ["Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Applebot-Extended", "CCBot"]) {
    assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*?Allow: /`));
  }
  assert.match(llms, /^# ByteQuant/m);
  assert.equal((llms.match(/^- \[/gm) ?? []).length, 38);
  assert.match(home, /38 araç ve 2 referansta ara/);
  assert.doesNotMatch(home, /codex-preview|react-loading-skeleton|Your site is taking shape/);
  assert.doesNotMatch(home, /pagead2\.googlesyndication\.com|googletagmanager\.com|adsbygoogle/i);
});

test("exports consent, storage, and security disclosures", async () => {
  const [cookies, englishCookies, privacy, security, llms] = await Promise.all([
    read("cerez-politikasi/index.html"),
    read("en/cookies/index.html"),
    read("gizlilik-politikasi/index.html"),
    read(".well-known/security.txt"),
    read("llms.txt"),
  ]);
  for (const page of [cookies, englishCookies]) {
    assert.match(page, /bq-consent-v1/);
    assert.match(page, /bq-tool-usage-v1/);
    assert.match(page, /180/);
    assert.doesNotMatch(page, /pagead2\.googlesyndication\.com|googletagmanager\.com|adsbygoogle/i);
  }
  assert.match(privacy, /Google-certified CMP|CMP/);
  assert.match(security, /Contact: mailto:bytequant@yahoo\.com/);
  assert.match(security, /Canonical: https:\/\/bytequant\.org\/\.well-known\/security\.txt/);
  assert.match(llms, /Optional tool-visit counting is off until/);
  assert.match(llms, /https:\/\/bytequant\.org\/en\/cookies/);
});

test("exports all tool and guide routes", async () => {
  const [turkishTools, englishTools, turkishPosts, englishPosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 38);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 38);
  assert.ok(turkishPosts.length >= 21);
  assert.ok(englishPosts.length >= 21);
  await access(new URL("gizlilik-politikasi/index.html", root));
  await access(new URL("en/privacy/index.html", root));
  await access(new URL("cerez-politikasi/index.html", root));
  await access(new URL("en/cookies/index.html", root));
  await access(new URL("blog/exif-metadata-gizlilik-rehberi/index.html", root));
  await access(new URL("en/blog/qr-kod-guvenligi-ve-gizlilik/index.html", root));
  await access(new URL("blog/csv-kvkk-maskeleme-json-pipeline/index.html", root));
  await access(new URL("en/blog/meta-etiket-favicon-open-graph-seo/index.html", root));
  await access(new URL("blog/webp-png-jpg-gorsel-format-optimizasyonu/index.html", root));
  await access(new URL("en/blog/pdf-birlestirme-bolme-gizlilik-guvenlik/index.html", root));
  await access(new URL("referanslar/regex-cheat-sheet/index.html", root));
  await access(new URL("en/references/cron-cheat-sheet/index.html", root));
});

test("tool pages explain local processing and expose structured data", async () => {
  const page = await read("araclar/kvkk-veri-maskeleyici/index.html");
  assert.match(page, /Girdi bu sayfadan ayrılmaz/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /FAQPage/);
  assert.match(page, /HowTo/);
  assert.match(page, /BreadcrumbList/);
  assert.match(page, /WebApplication/);
  assert.match(page, /tool-transparency/);
  assert.match(page, /İLGİLİ ARAÇLAR/);
  assert.match(page, /Örnek veri yükle/);
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
    assert.match(page, /Örnek veri yükle|Load example/);
    assert.doesNotMatch(page, /pagead2\.googlesyndication\.com|axios/i);
  }
});

test("exports the pipeline and developer workflow package", async () => {
  const pages = await Promise.all([
    read("araclar/arac-zinciri-pipeline/index.html"),
    read("araclar/json-diff-karsilastirma/index.html"),
    read("araclar/curl-kod-donusturucu/index.html"),
    read("araclar/meta-etiket-favicon-uretici/index.html"),
    read("en/tools/arac-zinciri-pipeline/index.html"),
  ]);
  for (const page of pages) {
    assert.match(page, /HowTo/);
    assert.match(page, /Örnek veri yükle|Load example/);
    assert.match(page, /active browser tab|etkin tarayıcı sekmesi/i);
  }
  assert.match(pages[0], /algoritmik tespit|algorithmic detection/i);
  assert.match(pages[1], /imza\/kimlik doğrulaması|signatures, or identities/i);
  assert.match(pages[2], /komutunu çalıştırmadan|without executing/i);
  assert.match(pages[3], /indeksleme garantisi|indexing guarantee/i);
});

test("exports bilingual local image and PDF converters", async () => {
  const pages = await Promise.all([
    read("araclar/gorsel-format-donusturucu/index.html"),
    read("araclar/gorsel-sikistirici/index.html"),
    read("araclar/gorselden-pdf/index.html"),
    read("araclar/pdf-birlestirme/index.html"),
    read("araclar/pdf-bolme/index.html"),
    read("en/tools/pdf-birlestirme/index.html"),
  ]);
  for (const page of pages) {
    assert.match(page, /HowTo/);
    assert.match(page, /Örnek veri yükle|Load example/);
    assert.match(page, /active browser tab|etkin tarayıcı sekmesi/i);
    assert.match(page, /İLGİLİ ARAÇLAR|RELATED TOOLS/);
    assert.doesNotMatch(page, /axios|upload\s+to\s+(?:our|the)\s+server/i);
  }
  assert.match(pages[0], /gerçek vektörleştirme|vectorize PNG/i);
  assert.match(pages[3], /korumasını aşmaz|never bypasses encryption/i);
  assert.match(pages[4], /dijital imzalar|digital signatures/i);
});

test("every localized tool exposes demo UX and HowTo schema", async () => {
  const [turkishTools, englishTools, faq, englishFaq] = await Promise.all([
    readdir(new URL("araclar/", root)),
    readdir(new URL("en/tools/", root)),
    read("sss/index.html"),
    read("en/faq/index.html"),
  ]);
  for (const slug of turkishTools.filter((name) => !name.startsWith("."))) {
    const page = await read(`araclar/${slug}/index.html`);
    assert.match(page, /Örnek veri yükle/);
    assert.match(page, /HowTo/);
  }
  for (const slug of englishTools.filter((name) => !name.startsWith("."))) {
    const page = await read(`en/tools/${slug}/index.html`);
    assert.match(page, /Load example/);
    assert.match(page, /HowTo/);
  }
  assert.match(faq, /FAQPage/);
  assert.match(englishFaq, /FAQPage/);
});
