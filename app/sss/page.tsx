import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";
const description = "ByteQuant araçlarının çalışma biçimi, gizlilik, ücretsiz kullanım, tarayıcı desteği ve sonuç sınırları hakkında cevaplar.";
export const metadata: Metadata = { title: "Sık Sorulan Sorular", description, alternates: localizedAlternates("tr", "/sss", "/en/faq"), ...localizedSocialMetadata("tr", "Sık Sorulan Sorular", description, "/sss") };
export default function Page() { return <InfoPage pageKey="faq" locale="tr" />; }
