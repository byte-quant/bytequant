import type { Metadata } from "next";
import { PublishingStandardsPage } from "../../components/PublishingStandardsPage";
import { publishingStandards } from "../../lib/publishing-standards";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const content = publishingStandards.en;
export const metadata: Metadata = { title: "Publishing and Trust Standards", description: content.intro, alternates: localizedAlternates("en", pathFor("tr", "standards"), pathFor("en", "standards")), ...localizedSocialMetadata("en", content.title, content.intro, pathFor("en", "standards")) };
export default function Page() { return <PublishingStandardsPage locale="en" />; }
