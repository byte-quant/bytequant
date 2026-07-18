import type { Metadata } from "next";
import { BlogIndex } from "../../components/BlogIndex";
import { absoluteUrl, localizedAlternates } from "../../lib/site";

export const metadata: Metadata = {
  title: "Privacy, Technical SEO, and In-Browser Tool Guides",
  description: "Sourced, practical guides to GDPR, technical SEO, GEO, PDFs, data, and privacy-first in-browser workflows.",
  alternates: { ...localizedAlternates("en", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/en/feed.xml") } },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "en_US", alternateLocale: "tr_TR", url: absoluteUrl("/en/blog"), title: "ByteQuant Guides", description: "Evidence-led guides to privacy, technical SEO, and in-browser workflows.", images: [{ url: absoluteUrl("/og-v4.png"), width: 1200, height: 630, alt: "ByteQuant guides" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant Guides", description: "Evidence-led guides to privacy, technical SEO, and in-browser workflows.", images: [absoluteUrl("/og-v4.png")] },
};
export default function EnglishBlogPage() { return <div lang="en"><BlogIndex locale="en" /></div>; }
