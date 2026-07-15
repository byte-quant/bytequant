import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";
const description = "ByteQuant araçlarının izin verilen kullanımı, sonuç doğrulama sorumluluğu, fikrî haklar ve hizmet sınırları.";
export const metadata: Metadata = { title: "Kullanım Koşulları", description, alternates: localizedAlternates("tr", "/kullanim-kosullari", "/en/terms"), ...localizedSocialMetadata("tr", "Kullanım Koşulları", description, "/kullanim-kosullari") };
export default function Page() { return <InfoPage pageKey="terms" locale="tr" />; }
