import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferencePage } from "../../../components/ReferencePage";
import { getReference, referenceCopy, referencePath, references } from "../../../lib/references";
import { absoluteUrl, localizedAlternates, ogImageUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return references.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getReference((await params).slug); if (!guide) return {};
  const copy = referenceCopy(guide, "de");
  return { title: copy.title, description: copy.description, alternates: localizedAlternates("de", referencePath("tr", guide.slug), referencePath("en", guide.slug)), openGraph: { type: "article", siteName: "ByteQuant", locale: "de_DE", alternateLocale: ["tr_TR", "en_US", "zh_CN"], url: absoluteUrl(referencePath("de", guide.slug)), title: copy.title, description: copy.description, images: [ogImageUrl] } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const guide = getReference((await params).slug); if (!guide) notFound(); return <div lang="de"><ReferencePage guide={guide} locale="de" /></div>; }
