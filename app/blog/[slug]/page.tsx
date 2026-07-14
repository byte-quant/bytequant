import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../components/ArticlePage";
import { getPost, posts } from "../../lib/posts";
import { postPath, siteUrl } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = getPost(slug); if (!post) return {}; return { title: post.title.tr, description: post.description.tr, keywords: ["gizlilik", "KVKK", "GDPR", "prompt mühendisliği", "client-side"], alternates: { canonical: postPath("tr", slug), languages: { "tr-TR": postPath("tr", slug), "en-US": postPath("en", slug) } }, openGraph: { type: "article", url: `${siteUrl}${postPath("tr", slug)}`, title: post.title.tr, description: post.excerpt.tr, publishedTime: post.date, modifiedTime: post.date, authors: ["ByteQuant Editorial"] } }; }
export default async function TurkishArticle({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = getPost(slug); if (!post) notFound(); return <ArticlePage post={post} locale="tr" />; }

