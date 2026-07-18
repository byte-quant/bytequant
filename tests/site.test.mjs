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
  assert.match(home, /89 açıklanabilir araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(german, /<html lang="de"/);
  assert.match(chinese, /<html lang="zh-CN"/);
  assert.match(german, /89 nachvollziehbare Werkzeuge/);
  assert.match(chinese, /89 个可解释工具/);
  assert.match(home, /En Çok Kullanılan Araçlar/);
  assert.match(english, /Most Used Tools/);
  assert.match(home, /<title>ByteQuant ·/);
  assert.match(home, /og-v2\.png/);
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
  assert.match(sitemap, /araclar\/yaml-json-donusturucu/);
  assert.match(sitemap, /en\/tools\/hreflang-etiket-olusturucu/);
  assert.match(sitemap, /de\/tools\/hmac-olusturucu-dogrulayici/);
  assert.match(sitemap, /zh\/tools\/prompt-enjeksiyon-on-taramasi/);
  assert.match(sitemap, /araclar\/prompt-test-vaka-matrisi/);
  assert.match(sitemap, /en\/tools\/data-uri-donusturucu/);
  assert.match(sitemap, /de\/tools\/http-guvenlik-basliklari-denetleyici/);
  assert.match(sitemap, /referanslar\/regex-cheat-sheet/);
  assert.match(sitemap, /en\/references\/cron-cheat-sheet/);
  assert.match(sitemap, /blog\/nextjs-hreflang-canonical-global-seo-rehberi/);
  assert.match(sitemap, /en\/blog\/geo-aeo-ai-overviews-teknik-seo-rehberi/);
  assert.match(sitemap, /blog\/json-ld-schema-nextjs-denetim-rehberi/);
  assert.match(sitemap, /blog\/pwa-kurulum-offline-onbellek-gizlilik-rehberi/);
  assert.match(sitemap, /en\/blog\/tarayicida-dosya-risk-taramasi-sinirlari/);
  assert.match(sitemap, /blog\/kod-guvenligi-on-tarama-sast-kod-inceleme/);
  assert.match(sitemap, /en\/blog\/token-baglam-butcesi-sistem-promptu-kontrol-listesi/);
  assert.match(sitemap, /de\/blog\/local-prompt-text-date-workflow/);
  assert.match(sitemap, /zh\/blog\/loan-ai-rubric-csp-workflow/);
  assert.match(sitemap, /de\/blog\/technical-seo-robots-hreflang-faq-utm-workflow/);
  assert.match(sitemap, /zh\/blog\/web-crypto-rag-prompt-injection-security-workflow/);
  assert.match(sitemap, /de\/references\/regex-cheat-sheet/);
  assert.match(sitemap, /zh\/references\/cron-cheat-sheet/);
  assert.doesNotMatch(sitemap, /lokale-produktivitaet|json-schema-bild|kredit-ai-bewertung/);
  assert.match(sitemap, /cerez-politikasi/);
  assert.match(sitemap, /en\/cookies/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.match(robots, /sitemap\.xml/i);
  for (const crawler of ["Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Applebot-Extended", "CCBot"]) {
    assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*?Allow: /`));
  }
  assert.match(llms, /^# ByteQuant/m);
  assert.equal((llms.match(/^- \[/gm) ?? []).length, 89);
  assert.match(home, /aria-label="Araç ve referans ara"/);
  assert.match(german, /aria-label="Werkzeuge und Referenzen durchsuchen"/);
  assert.match(chinese, /aria-label="搜索工具和参考资料"/);
  assert.match(manifest, /standalone/);
  assert.match(manifest, /app-icon-maskable\.svg/);
  assert.match(worker, /bytequant-shell-v7/);
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
  const [turkishTools, englishTools, germanTools, chineseTools, turkishPosts, englishPosts, germanPosts, chinesePosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("de/tools/", root)), readdir(new URL("zh/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root)), readdir(new URL("de/blog/", root)), readdir(new URL("zh/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 89);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 89);
  assert.equal(germanTools.filter((name) => !name.startsWith(".")).length, 89);
  assert.equal(chineseTools.filter((name) => !name.startsWith(".")).length, 89);
  assert.ok(turkishPosts.length >= 35);
  assert.ok(englishPosts.length >= 35);
  assert.ok(germanPosts.length >= 7);
  assert.ok(chinesePosts.length >= 7);
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
  await access(new URL("de/blog/local-prompt-text-date-workflow/index.html", root));
  await access(new URL("zh/blog/loan-ai-rubric-csp-workflow/index.html", root));
  await access(new URL("de/blog/yaml-xml-json-csv-local-data-workflow/index.html", root));
  await access(new URL("zh/blog/technical-seo-robots-hreflang-faq-utm-workflow/index.html", root));
  await access(new URL("de/blog/unicode-text-percentage-time-productivity-workflow/index.html", root));
  await access(new URL("zh/blog/web-crypto-rag-prompt-injection-security-workflow/index.html", root));
  await access(new URL("referanslar/regex-cheat-sheet/index.html", root));
  await access(new URL("en/references/cron-cheat-sheet/index.html", root));
  await access(new URL("de/references/regex-cheat-sheet/index.html", root));
  await access(new URL("zh/references/cron-cheat-sheet/index.html", root));
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

test("exports the nine new growth tools and localized guides", async () => {
  const pages = await Promise.all([
    read("araclar/prompt-sablon-degisken-doldurucu/index.html"),
    read("en/tools/yerel-metin-ozetleyici/index.html"),
    read("de/tools/json-schema-olusturucu/index.html"),
    read("zh/tools/gorsel-boyutlandirici/index.html"),
    read("araclar/dosya-hash-karsilastirici/index.html"),
    read("en/tools/kredi-odeme-hesaplayici/index.html"),
    read("de/tools/tarih-farki-hesaplayici/index.html"),
    read("zh/tools/ai-yanit-degerlendirme-rubrigi/index.html"),
    read("en/tools/csp-olusturucu-denetleyici/index.html"),
  ]);
  for (const page of pages) {
    assert.match(page, /HowTo/);
    assert.match(page, /WebApplication/);
    assert.match(page, /Load example|Örnek veri yükle|Beispiel laden|加载示例/);
    assert.doesNotMatch(page, /axios|pagead2\.googlesyndication\.com/i);
  }

  const guides = await Promise.all([
    read("de/blog/local-prompt-text-date-workflow/index.html"),
    read("zh/blog/json-schema-image-hash-workflow/index.html"),
    read("de/blog/loan-ai-rubric-csp-workflow/index.html"),
  ]);
  for (const guide of guides) {
    assert.doesNotThrow(() => jsonLd(guide));
    assert.match(guide, /BlogPosting/);
    assert.match(guide, /hrefLang="de-DE"/);
    assert.match(guide, /hrefLang="zh-CN"/);
    assert.match(guide, /hrefLang="x-default"/);
  }
});

test("exports 27 high-demand tools in every category and four localized deep guides", async () => {
  const toolPaths = [
    "araclar/yaml-json-donusturucu/index.html",
    "araclar/csv-tekil-satir-ayiklayici/index.html",
    "araclar/robots-txt-olusturucu-denetleyici/index.html",
    "araclar/unicode-normalizasyon-inceleyici/index.html",
    "araclar/kdv-indirim-hesaplayici/index.html",
    "araclar/hmac-olusturucu-dogrulayici/index.html",
    "en/tools/xml-bicimlendirici-dogrulayici/index.html",
    "en/tools/url-sorgu-parametresi-analizoru/index.html",
    "en/tools/hreflang-etiket-olusturucu/index.html",
    "en/tools/satir-siralayici-tekillestirici/index.html",
    "en/tools/sure-mesai-hesaplayici/index.html",
    "en/tools/sri-butunluk-hash-uretici/index.html",
    "de/tools/json-flatten-unflatten/index.html",
    "de/tools/html-varlik-kodlayici/index.html",
    "de/tools/faq-json-ld-olusturucu/index.html",
    "de/tools/seo-slug-olusturucu/index.html",
    "de/tools/rastgele-secici-takim-karistirici/index.html",
    "de/tools/rag-parcalama-butcesi-planlayici/index.html",
    "zh/tools/ip-cidr-alt-ag-hesaplayici/index.html",
    "zh/tools/utm-kampanya-url-olusturucu/index.html",
    "zh/tools/kelime-sikligi-ngram-analizi/index.html",
    "zh/tools/yuzde-degisim-hesaplayici/index.html",
    "zh/tools/hatirlanabilir-parola-uretici/index.html",
    "zh/tools/prompt-enjeksiyon-on-taramasi/index.html",
    "araclar/prompt-test-vaka-matrisi/index.html",
    "en/tools/data-uri-donusturucu/index.html",
    "de/tools/http-guvenlik-basliklari-denetleyici/index.html",
  ];
  for (const page of await Promise.all(toolPaths.map(read))) {
    assert.match(page, /HowTo/);
    assert.match(page, /FAQPage/);
    assert.match(page, /WebApplication/);
    assert.match(page, /Load example|Örnek veri yükle|Beispiel laden|加载示例/);
    assert.doesNotMatch(page, /axios|pagead2\.googlesyndication\.com/i);
  }

  const guidePaths = [
    "de/blog/yaml-xml-json-csv-local-data-workflow/index.html",
    "zh/blog/yaml-xml-json-csv-local-data-workflow/index.html",
    "de/blog/technical-seo-robots-hreflang-faq-utm-workflow/index.html",
    "zh/blog/technical-seo-robots-hreflang-faq-utm-workflow/index.html",
    "de/blog/unicode-text-percentage-time-productivity-workflow/index.html",
    "zh/blog/unicode-text-percentage-time-productivity-workflow/index.html",
    "de/blog/web-crypto-rag-prompt-injection-security-workflow/index.html",
    "zh/blog/web-crypto-rag-prompt-injection-security-workflow/index.html",
  ];
  for (const guide of await Promise.all(guidePaths.map(read))) {
    assert.doesNotThrow(() => jsonLd(guide));
    assert.match(guide, /BlogPosting/);
    assert.match(guide, /hrefLang="tr-TR"/);
    assert.match(guide, /hrefLang="en-US"/);
    assert.match(guide, /hrefLang="de-DE"/);
    assert.match(guide, /hrefLang="zh-CN"/);
  }
});

test("keeps legacy mixed-language guide slugs as noindex canonical aliases", async () => {
  const aliases = await Promise.all([
    read("de/blog/lokale-produktivitaet-prompt-text-datum-workflow/index.html"),
    read("zh/blog/json-schema-bild-hash-integritaet-workflow/index.html"),
    read("en/blog/kredit-ai-bewertung-csp-entscheidungsworkflow/index.html"),
  ]);
  assert.match(aliases[0], /name="robots" content="noindex, follow"|content="noindex, follow" name="robots"/);
  assert.match(aliases[0], /rel="canonical" href="https:\/\/bytequant\.org\/de\/blog\/local-prompt-text-date-workflow\//);
  assert.match(aliases[1], /rel="canonical" href="https:\/\/bytequant\.org\/zh\/blog\/json-schema-image-hash-workflow\//);
  assert.match(aliases[2], /rel="canonical" href="https:\/\/bytequant\.org\/en\/blog\/loan-ai-rubric-csp-workflow\//);
});

test("exports localized reference content and reciprocal hreflang", async () => {
  const [german, chinese] = await Promise.all([
    read("de/references/regex-cheat-sheet/index.html"),
    read("zh/references/cron-cheat-sheet/index.html"),
  ]);
  assert.match(german, /Grundbausteine/);
  assert.match(chinese, /运行检查/);
  for (const page of [german, chinese]) {
    assert.match(page, /hrefLang="tr-TR"/);
    assert.match(page, /hrefLang="en-US"/);
    assert.match(page, /hrefLang="de-DE"/);
    assert.match(page, /hrefLang="zh-CN"/);
    assert.match(page, /FAQPage/);
    assert.match(page, /TechArticle/);
  }
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
  assert.match(blog, /<strong>35<\/strong>\s*ayrıntılı rehber/);
  assert.match(englishBlog, /<strong>35<\/strong>\s*in-depth guides/);
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
