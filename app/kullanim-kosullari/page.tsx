import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
export const metadata: Metadata = { title: "Kullanım Koşulları", description: "ByteQuant araçlarının izin verilen kullanımı, sonuç doğrulama sorumluluğu, fikrî haklar ve hizmet sınırları.", alternates: { canonical: "/kullanim-kosullari", languages: { "tr-TR": "/kullanim-kosullari", "en-US": "/en/terms", "x-default": "/kullanim-kosullari" } } };
export default function Page() { return <InfoPage pageKey="terms" locale="tr" />; }
