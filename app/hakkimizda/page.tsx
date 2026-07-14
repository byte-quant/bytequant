import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
export const metadata: Metadata = { title: "Hakkımızda", description: "ByteQuant'ın misyonu, tarayıcı içi mimari yaklaşımı, editoryal ilkeleri ve bağımsız iş modeli.", alternates: { canonical: "/hakkimizda", languages: { "tr-TR": "/hakkimizda", "en-US": "/en/about", "x-default": "/hakkimizda" } } };
export default function Page() { return <InfoPage pageKey="about" locale="tr" />; }
