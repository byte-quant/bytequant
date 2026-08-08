import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { publicTools } from "../app/lib/tools.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const origin = "https://bytequant.org";
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const reportUrl = new URL("../docs/ADSENSE-STAGE-4-FINAL-REPORT.md", import.meta.url);

assert.ok(existsSync(out), "Run the production build before Stage 4 audit.");
const source = (relative) => readFileSync(join(root, relative), "utf8");
const output = (relative) => readFileSync(join(out, relative), "utf8");
const normalize = (value) => decodeEntities(String(value)).replace(/\s+/g, " ").trim();
function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&nbsp;", " ");
}
const attr = (tag, name) => new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1];
const canonicalFrom = (html) => [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]).find((tag) => /\brel="canonical"/i.test(tag))?.match(/href="([^"]+)"/i)?.[1];
const noindex = (html) => /<meta\b[^>]*(?:name="robots"[^>]*content="[^"]*noindex|content="[^"]*noindex[^>]*name="robots")/i.test(html);
const pathForUrl = (url) => {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  return pathname ? join(out, pathname, "index.html") : join(out, "index.html");
};
const visibleText = (html) => normalize(html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
const flattenSchema = (value, items = []) => {
  if (Array.isArray(value)) for (const item of value) flattenSchema(item, items);
  else if (value && typeof value === "object") {
    items.push(value);
    if (Array.isArray(value["@graph"])) flattenSchema(value["@graph"], items);
  }
  return items;
};
const gzipBytes = (file) => gzipSync(readFileSync(file), { level: 9 }).byteLength;

const adsTxt = source("public/ads.txt");
const layout = source("app/layout.tsx");
const shell = source("app/components/SiteShell.tsx");
const homeSource = source("app/components/HomePage.tsx");
const headersSource = source("public/_headers");
const worker = source("worker/index.ts");
const workflow = source(".github/workflows/deploy.yml");
const manifest = output("manifest.webmanifest");
const serviceWorker = output("sw.js");
const robots = output("robots.txt");
const llms = output("llms.txt");
const sitemap = output("sitemap.xml");

assert.equal(adsTxt, expectedAds, "Protected ads.txt record changed.");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedHash, "Protected ads.txt hash changed.");
assert.ok(layout.includes(expectedScript), "Protected Auto Ads script changed.");
assert.equal((layout.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) ?? []).length, 1, "Auto Ads must load once.");
assert.doesNotMatch(output("index.html"), /<ins[^>]+adsbygoogle|data-ad-slot=/i, "Manual ad inventory competes with Auto Ads.");

assert.match(shell, /includeGlobalSchema = false/);
assert.match(shell, /includeGlobalSchema \? <SchemaScript data=\{globalSchema\}/);
assert.match(homeSource, /includeGlobalSchema/);
assert.doesNotMatch(shell, /^\s*<SchemaScript data=\{globalSchema\} \/>\s*$/m, "Organization/WebSite schema must not be repeated unconditionally.");

for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'", "upgrade-insecure-requests"]) {
  assert.ok(headersSource.includes(directive) && worker.includes(directive), `Security policy missing ${directive}.`);
}
for (const header of ["Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Permissions-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "Origin-Agent-Cluster"]) {
  assert.ok(headersSource.includes(header) && worker.includes(header), `Security header source mismatch: ${header}.`);
}
assert.match(headersSource, /\/sw\.js[\s\S]*no-cache, no-store, must-revalidate/);
assert.match(headersSource, /\/_next\/static\/\*[\s\S]*max-age=31536000, immutable/);
assert.match(worker, /pathname === "\/sw\.js"/);
assert.match(worker, /pathname\.startsWith\("\/_next\/static\/"\)/);
const securityTxt = source("public/.well-known/security.txt");
assert.match(securityTxt, /^Contact: mailto:bytequant@yahoo\.com$/m);
assert.match(securityTxt, /^Canonical: https:\/\/bytequant\.org\/\.well-known\/security\.txt$/m);
assert.ok(new Date(/^Expires: (.+)$/m.exec(securityTxt)?.[1] ?? 0) > new Date("2026-08-09"), "security.txt is expired.");

for (const crawler of ["Googlebot", "Mediapartners-Google", "Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"]) {
  if (crawler === "Googlebot") assert.match(robots, /User-Agent: \*[\s\S]*Allow: \//i);
  else assert.match(robots, new RegExp(`User-Agent: ${crawler}[\\s\\S]*Allow: /`, "i"));
}
assert.match(robots, /Sitemap: https:\/\/bytequant\.org\/sitemap\.xml/);
assert.match(llms, /canonical HTML pages[\s\S]*authoritative/i);
assert.match(llms, /does not|Neither/i);
for (const tool of publicTools) assert.ok(llms.includes(`/en/tools/${tool.slug}`) || llms.includes(`/araclar/${tool.slug}`), `llms.txt omits ${tool.slug}.`);

const sitemapBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
const sitemapEntries = new Map();
for (const block of sitemapBlocks) {
  const url = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
  assert.ok(url, "Sitemap entry lacks loc.");
  const alternates = [...block.matchAll(/<xhtml:link\b[^>]*\/>/g)].map((match) => ({ language: attr(match[0], "hreflang"), href: attr(match[0], "href") }));
  sitemapEntries.set(url, alternates);
}
assert.ok(sitemapEntries.size > 1_500, `Sitemap unexpectedly small: ${sitemapEntries.size}.`);

let schemaBlocks = 0;
let faqItems = 0;
let howToItems = 0;
let reciprocalLinks = 0;
let organizationPages = 0;
const titles = new Map();
const descriptions = new Map();
const schemaTypes = new Set();
for (const [url, alternates] of sitemapEntries) {
  assert.equal(new URL(url).origin, origin, `Foreign sitemap origin: ${url}`);
  const file = pathForUrl(url);
  assert.ok(existsSync(file), `Sitemap URL has no generated page: ${url}`);
  const html = readFileSync(file, "utf8");
  const pathname = new URL(url).pathname;
  const locale = pathname.startsWith("/en/") || pathname === "/en/" ? "en" : pathname.startsWith("/de/") || pathname === "/de/" ? "de" : pathname.startsWith("/zh/") || pathname === "/zh/" ? "zh" : "tr";
  assert.equal(canonicalFrom(html), url, `Canonical mismatch: ${url}`);
  assert.ok(!noindex(html), `Indexable sitemap page has noindex: ${url}`);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, `Expected one main landmark: ${url}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected one H1: ${url}`);
  const expectedLang = locale === "zh" ? "zh-CN" : locale;
  assert.equal(/<html[^>]+lang="([^"]+)"/i.exec(html)?.[1], expectedLang, `HTML lang mismatch: ${url}`);
  const title = normalize(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]).find((tag) => /name="description"/i.test(tag));
  const description = normalize(descriptionTag ? attr(descriptionTag, "content") ?? "" : "");
  assert.ok(title.length >= 8 && title.length <= 180, `Title length is not useful (${title.length}): ${url}`);
  assert.ok(description.length >= (locale === "zh" ? 14 : 40) && description.length <= 360, `Description length is not useful (${description.length}): ${url}`);
  const titleKey = `${locale}:${title.toLocaleLowerCase()}`;
  const descriptionKey = `${locale}:${description.toLocaleLowerCase()}`;
  assert.ok(!titles.has(titleKey), `Duplicate localized title: ${url} and ${titles.get(titleKey)}`);
  assert.ok(!descriptions.has(descriptionKey), `Duplicate localized description: ${url} and ${descriptions.get(descriptionKey)}`);
  titles.set(titleKey, url);
  descriptions.set(descriptionKey, url);

  assert.ok(alternates.some((item) => item.href === url), `Hreflang cluster lacks self reference: ${url}`);
  assert.ok(alternates.some((item) => item.language === "x-default"), `Hreflang cluster lacks x-default: ${url}`);
  for (const alternate of alternates) {
    if (!alternate.href || !sitemapEntries.has(alternate.href)) continue;
    assert.ok(sitemapEntries.get(alternate.href).some((candidate) => candidate.href === url), `Hreflang return link missing: ${alternate.href} -> ${url}`);
    reciprocalLinks += 1;
  }

  const text = visibleText(html);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length > 0, `Missing JSON-LD: ${url}`);
  for (const match of schemas) {
    const parsed = JSON.parse(match[1]);
    schemaBlocks += 1;
    for (const item of flattenSchema(parsed)) {
      const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
      for (const type of types.filter(Boolean)) schemaTypes.add(type);
      if (types.includes("Organization")) organizationPages += 1;
      if (types.includes("FAQPage")) for (const question of item.mainEntity ?? []) {
        assert.ok(text.includes(normalize(question.name)), `FAQ schema is not visibly represented: ${url}`);
        faqItems += 1;
      }
      if (types.includes("HowTo")) for (const step of item.step ?? []) {
        const candidate = normalize(step.text ?? step.name ?? "");
        assert.ok(candidate && text.includes(candidate), `HowTo schema is not visibly represented: ${url}`);
        howToItems += 1;
      }
    }
  }
}
assert.equal(sitemapEntries.size, 1_624, "Unexpected canonical sitemap inventory.");
assert.equal(organizationPages, 8, "Organization schema should appear only on four home and four about pages.");

const manifestJson = JSON.parse(manifest);
assert.equal(manifestJson.prefer_related_applications, false);
assert.ok(manifestJson.icons.some((icon) => String(icon.purpose).includes("maskable")), "PWA manifest lacks maskable icon.");
assert.match(serviceWorker, /offline\.html/);
assert.match(serviceWorker, /fetch/);
for (const feed of ["feed.xml", "en/feed.xml", "de/feed.xml", "zh/feed.xml"]) {
  const xml = output(feed);
  assert.match(xml, /<rss\b/);
  assert.match(xml, /<channel>/);
  assert.ok((xml.match(/<item>/g) ?? []).length >= 10, `${feed} is too shallow.`);
}

const homeFile = join(out, "index.html");
const homeHtml = readFileSync(homeFile, "utf8");
const assetUrls = [...new Set([...homeHtml.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^\"]*)?)"/g)].map((match) => match[1].split("?")[0]))];
const assetFiles = assetUrls.map((url) => join(out, url.replace(/^\//, ""))).filter(existsSync);
const jsGzip = assetFiles.filter((file) => file.endsWith(".js")).reduce((total, file) => total + gzipBytes(file), 0);
const cssGzip = assetFiles.filter((file) => file.endsWith(".css")).reduce((total, file) => total + gzipBytes(file), 0);
const homeGzip = gzipBytes(homeFile);
const sampleToolGzip = gzipBytes(pathForUrl(`${origin}/araclar/json-bicimlendirici/`));
assert.ok(homeGzip <= 150_000, `Home HTML gzip budget exceeded: ${homeGzip}.`);
assert.ok(sampleToolGzip <= 135_000, `Tool HTML gzip budget exceeded: ${sampleToolGzip}.`);
assert.ok(jsGzip <= 390_000, `Initial home JavaScript gzip budget exceeded: ${jsGzip}.`);
assert.ok(cssGzip <= 100_000, `Initial home CSS gzip budget exceeded: ${cssGzip}.`);

assert.match(workflow, /pnpm audit:stage4/);
const report = `# AdSense remediation — Stage 4 final acceptance report

Generated: 2026-08-09

## Final repository gate

| Measure | Verified |
| --- | ---: |
| Canonical indexable URLs | ${sitemapEntries.size} |
| Reciprocal hreflang links checked | ${reciprocalLinks} |
| Valid JSON-LD blocks | ${schemaBlocks} |
| Visible FAQ schema entries | ${faqItems} |
| Visible HowTo schema steps | ${howToItems} |
| Canonical tools represented in llms.txt | ${publicTools.length} |
| Duplicate localized titles | 0 |
| Duplicate localized descriptions | 0 |

## Performance budgets (gzip)

| Surface | Bytes |
| --- | ---: |
| Home HTML | ${homeGzip} |
| Representative tool HTML | ${sampleToolGzip} |
| Initial home JavaScript | ${jsGzip} |
| Initial home CSS | ${cssGzip} |

## Applied final repairs

- Organization and WebSite identity markup is limited to the four home and four About pages instead of being repeated across the full catalog. Page-specific schema remains on every canonical URL.
- Hreflang clusters are checked for self references, x-default, and reciprocal return links across the complete sitemap.
- Security policy sources now agree on HSTS, COOP, CORP, permissions, content-type, framing, origin isolation, and cross-domain policy headers.
- The service-worker cache rule now targets the real /sw.js path. Fingerprinted assets receive immutable cache policy while HTML remains revalidated.
- A standards-based /.well-known/security.txt publishes the security contact, canonical record, languages, expiry, and policy location.
- Auto Ads remains a single owner-supplied bootstrap with no manual slots. The protected seller record and publisher identity are unchanged.

## Decision boundary

Repository acceptance: **PASS**. This is not an AdSense approval guarantee. Google-certified CMP publication, Policy Center status, Auto Ads preview/exclusions, Search Console canonical selection, traffic quality, and field Core Web Vitals remain account-side or real-user checks.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated Stage 4 final acceptance report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "Stage 4 report is stale; run pnpm stage4:generate");
  console.log(`AdSense Stage 4 audit: PASS (${sitemapEntries.size} URLs, ${schemaBlocks} JSON-LD blocks, ${reciprocalLinks} hreflang return links)`);
}
