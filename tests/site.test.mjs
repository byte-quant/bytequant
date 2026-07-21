import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

test("exports the complete four-language site", async () => {
  const [home, english, german, chinese, sitemap, robots, llms, manifest, worker] = await Promise.all([read("index.html"), read("en/index.html"), read("de/index.html"), read("zh/index.html"), read("sitemap.xml"), read("robots.txt"), read("llms.txt"), read("manifest.webmanifest"), read("sw.js")]);
  assert.match(home, /Hassas verileriniz tarayıcıdan çıkmadan/);
  assert.match(english, /without sensitive data leaving your browser/);
  assert.match(home, /131 açıklanabilir araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(german, /<html lang="de"/);
  assert.match(chinese, /<html lang="zh-CN"/);
  assert.match(german, /131 nachvollziehbare Werkzeuge/);
  assert.match(chinese, /131 个可解释工具/);
  assert.match(home, /Sabitlenenler ve sık kullanılanlar/);
  assert.match(english, /Pinned and frequently used tools/);
  assert.match(home, /Bugün ne yapmak istediğinizi seçin/);
  assert.match(english, /Choose how you want to work today/);
  assert.match(german, /Wählen Sie Ihren Einstieg/);
  assert.match(chinese, /选择今天的工作方式/);
  for (const page of [home, english, german, chinese]) {
    assert.match(page, /GitHub/);
    assert.match(page, /open-source|açık kaynak|Open Source|开源/i);
    assert.match(page, /og:locale:alternate/);
  }
  assert.match(home, /<title>ByteQuant ·/);
  assert.match(home, /og\.png/);
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
  assert.match(sitemap, /araclar\/json-lines-donusturucu/);
  assert.match(sitemap, /en\/tools\/openapi-endpoint-envanteri/);
  assert.match(sitemap, /de\/tools\/renk-kontrast-denetleyici/);
  assert.match(sitemap, /zh\/tools\/semver-karsilastirici/);
  assert.match(sitemap, /araclar\/prompt-sinirlandirici-ayirici/);
  assert.match(sitemap, /en\/tools\/json-kanoniklestirici/);
  assert.match(sitemap, /de\/tools\/e-posta-basligi-analizoru/);
  assert.match(sitemap, /zh\/tools\/bilesik-faiz-hesaplayici/);
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
  assert.match(sitemap, /https:\/\/bytequant\.org\/ajan\//);
  assert.match(sitemap, /https:\/\/bytequant\.org\/en\/agent\//);
  assert.match(sitemap, /de\/blog\/browser-only-agentic-ai-tool-orchestration/);
  assert.match(sitemap, /zh\/blog\/browser-only-agentic-ai-tool-orchestration/);
  assert.match(sitemap, /https:\/\/bytequant\.org\/is-istasyonu\//);
  assert.match(sitemap, /https:\/\/bytequant\.org\/en\/workstation\//);
  assert.match(sitemap, /de\/blog\/visual-workflow-indexeddb-webrtc-workstation/);
  assert.match(sitemap, /zh\/blog\/visual-workflow-indexeddb-webrtc-workstation/);
  assert.match(sitemap, /https:\/\/bytequant\.org\/topluluk\//);
  assert.match(sitemap, /https:\/\/bytequant\.org\/en\/community\//);
  assert.match(sitemap, /de\/blog\/private-agent-workstation-pipeline/);
  assert.match(sitemap, /zh\/blog\/core-web-vitals-client-side-tools/);
  assert.match(sitemap, /en\/blog\/ndjson-openapi-semver-api-delivery/);
  assert.match(sitemap, /de\/blog\/accessible-responsive-ui-contrast-clamp-ratio/);
  assert.match(sitemap, /zh\/blog\/global-team-planning-time-zones-business-days/);
  assert.match(sitemap, /en\/blog\/prompt-boundaries-structured-output-red-team/);
  assert.match(sitemap, /de\/blog\/unicode-subtitles-morse-text-integrity/);
  assert.match(sitemap, /zh\/blog\/browser-data-delivery-json-csv-http-identifiers/);
  assert.match(sitemap, /blog\/local-design-security-finance-planning/);
  assert.doesNotMatch(sitemap, /https:\/\/bytequant\.org\/workspace\//);
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
  assert.equal((llms.match(/^- \[/gm) ?? []).length, 131);
  assert.match(home, /aria-label="Araç ve referans ara"/);
  assert.match(german, /aria-label="Werkzeuge und Referenzen durchsuchen"/);
  assert.match(chinese, /aria-label="搜索工具和参考资料"/);
  assert.match(manifest, /standalone/);
  assert.match(manifest, /app-icon-maskable\.svg/);
  assert.match(worker, /bytequant-shell-v11/);
  assert.match(worker, /\/en\/agent\//);
  assert.match(worker, /\/en\/workstation\//);
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
  assert.match(privacy, /bytequant-workspaces/);
  assert.match(privacy, /AES-GCM-256/);
  assert.match(privacy, /WebRTC DataChannel/);
  assert.match(security, /Contact: mailto:bytequant@yahoo\.com/);
  assert.match(security, /Canonical: https:\/\/bytequant\.org\/\.well-known\/security\.txt/);
  assert.match(llms, /Optional tool-visit counting is off until/);
  assert.match(llms, /https:\/\/bytequant\.org\/en\/cookies/);
});

test("exports all tool and guide routes", async () => {
  const [turkishTools, englishTools, germanTools, chineseTools, turkishPosts, englishPosts, germanPosts, chinesePosts] = await Promise.all([readdir(new URL("araclar/", root)), readdir(new URL("en/tools/", root)), readdir(new URL("de/tools/", root)), readdir(new URL("zh/tools/", root)), readdir(new URL("blog/", root)), readdir(new URL("en/blog/", root)), readdir(new URL("de/blog/", root)), readdir(new URL("zh/blog/", root))]);
  assert.equal(turkishTools.filter((name) => !name.startsWith(".")).length, 131);
  assert.equal(englishTools.filter((name) => !name.startsWith(".")).length, 131);
  assert.equal(germanTools.filter((name) => !name.startsWith(".")).length, 131);
  assert.equal(chineseTools.filter((name) => !name.startsWith(".")).length, 131);
  assert.ok(turkishPosts.length >= 36);
  assert.ok(englishPosts.length >= 36);
  assert.ok(turkishPosts.length >= 42);
  assert.ok(englishPosts.length >= 42);
  assert.ok(germanPosts.length >= 14);
  assert.ok(chinesePosts.length >= 14);
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
  await access(new URL("blog/browser-only-agentic-ai-tool-orchestration/index.html", root));
  await access(new URL("en/blog/browser-only-agentic-ai-tool-orchestration/index.html", root));
  await access(new URL("de/blog/browser-only-agentic-ai-tool-orchestration/index.html", root));
  await access(new URL("zh/blog/browser-only-agentic-ai-tool-orchestration/index.html", root));
  await access(new URL("blog/visual-workflow-indexeddb-webrtc-workstation/index.html", root));
  await access(new URL("en/blog/visual-workflow-indexeddb-webrtc-workstation/index.html", root));
  await access(new URL("de/blog/visual-workflow-indexeddb-webrtc-workstation/index.html", root));
  await access(new URL("zh/blog/visual-workflow-indexeddb-webrtc-workstation/index.html", root));
  await access(new URL("blog/private-agent-workstation-pipeline/index.html", root));
  await access(new URL("en/blog/batch-masking-before-after-quality-control/index.html", root));
  await access(new URL("de/blog/browser-tool-handoff-json-csv-base64/index.html", root));
  await access(new URL("zh/blog/open-source-browser-tool-security-audit/index.html", root));
  await access(new URL("zh/blog/core-web-vitals-client-side-tools/index.html", root));
  await access(new URL("topluluk/index.html", root));
  await access(new URL("en/community/index.html", root));
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
  assert.match(page, /Bu araçla sık kullanılanlar/);
  assert.match(page, /Tamamen tarayıcıda çalışır/);
  assert.match(page, /Son güncelleme: 22 Temmuz 2026/);
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
    assert.match(page, /Bu araçla sık kullanılanlar|Frequently used with this tool/);
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

test("exports 27 local productivity tools with working handlers and four guides in every locale", async () => {
  const slugs = [
    "prompt-sinirlandirici-ayirici",
    "yapisal-cikti-semasi-olusturucu",
    "ai-red-team-kontrol-listesi",
    "grapheme-guvenli-metin-ters-cevirici",
    "cumle-paragraf-bolucu",
    "srt-altyazi-zaman-kaydirici",
    "unicode-kod-noktasi-inceleyici",
    "mors-kodu-donusturucu",
    "json-kanoniklestirici",
    "json-string-kacis-donusturucu",
    "csv-sql-insert-olusturucu",
    "http-istek-basligi-olusturucu",
    "mime-turu-bulucu",
    "uuid-inceleyici",
    "ulid-uretici-inceleyici",
    "changelog-bicimlendirici",
    "css-gradient-olusturucu",
    "css-box-shadow-olusturucu",
    "sayi-tabani-donusturucu",
    "byte-hex-inceleyici",
    "e-posta-basligi-analizoru",
    "csp-nonce-uretici",
    "parola-politikasi-olusturucu",
    "bilesik-faiz-hesaplayici",
    "birikim-hedefi-planlayici",
    "yakit-maliyeti-hesaplayici",
    "tempo-hiz-donusturucu",
  ];
  const localeRoots = ["araclar", "en/tools", "de/tools", "zh/tools"];
  const pages = await Promise.all(localeRoots.flatMap((localeRoot) => slugs.map((slug) => read(`${localeRoot}/${slug}/index.html`))));
  for (const page of pages) {
    assert.match(page, /HowTo/);
    assert.match(page, /FAQPage/);
    assert.match(page, /WebApplication/);
  }

  const handlerSource = await readSource("app/components/ProductivityWorkbenches.tsx");
  for (const slug of slugs) assert.match(handlerSource, new RegExp(`case ["']${slug}["']`));

  const guideSlugs = [
    "prompt-boundaries-structured-output-red-team",
    "unicode-subtitles-morse-text-integrity",
    "browser-data-delivery-json-csv-http-identifiers",
    "local-design-security-finance-planning",
  ];
  const guideRoots = ["blog", "en/blog", "de/blog", "zh/blog"];
  for (const guide of await Promise.all(guideRoots.flatMap((localeRoot) => guideSlugs.map((slug) => read(`${localeRoot}/${slug}/index.html`))))) {
    assert.doesNotThrow(() => jsonLd(guide));
    assert.match(guide, /BlogPosting/);
    assert.match(guide, /hrefLang="tr-TR"/);
    assert.match(guide, /hrefLang="en-US"/);
    assert.match(guide, /hrefLang="de-DE"/);
    assert.match(guide, /hrefLang="zh-CN"/);
  }
});

test("exports the 15 discovery tools and four new guides in every locale", async () => {
  const slugs = [
    "json-lines-donusturucu", "json-pointer-gezgini", "sql-bicimlendirici-analizoru",
    "openapi-endpoint-envanteri", "env-dosyasi-denetleyici", "unix-izin-hesaplayici",
    "renk-kontrast-denetleyici", "en-boy-orani-hesaplayici", "css-clamp-olusturucu",
    "is-gunu-hesaplayici", "zaman-dilimi-toplanti-planlayici", "bahsis-hesap-bolusturucu",
    "regex-degistirme-laboratuvari", "markdown-tablo-olusturucu", "semver-karsilastirici",
  ];
  const localeRoots = ["araclar", "en/tools", "de/tools", "zh/tools"];
  const pages = await Promise.all(localeRoots.flatMap((localeRoot) => slugs.map((slug) => read(`${localeRoot}/${slug}/index.html`))));
  for (const page of pages) {
    assert.match(page, /WebApplication/);
    assert.match(page, /HowTo/);
    assert.match(page, /FAQPage/);
    assert.match(page, /dateModified[^<]*2026-07-22/);
  }

  const guideSlugs = [
    "ndjson-openapi-semver-api-delivery",
    "accessible-responsive-ui-contrast-clamp-ratio",
    "local-config-security-env-sql-unix-permissions",
    "global-team-planning-time-zones-business-days",
  ];
  const guideRoots = ["blog", "en/blog", "de/blog", "zh/blog"];
  const guides = await Promise.all(guideRoots.flatMap((localeRoot) => guideSlugs.map((slug) => read(`${localeRoot}/${slug}/index.html`))));
  for (const guide of guides) {
    assert.match(guide, /BlogPosting/);
    assert.match(guide, /hrefLang="tr-TR"/);
    assert.match(guide, /hrefLang="en-US"/);
    assert.match(guide, /hrefLang="de-DE"/);
    assert.match(guide, /hrefLang="zh-CN"/);
  }
});

test("exports instant search, live demo, and no-account community sharing", async () => {
  const [home, englishHome, community, englishCommunity] = await Promise.all([
    read("index.html"), read("en/index.html"), read("topluluk/index.html"), read("en/community/index.html"),
  ]);
  assert.match(home, /JSON, PDF, KVKK, regex/);
  assert.match(englishHome, /JSON, PDF, privacy, regex/);
  assert.match(home, /TEK EKRANDA 4 CANLI DEMO/);
  assert.match(englishHome, /4 LIVE DEMOS IN ONE VIEW/);
  assert.match(community, /HESAPSIZ/);
  assert.match(englishCommunity, /NO-ACCOUNT/);
  assert.match(community, /FAQPage|HowTo/);
  assert.doesNotMatch(community, /api\.github\.com/);
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
  assert.match(blog, /<strong>50<\/strong>\s*ayrıntılı rehber/);
  assert.match(englishBlog, /<strong>50<\/strong>\s*in-depth guides/);
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

test("exports the four-language local agent, domain integrity, and security headers", async () => {
  const [turkish, english, german, chinese, headers, guide, englishGuide] = await Promise.all([
    read("ajan/index.html"),
    read("en/agent/index.html"),
    read("de/agent/index.html"),
    read("zh/agent/index.html"),
    read("_headers"),
    read("blog/browser-only-agentic-ai-tool-orchestration/index.html"),
    read("en/blog/browser-only-agentic-ai-tool-orchestration/index.html"),
  ]);
  assert.match(turkish, /Hedefinizi yazın; ByteQuant araçlarıyla/);
  assert.match(english, /build an auditable workflow across ByteQuant tools/);
  assert.match(german, /prüfbaren Ablauf mit ByteQuant-Werkzeugen/);
  assert.match(chinese, /建立可审计的工作流/);
  for (const page of [turkish, english, german, chinese]) {
    assert.doesNotThrow(() => jsonLd(page));
    assert.match(page, /WebApplication/);
    assert.match(page, /FAQPage/);
    assert.match(page, /BQ-Agent 1\.3/);
    assert.match(page, /hrefLang="tr-TR"/);
    assert.match(page, /hrefLang="en-US"/);
    assert.match(page, /hrefLang="de-DE"/);
    assert.match(page, /hrefLang="zh-CN"/);
    assert.match(page, /hrefLang="x-default"/);
    assert.doesNotMatch(page, /api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com/);
  }
  assert.match(turkish, /uzak model|Uzak model/i);
  assert.match(english, /not a generative foundation model/i);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(headers, /on-device-speech-recognition=\(self\)/);
  assert.match(headers, /connect-src 'self'/);
  assert.doesNotMatch(headers, /api\.github\.com/);
  assert.doesNotMatch(await readSource("worker/index.ts"), /api\.github\.com/);
  assert.match(turkish, /bytequant:canonical-origin/);
  assert.match(turkish, /bq-org-agent-v1-20260718/);
  assert.match(guide, /Tarayıcı İçi Agentic AI/);
  assert.match(englishGuide, /Browser-Only Agentic AI/);
  assert.match(guide, /BlogPosting/);
  assert.match(englishGuide, /developer\.mozilla\.org/);
  await access(new URL("og.png", root));
});

test("exports the four-language visual workstation and private recipe importer", async () => {
  const [turkish, english, german, chinese, importer, guide] = await Promise.all([
    read("is-istasyonu/index.html"),
    read("en/workstation/index.html"),
    read("de/workstation/index.html"),
    read("zh/workstation/index.html"),
    read("workspace/index.html"),
    read("en/blog/visual-workflow-indexeddb-webrtc-workstation/index.html"),
  ]);
  assert.match(turkish, /131 tarayıcı aracını görsel bir geliştirme ortamında/);
  assert.match(english, /Connect 131 browser tools inside a visual development environment/);
  assert.match(german, /131 Browser-Werkzeuge in einer visuellen Entwicklungsumgebung/);
  assert.match(chinese, /在可视化开发环境中连接 131 个浏览器工具/);
  assert.match(turkish, /İlk akışınızı beş kontrollü adımda kurun/);
  assert.match(english, /Build your first workflow in five controlled steps/);
  assert.match(german, /Den ersten Ablauf in fünf kontrollierten Schritten erstellen/);
  assert.match(chinese, /通过五个可控步骤建立首个流程/);
  for (const page of [turkish, english, german, chinese]) {
    assert.doesNotThrow(() => jsonLd(page));
    assert.match(page, /WebApplication/);
    assert.match(page, /HowTo/);
    assert.match(page, /FAQPage/);
    assert.match(page, /hrefLang="tr-TR"/);
    assert.match(page, /hrefLang="en-US"/);
    assert.match(page, /hrefLang="de-DE"/);
    assert.match(page, /hrefLang="zh-CN"/);
    assert.match(page, /hrefLang="x-default"/);
    assert.doesNotMatch(page, /api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com/);
  }
  assert.match(importer, /name="robots" content="noindex, nofollow, noarchive"|content="noindex, nofollow, noarchive" name="robots"/);
  assert.match(importer, /rel="canonical" href="https:\/\/bytequant\.org\/en\/workstation\//);
  assert.doesNotMatch(importer, /FAQPage|HowTo|WebApplication/);
  assert.match(guide, /IndexedDB/);
  assert.match(guide, /RTCDataChannel/);
  assert.match(guide, /developer\.mozilla\.org/);
  assert.match(guide, /rfc-editor\.org/);
});
