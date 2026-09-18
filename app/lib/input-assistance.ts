/** Removes only a complete outer Markdown fence, on an explicit user action. */
export function unwrapInputFence(value: string): string | null {
  const match = value.trim().match(/^```(?:json|csv|text|txt)?[ \t]*\r?\n([\s\S]*?)\r?\n```$/iu);
  return match && !/^```/mu.test(match[1]) ? match[1] : null;
}

export function csvDirection(input: string, mode: string) {
  if (mode === "csv-to-json" || mode === "json-to-csv") return mode;
  return /^[\[{]/u.test(input.trimStart()) ? "json-to-csv" : "csv-to-json";
}

export function sampleForMode(slug: string, mode: string, fallback: string) {
  if (slug === "json-csv-donusturucu" && mode === "csv-to-json") return 'id,note\n007,"A,B"';
  if (slug === "base64-kodlayici" && mode === "decode") return "TWVyaGFiYSDkuJbnlYw=";
  if (slug === "url-kodlayici" && mode === "decode") return "name%3DAda%26city%3D%C4%B0zmir";
  return fallback;
}
