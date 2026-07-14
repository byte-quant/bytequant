import type { Metadata } from "next";
import { InfoPage } from "../../components/InfoPage";
import { localizedAlternates } from "../../lib/site";

export const metadata: Metadata = {
  title: "Cookie and Local-Storage Policy",
  description: "Review ByteQuant's cookieless model, essential and optional localStorage keys, retention periods, and privacy controls.",
  alternates: localizedAlternates("en", "/cerez-politikasi", "/en/cookies"),
};

export default function Page() {
  return <InfoPage pageKey="cookies" locale="en" />;
}
