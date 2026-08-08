import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("out");
const canonicalOrigin = "https://bytequant.org";
const publisherId = "ca-pub-4158794981134847";
const sellerRecord = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0";
const standardsPaths = [
  "/yayin-ilkeleri/",
  "/en/publishing-standards/",
  "/de/publishing-standards/",
  "/zh/publishing-standards/",
];

assert.ok(existsSync(root), "Run the production build before the release-readiness audit.");

const readOutput = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");
const readSource = (relativePath) => readFileSync(path.resolve(relativePath), "utf8");
const canonicalFrom = (html) => /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i.exec(html)?.[1]
  ?? /<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i.exec(html)?.[1];
const hasNoindex = (html) => /<meta[^>]+(?:name="robots"[^>]+content="[^"]*noindex|content="[^"]*noindex[^>]+name="robots")/i.test(html);
const outputPathFor = (url) => {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  return pathname ? path.join(root, pathname, "index.html") : path.join(root, "index.html");
};
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : target;
});
const gzipBytes = (file) => gzipSync(readFileSync(file), { level: 9 }).byteLength;

const layout = readSource("app/layout.tsx");
const adsTxtSource = readSource("public/ads.txt");
const headers = readSource("public/_headers");
const worker = readSource("worker/index.ts");
const workflow = readSource(".github/workflows/deploy.yml");
const sitemap = readOutput("sitemap.xml");
const robots = readOutput("robots.txt");
const llms = readOutput("llms.txt");
const home = readOutput("index.html");

assert.equal(adsTxtSource.trim(), sellerRecord, "Protected ads.txt seller record changed.");
assert.equal((layout.match(new RegExp(publisherId, "g")) ?? []).length, 3, "Protected AdSense publisher integration changed.");
assert.equal((layout.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) ?? []).length, 1, "Auto Ads must load exactly once.");
assert.doesNotMatch(layout, /234 (?:benzersiz|Tarayıcı|Araç)/, "Root metadata contains a stale tool count.");
assert.doesNotMatch(home, /<ins[^>]+adsbygoogle|data-ad-slot=/i, "Manual ad units must not appear in generated HTML.");

assert.match(robots, /User-Agent: \*[\s\S]*?Allow: \//i, "The public crawl policy must allow standards-compliant search crawlers, including Googlebot.");
for (const crawler of ["Google-Extended", "Mediapartners-Google", "GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"]) {
  assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*?Allow: /`, "i"), `${crawler} must be allowed to crawl public pages.`);
}
assert.match(robots, /Sitemap: https:\/\/bytequant\.org\/sitemap\.xml/i);

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(sitemapUrls.length > 1_500, `Unexpectedly small sitemap: ${sitemapUrls.length} URLs.`);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate canonical URLs.");

const canonicalOwners = new Map();
let schemaBlocks = 0;
for (const url of sitemapUrls) {
  assert.equal(new URL(url).origin, canonicalOrigin, `Non-canonical sitemap host: ${url}`);
  const file = outputPathFor(url);
  assert.ok(existsSync(file), `Sitemap URL has no generated page: ${url}`);
  const html = readFileSync(file, "utf8");
  assert.equal(canonicalFrom(html), url, `Canonical mismatch for ${url}`);
  assert.ok(!hasNoindex(html), `Sitemap URL is noindex: ${url}`);
  assert.match(html, /hreflang="x-default"/i, `Missing x-default hreflang: ${url}`);
  assert.match(html, /<meta[^>]+(?:name="description"[^>]+content="[^"]+"|content="[^"]+"[^>]+name="description")/i, `Missing description: ${url}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length > 0, `Missing JSON-LD: ${url}`);
  for (const schema of schemas) {
    JSON.parse(schema[1]);
    schemaBlocks += 1;
  }
  assert.ok(!canonicalOwners.has(url), `Duplicate indexable canonical: ${url}`);
  canonicalOwners.set(url, file);
}

for (const standardsPath of standardsPaths) {
  const url = `${canonicalOrigin}${standardsPath}`;
  assert.ok(sitemapUrls.includes(url), `Publishing standards missing from sitemap: ${url}`);
  assert.ok(llms.includes(url.replace(/\/$/, "")), `Publishing standards missing from llms.txt: ${url}`);
}
assert.ok(!sitemapUrls.some((url) => new URL(url).pathname === "/workspace/"), "Private recipe importer must remain outside the sitemap.");
assert.match(llms, /(?:does not|neither[^.]+) guarantee(?:s)? indexing, citation, ranking, AdSense approval/i);
assert.match(llms, /Local Agent 4\.3/);

for (const source of [headers, worker]) {
  assert.match(source, /Content-Security-Policy/i);
  assert.match(source, /default-src 'self'/i);
  assert.match(source, /object-src 'none'/i);
  assert.match(source, /base-uri 'self'/i);
  assert.match(source, /frame-ancestors 'none'/i);
  assert.match(source, /googlesyndication\.com/i);
  assert.match(source, /doubleclick\.net/i);
}
for (const audit of ["static", "adsense", "content", "editorial", "trust", "inventory", "stage1", "stage2", "stage3", "release"]) {
  assert.match(workflow, new RegExp(`pnpm audit:${audit}`), `CI does not run audit:${audit}.`);
}

const homeFile = path.join(root, "index.html");
const assetUrls = [...new Set([...home.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^\"]*)?)"/g)].map((match) => match[1].split("?")[0]))];
const assetFiles = assetUrls.map((url) => path.join(root, url.replace(/^\//, ""))).filter(existsSync);
const scriptFiles = assetFiles.filter((file) => file.endsWith(".js"));
const styleFiles = assetFiles.filter((file) => file.endsWith(".css"));
const homeGzip = gzipBytes(homeFile);
const scriptGzip = scriptFiles.reduce((total, file) => total + gzipBytes(file), 0);
const styleGzip = styleFiles.reduce((total, file) => total + gzipBytes(file), 0);
assert.ok(homeGzip <= 150_000, `Home HTML gzip budget exceeded: ${homeGzip} bytes.`);
assert.ok(scriptGzip <= 400_000, `Home JavaScript gzip budget exceeded: ${scriptGzip} bytes.`);
assert.ok(styleGzip <= 110_000, `Home CSS gzip budget exceeded: ${styleGzip} bytes.`);

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const indexableCanonicalCounts = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const canonical = canonicalFrom(html);
  if (!canonical || hasNoindex(html)) continue;
  indexableCanonicalCounts.set(canonical, (indexableCanonicalCounts.get(canonical) ?? 0) + 1);
}
const duplicateCanonicals = [...indexableCanonicalCounts].filter(([, count]) => count > 1);
assert.equal(duplicateCanonicals.length, 0, `Multiple indexable pages share a canonical: ${duplicateCanonicals.slice(0, 5).map(([url]) => url).join(", ")}`);

console.log("Final release-readiness audit: PASS");
console.log(`Discovery: ${sitemapUrls.length} unique indexable URLs, ${schemaBlocks} valid JSON-LD blocks, robots and llms.txt aligned.`);
console.log(`Performance budgets (gzip): HTML ${homeGzip} B, home JS ${scriptGzip} B, home CSS ${styleGzip} B.`);
console.log(`Security policy sources and protected AdSense identity: PASS (${publisherId}).`);
console.log("Account-side AdSense review, CMP publication, Auto Ads exclusions, and Search Console inspection remain owner-controlled gates.");
