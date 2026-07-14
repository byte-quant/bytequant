import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../../components/ArticlePage";
import { getPost, posts } from "../../../lib/posts";
import { localizedAlternates, postPath, siteUrl } from "../../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPost(slug); if (!post) return {}; return { title: post.title.en, description: post.description.en, keywords: ["privacy", "GDPR", "KVKK", "prompt engineering", "client-side tools", post.category.en], alternates: localizedAlternates("en", postPath("tr", slug), postPath("en", slug)), openGraph: { type: "article", locale: "en_US", url: `${siteUrl}${postPath("en", slug)}`, title: post.title.en, description: post.excerpt.en, publishedTime: post.date, modifiedTime: post.date, authors: ["ByteQuant Editorial"] } }; }
export default async function EnglishArticle({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPost(slug); if (!post) notFound(); return <div lang="en"><ArticlePage post={post} locale="en" /></div>; }
