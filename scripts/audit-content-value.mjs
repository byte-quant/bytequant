import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const [frontierSource, sitemapSource, qualitySource, layout, adsTxt, llms, sitemapXml] = await Promise.all([
  read("app/lib/frontier-tools.ts"), read("app/sitemap.ts"), read("app/lib/content-quality.ts"),
  read("app/layout.tsx"), read("public/ads.txt"), read("public/llms.txt"), read("out/sitemap.xml"),
]);
const laboratorySlugs = [...frontierSource.matchAll(/\{ slug: "([^"]+)"/g)].map((match) => match[1]);
assert.equal(laboratorySlugs.length, 75, "laboratory collection must contain exactly 75 explicit tools");
assert.equal(new Set(laboratorySlugs).size, laboratorySlugs.length, "laboratory slugs must be unique");
assert.match(sitemapSource, /filter\(\(tool\) => isEditoriallyReviewedTool\(tool\.slug\)\)/);
assert.match(qualitySource, /follow: true/);
assert.match(llms, /234 editorially reviewed browser tools plus 75 clearly labelled laboratory tools/);
assert.equal(adsTxt.trim(), "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0");
assert.match(layout, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847/);

for (const slug of laboratorySlugs) assert.doesNotMatch(sitemapXml, new RegExp(`/(?:araclar|tools)/${slug}/`), `${slug} must stay out of the sitemap until review`);
for (const route of ["topluluk", "en/community", "de/community", "zh/community", "guncel", "en/updates", "de/updates", "zh/updates", "workspace"]) {
  assert.doesNotMatch(sitemapXml, new RegExp(`https://bytequant\\.org/${route}/`), `${route} must not be advertised as indexed publisher content`);
}
for (const route of ["hakkimizda", "gizlilik-politikasi", "kullanim-kosullari", "iletisim", "sss", "en/about", "en/privacy", "en/terms", "en/contact", "en/faq"]) {
  assert.match(sitemapXml, new RegExp(`https://bytequant\\.org/${route}/`), `${route} trust route must remain discoverable`);
}

const htmlFiles = await walkHtml(path.join(root, "out"));
let noindexCount = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  assert.doesNotMatch(html, /<main\b[\s\S]*<main\b/i, `${path.relative(root, file)} contains nested main landmarks`);
  assert.doesNotMatch(html, /lorem ipsum|under construction|coming soon/i, `${path.relative(root, file)} contains placeholder content`);
  if (/name="robots" content="[^"]*noindex/i.test(html)) noindexCount += 1;
}
for (const localePrefix of ["araclar", "en/tools", "de/tools", "zh/tools"]) {
  for (const slug of laboratorySlugs) {
    const html = await read(path.join("out", localePrefix, slug, "index.html"));
    assert.match(html, /name="robots" content="[^"]*noindex/i, `${localePrefix}/${slug} must disclose noindex`);
    assert.match(html, /data-editorial-status="laboratory"/, `${localePrefix}/${slug} must disclose laboratory status`);
  }
}
for (const route of ["topluluk", "en/community", "de/community", "zh/community", "guncel", "en/updates", "de/updates", "zh/updates"]) {
  const html = await read(path.join("out", route, "index.html"));
  assert.match(html, /name="robots" content="[^"]*noindex/i, `${route} must be noindex`);
}
for (const route of ["araclar/json-bicimlendirici", "en/tools/json-bicimlendirici", "de/tools/json-bicimlendirici", "zh/tools/json-bicimlendirici"]) {
  const html = await read(path.join("out", route, "index.html"));
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${route} reviewed tool must remain indexable`);
  assert.match(html, /data-editorial-status="reviewed"/);
}

console.log(`Content value audit: PASS (${htmlFiles.length} HTML pages, ${noindexCount} noindex pages)`);
console.log("Editorial index: 234 reviewed tools; 75 laboratory tools available but excluded from sitemap/indexing.");
console.log("Dynamic UGC and official-source feeds: accessible, noindex, and listed for AdSense account-level URL exclusion.");
