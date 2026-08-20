import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const origin = "https://bytequant.org";

assert.ok(existsSync(root), "Run the production build before the experience-integrity audit.");

const readOutput = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");
const outputPathFor = (url) => {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  return pathname ? path.join(root, pathname, "index.html") : path.join(root, "index.html");
};
const attributes = (tag) => new Map([...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), match[2]]));
const metaContent = (html, property) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if (attrs.get("property") === property || attrs.get("name") === property) return attrs.get("content");
  }
};
const linkHref = (html, rel) => {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if ((attrs.get("rel") ?? "").split(/\s+/).includes(rel)) return attrs.get("href");
  }
};
const localeFor = (url) => {
  const pathname = new URL(url).pathname;
  if (pathname === "/en" || pathname.startsWith("/en/")) return { html: "en", openGraph: "en_US" };
  if (pathname === "/de" || pathname.startsWith("/de/")) return { html: "de", openGraph: "de_DE" };
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return { html: "zh-CN", openGraph: "zh_CN" };
  return { html: "tr", openGraph: "tr_TR" };
};

const sitemap = readOutput("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sharedStyles = new Set();
let schemaBlocks = 0;

for (const url of urls) {
  assert.equal(new URL(url).origin, origin, `Unexpected sitemap origin: ${url}`);
  const file = outputPathFor(url);
  assert.ok(existsSync(file), `Missing generated route: ${url}`);
  const html = readFileSync(file, "utf8");
  const locale = localeFor(url);

  assert.equal(linkHref(html, "canonical"), url, `Canonical mismatch: ${url}`);
  assert.equal(metaContent(html, "og:url"), url, `Open Graph URL does not match the canonical: ${url}`);
  assert.equal(metaContent(html, "og:locale"), locale.openGraph, `Open Graph locale mismatch: ${url}`);
  assert.ok(metaContent(html, "og:title"), `Missing Open Graph title: ${url}`);
  assert.ok(metaContent(html, "og:description"), `Missing Open Graph description: ${url}`);
  assert.ok(metaContent(html, "og:image"), `Missing Open Graph image: ${url}`);
  assert.equal(metaContent(html, "twitter:card"), "summary_large_image", `Twitter card mismatch: ${url}`);
  assert.match(html, new RegExp(`<html[^>]+lang="${locale.html}"`, "i"), `HTML language mismatch: ${url}`);
  assert.match(html, /class="[^"]*experience-v3[^"]*"/i, `Final design system is not applied: ${url}`);
  assert.equal((html.match(/<main\b/gi) ?? []).length, 1, `Expected one main landmark: ${url}`);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `Expected one visible h1: ${url}`);

  const stylesheetUrls = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if ((attrs.get("rel") ?? "").split(/\s+/).includes("stylesheet") && attrs.get("href")) stylesheetUrls.push(attrs.get("href"));
  }
  assert.ok(stylesheetUrls.length > 0, `No stylesheet is linked: ${url}`);
  for (const href of stylesheetUrls) {
    const pathname = new URL(href, origin).pathname.replace(/^\//, "");
    assert.ok(existsSync(path.join(root, pathname)), `Stylesheet asset is missing for ${url}: ${href}`);
    sharedStyles.add(pathname);
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length > 0, `No structured data is attached: ${url}`);
  for (const [, raw] of schemas) {
    JSON.parse(raw);
    schemaBlocks += 1;
  }
}

assert.ok(sharedStyles.size > 0, "No shared production stylesheet was discovered.");
console.log(`Experience integrity audit: PASS (${urls.length} routes, ${sharedStyles.size} CSS assets, ${schemaBlocks} JSON-LD blocks).`);
console.log("Canonical/social locale parity, rendered landmarks, design shell, and stylesheet delivery are complete.");
