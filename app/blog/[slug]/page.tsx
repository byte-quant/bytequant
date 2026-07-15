import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../components/ArticlePage";
import { getPost, posts } from "../../lib/posts";
import { absoluteUrl, localizedAlternates, ogImageUrl, postPath, schemaDate } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPost(slug); if (!post) return {}; const title = `ByteQuant · ${post.title.tr}`; return { title: post.title.tr, description: post.description.tr, keywords: ["gizlilik", "KVKK", "GDPR", "teknik SEO", "client-side", post.category.tr], alternates: localizedAlternates("tr", postPath("tr", slug), postPath("en", slug)), openGraph: { type: "article", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: "en_US", url: absoluteUrl(postPath("tr", slug)), title, description: post.excerpt.tr, publishedTime: schemaDate(post.date), modifiedTime: schemaDate(post.updated ?? post.date), authors: ["ByteQuant Editorial"], section: post.category.tr, images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description: post.excerpt.tr, images: [ogImageUrl] } }; }
export default async function TurkishArticle({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPost(slug); if (!post) notFound(); return <ArticlePage post={post} locale="tr" />; }
