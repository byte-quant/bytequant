import type { Tool, ToolCategory } from "../lib/tools";

const categoryGlyphs: Record<ToolCategory, string> = {
  prompt: "✦",
  text: "Aa",
  data: "{ }",
  converter: "⇄",
  security: "◇",
  calculation: "±",
  general: "✓",
  ai: "AI",
  codeSecurity: "</>",
};

const glyphRules: Array<[RegExp, string]> = [
  [/json|schema|openapi/i, "{ }"],
  [/csv|tablo|table|excel/i, "▦"],
  [/pdf|dosya|file|fatura|sozlesme/i, "▤"],
  [/gorsel|image|png|jpg|webp|renk|color|kontrast/i, "◐"],
  [/parola|password|hash|hmac|sri|jwt|izin|permission|env/i, "◇"],
  [/url|link|utm|qr|href|canonical/i, "↗"],
  [/zaman|tarih|date|cron|gunu|time/i, "◷"],
  [/hesap|oran|yuzde|gpa|not|yatirim|kredi|bahsis|boyut/i, "±"],
  [/prompt|persona|token|rag|ai-|yapay/i, "✦"],
  [/regex|sql|kod|code|css|html|xml|yaml|semver/i, "</>"],
  [/metin|markdown|kelime|unicode|slug|citation|kaynakca/i, "Aa"],
];

export function toolGlyph(tool: Pick<Tool, "slug" | "category">) {
  return glyphRules.find(([pattern]) => pattern.test(tool.slug))?.[1] ?? categoryGlyphs[tool.category];
}

export function ToolIcon({ tool, size = "md" }: { tool: Pick<Tool, "slug" | "category" | "mark">; size?: "sm" | "md" | "lg" }) {
  return <span className={`tool-icon tool-icon-${size} category-${tool.category}`} aria-hidden="true"><b>{toolGlyph(tool)}</b><small>{tool.mark}</small></span>;
}
