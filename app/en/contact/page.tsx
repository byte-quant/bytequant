import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
export const metadata: Metadata = { title: "Contact", description: "ByteQuant support, privacy, bug-report, and content-correction channels.", alternates: { canonical: "/en/contact", languages: { "tr-TR": "/iletisim", "en-US": "/en/contact" } } };
export default function Page() { return <div lang="en"><InfoPage pageKey="contact" locale="en" /></div>; }

