export type CommunitySafetyIssue = "abusive" | "restricted" | "privateKey" | "credential" | "email" | "identity" | "external" | "spam";

const abusiveTerms = [
  "fuck", "nigger", "terrorist threat", "öldür", "sikeyim", "piç", "hurensohn", "töten", "去死", "操你",
];
const restrictedTerms = [
  "child porn", "child sexual", "revenge porn", "rape video", "buy cocaine", "sell cocaine", "buy heroin", "sell heroin",
  "kumar bonusu", "bahis bonusu", "çocuk pornosu", "intikam pornosu", "kokain sat", "eroin sat",
  "kinderporno", "racheporno", "kokain kaufen", "heroin kaufen", "儿童色情", "强奸视频", "购买可卡因", "购买海洛因",
];
const patterns: ReadonlyArray<{ key: CommunitySafetyIssue; pattern: RegExp }> = [
  { key: "privateKey", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { key: "credential", pattern: /\b(?:api[_ -]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{12,}/i },
  { key: "credential", pattern: /\b(?:sk|pk|rk)-[A-Za-z0-9_-]{20,}\b/i },
  { key: "credential", pattern: /\b(?:gh[opusr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/ },
  { key: "credential", pattern: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}={0,2}\b/i },
  { key: "email", pattern: /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/i },
  { key: "identity", pattern: /(?<!\d)(?:\+?\d[ .-]?){10,16}(?!\d)/ },
];

export function reviewCommunityText(value: string): CommunitySafetyIssue[] {
  const normalized = value.normalize("NFKC").slice(0, 20_000);
  const text = normalized.toLocaleLowerCase();
  const comparable = text.replace(/[\s._*~|\\/-]+/gu, " ");
  const obfuscated = text.replace(/[._*~|\\/-]+/gu, "");
  const result: CommunitySafetyIssue[] = [];
  if (abusiveTerms.some((word) => comparable.includes(word) || obfuscated.includes(word))) result.push("abusive");
  if (restrictedTerms.some((word) => comparable.includes(word) || obfuscated.includes(word))) result.push("restricted");
  for (const item of patterns) if (item.pattern.test(text)) result.push(item.key);
  const urls = text.match(/https?:\/\/[^\s)]+/g) ?? [];
  if (urls.some((url) => !/^https:\/\/(?:www\.)?bytequant\.org\//i.test(url))) result.push("external");
  const letters = [...normalized].filter((character) => /\p{L}/u.test(character));
  const uppercase = letters.filter((character) => character === character.toLocaleUpperCase() && character !== character.toLocaleLowerCase()).length;
  const excessiveCaps = letters.length >= 40 && uppercase / letters.length > 0.82;
  const domainCount = (text.match(/(?:^|\s)(?:www\.)?[a-z0-9-]+\.(?:com|net|org|xyz|top|click|link)\b/giu) ?? []).length;
  if (urls.length > 3 || domainCount > 3 || excessiveCaps || /(.)\1{14,}/u.test(text) || /\b([\p{L}\p{N}]{3,})\b(?:\s+\1\b){5,}/iu.test(text)) result.push("spam");
  return [...new Set(result)];
}
