import type { Metadata } from "next";
import { BlogIndex } from "../../components/BlogIndex";

export const metadata: Metadata = { title: "Privacy, Prompt, and Data-Security Guides", description: "Practical ByteQuant guides to in-browser tools, KVKK, GDPR, prompt engineering, and data security.", alternates: { canonical: "/en/blog", languages: { "tr-TR": "/blog", "en-US": "/en/blog" } }, openGraph: { locale: "en_US", url: "/en/blog" } };
export default function EnglishBlogPage() { return <div lang="en"><BlogIndex locale="en" /></div>; }

