import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolAliasPage } from "../../../components/ToolAliasPage";
import { ToolPage } from "../../../components/ToolPage";
import { canonicalToolSlug, isToolAlias } from "../../../lib/tool-aliases";
import { getTool, tools } from "../../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) return {};
  const title = `ByteQuant · ${tool.title.de}`;
  return { title: tool.title.de, description: tool.short.de, robots: isToolAlias(slug) ? { index: false, follow: true } : undefined, alternates: localizedAlternates("de", toolPath("tr", canonicalSlug), toolPath("en", canonicalSlug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "de_DE", alternateLocale: ["tr_TR", "en_US", "zh_CN"], url: absoluteUrl(toolPath("de", canonicalSlug)), title, description: tool.short.de, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.de, images: [ogImageUrl] } };
}
export default async function GermanTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const canonicalSlug = canonicalToolSlug(slug); const tool = getTool(canonicalSlug); if (!tool) notFound(); return <div lang="de">{isToolAlias(slug) ? <ToolAliasPage locale="de" canonicalSlug={canonicalSlug} toolTitle={tool.title.de} /> : <ToolPage tool={tool} locale="de" />}</div>; }
