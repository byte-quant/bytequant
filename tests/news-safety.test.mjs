import assert from "node:assert/strict";
import test from "node:test";
import { newsItems } from "../app/lib/generated-news.ts";

const allowedHosts = new Set([
  "www.nist.gov", "nist.gov", "csrc.nist.gov", "www.nasa.gov", "nasa.gov", "science.nasa.gov",
  "www.cisa.gov", "cisa.gov", "www.gov.uk", "gov.uk", "www.nsf.gov", "nsf.gov", "www.nih.gov", "nih.gov",
  "www.esa.int", "esa.int", "www.ncsc.gov.uk", "ncsc.gov.uk", "oceanservice.noaa.gov", "www.noaa.gov", "noaa.gov",
]);
const spam = /\b(?:casino|betting|sportsbook|crypto\s*giveaway|free\s*money|limited\s*time\s*offer|click\s+here|sponsored\s+post|adult\s+content)\b/i;

test("checked-in news stays finite, diverse, chronological, and spam resistant", () => {
  assert.ok(newsItems.length >= 12 && newsItems.length <= 72);
  assert.ok(new Set(newsItems.map((item) => item.source)).size >= 4);
  assert.equal(new Set(newsItems.map((item) => item.id)).size, newsItems.length);
  assert.equal(new Set(newsItems.map((item) => item.url)).size, newsItems.length);
  const titleKeys = newsItems.map((item) => item.title.toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim());
  assert.equal(new Set(titleKeys).size, newsItems.length);
  for (let index = 0; index < newsItems.length; index += 1) {
    const item = newsItems[index];
    const url = new URL(item.url);
    assert.equal(url.protocol, "https:");
    assert.ok(allowedHosts.has(url.hostname));
    assert.ok(item.title.length >= 8 && item.title.length <= 240);
    assert.ok(item.sourceSummary.length > 0 && item.sourceSummary.length <= 281);
    assert.ok(item.sourceSummary.split(/\s+/).length <= 24);
    assert.doesNotMatch(`${item.title} ${item.sourceSummary}`, spam);
    assert.doesNotMatch(item.sourceSummary, /https?:\/\//i);
    if (item.summaryOrigin === "feed") assert.doesNotMatch(item.sourceSummary, /today[’']?s\s+apod|archive\s+submissions\s+index\s+search\s+calendar\s+rss|skip\s+to\s+main\s+content/i);
    assert.ok(Date.parse(item.date) <= Date.now() + 36 * 60 * 60 * 1000);
    if (index > 0) assert.ok(newsItems[index - 1].date.localeCompare(item.date) >= 0);
  }
});
