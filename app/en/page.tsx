import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";
import { localizedAlternates } from "../lib/site";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · Privacy-First In-Browser Tools" },
  description: "Twenty-nine free tools for prompt, text, developer, and privacy workflows. No account; core processing stays in your browser.",
  alternates: localizedAlternates("en", "/", "/en"),
  openGraph: { locale: "en_US", url: "/en", title: "ByteQuant · Privacy-First In-Browser Tools", description: "29 free tools. No account or server uploads; core processing stays on-device." },
};

export default function EnglishHome() { return <div lang="en"><HomePage locale="en" /></div>; }
