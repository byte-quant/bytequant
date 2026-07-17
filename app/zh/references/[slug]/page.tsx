import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferencePage } from "../../../components/ReferencePage";
import { getReference, referenceCopy, referencePath, references } from "../../../lib/references";
import { absoluteUrl, localizedAlternates, ogImageUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return references.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getReference((await params).slug); if (!guide) return {};
  const copy = referenceCopy(guide, "zh");
  return { title: copy.title, description: copy.description, alternates: localizedAlternates("zh", referencePath("tr", guide.slug), referencePath("en", guide.slug)), openGraph: { type: "article", siteName: "ByteQuant", locale: "zh_CN", alternateLocale: ["tr_TR", "en_US", "de_DE"], url: absoluteUrl(referencePath("zh", guide.slug)), title: copy.title, description: copy.description, images: [ogImageUrl] } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const guide = getReference((await params).slug); if (!guide) notFound(); return <div lang="zh-CN"><ReferencePage guide={guide} locale="zh" /></div>; }
