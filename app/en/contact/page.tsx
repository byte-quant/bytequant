import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "Contact ByteQuant for reproducible tool bugs, accessibility issues, privacy requests, security reports, or sourced editorial corrections without sending sensitive data.";
export const metadata: Metadata = { title: "Contact", description, alternates: localizedAlternates("en", "/iletisim", "/en/contact"), ...localizedSocialMetadata("en", "Contact", description, "/en/contact") };
export default function Page() { return <div lang="en"><InfoPage pageKey="contact" locale="en" /></div>; }
