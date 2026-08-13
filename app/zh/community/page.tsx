import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "ByteQuant 社区 · 工作流、问题与想法";
const description = "无需账号即可阅读 ByteQuant 全球主题动态；准备好后，可使用仅在设备上加密的资料发布、回复并收藏有用想法。";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "community")) };
export default function Page() { return <CommunityPage locale="zh" />; }
