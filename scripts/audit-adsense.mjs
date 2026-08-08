import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [layout, shell, home, tool, article, blog, agent, workstation, community, privacy, localizedInfo, cookies, adsTxt, robots, worker, headers, sitemap, infoPage, contentQuality, newsPage] = await Promise.all([
  read("app/layout.tsx"), read("app/components/SiteShell.tsx"), read("app/components/HomePage.tsx"), read("app/components/ToolPage.tsx"),
  read("app/components/ArticlePage.tsx"), read("app/components/BlogIndex.tsx"), read("app/components/AgenticAssistant.tsx"),
  read("app/components/WorkstationClient.tsx"), read("app/components/CommunityPage.tsx"), read("app/lib/info.ts"), read("app/lib/localized-info.ts"), read("app/components/ConsentManager.tsx"),
  read("public/ads.txt"), read("app/robots.ts"), read("worker/index.ts"), read("public/_headers"), read("app/sitemap.ts"),
  read("app/components/InfoPage.tsx"), read("app/lib/content-quality.ts"), read("app/components/NewsPage.tsx"),
]);

const publisherId = "ca-pub-4158794981134847";
assert.equal((layout.match(new RegExp(publisherId, "g")) ?? []).length, 3, "publisher ID must match in metadata, explicit meta, and script URL");
assert.match(layout, /<Script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive"/);
assert.match(layout, /name="google-adsense-account" content="ca-pub-4158794981134847"/);
assert.equal((layout.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) ?? []).length, 1, "Auto Ads bootstrap must be loaded exactly once");
assert.equal(adsTxt.trim(), "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0");
assert.match(robots, /Mediapartners-Google/);
for (const source of [layout, worker, headers]) {
  assert.match(source, /googlesyndication\.com/);
  assert.match(source, /doubleclick\.net/);
  assert.match(source, /frame-src/);
}

for (const [name, source] of Object.entries({ home, tool, article, blog, agent, workstation, community })) {
  assert.doesNotMatch(source, /<AdSlot|data-ad-status="auto-ads-eligible"|className="ad-slot/, `${name}: manual placeholders must not compete with Auto Ads`);
}
const componentNames = await readdir(new URL("../app/components/", import.meta.url));
for (const name of componentNames.filter((item) => item.endsWith(".tsx"))) {
  const source = await read(`app/components/${name}`);
  assert.doesNotMatch(source, /adsbygoogle\.push|<ins[^>]+adsbygoogle|data-ad-slot=/i, `${name}: manual ad units must not compete with Auto Ads`);
}

assert.match(privacy, /Google-certified CMP|Google sertifikalı CMP/);
assert.match(privacy, /ca-pub-4158794981134847/);
assert.match(privacy, /ads\.txt/);
assert.match(cookies, /optional|isteğe bağlı|Einwilligung|可选/i);
assert.match(shell, /pathFor\(locale, "privacy"\)/);
assert.match(shell, /pathFor\(locale, "cookies"\)/);
assert.match(shell, /pathFor\(locale, "terms"\)/);
assert.match(shell, /pathFor\(locale, "contact"\)/);
assert.match(shell, /pathFor\(locale, "about"\)/);
assert.match(shell, /PrivacySettingsButton/);
assert.match(sitemap, /"community", "news", "blog", "about", "privacy", "cookies", "terms", "contact", "faq"/);
assert.match(sitemap, /const toolRoutes = tools\.flatMap/);
assert.doesNotMatch(sitemap, /isEditoriallyReviewedTool/);
assert.match(contentQuality, /nonIndexableRobots/);
assert.match(contentQuality, /adsenseAccountExclusionPaths/);
assert.doesNotMatch(newsPage, /<main className="news-page"/);
assert.match(infoPage, /pageKey === "about" \? "AboutPage"/);
assert.match(infoPage, /pageKey === "contact" \? "ContactPage"/);
assert.match(infoPage, /pageKey === "faq" \? "FAQPage"/);
assert.ok(privacy.length > 20_000, "Turkish trust pages must contain substantive first-party content");
assert.ok(localizedInfo.length > 20_000, "localized trust pages must contain substantive first-party content");
for (const source of [home, tool, article, blog]) assert.doesNotMatch(source, /click (?:the )?ad|reklama tıkla|anzeigen? anklicken|点击广告/i, "content must not encourage ad clicks");

console.log("AdSense static readiness: PASS");
console.log("Publisher tag and ads.txt: ACTIVE for ca-pub-4158794981134847");
console.log("Auto Ads layout: PASS (single bootstrap, no manual placeholders or slot competition)");
console.log("Trust navigation: PASS (privacy, cookies, terms, about, contact, FAQ, and privacy settings)");
console.log("External account checks remain: Google-certified CMP/TCF publication, Auto Ads preview/exclusions, site review, and Policy Center status.");
