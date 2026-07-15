import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "Acceptable use, output-verification responsibility, intellectual property, and service limitations for ByteQuant tools.";
export const metadata: Metadata = { title: "Terms of Use", description, alternates: localizedAlternates("en", "/kullanim-kosullari", "/en/terms"), ...localizedSocialMetadata("en", "Terms of Use", description, "/en/terms") };
export default function Page() { return <div lang="en"><InfoPage pageKey="terms" locale="en" /></div>; }
