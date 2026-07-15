import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "ByteQuant support, privacy, bug-report, and content-correction channels.";
export const metadata: Metadata = { title: "Contact", description, alternates: localizedAlternates("en", "/iletisim", "/en/contact"), ...localizedSocialMetadata("en", "Contact", description, "/en/contact") };
export default function Page() { return <div lang="en"><InfoPage pageKey="contact" locale="en" /></div>; }
