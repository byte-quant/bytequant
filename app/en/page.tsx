import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";
import { absoluteUrl, localizedAlternates, ogImageUrl } from "../lib/site";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · Privacy-First In-Browser Tools" },
  description: "327 distinct free tools for calculations, AI, PDF, image, data, text, developer, research, and privacy workflows. No account; core processing stays in your browser.",
  alternates: localizedAlternates("en", "/", "/en"),
  openGraph: { type: "website", siteName: "ByteQuant", locale: "en_US", alternateLocale: ["tr_TR", "de_DE", "zh_CN"], url: absoluteUrl("/en"), title: "ByteQuant · Privacy-First In-Browser Tools", description: "327 distinct free calculation, AI, PDF, image, research, data, text, and security tools. No account or server uploads; core processing stays on-device.", images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "ByteQuant privacy-first in-browser tools" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant · Privacy-First In-Browser Tools", description: "327 distinct free tools with core processing in your browser.", images: [ogImageUrl] },
};

export default function EnglishHome() { return <div lang="en"><HomePage locale="en" /></div>; }
