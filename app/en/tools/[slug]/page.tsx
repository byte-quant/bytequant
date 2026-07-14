import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "../../../components/ToolPage";
import { getTool, tools } from "../../../lib/tools";
import { localizedAlternates, siteUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  return { title: tool.title.en, description: tool.short.en, alternates: localizedAlternates("en", toolPath("tr", slug), toolPath("en", slug)), openGraph: { type: "website", locale: "en_US", url: `${siteUrl}${toolPath("en", slug)}`, title: `ByteQuant · ${tool.title.en}`, description: tool.short.en } };
}
export default async function EnglishTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tool = getTool(slug); if (!tool) notFound(); return <div lang="en"><ToolPage tool={tool} locale="en" /></div>; }
