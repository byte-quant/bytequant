import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const decode = (value) => value
  .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&nbsp;/giu, " ")
  .replace(/&amp;/giu, "&")
  .replace(/&quot;/giu, '"')
  .replace(/&#39;|&apos;/giu, "'")
  .replace(/&lt;/giu, "<")
  .replace(/&gt;/giu, ">");
const text = (markup) => decode(markup
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<svg\b[\s\S]*?<\/svg>/giu, " ")
  .replace(/<[^>]+>/gu, " "))
  .normalize("NFKC")
  .replace(/\s+/gu, " ")
  .trim();
const localeOf = (route) => route.startsWith("en/") ? "en" : route.startsWith("de/") ? "de" : route.startsWith("zh/") ? "zh" : "tr";
const languageTag = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const units = (value, locale) => [...new Intl.Segmenter(languageTag[locale], { granularity: "word" }).segment(value)].filter((item) => item.isWordLike).length;
const familyOf = (route) => {
  if (/^(?:araclar|(?:en|de|zh)\/tools)\/[^/]+$/u.test(route)) return "tool";
  if (/^(?:blog|(?:en|de|zh)\/blog)\/[^/]+$/u.test(route)) return "guide";
  if (/^(?:referanslar|(?:en|de|zh)\/references)\/[^/]+$/u.test(route)) return "reference";
  if (/^(?:araclar|(?:en|de|zh)\/tools)$/u.test(route)) return "tool-index";
  if (/^(?:blog|(?:en|de|zh)\/blog)$/u.test(route)) return "guide-index";
  if (/^(?:ajan|(?:en|de|zh)\/agent|is-istasyonu|(?:en|de|zh)\/workstation|topluluk|(?:en|de|zh)\/community|guncel|(?:en|de|zh)\/updates)$/u.test(route)) return "product";
  if (route === "" || /^(?:en|de|zh)$/u.test(route)) return "home";
  return "trust";
};
const metaContent = (html, name) => {
  const tag = [...html.matchAll(/<meta\b[^>]*>/giu)].map((match) => match[0]).find((value) => new RegExp(`\\bname=["']${name}["']`, "iu").test(value));
  return tag ? decode(tag.match(/\bcontent=["']([^"']*)["']/iu)?.[1] ?? "") : "";
};
const minimums = {
  tool: { units: 650, paragraphs: 8, substantial: 5 },
  guide: { units: 850, paragraphs: 10, substantial: 7 },
  reference: { units: 350, paragraphs: 4, substantial: 2 },
  "tool-index": { units: 250, paragraphs: 3, substantial: 2 },
  "guide-index": { units: 250, paragraphs: 3, substantial: 2 },
  product: { units: 450, paragraphs: 7, substantial: 4 },
  home: { units: 450, paragraphs: 7, substantial: 4 },
  trust: { units: 300, paragraphs: 5, substantial: 3 },
};
const sitemap = await readFile(path.join(root, "out", "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/bytequant\.org\/?([^<]*)<\/loc>/gu)]
  .map((match) => decodeURIComponent(match[1]).replace(/^\/+|\/+$/gu, ""));
const records = [];
const paragraphOwners = new Map();
for (const route of routes) {
  const locale = localeOf(route);
  const family = familyOf(route);
  const file = path.join(root, "out", ...(route ? route.split("/") : []), "index.html");
  const html = await readFile(file, "utf8");
  const mainMarkup = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/iu)?.[1] ?? "";
  const visible = text(mainMarkup);
  const paragraphs = [...mainMarkup.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/giu)]
    .map((match) => text(match[1]))
    .filter(Boolean);
  const substantial = paragraphs.filter((paragraph) => units(paragraph, locale) >= (locale === "zh" ? 18 : 16));
  const long = paragraphs.filter((paragraph) => units(paragraph, locale) >= (locale === "zh" ? 35 : 42));
  for (const paragraph of long) {
    const key = paragraph.toLocaleLowerCase(languageTag[locale]);
    const owners = paragraphOwners.get(key) ?? [];
    owners.push(route || "/");
    paragraphOwners.set(key, owners);
  }
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1] ?? "");
  const description = metaContent(html, "description");
  const controls = (mainMarkup.match(/<(?:button|input|select|textarea)\b/giu) ?? []).length;
  const headings = (mainMarkup.match(/<h[1-3]\b/giu) ?? []).length;
  const links = (mainMarkup.match(/<a\b/giu) ?? []).length;
  records.push({ route: route || "/", locale, family, units: units(visible, locale), paragraphs: paragraphs.length, substantial: substantial.length, controls, links, headings, title, description });
}

const duplicates = [...paragraphOwners.entries()]
  .filter(([, owners]) => owners.length >= 8)
  .sort((a, b) => b[1].length - a[1].length);
const failures = [];
for (const field of ["title", "description"]) {
  const owners = new Map();
  for (const record of records) {
    const value = record[field].normalize("NFKC").toLocaleLowerCase(languageTag[record.locale]).replace(/\s+/gu, " ").trim();
    if (!value) continue;
    const key = `${record.locale}:${value}`;
    const routesForValue = owners.get(key) ?? [];
    routesForValue.push(record.route);
    owners.set(key, routesForValue);
  }
  for (const routesForValue of owners.values()) if (routesForValue.length > 1) failures.push(`duplicate ${field}: ${routesForValue.join(", ")}`);
}
for (const record of records) {
  const minimum = minimums[record.family];
  if (record.units < minimum.units) failures.push(`${record.route}: ${record.units} text units < ${minimum.units}`);
  if (record.paragraphs < minimum.paragraphs) failures.push(`${record.route}: ${record.paragraphs} paragraphs < ${minimum.paragraphs}`);
  if (record.substantial < minimum.substantial) failures.push(`${record.route}: ${record.substantial} substantial paragraphs < ${minimum.substantial}`);
  if (!record.title || record.title.length < 12) failures.push(`${record.route}: missing or shallow title`);
  if (!record.description || record.description.length < (record.locale === "zh" ? 35 : 80)) failures.push(`${record.route}: missing or shallow meta description`);
  const minimumHeadings = ["tool", "guide", "reference", "product", "home"].includes(record.family) ? 3 : 1;
  if (record.headings < minimumHeadings) failures.push(`${record.route}: shallow heading hierarchy`);
}
for (const [paragraph, owners] of duplicates) if (owners.length >= 50) failures.push(`boilerplate paragraph appears on ${owners.length} pages: ${paragraph.slice(0, 90)}…`);
const familySummary = [...new Set(records.map((record) => record.family))].sort().map((family) => {
  const items = records.filter((record) => record.family === family);
  const average = Math.round(items.reduce((total, item) => total + item.units, 0) / items.length);
  const lowest = items.slice().sort((a, b) => a.units - b.units).slice(0, 5).map((item) => `${item.route} (${item.units})`).join(", ");
  return `${family.padEnd(11)} pages=${String(items.length).padStart(4)} avg=${String(average).padStart(5)} lowest=${lowest}`;
});
console.log("Publisher surface inventory");
console.log(familySummary.join("\n"));
console.log("Product pages: " + records.filter((record) => record.family === "product").sort((a, b) => a.units - b.units).map((record) => `${record.route}=${record.units}`).join(", "));
console.log("Trust pages: " + records.filter((record) => record.family === "trust").sort((a, b) => a.units - b.units).map((record) => `${record.route}=${record.units}`).join(", "));
console.log(`Repeated long paragraphs on 8+ indexable pages: ${duplicates.length}`);
for (const [paragraph, owners] of duplicates.slice(0, 12)) console.log(`  ${owners.length} pages: ${paragraph.slice(0, 150)}${paragraph.length > 150 ? "…" : ""}`);
console.log(`Threshold findings: ${failures.length}`);
for (const failure of failures.slice(0, 80)) console.log(`  - ${failure}`);
if (strict) assert.deepEqual(failures, [], "publisher surface quality thresholds failed");
