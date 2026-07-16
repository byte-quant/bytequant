import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name));
const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const brokenLinks = new Set();
const invalidSchemas = new Set();
let schemaBlocks = 0;

function localTargetExists(href) {
  const pathname = decodeURI(href.split("#")[0].split("?")[0]);
  if (!pathname || pathname === "/") return existsSync(path.join(root, "index.html"));
  const relative = pathname.replace(/^\//, "");
  return existsSync(path.join(root, relative)) || existsSync(path.join(root, relative, "index.html")) || existsSync(path.join(root, `${relative}.html`));
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
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
}

const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(invalidSchemas.size, 0, `Invalid JSON-LD: ${[...invalidSchemas].join(", ")}`);
assert.equal(brokenLinks.size, 0, `Broken internal links:\n${[...brokenLinks].slice(0, 20).join("\n")}`);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate canonical URLs.");
assert.ok(sitemap.includes('hreflang="x-default"'), "Sitemap is missing x-default alternates.");

console.log(`Static audit passed: ${htmlFiles.length} HTML files, ${schemaBlocks} valid JSON-LD blocks, ${sitemapUrls.length} unique sitemap URLs, 0 broken internal links.`);
