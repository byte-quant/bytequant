import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolAliasPage } from "../../../components/ToolAliasPage";
import { ToolPage } from "../../../components/ToolPage";
import { canonicalToolSlug, isToolAlias } from "../../../lib/tool-aliases";
import { nonIndexableRobots } from "../../../lib/content-quality";
import { getTool, tools } from "../../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) return {};
  const title = `ByteQuant · ${tool.title.en}`;
  return { title: tool.title.en, description: tool.short.en, robots: isToolAlias(slug) ? nonIndexableRobots : undefined, alternates: localizedAlternates("en", toolPath("tr", canonicalSlug), toolPath("en", canonicalSlug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "en_US", alternateLocale: ["tr_TR", "de_DE", "zh_CN"], url: absoluteUrl(toolPath("en", canonicalSlug)), title, description: tool.short.en, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.en, images: [ogImageUrl] } };
}
export default async function EnglishTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) notFound(); return <div lang="en">{isToolAlias(slug) ? <ToolAliasPage locale="en" canonicalSlug={canonicalSlug} toolTitle={tool.title.en} /> : <ToolPage tool={tool} locale="en" />}</div>; }
