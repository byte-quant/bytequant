import type { Metadata } from "next";
import { PublishingStandardsPage } from "../../components/PublishingStandardsPage";
import { publishingStandards } from "../../lib/publishing-standards";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const content = publishingStandards.zh;
export const metadata: Metadata = { title: "发布与信任标准", description: content.intro, alternates: localizedAlternates("zh", pathFor("tr", "standards"), pathFor("en", "standards")), ...localizedSocialMetadata("zh", content.title, content.intro, pathFor("zh", "standards")) };
export default function Page() { return <PublishingStandardsPage locale="zh" />; }
