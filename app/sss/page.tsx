import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
export const metadata: Metadata = { title: "Sık Sorulan Sorular", description: "ByteQuant araçlarının çalışma biçimi, gizlilik, ücretsiz kullanım, tarayıcı desteği ve sonuç sınırları hakkında cevaplar.", alternates: { canonical: "/sss", languages: { "tr-TR": "/sss", "en-US": "/en/faq", "x-default": "/sss" } } };
export default function Page() { return <InfoPage pageKey="faq" locale="tr" />; }
