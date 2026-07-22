export type CommunitySafetyIssue = "abusive" | "privateKey" | "credential" | "email" | "identity" | "external";

const prohibited = ["fuck", "nigger", "terrorist threat", "öldür", "sikeyim", "piç", "hurensohn", "töten", "去死", "操你"];
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
  const text = value.toLocaleLowerCase().slice(0, 20_000);
  const result: CommunitySafetyIssue[] = [];
  if (prohibited.some((word) => text.includes(word))) result.push("abusive");
  for (const item of patterns) if (item.pattern.test(text)) result.push(item.key);
  const urls = text.match(/https?:\/\/[^\s)]+/g) ?? [];
  if (urls.some((url) => !/^https:\/\/(?:www\.)?bytequant\.org\//i.test(url))) result.push("external");
  return [...new Set(result)];
}
