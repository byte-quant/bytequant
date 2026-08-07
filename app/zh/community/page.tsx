import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
import { nonIndexableRobots } from "../../lib/content-quality";

const title = "ByteQuant 全球社区 · 工作流、小组与资料";
const description = "通过开放的 Nostr 网络阅读全球动态，并使用设备端加密的便携资料分享工作流、评论、互动和发现小组。";

export const metadata: Metadata = { title, description, robots: nonIndexableRobots, alternates: localizedAlternates("zh", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "community")) };
export default function Page() { return <CommunityPage locale="zh" />; }
