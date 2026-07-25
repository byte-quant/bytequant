import type { Metadata } from "next";
import { NewsPage } from "../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "Bilim, Teknoloji ve Güvenlik Gündemi | ByteQuant";
const description = "NASA ve NIST resmî RSS kaynaklarından otomatik güncellenen; favorileri cihazda tutan, kaynak şeffaflığı yüksek ByteQuant gündemi.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "news")) };
export default function Page() { return <NewsPage locale="tr" />; }
