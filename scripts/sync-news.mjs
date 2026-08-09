import { writeFile } from "node:fs/promises";

const feeds = [
  { url: "https://www.nist.gov/news-events/news/rss.xml", source: "NIST", category: "standards", region: "global", sourceLanguage: "en", hosts: ["www.nist.gov", "nist.gov"] },
  { url: "https://www.nist.gov/news-events/cybersecurity/rss.xml", source: "NIST", category: "security", region: "global", sourceLanguage: "en", hosts: ["www.nist.gov", "nist.gov", "csrc.nist.gov"] },
  { url: "https://www.nasa.gov/feed/", source: "NASA", category: "science", region: "global", sourceLanguage: "en", hosts: ["www.nasa.gov", "nasa.gov", "science.nasa.gov"] },
  { url: "https://www.nasa.gov/technology/feed/", source: "NASA", category: "technology", region: "global", sourceLanguage: "en", hosts: ["www.nasa.gov", "nasa.gov", "science.nasa.gov"] },
  { url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", source: "CISA", category: "security", region: "global", sourceLanguage: "en", hosts: ["www.cisa.gov", "cisa.gov"] },
  { url: "https://www.gov.uk/search/news-and-communications.atom?keywords=artificial+intelligence&order=updated-newest", source: "GOV.UK", category: "technology", region: "uk", sourceLanguage: "en", titleFilter: /\b(?:artificial intelligence|AI|machine learning|digital|cyber|software|technology|data)\b/i, hosts: ["www.gov.uk", "gov.uk"] },
  { url: "https://www.nsf.gov/rss/rss_www_news.xml", source: "NSF", category: "science", region: "global", sourceLanguage: "en", hosts: ["www.nsf.gov", "nsf.gov"] },
  { url: "https://www.nih.gov/news-events/news-releases/feed.xml", source: "NIH", category: "science", region: "global", sourceLanguage: "en", hosts: ["www.nih.gov", "nih.gov"] },
  { url: "https://www.esa.int/rssfeed/Our_Activities/Space_News", source: "ESA", category: "science", region: "global", sourceLanguage: "en", hosts: ["www.esa.int", "esa.int"] },
  { url: "https://www.ncsc.gov.uk/api/1/services/v1/news-rss-feed.xml", source: "NCSC", category: "security", region: "uk", sourceLanguage: "en", hosts: ["www.ncsc.gov.uk", "ncsc.gov.uk"] },
  { url: "https://oceanservice.noaa.gov/rss/nosnews.xml", source: "NOAA", category: "science", region: "global", sourceLanguage: "en", hosts: ["oceanservice.noaa.gov", "www.noaa.gov", "noaa.gov"] },
];
const target = new URL("../app/lib/generated-news.ts", import.meta.url);
const now = Date.now();
const maxFutureSkew = 36 * 60 * 60 * 1000;
const maxAge = 550 * 24 * 60 * 60 * 1000;
const spamPattern = /\b(?:casino|betting|sportsbook|crypto\s*giveaway|free\s*money|limited\s*time\s*offer|click\s+here|sponsored\s+post|adult\s+content)\b/i;
const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
function decode(value = "") { return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, token) => token[0] === "#" ? String.fromCodePoint(token[1].toLowerCase() === "x" ? Number.parseInt(token.slice(2), 16) : Number(token.slice(1))) : entities[token.toLowerCase()] ?? " ").replace(/<[^>]+>/g, " ").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim(); }
function field(block, names) { for (const name of names) { const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i")); if (match) return decode(match[1]); } return ""; }
function link(block) { const text = field(block, ["link", "guid"]); if (text.startsWith("http")) return text; return block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? ""; }
function id(value) { let hash = 2166136261; for (const char of value) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(36); }
function shortSummary(value, maxWords = 24, maxChars = 280) { const words = value.trim().split(/\s+/).filter(Boolean); const clipped = words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}…` : words.join(" "); return clipped.length > maxChars ? `${clipped.slice(0, maxChars).replace(/\s+\S*$/, "")}…` : clipped; }
function normalizedTitle(value) { return value.toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim(); }
function suspicious(value) { return spamPattern.test(value) || /https?:\/\//i.test(value) || /([!?$])\1{4,}/.test(value) || /(.)\1{10,}/i.test(value); }
function boilerplateSummary(value, title) { const normalized = normalizedTitle(value); const normalizedHeadline = normalizedTitle(title); return /\b(?:today s apod|archive submissions index search calendar rss|skip to main content|open navigation|subscribe to our newsletter|follow us on)\b/i.test(normalized) || normalized === normalizedHeadline || normalized.startsWith(`${normalizedHeadline} ${normalizedHeadline}`); }
function itemSource(xml, feed) { const blocks = [...xml.matchAll(/<(?:item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/(?:item|entry)>/gi)].map((match) => match[1]); return blocks.slice(0, 20).flatMap((block) => { const title = field(block, ["title"]).slice(0, 240); const rawUrl = link(block); const rawDate = field(block, ["pubDate", "published", "updated", "dc:date"]); if (title.length < 8 || !rawUrl || suspicious(title) || (feed.titleFilter && !feed.titleFilter.test(title))) return []; try { const url = new URL(rawUrl); if (url.protocol !== "https:" || !feed.hosts.includes(url.hostname) || url.username || url.password) return []; const date = new Date(rawDate); const timestamp = date.valueOf(); if (Number.isNaN(timestamp) || timestamp > now + maxFutureSkew || timestamp < now - maxAge) return []; const candidateSummary = shortSummary(field(block, ["description", "summary", "content:encoded", "content"])); const sourceSummary = suspicious(candidateSummary) || boilerplateSummary(candidateSummary, title) ? "" : candidateSummary; const summaryOrigin = sourceSummary ? "feed" : "metadata"; const completeSummary = sourceSummary || shortSummary(`${feed.source} published this official ${feed.category} update under the headline “${title}”. Open the source for full context.`); return [{ id: `${feed.source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id(url.toString())}`, title, url: url.toString(), date: date.toISOString().slice(0, 10), source: feed.source, category: feed.category, region: feed.region, sourceLanguage: feed.sourceLanguage, sourceSummary: completeSummary, summaryOrigin }]; } catch { return []; } }); }

const settled = await Promise.allSettled(feeds.map(async (feed) => { const response = await fetch(feed.url, { headers: { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml", "user-agent": "ByteQuantNewsSync/1.0 (+https://bytequant.org/updates)" }, redirect: "follow", signal: AbortSignal.timeout(15_000) }); const finalUrl = new URL(response.url); if (finalUrl.protocol !== "https:" || !feed.hosts.includes(finalUrl.hostname)) throw new Error(`${feed.url}: redirect left the source allowlist`); if (!response.ok) throw new Error(`${feed.url}: ${response.status}`); const xml = await response.text(); if (xml.length > 4_000_000) throw new Error(`${feed.url}: feed too large`); return itemSource(xml, feed); }));
for (const [index, result] of settled.entries()) if (result.status === "rejected") console.warn(`News source unavailable (${feeds[index].source}): ${result.reason instanceof Error ? result.reason.message : "unknown error"}`);
const sourceCounts = new Map();
const seenUrls = new Set();
const seenTitles = new Set();
const items = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []).sort((a, b) => b.date.localeCompare(a.date)).filter((item) => {
  const titleKey = normalizedTitle(item.title);
  const count = sourceCounts.get(item.source) ?? 0;
  if (seenUrls.has(item.url) || seenTitles.has(titleKey) || count >= 14) return false;
  seenUrls.add(item.url);
  seenTitles.add(titleKey);
  sourceCounts.set(item.source, count + 1);
  return true;
}).slice(0, 72);
if (items.length < 12 || sourceCounts.size < 4) { console.warn("News sync retained the checked-in fallback because the validated feed set lacked enough source diversity."); process.exit(0); }
const source = `export type NewsItem = { id: string; title: string; url: string; date: string; source: "NASA" | "NIST" | "CISA" | "GOV.UK" | "NSF" | "NIH" | "ESA" | "NCSC" | "NOAA"; category: "science" | "technology" | "security" | "standards"; region: "global" | "uk"; sourceLanguage: "en"; sourceSummary: string; summaryOrigin: "feed" | "metadata" };\n\n// Generated at build time from official, allowlisted RSS endpoints. Feed descriptions are attribution-linked and intentionally limited to a short excerpt.\nexport const newsGeneratedAt = ${JSON.stringify(new Date().toISOString())};\nexport const newsItems: NewsItem[] = ${JSON.stringify(items, null, 2)};\n`;
await writeFile(target, source, "utf8");
console.log(`News sync wrote ${items.length} title/link records from official feeds.`);
