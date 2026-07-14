import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";

export const metadata: Metadata = {
  title: "Privacy-First In-Browser Tools",
  description: "Eighteen free tools for prompts, text, JSON, CSV, and personal-data workflows. No account; core processing stays in your browser.",
  alternates: { canonical: "/en", languages: { "tr-TR": "/", "en-US": "/en" } },
  openGraph: { locale: "en_US", url: "/en", title: "ByteQuant · Privacy-First In-Browser Tools", description: "18 free tools. No account, no uploads; core processing stays on-device." },
};

export default function EnglishHome() { return <div lang="en"><HomePage locale="en" /></div>; }

