import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about ByteQuant privacy, free use, browser support, and output limitations.", alternates: { canonical: "/en/faq", languages: { "tr-TR": "/sss", "en-US": "/en/faq" } } };
export default function Page() { return <div lang="en"><InfoPage pageKey="faq" locale="en" /></div>; }

