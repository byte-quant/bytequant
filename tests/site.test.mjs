import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../out/", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const toolAliases = new Set(["kredi-taksit-hesaplayici", "tarih-sure-hesaplayici", "kelime-sikligi-analizoru", "okunabilirlik-on-analizi", "liste-siralama-temizleme", "sri-hash-olusturucu", "yuzde-degisim-hizli-hesaplayici", "indirim-kdv-hesaplayici", "rastgele-takim-olusturucu", "query-string-olusturucu", "http-durum-kodu-rehberi", "mime-turu-bulucu"]);

test("global command search defers the full tool index until the keyboard shortcut is used", async () => {
  const [shell, loader, palette] = await Promise.all([
    readSource("app/components/SiteShell.tsx"),
    readSource("app/components/LazyCommandPalette.tsx"),
    readSource("app/components/CommandPalette.tsx"),
  ]);
  assert.match(shell, /<LazyCommandPalette locale=\{locale\}/);
  assert.doesNotMatch(shell, /import \{ CommandPalette \}/);
  assert.match(loader, /lazy\(\(\) => import\("\.\/CommandPalette"\)/);
  assert.match(loader, /className="nav-more-search"/);
  assert.match(loader, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(palette, /initialOpen = false/);
});

test("exports the complete four-language site", async () => {
  const [home, english, german, chinese, sitemap, robots, llms, manifest, worker] = await Promise.all([read("index.html"), read("en/index.html"), read("de/index.html"), read("zh/index.html"), read("sitemap.xml"), read("robots.txt"), read("llms.txt"), read("manifest.webmanifest"), read("sw.js")]);
  assert.match(home, /Ne yapmak istediğinizi anlatın; ByteQuant AI doğru yolu hazırlasın/);
  assert.match(english, /Describe what you need; ByteQuant AI will prepare the right path/);
  assert.match(home, /benzersiz yayımlanmış araç/);
  assert.match(home, /<html lang="tr"/);
  assert.match(english, /<html lang="en"/);
  assert.match(german, /<html lang="de"/);
  assert.match(chinese, /<html lang="zh-CN"/);
  assert.match(german, /eigenständige veröffentlichte Werkzeuge/);
  assert.match(chinese, /个独立发布工具/);
  assert.match(home, /Sabitlenenler ve sık kullanılanlar/);
  assert.match(english, /Pinned and frequently used tools/);
  assert.match(home, /Kararsızsanız ByteQuant AI ile başlayın/);
  assert.match(english, /Start with ByteQuant AI when the path is unclear/);
  assert.match(german, /Bei unklarem Weg mit ByteQuant AI starten/);
  assert.match(chinese, /不确定从何开始时，先使用 ByteQuant AI/);
  for (const page of [home, english, german, chinese]) {
    assert.match(page, /GitHub/);
    assert.match(page, /open-source|açık kaynak|Open Source|开源/i);
    assert.match(page, /og:locale:alternate/);
    assert.match(page, /BQ-Agent 5\.1/);
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
  assert.match(sitemap, /https:\/\/bytequant\.org\/(?:guncel|en\/updates|de\/updates|zh\/updates)\//);
  assert.match(sitemap, /prompt-negatif-kisit-denetleyici/);
  assert.match(sitemap, /de\/blog\/private-agent-workstation-pipeline/);
  assert.match(sitemap, /zh\/blog\/core-web-vitals-client-side-tools/);
  assert.match(sitemap, /en\/blog\/ndjson-openapi-semver-api-delivery/);
  assert.match(sitemap, /de\/blog\/accessible-responsive-ui-contrast-clamp-ratio/);
  assert.match(sitemap, /zh\/blog\/global-team-planning-time-zones-business-days/);
  assert.match(sitemap, /en\/blog\/prompt-boundaries-structured-output-red-team/);
  assert.match(sitemap, /de\/blog\/unicode-subtitles-morse-text-integrity/);
  assert.match(sitemap, /zh\/blog\/browser-data-delivery-json-csv-http-identifiers/);
  assert.match(sitemap, /blog\/local-design-security-finance-planning/);
  assert.match(sitemap, /araclar\/talimat-cakisma-denetleyici/);
  assert.match(sitemap, /en\/tools\/csv-pivot-ozeti/);
  assert.match(sitemap, /de\/tools\/cors-politikasi-denetleyici/);
  assert.match(sitemap, /zh\/tools\/kaynak-guncellik-takipcisi/);
  assert.match(sitemap, /blog\/prompt-yonetisimi-degerlendirme-rehberi/);
  assert.match(sitemap, /en\/blog\/gizlilik-saklama-anonimlestirme-rehberi/);
  assert.match(sitemap, /de\/blog\/api-teslim-guvenlik-kontrol-listesi/);
  assert.match(sitemap, /zh\/blog\/kanit-odakli-arastirma-ve-guncellik-rehberi/);
  assert.doesNotMatch(sitemap, /https:\/\/bytequant\.org\/workspace\//);
  assert.match(sitemap, /de\/references\/regex-cheat-sheet/);
  assert.match(sitemap, /zh\/references\/cron-cheat-sheet/);
  assert.doesNotMatch(sitemap, /lokale-produktivitaet|json-schema-bild|kredit-ai-bewertung/);
  assert.match(sitemap, /cerez-politikasi/);
  assert.match(sitemap, /en\/cookies/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.match(robots, /sitemap\.xml/i);
  for (const crawler of ["Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Applebot-Extended", "CCBot", "Mediapartners-Google"]) {
    assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*?Allow: /`));
  }
  assert.match(llms, /^# ByteQuant/m);
  assert.equal((llms.match(/^- \[/gm) ?? []).length, 317);
  for (const standardsUrl of [
    "https://bytequant.org/yayin-ilkeleri",
    "https://bytequant.org/en/publishing-standards",
    "https://bytequant.org/de/publishing-standards",
    "https://bytequant.org/zh/publishing-standards",
  ]) assert.match(llms, new RegExp(standardsUrl.replaceAll("/", "\\/")));
  assert.match(home, /Araçlarda anında ara/);
  assert.match(german, /Werkzeuge sofort durchsuchen/);
  assert.match(chinese, /即时搜索工具/);
  for (const page of [home, english, german, chinese]) assert.doesNotMatch(page, /class="palette-trigger"/);
  assert.match(manifest, /standalone/);
  assert.match(manifest, /app-icon-maskable\.svg/);
  assert.match(worker, /bytequant-shell-v13/);
  assert.match(worker, /\/en\/agent\//);
  assert.match(worker, /\/en\/workstation\//);
  assert.doesNotMatch(worker, /localStorage/i);
  assert.match(worker, /cache\.put\(pageKey/);
  const navigationCacheBranch = worker.slice(worker.indexOf('if (request.mode === "navigate")'), worker.indexOf('if (["script", "style", "image", "font"]'));
  assert.doesNotMatch(navigationCacheBranch, /cache\.put\(request/);
  assert.match(worker, /\["script", "style", "image", "font"\]\.includes\(request\.destination\)/);
  assert.doesNotMatch(home, /codex-preview|react-loading-skeleton|Your site is taking shape/);
  assert.match(home, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847/);
  assert.doesNotMatch(home, /googletagmanager\.com/i);
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
    assert.match(page, /google-adsense-account/);
    assert.doesNotMatch(page, /googletagmanager\.com/i);
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
  assert.equal(turkishTools.filter((name) => !name.includes(".")).length, 329);
  assert.equal(englishTools.filter((name) => !name.includes(".")).length, 329);
  assert.equal(germanTools.filter((name) => !name.includes(".")).length, 329);
  assert.equal(chineseTools.filter((name) => !name.includes(".")).length, 329);
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
  for (const slug of ["prompt-yonetisimi-degerlendirme-rehberi", "gizlilik-saklama-anonimlestirme-rehberi", "api-teslim-guvenlik-kontrol-listesi", "csv-json-veri-yeniden-sekillendirme-rehberi", "kanit-odakli-arastirma-ve-guncellik-rehberi"]) {
    await Promise.all([
      access(new URL(`blog/${slug}/index.html`, root)),
      access(new URL(`en/blog/${slug}/index.html`, root)),
      access(new URL(`de/blog/${slug}/index.html`, root)),
      access(new URL(`zh/blog/${slug}/index.html`, root)),
    ]);
  }
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
  assert.match(page, /İçerik ve arayüz incelemesi: 9 Ağustos 2026/);
  assert.match(page, /Örnek veri yükle/);
  assert.doesNotMatch(page, /fetch\(|axios/i);
});

test("ships exactly 25 new working tools and seven deep guides in all four locales", async () => {
  const [{ essentialToolSlugs }, { essentialPosts, essentialLocalizedGuides }] = await Promise.all([
    import("../app/lib/essential-tool-slugs.ts"),
    import("../app/lib/essential-guides.ts"),
  ]);
  assert.equal(essentialToolSlugs.size, 25);
  assert.equal(essentialPosts.length, 7);
  assert.equal(essentialLocalizedGuides.length, 7);
  for (const slug of essentialToolSlugs) {
    const pages = await Promise.all([
      read(`araclar/${slug}/index.html`),
      read(`en/tools/${slug}/index.html`),
      read(`de/tools/${slug}/index.html`),
      read(`zh/tools/${slug}/index.html`),
    ]);
    if (toolAliases.has(slug)) {
      for (const page of pages) assert.match(page, /name="robots" content="noindex, follow(?:, noarchive)?"|content="noindex, follow(?:, noarchive)?" name="robots"/);
      continue;
    }
    for (const page of pages) {
      assert.match(page, /HowTo/);
      assert.match(page, /essential-workbench/);
      assert.match(page, /data-agent-input/);
    }
  }
  for (const post of essentialPosts) {
    await Promise.all([
      access(new URL(`blog/${post.slug}/index.html`, root)),
      access(new URL(`en/blog/${post.slug}/index.html`, root)),
      access(new URL(`de/blog/${post.slug}/index.html`, root)),
      access(new URL(`zh/blog/${post.slug}/index.html`, root)),
    ]);
  }
});

test("ships 35 distinct precision tools and five long guides in all four locales", async () => {
  const [{ precisionToolSlugs }, { precisionPosts, precisionLocalizedGuides }] = await Promise.all([
    import("../app/lib/precision-tools.ts"),
    import("../app/lib/precision-guides.ts"),
  ]);
  assert.equal(precisionToolSlugs.size, 35);
  assert.equal(precisionPosts.length, 5);
  assert.equal(precisionLocalizedGuides.length, 5);
  for (const slug of precisionToolSlugs) {
    const pages = await Promise.all([
      read(`araclar/${slug}/index.html`),
      read(`en/tools/${slug}/index.html`),
      read(`de/tools/${slug}/index.html`),
      read(`zh/tools/${slug}/index.html`),
    ]);
    for (const page of pages) {
      assert.match(page, /HowTo/);
      assert.match(page, /precision-workbench/);
      assert.doesNotMatch(page, /noindex, follow/);
    }
  }
  for (const post of precisionPosts) {
    await Promise.all([
      access(new URL(`blog/${post.slug}/index.html`, root)),
      access(new URL(`en/blog/${post.slug}/index.html`, root)),
      access(new URL(`de/blog/${post.slug}/index.html`, root)),
      access(new URL(`zh/blog/${post.slug}/index.html`, root)),
    ]);
  }
});

test("ships 75 distinct frontier tools and 15 detailed guides in all four locales", async () => {
  const [{ frontierTools, frontierToolSlugs, frontierToolCount }, { frontierPosts, frontierLocalizedGuides, frontierGuideCount }] = await Promise.all([
    import("../app/lib/frontier-tools.ts"),
    import("../app/lib/frontier-guides.ts"),
  ]);
  assert.equal(frontierToolCount, 75);
  assert.equal(frontierToolSlugs.size, 75);
  assert.equal(frontierTools.length, 75);
  assert.equal(frontierGuideCount, 15);
  assert.equal(frontierPosts.length, 15);
  assert.equal(frontierLocalizedGuides.length, 15);
  assert.deepEqual(frontierTools.map((tool) => Number(tool.mark)), Array.from({ length: 75 }, (_, index) => 247 + index));
  for (const tool of frontierTools) {
    for (const locale of ["tr", "en", "de", "zh"]) {
      assert.ok(tool.title[locale].length > 4, `${tool.slug} missing ${locale} title`);
      assert.ok(tool.description[locale].length > 80, `${tool.slug} shallow ${locale} description`);
      assert.equal(tool.steps[locale].length, 3);
    }
    const pages = await Promise.all([
      read(`araclar/${tool.slug}/index.html`),
      read(`en/tools/${tool.slug}/index.html`),
      read(`de/tools/${tool.slug}/index.html`),
      read(`zh/tools/${tool.slug}/index.html`),
    ]);
    for (const page of pages) {
      assert.match(page, /HowTo/);
      assert.match(page, /frontier-workbench/);
      assert.match(page, /data-agent-input/);
      assert.doesNotMatch(page, /noindex, follow, noarchive/);
      assert.match(page, /data-editorial-status="published"/);
    }
  }
  for (const post of frontierPosts) {
    assert.equal(post.sections.tr.length, 6);
    assert.equal(post.sections.en.length, 6);
    await Promise.all([
      access(new URL(`blog/${post.slug}/index.html`, root)),
      access(new URL(`en/blog/${post.slug}/index.html`, root)),
      access(new URL(`de/blog/${post.slug}/index.html`, root)),
      access(new URL(`zh/blog/${post.slug}/index.html`, root)),
    ]);
  }
  const workbench = await readFile(new URL("../app/components/FrontierWorkbenches.tsx", import.meta.url), "utf8");
  for (const slug of frontierToolSlugs) assert.match(workbench, new RegExp(`"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), `${slug} has no dedicated demo/processor registration`);
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
    assert.doesNotMatch(page, /axios/i);
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
    assert.doesNotMatch(page, /axios/i);
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
    assert.doesNotMatch(page, /axios/i);
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
  const pages = await Promise.all(localeRoots.flatMap((localeRoot) => slugs.filter((slug) => !toolAliases.has(slug)).map((slug) => read(`${localeRoot}/${slug}/index.html`))));
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
    assert.match(page, /dateModified[^<]*2026-08-11/);
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

test("exports instant search, live demo, and opt-in global community sharing", async () => {
  const [home, englishHome, community, englishCommunity] = await Promise.all([
    read("index.html"), read("en/index.html"), read("topluluk/index.html"), read("en/community/index.html"),
  ]);
  assert.match(home, /JSON, PDF, KVKK, regex/);
  assert.match(englishHome, /JSON, PDF, privacy, regex/);
  assert.match(home, /TEK EKRANDA 4 CANLI DEMO/);
  assert.match(englishHome, /4 LIVE DEMOS IN ONE VIEW/);
  assert.match(community, /GLOBAL TOPLULUK/);
  assert.match(englishCommunity, /GLOBAL COMMUNITY/);
  assert.match(community, /Global akışa bağlan/);
  assert.match(englishCommunity, /Connect global feed/);
  assert.match(englishCommunity, /Open Nostr protocol/);
  assert.match(englishCommunity, /selected relay operators can see your IP address/i);
  assert.match(community, /FAQPage|HowTo/);
  assert.doesNotMatch(community, /api\.github\.com/);
  const communitySource = await readSource("app/components/CommunityNetwork.tsx");
  for (const pattern of [/verifyEvent/, /MAX_EVENT_BYTES/, /AUTO_LOCK_MS/, /210_000/, /isPrivateRelayHost/, /allowAction/, /validStoredIdentity/, /community-backup-actions/]) assert.match(communitySource, pattern);
  const styles = await readSource("app/globals.css");
  assert.match(styles, /\.sr-only\{[^}]*width:1px!important[^}]*clip:rect\(0,0,0,0\)!important/);
  assert.match(styles, /\.community-security-strip/);
});

test("keeps the exact owner-provided Auto Ads tag without manual placeholder inventory", async () => {
  const [home, tool, guide, agent, workstation, community] = await Promise.all([
    read("en/index.html"), read("en/tools/json-bicimlendirici/index.html"), read("en/blog/index.html"),
    read("en/agent/index.html"), read("en/workstation/index.html"), read("en/community/index.html"),
  ]);
  for (const page of [home, tool, guide, agent, workstation, community]) {
    assert.doesNotMatch(page, /data-ad-status="auto-ads-eligible"|class="[^"]*\bad-slot\b/);
  }
  for (const page of [home, tool, guide, agent, workstation, community]) {
    // next/script with afterInteractive is represented by a preload in static
    // HTML and injects the executable tag only after hydration. Requiring a
    // server-rendered script here would reintroduce the hydration race this
    // integration deliberately avoids.
    assert.equal((page.match(/<link[^>]+href="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847"[^>]+as="script"[^>]*>/g) ?? []).length, 1);
    assert.match(page, /google-adsense-account/);
  }
});

test("keeps legacy mixed-language guide slugs as noindex canonical aliases", async () => {
  const aliases = await Promise.all([
    read("de/blog/lokale-produktivitaet-prompt-text-datum-workflow/index.html"),
    read("zh/blog/json-schema-bild-hash-integritaet-workflow/index.html"),
    read("en/blog/kredit-ai-bewertung-csp-entscheidungsworkflow/index.html"),
  ]);
  assert.match(aliases[0], /name="robots" content="noindex, follow(?:, noarchive)?"|content="noindex, follow(?:, noarchive)?" name="robots"/);
  assert.match(aliases[0], /rel="canonical" href="https:\/\/bytequant\.org\/de\/blog\/local-prompt-text-date-workflow\//);
  assert.match(aliases[1], /rel="canonical" href="https:\/\/bytequant\.org\/zh\/blog\/json-schema-image-hash-workflow\//);
  assert.match(aliases[2], /rel="canonical" href="https:\/\/bytequant\.org\/en\/blog\/loan-ai-rubric-csp-workflow\//);
});

test("consolidates duplicate tools without breaking established URLs", async () => {
  const [turkish, english, german, chinese, newTurkish, newEnglish, newGerman, newChinese, sitemap, llms] = await Promise.all([
    read("araclar/kredi-taksit-hesaplayici/index.html"),
    read("en/tools/tarih-sure-hesaplayici/index.html"),
    read("de/tools/kelime-sikligi-analizoru/index.html"),
    read("zh/tools/sri-hash-olusturucu/index.html"),
    read("araclar/yuzde-degisim-hizli-hesaplayici/index.html"),
    read("en/tools/query-string-olusturucu/index.html"),
    read("de/tools/http-durum-kodu-rehberi/index.html"),
    read("zh/tools/mime-turu-bulucu/index.html"),
    read("sitemap.xml"), read("llms.txt"),
  ]);
  for (const page of [turkish, english, german, chinese, newTurkish, newEnglish, newGerman, newChinese]) assert.match(page, /name="robots" content="noindex, follow(?:, noarchive)?"|content="noindex, follow(?:, noarchive)?" name="robots"/);
  assert.match(turkish, /rel="canonical" href="https:\/\/bytequant\.org\/araclar\/kredi-odeme-hesaplayici\//);
  assert.match(english, /rel="canonical" href="https:\/\/bytequant\.org\/en\/tools\/tarih-farki-hesaplayici\//);
  assert.match(german, /rel="canonical" href="https:\/\/bytequant\.org\/de\/tools\/kelime-sikligi-ngram-analizi\//);
  assert.match(chinese, /rel="canonical" href="https:\/\/bytequant\.org\/zh\/tools\/sri-butunluk-hash-uretici\//);
  assert.match(newTurkish, /rel="canonical" href="https:\/\/bytequant\.org\/araclar\/yuzde-degisim-hesaplayici\//);
  assert.match(newEnglish, /rel="canonical" href="https:\/\/bytequant\.org\/en\/tools\/sorgu-dizesi-json-donusturucu\//);
  assert.match(newGerman, /rel="canonical" href="https:\/\/bytequant\.org\/de\/tools\/http-durum-kodu-gezgini\//);
  assert.match(newChinese, /rel="canonical" href="https:\/\/bytequant\.org\/zh\/tools\/mime-tipi-inceleyici\//);
  for (const slug of toolAliases) { assert.doesNotMatch(sitemap, new RegExp(`(?:araclar|tools)/${slug}`)); assert.doesNotMatch(llms, new RegExp(`/tools/${slug}`)); }
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
  for (const slug of turkishTools.filter((name) => !name.includes("."))) {
    if (toolAliases.has(slug)) continue;
    const page = await read(`araclar/${slug}/index.html`);
    assert.match(page, /Örnek veri yükle/);
    assert.match(page, /HowTo/);
  }
  for (const slug of englishTools.filter((name) => !name.includes("."))) {
    if (toolAliases.has(slug)) continue;
    const page = await read(`en/tools/${slug}/index.html`);
    assert.match(page, /Load example/);
    assert.match(page, /HowTo/);
  }
  for (const slug of germanTools.filter((name) => !name.includes("."))) {
    if (toolAliases.has(slug)) continue;
    const page = await read(`de/tools/${slug}/index.html`);
    assert.match(page, /Beispiel laden/);
    assert.match(page, /HowTo/);
  }
  for (const slug of chineseTools.filter((name) => !name.includes("."))) {
    if (toolAliases.has(slug)) continue;
    const page = await read(`zh/tools/${slug}/index.html`);
    assert.match(page, /加载示例/);
    assert.match(page, /HowTo/);
  }
  assert.match(faq, /FAQPage/);
  assert.match(englishFaq, /FAQPage/);
  assert.match(germanFaq, /FAQPage/);
  assert.match(chineseFaq, /FAQPage/);
});

test("exports the four-language editorial discovery and structured-data package", async () => {
  const [blog, englishBlog, article, englishArticle, feed, englishFeed, germanFeed, chineseFeed] = await Promise.all([
    read("blog/index.html"),
    read("en/blog/index.html"),
    read("blog/json-ld-schema-nextjs-denetim-rehberi/index.html"),
    read("en/blog/nextjs-hreflang-canonical-global-seo-rehberi/index.html"),
    read("feed.xml"),
    read("en/feed.xml"),
    read("de/feed.xml"),
    read("zh/feed.xml"),
  ]);
  assert.match(blog, /<strong>104<\/strong>\s*(?:<!-- -->)?\s*ayrıntılı rehber/);
  assert.match(englishBlog, /<strong>104<\/strong>\s*(?:<!-- -->)?\s*in-depth guides/);
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
  assert.match(germanFeed, /<language>de-DE<\/language>/);
  assert.match(germanFeed, /local-agent-workstation-verifiable-planning/);
  assert.match(chineseFeed, /<language>zh-CN<\/language>/);
  assert.match(chineseFeed, /source-reliability-evidence-synthesis/);
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
  assert.match(turkish, /Sohbet edin; gerektiğinde araçları/);
  assert.match(english, /Chat naturally, then put the right tools/);
  assert.match(german, /Natürlich chatten und passende Werkzeuge/);
  assert.match(chinese, /自然对话，并让合适的工具/);
  for (const page of [turkish, english, german, chinese]) {
    assert.doesNotThrow(() => jsonLd(page));
    assert.match(page, /WebApplication/);
    assert.match(page, /FAQPage/);
    assert.match(page, /BQ-Agent 5\.1/);
    assert.match(page, /hrefLang="tr-TR"/);
    assert.match(page, /hrefLang="en-US"/);
    assert.match(page, /hrefLang="de-DE"/);
    assert.match(page, /hrefLang="zh-CN"/);
    assert.match(page, /hrefLang="x-default"/);
    assert.doesNotMatch(page, /api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com/);
    assert.doesNotMatch(page, /211 (?:araçlık|tools|Werkzeuge|个工具)/);
  }
  assert.match(turkish, /uzak AI API'si kullanılmaz|uzak çıkarım yok/i);
  assert.match(english, /no remote AI API|no remote inference/i);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(headers, /on-device-speech-recognition=\(self\)/);
  assert.match(headers, /connect-src 'self'/);
  assert.doesNotMatch(headers, /api\.github\.com/);
  assert.doesNotMatch(await readSource("worker/index.ts"), /api\.github\.com/);
  const [conversationSource, bridgeSource, genericWorkbenchSource, essentialWorkbenchSource] = await Promise.all([
    readSource("app/components/AgentConversation.tsx"),
    readSource("app/components/AgentToolBridge.tsx"),
    readSource("app/components/ToolWorkbench.tsx"),
    readSource("app/components/EssentialWorkbenches.tsx"),
  ]);
  assert.match(conversationSource, /extractAgentPayload/);
  assert.match(conversationSource, /runAgentAutomation\(next, detectedInput/);
  assert.match(bridgeSource, /AGENT_AUTO_PREPARE_KEY/);
  assert.match(bridgeSource, /\.tool-workbench, \.workbench/);
  assert.match(bridgeSource, /bytequant:agent-input/);
  assert.match(bridgeSource, /querySelector<HTMLElement>\("\[data-agent-contract\]"\)/);
  assert.match(bridgeSource, /\[data-agent-mode\]/);
  assert.match(bridgeSource, /step\.toolSlug === "csv-inceleyici"/);
  assert.match(bridgeSource, /sourceField\.value\.slice\(0, AGENT_SESSION_LIMIT\)/);
  assert.match(bridgeSource, /\[data-agent-output\]:not\(\[data-ready\]\)/);
  assert.match(bridgeSource, /slug: nextStep\.toolSlug, createdAt: Date\.now\(\)/);
  assert.match(genericWorkbenchSource, /data-agent-mode/);
  assert.match(essentialWorkbenchSource, /data-agent-contract="fields-v1"/);
  assert.match(turkish, /bytequant:canonical-origin/);
  assert.match(turkish, /bq-org-agent-v2-20260725/);
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
  assert.match(turkish, /Tekrarlanan işleri, takip etmesi kolay görsel akışlara dönüştürün/);
  assert.match(english, /Turn repeated tasks into visual flows that are easy to follow/);
  assert.match(german, /Wiederkehrende Aufgaben in leicht verständliche visuelle Abläufe verwandeln/);
  assert.match(chinese, /把重复任务变成清晰易懂的可视化流程/);
  assert.match(turkish, /İlk akışınızı beş anlaşılır adımda kurun/);
  assert.match(english, /Build your first flow in five clear steps/);
  assert.match(german, /Den ersten Ablauf in fünf klaren Schritten erstellen/);
  assert.match(chinese, /通过五个清晰步骤建立首个流程/);
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
  for (const page of [turkish, english, german, chinese]) assert.doesNotMatch(page, /211 (?:araçlık|tools|Werkzeuge|个工具)/);
  assert.match(importer, /name="robots" content="noindex, nofollow, noarchive"|content="noindex, nofollow, noarchive" name="robots"/);
  assert.match(importer, /rel="canonical" href="https:\/\/bytequant\.org\/en\/workstation\//);
  assert.doesNotMatch(importer, /FAQPage|HowTo|WebApplication/);
  assert.match(guide, /IndexedDB/);
  assert.match(guide, /RTCDataChannel/);
  assert.match(guide, /developer\.mozilla\.org/);
  assert.match(guide, /rfc-editor\.org/);
});

test("exports the 55-tool expansion and localized evidence guides", async () => {
  const sampleSlugs = [
    "prompt-varsayim-haritasi", "cumle-sadelestirici", "json-schema-ornek-uretici",
    "csv-markdown-donusturucu", "gizli-deger-redaksiyon-planlayici",
    "kredi-amortisman-tahminleyici", "karar-matrisi", "ajan-gorev-ayristirici",
    "paket-manifestosu-denetleyici", "kaynak-guvenilirlik-matrisi",
  ];
  const localeRoots = ["araclar", "en/tools", "de/tools", "zh/tools"];
  const pages = await Promise.all(localeRoots.flatMap((localeRoot) => sampleSlugs.map((slug) => read(`${localeRoot}/${slug}/index.html`))));
  for (const page of pages) {
    assert.match(page, /WebApplication/);
    assert.match(page, /HowTo/);
    assert.match(page, /FAQPage/);
    assert.match(page, /dateModified[^<]*2026-08-11/);
  }
  for (const localeRoot of ["blog", "en/blog", "de/blog", "zh/blog"]) {
    for (const slug of ["local-agent-workstation-verifiable-planning", "source-reliability-evidence-synthesis", "seo-aeo-geo-useful-tool-pages"]) {
      const guide = await read(`${localeRoot}/${slug}/index.html`);
      assert.match(guide, /BlogPosting/);
      assert.match(guide, /hrefLang="x-default"/);
    }
  }
});

test("exports finite official-source updates and verified session-only P2P chat", async () => {
  const [tr, en, de, zh, trCommunity, enCommunity, syncSource, networkSource, newsClientSource] = await Promise.all([
    read("guncel/index.html"), read("en/updates/index.html"), read("de/updates/index.html"), read("zh/updates/index.html"),
    read("topluluk/index.html"), read("en/community/index.html"), readSource("scripts/sync-news.mjs"),
    readSource("app/components/CommunityNetwork.tsx"), readSource("app/components/NewsFeedClient.tsx"),
  ]);
  for (const page of [tr, en, de, zh]) {
    assert.doesNotThrow(() => jsonLd(page));
    assert.match(page, /CollectionPage/);
    assert.match(page, /hrefLang="tr-TR"/);
    assert.match(page, /hrefLang="en-US"/);
    assert.match(page, /hrefLang="de-DE"/);
    assert.match(page, /hrefLang="zh-CN"/);
    assert.match(page, /hrefLang="x-default"/);
  }
  assert.match(tr, /NASA|NIST/);
  assert.match(en, /official sources/i);
  assert.match(trCommunity, /P2P/);
  assert.match(enCommunity, /DIRECT P2P CHAT/);
  assert.match(enCommunity, /safety code/i);
  assert.doesNotMatch(enCommunity, /socket\.io|firebase|supabase|gundb/i);
  assert.match(syncSource, /hosts:/);
  assert.match(syncSource, /4_000_000/);
  assert.match(syncSource, /GOV\.UK/);
  assert.match(syncSource, /NSF/);
  assert.match(syncSource, /NIH/);
  assert.match(syncSource, /ESA/);
  assert.match(syncSource, /NCSC/);
  assert.match(syncSource, /NOAA/);
  assert.match(syncSource, /AbortSignal\.timeout\(15_000\)/);
  assert.match(networkSource, /kinds: \[1, 5\]/);
  assert.match(networkSource, /async function deletePost/);
  assert.match(networkSource, /function editPost/);
  assert.match(networkSource, /publishEvent\(5,/);
  assert.match(networkSource, /community-source-quote/);
  assert.match(newsClientSource, /bytequant:community-news-quote:v1/);
  assert.match(newsClientSource, /Toplulukta alıntıla|Quote in Community/);
});

test("ships the July 26 depth, local-social, and supply-chain quality pass", async () => {
  const [trGuide, enGuide, deGuide, zhGuide, communitySource, composerSource, agentSource, toolSource, newsSource, generatedNews, workflow] = await Promise.all([
    read("blog/local-agent-workstation-verifiable-planning/index.html"),
    read("en/blog/local-agent-workstation-verifiable-planning/index.html"),
    read("de/blog/local-agent-workstation-verifiable-planning/index.html"),
    read("zh/blog/local-agent-workstation-verifiable-planning/index.html"),
    readSource("app/components/CommunityFeed.tsx"),
    readSource("app/components/CommunityComposer.tsx"),
    readSource("app/components/AgenticAssistant.tsx"),
    readSource("app/components/ExpansionWorkbenches.tsx"),
    readSource("app/components/NewsFeedClient.tsx"),
    readSource("app/lib/generated-news.ts"),
    readSource(".github/workflows/deploy.yml"),
  ]);

  for (const guide of [trGuide, enGuide, deGuide, zhGuide]) {
    assert.match(guide, /2026-07-26/);
    assert.ok((guide.match(/section-index/g) ?? []).length >= 5);
    assert.match(guide, /BlogPosting/);
  }
  assert.match(trGuide, /Kalite kapısı, hata senaryosu ve güvenli teslim/);
  assert.match(enGuide, /Quality gate, failure path, and safe delivery/);
  assert.match(deGuide, /Qualitätsgrenze, Fehlerpfad und sichere Übergabe/);
  assert.match(zhGuide, /质量门槛、失败路径与安全交付/);

  assert.match(communitySource, /type Visibility = "public" \| "private"/);
  assert.match(communitySource, /type Audience = Visibility \| "group"/);
  assert.match(communitySource, /bytequant:community-feed:v4/);
  assert.match(communitySource, /exportPack/);
  assert.match(composerSource, /audience/);
  assert.match(composerSource, /groupName/);
  assert.match(communitySource, /does not fake those features or counts/i);
  assert.doesNotMatch(communitySource, /simulatedGlobalCount|fakeMemberCount/);

  assert.match(agentSource, /specialistCopy/);
  assert.match(agentSource, /workflow architect/i);
  assert.match(agentSource, /not separate LLMs/i);
  assert.match(toolSource, /SMART goal contract/);
  assert.match(toolSource, /Decision-focused meeting agenda/);
  assert.match(toolSource, /Closure gate/);
  assert.equal((toolSource.match(/pair\.length >= 2/g) ?? []).length, 2);
  assert.match(newsSource, /news-source-brief-prominent/);
  assert.doesNotMatch(newsSource, /news-checklist/);
  assert.match(newsSource, /summaryOrigin === "feed"/);
  assert.match(newsSource, /reviewedKey/);
  assert.match(generatedNews, /"sourceSummary":/);
  assert.match(generatedNews, /"summaryOrigin":/);
  assert.doesNotMatch(generatedNews, /"sourceSummary":\s*"[^"\n]*<[^>]+>/);

  assert.match(workflow, /pnpm audit:licenses/);
  assert.match(workflow, /pnpm audit:static/);
  assert.match(workflow, /pnpm audit:adsense/);
  for (const audit of ["content", "editorial", "trust", "inventory", "stage1", "stage2", "stage3", "stage4", "release"]) assert.match(workflow, new RegExp(`pnpm audit:${audit}`));
  assert.doesNotMatch(workflow, /uses:\s+[^\s]+@v\d/);
  for (const sha of workflow.matchAll(/uses:\s+[^\s]+@([a-f0-9]{40})/g)) assert.equal(sha[1].length, 40);
  const licenseAudit = await readSource("scripts/audit-licenses.mjs");
  assert.match(licenseAudit, /name\.startsWith\("@img\/sharp-libvips-"\)/);
  assert.match(licenseAudit, /license === "LGPL-3\.0-or-later"/);
});
