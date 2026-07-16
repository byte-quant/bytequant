import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "../../../components/ToolPage";
import { getTool, tools } from "../../../lib/tools";
import { absoluteUrl, localizedAlternates, ogImageUrl, toolPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  const title = "ByteQuant · " + tool.title.zh;
  return { title: tool.title.zh, description: tool.short.zh, alternates: localizedAlternates("zh", toolPath("tr", slug), toolPath("en", slug)), openGraph: { type: "website", siteName: "ByteQuant", locale: "zh_CN", alternateLocale: ["tr_TR", "en_US", "de_DE"], url: absoluteUrl(toolPath("zh", slug)), title, description: tool.short.zh, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: tool.short.zh, images: [ogImageUrl] } };
}
export default async function ChineseTool({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const tool = getTool(slug); if (!tool) notFound(); return <div lang="zh-CN"><ToolPage tool={tool} locale="zh" /></div>; }
