import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";

export const metadata: Metadata = {
  title: "Gizlilik Odaklı Tarayıcı İçi Araçlar",
  description: "Prompt, metin, JSON, CSV ve kişisel veri işlemleri için 18 ücretsiz araç. Üyelik yok; temel işlemler tarayıcınızda.",
  alternates: { canonical: "/", languages: { "tr-TR": "/", "en-US": "/en" } },
};

export default function Home() { return <HomePage locale="tr" />; }

