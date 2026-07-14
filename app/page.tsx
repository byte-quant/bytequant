import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";

export const metadata: Metadata = {
  title: "Gizlilik Odaklı Tarayıcı İçi Araçlar",
  description: "Prompt, metin, geliştirici ve gizlilik işlemleri için 29 ücretsiz araç. Üyelik yok; temel işlemler tarayıcınızda.",
  alternates: { canonical: "/", languages: { "tr-TR": "/", "en-US": "/en" } },
};

export default function Home() { return <HomePage locale="tr" />; }
