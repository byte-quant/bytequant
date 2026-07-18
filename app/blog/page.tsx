import type { Metadata } from "next";
import { BlogIndex } from "../components/BlogIndex";
import { absoluteUrl, localizedAlternates } from "../lib/site";

export const metadata: Metadata = {
  title: "Gizlilik, Teknik SEO ve Tarayıcı İçi Araç Rehberleri",
  description: "KVKK/GDPR, teknik SEO, GEO, PDF, veri ve tarayıcı içi iş akışları için kaynaklı ve uygulamalı ByteQuant rehberleri.",
  alternates: { ...localizedAlternates("tr", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/feed.xml") } },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: "en_US", url: absoluteUrl("/blog"), title: "ByteQuant Rehberleri", description: "Gizlilik, teknik SEO ve tarayıcı içi iş akışları için kanıta dayalı rehberler.", images: [{ url: absoluteUrl("/og-v5.png"), width: 1200, height: 630, alt: "ByteQuant rehberleri ve yerel iş istasyonu" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant Rehberleri", description: "Gizlilik, teknik SEO ve tarayıcı içi iş akışları için kanıta dayalı rehberler.", images: [absoluteUrl("/og-v5.png")] },
};
export default function BlogPage() { return <BlogIndex locale="tr" />; }
