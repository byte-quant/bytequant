import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReferencePage } from "../../components/ReferencePage";
import { getReference, referencePath, references } from "../../lib/references";
import { localizedAlternates, siteUrl } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return references.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getReference((await params).slug); if (!guide) return {};
  return { title: guide.title.tr, description: guide.description.tr, alternates: localizedAlternates("tr", referencePath("tr", guide.slug), referencePath("en", guide.slug)), openGraph: { type: "article", url: `${siteUrl}${referencePath("tr", guide.slug)}`, title: guide.title.tr, description: guide.description.tr } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const guide = getReference((await params).slug); if (!guide) notFound(); return <ReferencePage guide={guide} locale="tr" />; }
