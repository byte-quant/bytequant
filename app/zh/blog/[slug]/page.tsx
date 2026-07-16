import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedGuidePage } from "../../../components/LocalizedGuidePage";
import { getLocalizedGuide, localizedGuides } from "../../../lib/localized-guides";
import { absoluteUrl, ogImageUrl, postPath } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return localizedGuides.map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const guide = getLocalizedGuide(slug); if (!guide) return {};
  const copy = guide.copy.zh; const title = `ByteQuant · ${copy.title}`;
  return { title: copy.title, description: copy.description, alternates: { canonical: absoluteUrl(postPath("zh", slug)), languages: { "tr-TR": absoluteUrl(postPath("tr", slug)), "en-US": absoluteUrl(postPath("en", slug)), "de-DE": absoluteUrl(postPath("de", slug)), "zh-CN": absoluteUrl(postPath("zh", slug)), "x-default": absoluteUrl(postPath("en", slug)) } }, openGraph: { type: "article", siteName: "ByteQuant", locale: "zh_CN", alternateLocale: ["tr_TR", "en_US", "de_DE"], url: absoluteUrl(postPath("zh", slug)), title, description: copy.excerpt, publishedTime: guide.date, modifiedTime: guide.updated ?? guide.date, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: copy.excerpt, images: [ogImageUrl] } };
}
export default async function ChineseGuide({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = getLocalizedGuide(slug); if (!guide) notFound(); return <LocalizedGuidePage guide={guide} locale="zh" />; }
