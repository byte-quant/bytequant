import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "../../../components/ToolPage";
import { getTool, tools } from "../../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  const title = `ByteQuant · ${tool.title.en}`;
  return { title: tool.title.en, description: tool.short.en, alternates: localizedAlternates("en", toolPath("tr", slug), toolPath("en", slug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "en_US", alternateLocale: "tr_TR", url: absoluteUrl(toolPath("en", slug)), title, description: tool.short.en, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.en, images: [ogImageUrl] } };
}
export default async function EnglishTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tool = getTool(slug); if (!tool) notFound(); return <div lang="en"><ToolPage tool={tool} locale="en" /></div>; }
