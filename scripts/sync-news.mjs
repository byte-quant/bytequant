import { writeFile } from "node:fs/promises";

const feeds = [
  { url: "https://www.nist.gov/news-events/news/rss.xml", source: "NIST", category: "standards", hosts: ["www.nist.gov", "nist.gov"] },
  { url: "https://www.nist.gov/news-events/cybersecurity/rss.xml", source: "NIST", category: "security", hosts: ["www.nist.gov", "nist.gov", "csrc.nist.gov"] },
  { url: "https://www.nasa.gov/feed/", source: "NASA", category: "science", hosts: ["www.nasa.gov", "nasa.gov", "science.nasa.gov"] },
  { url: "https://www.nasa.gov/technology/feed/", source: "NASA", category: "technology", hosts: ["www.nasa.gov", "nasa.gov", "science.nasa.gov"] },
];
const target = new URL("../app/lib/generated-news.ts", import.meta.url);
const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
function decode(value = "") { return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, token) => token[0] === "#" ? String.fromCodePoint(token[1].toLowerCase() === "x" ? Number.parseInt(token.slice(2), 16) : Number(token.slice(1))) : entities[token.toLowerCase()] ?? " ").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim(); }
function field(block, names) { for (const name of names) { const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i")); if (match) return decode(match[1]); } return ""; }
function link(block) { const text = field(block, ["link", "guid"]); if (text.startsWith("http")) return text; return block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? ""; }
function id(value) { let hash = 2166136261; for (const char of value) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(36); }
function itemSource(xml, feed) { const blocks = [...xml.matchAll(/<(?:item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/(?:item|entry)>/gi)].map((match) => match[1]); return blocks.slice(0, 16).flatMap((block) => { const title = field(block, ["title"]).slice(0, 240); const rawUrl = link(block); const rawDate = field(block, ["pubDate", "published", "updated", "dc:date"]); if (!title || !rawUrl) return []; try { const url = new URL(rawUrl); if (url.protocol !== "https:" || !feed.hosts.includes(url.hostname)) return []; const date = new Date(rawDate); return [{ id: `${feed.source.toLowerCase()}-${id(url.toString())}`, title, url: url.toString(), date: Number.isNaN(date.valueOf()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10), source: feed.source, category: feed.category }]; } catch { return []; } }); }

const settled = await Promise.allSettled(feeds.map(async (feed) => { const response = await fetch(feed.url, { headers: { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml", "user-agent": "ByteQuantNewsSync/1.0 (+https://bytequant.org/updates)" }, redirect: "follow", signal: AbortSignal.timeout(15_000) }); const finalUrl = new URL(response.url); if (finalUrl.protocol !== "https:" || !feed.hosts.includes(finalUrl.hostname)) throw new Error(`${feed.url}: redirect left the source allowlist`); if (!response.ok) throw new Error(`${feed.url}: ${response.status}`); const xml = await response.text(); if (xml.length > 4_000_000) throw new Error(`${feed.url}: feed too large`); return itemSource(xml, feed); }));
const items = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []).filter((item, index, list) => list.findIndex((candidate) => candidate.url === item.url) === index).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 48);
if (items.length < 4) { console.warn("News sync retained the checked-in fallback because fewer than four valid items were available."); process.exit(0); }
const source = `export type NewsItem = { id: string; title: string; url: string; date: string; source: "NASA" | "NIST"; category: "science" | "technology" | "security" | "standards" };\n\n// Generated at build time from the official, allowlisted RSS endpoints in scripts/sync-news.mjs.\nexport const newsGeneratedAt = ${JSON.stringify(new Date().toISOString())};\nexport const newsItems: NewsItem[] = ${JSON.stringify(items, null, 2)};\n`;
await writeFile(target, source, "utf8");
console.log(`News sync wrote ${items.length} title/link records from official feeds.`);
