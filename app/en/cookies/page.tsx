import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const description = "Review ByteQuant's cookieless model, essential and optional localStorage keys, retention periods, and privacy controls.";
export const metadata: Metadata = {
  title: "Cookie and Local-Storage Policy",
  description,
  alternates: localizedAlternates("en", "/cerez-politikasi", "/en/cookies"),
  ...localizedSocialMetadata("en", "Cookie and Local-Storage Policy", description, "/en/cookies"),
};

export default function Page() {
  return <InfoPage pageKey="cookies" locale="en" />;
}
