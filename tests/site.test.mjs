import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

test("exports the complete four-language site", async () => {
  const [home, english, german, chinese, sitemap, robots, llms, manifest, worker] = await Promise.all([read("index.html"), read("en/index.html"), read("de/index.html"), read("zh/index.html"), read("sitemap.xml"), read("robots.txt"), read("llms.txt"), read("manifest.webmanifest"), read("sw.js")]);
  assert.match(home, /Hassas verileriniz tarayıcıdan çıkmadan/);
  assert.match(english, /without sensitive data leaving your browser/);
  assert.match(home, /53 açıklanabilir araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(german, /<html lang="de"/);
  assert.match(chinese, /<html lang="zh-CN"/);
  assert.match(german, /53 nachvollziehbare Werkzeuge/);
  assert.match(chinese, /53 个可解释工具/);
  assert.match(home, /En Çok Kullanılan Araçlar/);
  assert.match(english, /Most Used Tools/);
  assert.match(home, /<title>ByteQuant ·/);
  assert.match(home, /hrefLang="tr-TR"/);
  assert.match(home, /hrefLang="en-US"/);
  assert.match(home, /hrefLang="tr"/);
  assert.match(home, /hrefLang="en"/);
  assert.match(home, /hrefLang="de-DE"/);
  assert.match(home, /hrefLang="zh-CN"/);
  assert.match(home, /hrefLang="x-default"/);
  assert.match(home, /href="https:\/\/bytequant\.org\/en\/" hrefLang="x-default"|hrefLang="x-default" href="https:\/\/bytequant\.org\/en\/"/);
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
  assert.match(sitemap, /blog\/nextjs-hreflang-canonical-global-seo-rehberi/);
  assert.match(sitemap, /en\/blog\/geo-aeo-ai-overviews-teknik-seo-rehberi/);
  assert.match(sitemap, /blog\/json-ld-schema-nextjs-denetim-rehberi/);
  assert.match(sitemap, /blog\/pwa-kurulum-offline-onbellek-gizlilik-rehberi/);
  assert.match(sitemap, /en\/blog\/tarayicida-dosya-risk-taramasi-sinirlari/);
  assert.match(sitemap, /blog\/kod-guvenligi-on-tarama-sast-kod-inceleme/);
  assert.match(sitemap, /en\/blog\/token-baglam-butcesi-sistem-promptu-kontrol-listesi/);
  assert.match(sitemap, /cerez-politikasi/);
  assert.match(sitemap, /en\/cookies/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.match(robots, /sitemap\.xml/i);
  for (const crawler of ["Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Applebot-Extended", "CCBot"]) {
    assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*?Allow: /`));
  }
  assert.match(llms, /^# ByteQuant/m);
  assert.equal((llms.match(/^- \[/gm) ?? []).length, 53);
  assert.match(home, /aria-label="Araç ve referans ara"/);
  assert.match(german, /aria-label="Werkzeuge und Referenzen durchsuchen"/);
  assert.match(chinese, /aria-label="搜索工具和参考资料"/);
  assert.match(manifest, /standalone/);
  assert.match(manifest, /app-icon-maskable\.svg/);
  assert.match(worker, /bytequant-shell-v5/);
  assert.doesNotMatch(worker, /localStorage/i);
  assert.match(worker, /cache\.put\(pageKey/);
  const navigationCacheBranch = worker.slice(worker.indexOf('if (request.mode === "navigate")'), worker.indexOf('if (["script", "style", "image", "font"]'));
  assert.doesNotMatch(navigationCacheBranch, /cache\.put\(request/);
  assert.match(worker, /\["script", "style", "image", "font"\]\.includes\(request\.destination\)/);
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
  const [turkishTools, englishTools, germanTools, chineseTools, turkishPosts, englishPosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("de/tools/", root)), readdir(new URL("zh/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 53);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 53);
  assert.equal(germanTools.filter((name) => !name.startsWith(".")).length, 53);
  assert.equal(chineseTools.filter((name) => !name.startsWith(".")).length, 53);
  assert.ok(turkishPosts.length >= 28);
  assert.ok(englishPosts.length >= 28);
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
  await access(new URL("blog/nextjs-hreflang-canonical-global-seo-rehberi/index.html", root));
  await access(new URL("en/blog/geo-aeo-ai-overviews-teknik-seo-rehberi/index.html", root));
  await access(new URL("blog/json-ld-schema-nextjs-denetim-rehberi/index.html", root));
  await access(new URL("blog/pwa-kurulum-offline-onbellek-gizlilik-rehberi/index.html", root));
  await access(new URL("en/blog/tarayicida-dosya-risk-taramasi-sinirlari/index.html", root));
  await access(new URL("blog/kod-guvenligi-on-tarama-sast-kod-inceleme/index.html", root));
  await access(new URL("en/blog/token-baglam-butcesi-sistem-promptu-kontrol-listesi/index.html", root));
  await access(new URL("referanslar/regex-cheat-sheet/index.html", root));
  await access(new URL("en/references/cron-cheat-sheet/index.html", root));
});

test("tool pages explain local processing and expose structured data", async () => {
  const page = await read("araclar/kvkk-veri-maskeleyici/index.html");
  assert.match(page, /Girdi bu sayfadan ayrılmaz/);
  assert.match(page, /application\/ld\+json/);
  assert.doesNotMatch(page, /FAQPage/);
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

test("exports four-language calculation, AI, document, and security tools", async () => {
  const pages = await Promise.all([
    read("araclar/yatirim-getiri-simulatoru/index.html"),
    read("en/tools/kaynakca-atif-formatlayici/index.html"),
    read("de/tools/sistem-promptu-netlik-kontrolu/index.html"),
    read("zh/tools/dosya-risk-on-taramasi/index.html"),
    read("en/tools/kod-guvenligi-on-taramasi/index.html"),
    read("de/tools/url-guvenlik-on-kontrolu/index.html"),
  ]);
  for (const page of pages) {
    assert.match(page, /HowTo/);
    assert.match(page, /WebApplication/);
    assert.match(page, /active browser tab|etkin tarayıcı sekmesi|aktiven Browser-Tab|当前浏览器标签页/i);
  }
  assert.match(pages[0], /yatırım tavsiyesi değildir/i);
  assert.match(pages[2], /KI-Anweisungen|System-Prompt/i);
  assert.match(pages[3], /不是杀毒软件|不是.*杀毒/i);
  assert.match(pages[4], /does not replace SAST|does not replace.*expert review/i);
  assert.match(pages[5], /weder Reputation|keine.*Reputationsprüfung|ohne.*Remote-API/i);
});

test("every localized tool exposes demo UX and HowTo schema", async () => {
  const [turkishTools, englishTools, germanTools, chineseTools, faq, englishFaq, germanFaq, chineseFaq] = await Promise.all([
    readdir(new URL("araclar/", root)),
    readdir(new URL("en/tools/", root)),
    readdir(new URL("de/tools/", root)),
    readdir(new URL("zh/tools/", root)),
    read("sss/index.html"),
    read("en/faq/index.html"),
    read("de/faq/index.html"),
    read("zh/faq/index.html"),
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
  for (const slug of germanTools.filter((name) => !name.startsWith("."))) {
    const page = await read(`de/tools/${slug}/index.html`);
    assert.match(page, /Beispiel laden/);
    assert.match(page, /HowTo/);
  }
  for (const slug of chineseTools.filter((name) => !name.startsWith("."))) {
    const page = await read(`zh/tools/${slug}/index.html`);
    assert.match(page, /加载示例/);
    assert.match(page, /HowTo/);
  }
  assert.match(faq, /FAQPage/);
  assert.match(englishFaq, /FAQPage/);
  assert.match(germanFaq, /FAQPage/);
  assert.match(chineseFaq, /FAQPage/);
});

test("exports the bilingual editorial discovery and structured-data package", async () => {
  const [blog, englishBlog, article, englishArticle, feed, englishFeed] = await Promise.all([
    read("blog/index.html"),
    read("en/blog/index.html"),
    read("blog/json-ld-schema-nextjs-denetim-rehberi/index.html"),
    read("en/blog/nextjs-hreflang-canonical-global-seo-rehberi/index.html"),
    read("feed.xml"),
    read("en/feed.xml"),
  ]);
  assert.match(blog, /<strong>28<\/strong>\s*ayrıntılı rehber/);
  assert.match(englishBlog, /<strong>28<\/strong>\s*in-depth guides/);
  assert.ok(blog.indexOf("json-ld-schema-nextjs-denetim-rehberi") < blog.indexOf("geo-aeo-ai-overviews-teknik-seo-rehberi"));
  assert.match(blog, /application\/rss\+xml/);
  assert.match(englishBlog, /application\/rss\+xml/);
  for (const page of [blog, englishBlog, article, englishArticle]) {
    assert.doesNotThrow(() => jsonLd(page));
  }
  const articleNodes = jsonLd(article).flatMap((value) => Array.isArray(value) ? value : [value]);
  const articleSchema = articleNodes.find((value) => value["@type"] === "BlogPosting");
  assert.ok(articleSchema);
  assert.equal(articleSchema.publisher["@id"], "https://bytequant.org/#organization");
  assert.match(articleSchema.datePublished, /T09:00:00\+03:00$/);
  assert.ok(articleSchema.citation.length >= 2);
  assert.match(article, /Kaynaklar ve doğrulama/);
  assert.match(article, /developers\.google\.com/);
  assert.doesNotMatch(article, /Görsel önerisi|Visual suggestion/);
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(feed, /<language>tr-TR<\/language>/);
  assert.match(feed, /json-ld-schema-nextjs-denetim-rehberi/);
  assert.match(englishFeed, /<language>en-US<\/language>/);
  assert.match(englishFeed, /nextjs-hreflang-canonical-global-seo-rehberi/);
});
