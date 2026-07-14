import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
export const metadata: Metadata = { title: "Privacy Policy", description: "ByteQuant privacy policy covering tool input, local preferences, hosting logs, advertising, and GDPR/KVKK rights.", alternates: { canonical: "/en/privacy", languages: { "tr-TR": "/gizlilik-politikasi", "en-US": "/en/privacy" } } };
export default function Page() { return <div lang="en"><InfoPage pageKey="privacy" locale="en" /></div>; }

