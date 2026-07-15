import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";
const description = "ByteQuant destek, gizlilik, hata bildirimi ve içerik düzeltme iletişim kanalları.";
export const metadata: Metadata = { title: "İletişim", description, alternates: localizedAlternates("tr", "/iletisim", "/en/contact"), ...localizedSocialMetadata("tr", "İletişim", description, "/iletisim") };
export default function Page() { return <InfoPage pageKey="contact" locale="tr" />; }
