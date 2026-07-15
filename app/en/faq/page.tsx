import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";
const description = "Answers about ByteQuant privacy, free use, browser support, and output limitations.";
export const metadata: Metadata = { title: "Frequently Asked Questions", description, alternates: localizedAlternates("en", "/sss", "/en/faq"), ...localizedSocialMetadata("en", "Frequently Asked Questions", description, "/en/faq") };
export default function Page() { return <div lang="en"><InfoPage pageKey="faq" locale="en" /></div>; }
