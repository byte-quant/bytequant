import type { Metadata } from "next";
import { PublishingStandardsPage } from "../components/PublishingStandardsPage";
import { publishingStandards } from "../lib/publishing-standards";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";

const content = publishingStandards.tr;
export const metadata: Metadata = { title: "Yayıncılık ve Güven Standartları", description: content.intro, alternates: localizedAlternates("tr", pathFor("tr", "standards"), pathFor("en", "standards")), ...localizedSocialMetadata("tr", content.title, content.intro, pathFor("tr", "standards")) };
export default function Page() { return <PublishingStandardsPage locale="tr" />; }
