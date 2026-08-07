import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolAliasPage } from "../../../components/ToolAliasPage";
import { ToolPage } from "../../../components/ToolPage";
import { canonicalToolSlug, isToolAlias } from "../../../lib/tool-aliases";
import { isEditoriallyReviewedTool, nonIndexableRobots } from "../../../lib/content-quality";
import { getTool, tools } from "../../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) return {};
  const title = `ByteQuant · ${tool.title.zh}`;
  return { title: tool.title.zh, description: tool.short.zh, robots: isToolAlias(slug) || !isEditoriallyReviewedTool(canonicalSlug) ? nonIndexableRobots : undefined, alternates: localizedAlternates("zh", toolPath("tr", canonicalSlug), toolPath("en", canonicalSlug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "zh_CN", alternateLocale: ["tr_TR", "en_US", "de_DE"], url: absoluteUrl(toolPath("zh", canonicalSlug)), title, description: tool.short.zh, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.zh, images: [ogImageUrl] } };
}
export default async function ChineseTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) notFound(); return <div lang="zh-CN">{isToolAlias(slug) ? <ToolAliasPage locale="zh" canonicalSlug={canonicalSlug} toolTitle={tool.title.zh} /> : <ToolPage tool={tool} locale="zh" />}</div>; }
