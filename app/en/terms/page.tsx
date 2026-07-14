import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
export const metadata: Metadata = { title: "Terms of Use", description: "Acceptable use, output-verification responsibility, intellectual property, and service limitations for ByteQuant tools.", alternates: { canonical: "/en/terms", languages: { "tr-TR": "/kullanim-kosullari", "en-US": "/en/terms" } } };
export default function Page() { return <div lang="en"><InfoPage pageKey="terms" locale="en" /></div>; }

