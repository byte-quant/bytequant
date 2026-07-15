import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";
const description = "ByteQuant'ın misyonu, tarayıcı içi mimari yaklaşımı, editoryal ilkeleri ve bağımsız iş modeli.";
export const metadata: Metadata = { title: "Hakkımızda", description, alternates: localizedAlternates("tr", "/hakkimizda", "/en/about"), ...localizedSocialMetadata("tr", "Hakkımızda", description, "/hakkimizda") };
export default function Page() { return <InfoPage pageKey="about" locale="tr" />; }
