import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "../../components/ToolPage";
import { getTool, tools } from "../../lib/tools";
import { localizedAlternates, siteUrl, toolPath } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  return { title: tool.title.tr, description: tool.short.tr, alternates: localizedAlternates("tr", toolPath("tr", slug), toolPath("en", slug)), openGraph: { type: "website", url: `${siteUrl}${toolPath("tr", slug)}`, title: `ByteQuant · ${tool.title.tr}`, description: tool.short.tr } };
}
export default async function TurkishTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tool = getTool(slug); if (!tool) notFound(); return <ToolPage tool={tool} locale="tr" />; }
