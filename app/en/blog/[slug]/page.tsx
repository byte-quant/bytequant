import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../../components/ArticlePage";
import { getPost, posts } from "../../../lib/posts";
import { getLocalizedGuide } from "../../../lib/localized-guides";
import { absoluteUrl, localizedAlternates, ogImageUrl, postPath, schemaDate } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPost(slug); if (!post) return {}; const title = `ByteQuant · ${post.title.en}`; const localized = Boolean(getLocalizedGuide(slug)); const alternates = localized ? { canonical: absoluteUrl(postPath("en", slug)), languages: { "tr-TR": absoluteUrl(postPath("tr", slug)), "en-US": absoluteUrl(postPath("en", slug)), "de-DE": absoluteUrl(postPath("de", slug)), "zh-CN": absoluteUrl(postPath("zh", slug)), "x-default": absoluteUrl(postPath("en", slug)) } } : localizedAlternates("en", postPath("tr", slug), postPath("en", slug)); return { title: post.title.en, description: post.description.en, keywords: ["privacy", "GDPR", "technical SEO", "GEO", "client-side tools", post.category.en], alternates, openGraph: { type: "article", siteName: "ByteQuant", locale: "en_US", alternateLocale: localized ? ["tr_TR", "de_DE", "zh_CN"] : "tr_TR", url: absoluteUrl(postPath("en", slug)), title, description: post.excerpt.en, publishedTime: schemaDate(post.date), modifiedTime: schemaDate(post.updated ?? post.date), authors: ["ByteQuant Editorial"], section: post.category.en, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: post.excerpt.en, images: [ogImageUrl] } }; }
export default async function EnglishArticle({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPost(slug); if (!post) notFound(); return <div lang="en"><ArticlePage post={post} locale="en" /></div>; }
