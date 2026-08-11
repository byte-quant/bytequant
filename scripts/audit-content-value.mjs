import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findStandalonePlaceholder } from "./lib/placeholder-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");
const walkHtml = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walkHtml(full) : entry.name.endsWith(".html") ? [full] : [];
  }));
  return nested.flat();
};

const [frontierSource, aliasSource, sitemapSource, qualitySource, layout, adsTxt, llms, sitemapXml, inventory] = await Promise.all([
  read("app/lib/frontier-tools.ts"), read("app/lib/tool-aliases.ts"), read("app/sitemap.ts"), read("app/lib/content-quality.ts"),
  read("app/layout.tsx"), read("public/ads.txt"), read("public/llms.txt"), read("out/sitemap.xml"), read("docs/TOOL-QUALITY-INVENTORY.md"),
]);
const frontierSlugs = [...frontierSource.matchAll(/\{ slug: "([^"]+)"/g)].map((match) => match[1]);
const aliasSlugs = [...aliasSource.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
assert.equal(frontierSlugs.length, 75, "frontier collection must contain exactly 75 explicit tools");
assert.equal(aliasSlugs.length, 12, "canonical alias register must contain exactly 12 URLs");
assert.match(sitemapSource, /const toolRoutes = tools\.flatMap/);
assert.doesNotMatch(sitemapSource, /isEditoriallyReviewedTool|tools\.filter/);
assert.match(qualitySource, /Search indexing and ad serving are separate controls/);
assert.match(llms, /317 distinct browser tools/);
assert.match(inventory, /Public canonical tools \| 317/);
assert.equal(adsTxt.trim(), "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0");
assert.match(layout, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847/);

const toolUrls = [...sitemapXml.matchAll(/<loc>https:\/\/bytequant\.org\/(?:araclar|en\/tools|de\/tools|zh\/tools)\/[^<]+<\/loc>/g)];
assert.equal(toolUrls.length, 317 * 4, "sitemap must contain every canonical tool in all four locales");
for (const slug of frontierSlugs) assert.match(sitemapXml, new RegExp(`/(?:araclar|en/tools|de/tools|zh/tools)/${slug}/`), `${slug} must be discoverable`);
for (const route of ["topluluk", "en/community", "de/community", "zh/community", "guncel", "en/updates", "de/updates", "zh/updates"]) {
  assert.match(sitemapXml, new RegExp(`https://bytequant\\.org/${route}/`), `${route} editorial landing page must be discoverable`);
}
assert.doesNotMatch(sitemapXml, /https:\/\/bytequant\.org\/workspace\//);
for (const route of ["hakkimizda", "gizlilik-politikasi", "kullanim-kosullari", "iletisim", "sss", "en/about", "en/privacy", "en/terms", "en/contact", "en/faq"]) {
  assert.match(sitemapXml, new RegExp(`https://bytequant\\.org/${route}/`), `${route} trust route must remain discoverable`);
}

const htmlFiles = await walkHtml(path.join(root, "out"));
let noindexCount = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  assert.doesNotMatch(html, /<main\b[\s\S]*<main\b/i, `${path.relative(root, file)} contains nested main landmarks`);
  const placeholder = findStandalonePlaceholder(html);
  assert.equal(placeholder, null, `${path.relative(root, file)} contains standalone placeholder content: ${placeholder}`);
  if (/name="robots" content="[^"]*noindex/i.test(html)) noindexCount += 1;
}
for (const localePrefix of ["araclar", "en/tools", "de/tools", "zh/tools"]) {
  for (const slug of frontierSlugs) {
    const html = await read(path.join("out", localePrefix, slug, "index.html"));
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${localePrefix}/${slug} must be indexable`);
    assert.match(html, /data-editorial-status="published"/, `${localePrefix}/${slug} must disclose publication status`);
  }
  for (const slug of aliasSlugs) {
    const html = await read(path.join("out", localePrefix, slug, "index.html"));
    assert.match(html, /name="robots" content="[^"]*noindex/i, `${localePrefix}/${slug} alias must remain noindex`);
  }
}
for (const route of ["topluluk", "en/community", "de/community", "zh/community", "guncel", "en/updates", "de/updates", "zh/updates"]) {
  const html = await read(path.join("out", route, "index.html"));
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${route} must be indexable`);
}
const workspace = await read(path.join("out", "workspace", "index.html"));
assert.match(workspace, /name="robots" content="[^"]*noindex/i, "query-driven workspace must remain noindex");

console.log(`Content value audit: PASS (${htmlFiles.length} HTML pages, ${noindexCount} intentional noindex pages)`);
console.log("Editorial index: 317 distinct tools and all localized community/news landing pages are discoverable.");
console.log("Duplicate aliases and the query-driven workspace remain noindex; Auto Ads exclusions remain account-side controls.");
