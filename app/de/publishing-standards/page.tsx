import type { Metadata } from "next";
import { PublishingStandardsPage } from "../../components/PublishingStandardsPage";
import { publishingStandards } from "../../lib/publishing-standards";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const content = publishingStandards.de;
export const metadata: Metadata = { title: "Publikations- und Vertrauensstandards", description: content.intro, alternates: localizedAlternates("de", pathFor("tr", "standards"), pathFor("en", "standards")), ...localizedSocialMetadata("de", content.title, content.intro, pathFor("de", "standards")) };
export default function Page() { return <PublishingStandardsPage locale="de" />; }
