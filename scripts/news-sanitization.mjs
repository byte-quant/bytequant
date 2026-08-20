const spamPattern = /\b(?:casino|betting|sportsbook|crypto\s*giveaway|free\s*money|limited\s*time\s*offer|click\s+here|sponsored\s+post|adult\s+content)\b/i;

export function normalizedTitle(value) {
  return value.toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function suspicious(value) {
  return spamPattern.test(value)
    || /https?:\/\//i.test(value)
    || /([!?$])\1{4,}/.test(value)
    || /(.)\1{10,}/i.test(value);
}

export function boilerplateSummary(value, title) {
  const normalized = normalizedTitle(value);
  const compact = normalized.replace(/\s+/g, "");
  const normalizedHeadline = normalizedTitle(title);

  return /(?:today\s+s\s+apod|archive\s+submissions\s+index\s+search\s+calendar\s+rss|skip\s+to\s+main\s+content|open\s+navigation|subscribe\s+to\s+our\s+newsletter|follow\s+us\s+on)/i.test(normalized)
    || /(?:todaysapod|archivesubmissionsindexsearchcalendarrss|skiptomaincontent|opennavigation|subscribetoournewsletter|followuson)/i.test(compact)
    || normalized === normalizedHeadline
    || normalized.startsWith(`${normalizedHeadline} ${normalizedHeadline}`);
}
