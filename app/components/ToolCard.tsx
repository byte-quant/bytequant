import Link from "next/link";
import { categories, type Tool } from "../lib/tools";
import { copy, toolPath, type Locale } from "../lib/site";

export function ToolCard({ tool, locale }: { tool: Tool; locale: Locale }) {
  return (
    <article className="tool-card">
      <div className="tool-card-top"><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><span className="category-label">{categories[tool.category].label[locale]}</span></div>
      <h3><Link href={toolPath(locale, tool.slug)}>{tool.title[locale]}</Link></h3>
      <p>{tool.short[locale]}</p>
      <Link className="text-link" href={toolPath(locale, tool.slug)}>{copy[locale].toolCta}<span aria-hidden="true"> →</span></Link>
    </article>
  );
}

