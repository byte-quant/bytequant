import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "ByteQuant's mission, browser-first architecture, editorial principles, and independent business model.";
export const metadata: Metadata = { title: "About", description, alternates: localizedAlternates("en", "/hakkimizda", "/en/about"), ...localizedSocialMetadata("en", "About", description, "/en/about") };
export default function Page() { return <div lang="en"><InfoPage pageKey="about" locale="en" /></div>; }
