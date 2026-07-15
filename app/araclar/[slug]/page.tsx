import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "../../components/ToolPage";
import { getTool, tools } from "../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  const title = `ByteQuant · ${tool.title.tr}`;
  return { title: tool.title.tr, description: tool.short.tr, alternates: localizedAlternates("tr", toolPath("tr", slug), toolPath("en", slug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: "en_US", url: absoluteUrl(toolPath("tr", slug)), title, description: tool.short.tr, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.tr, images: [ogImageUrl] } };
}
export default async function TurkishTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tool = getTool(slug); if (!tool) notFound(); return <ToolPage tool={tool} locale="tr" />; }
