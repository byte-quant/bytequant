import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "ByteQuant privacy policy covering tool input, local preferences, hosting logs, advertising, and GDPR/KVKK rights.";
export const metadata: Metadata = { title: "Privacy Policy", description, alternates: localizedAlternates("en", "/gizlilik-politikasi", "/en/privacy"), ...localizedSocialMetadata("en", "Privacy Policy", description, "/en/privacy") };
export default function Page() { return <div lang="en"><InfoPage pageKey="privacy" locale="en" /></div>; }
