import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
export const metadata: Metadata = { title: "İletişim", description: "ByteQuant destek, gizlilik, hata bildirimi ve içerik düzeltme iletişim kanalları.", alternates: { canonical: "/iletisim", languages: { "tr-TR": "/iletisim", "en-US": "/en/contact", "x-default": "/iletisim" } } };
export default function Page() { return <InfoPage pageKey="contact" locale="tr" />; }
