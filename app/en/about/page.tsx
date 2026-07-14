import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
export const metadata: Metadata = { title: "About", description: "ByteQuant's mission, browser-first architecture, editorial principles, and independent business model.", alternates: { canonical: "/en/about", languages: { "tr-TR": "/hakkimizda", "en-US": "/en/about" } } };
export default function Page() { return <div lang="en"><InfoPage pageKey="about" locale="en" /></div>; }

