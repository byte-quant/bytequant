import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name));
const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const brokenLinks = new Set();
const invalidSchemas = new Set();
const localeCanonicalErrors = new Set();
let schemaBlocks = 0;

function localTargetExists(href) {
  const pathname = decodeURI(href.split("#")[0].split("?")[0]);
  if (!pathname || pathname === "/") return existsSync(path.join(root, "index.html"));
  const relative = pathname.replace(/^\//, "");
  return existsSync(path.join(root, relative)) || existsSync(path.join(root, relative, "index.html")) || existsSync(path.join(root, `${relative}.html`));
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file).replaceAll("\\", "/");
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    schemaBlocks += 1;
    try {
      JSON.parse(match[1]);
    } catch {
      invalidSchemas.add(path.relative(root, file));
    }
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith("/") && !href.startsWith("/_next/") && !localTargetExists(href)) brokenLinks.add(`${path.relative(root, file)} -> ${href}`);
  }
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? /<link href="([^"]+)" rel="canonical"/.exec(html)?.[1];
  const expectedLocalePrefix = relativeFile.startsWith("de/") ? "/de/" : relativeFile.startsWith("zh/") ? "/zh/" : relativeFile.startsWith("en/") ? "/en/" : null;
  if (canonical && expectedLocalePrefix && !new URL(canonical).pathname.startsWith(expectedLocalePrefix)) localeCanonicalErrors.add(`${relativeFile} -> ${canonical}`);
  if (/http-equiv="X-Content-Type-Options"/i.test(html)) localeCanonicalErrors.add(`${relativeFile} contains an ineffective X-Content-Type-Options meta tag`);
}

const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(invalidSchemas.size, 0, `Invalid JSON-LD: ${[...invalidSchemas].join(", ")}`);
assert.equal(brokenLinks.size, 0, `Broken internal links:\n${[...brokenLinks].slice(0, 20).join("\n")}`);
assert.equal(localeCanonicalErrors.size, 0, `Locale/canonical errors:\n${[...localeCanonicalErrors].slice(0, 20).join("\n")}`);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate canonical URLs.");
assert.ok(sitemap.includes('hreflang="x-default"'), "Sitemap is missing x-default alternates.");
assert.ok(sitemapUrls.every((url) => {
  const pathname = new URL(url).pathname;
  const match = /\/(?:araclar|tools|blog|referanslar|references)\/([^/]+)\/?$/.exec(pathname);
  return !match || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(match[1]);
}), "Sitemap contains a non-canonical or non-ASCII slug.");
for (const pathName of ["/ajan/", "/en/agent/", "/de/agent/", "/zh/agent/", "/de/references/regex-cheat-sheet/", "/zh/references/cron-cheat-sheet/", "/de/blog/local-prompt-text-date-workflow/", "/zh/blog/loan-ai-rubric-csp-workflow/", "/araclar/yaml-json-donusturucu/", "/en/tools/hreflang-etiket-olusturucu/", "/de/tools/hmac-olusturucu-dogrulayici/", "/zh/tools/prompt-enjeksiyon-on-taramasi/", "/araclar/prompt-test-vaka-matrisi/", "/en/tools/data-uri-donusturucu/", "/de/tools/http-guvenlik-basliklari-denetleyici/", "/de/blog/technical-seo-robots-hreflang-faq-utm-workflow/", "/zh/blog/web-crypto-rag-prompt-injection-security-workflow/", "/de/blog/browser-only-agentic-ai-tool-orchestration/", "/zh/blog/browser-only-agentic-ai-tool-orchestration/"]) {
  assert.ok(sitemapUrls.some((url) => new URL(url).pathname === pathName), `Sitemap is missing ${pathName}`);
}
assert.ok(!sitemap.match(/lokale-produktivitaet|json-schema-bild|kredit-ai-bewertung/), "Legacy mixed-language slugs must not appear in the sitemap.");

console.log(`Static audit passed: ${htmlFiles.length} HTML files, ${schemaBlocks} valid JSON-LD blocks, ${sitemapUrls.length} unique sitemap URLs, 0 broken internal links.`);
