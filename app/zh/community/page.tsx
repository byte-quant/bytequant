import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "开源社区 · 安全分享工作流";
const description = "在设备上准备工作流，预检个人数据与秘密，再将安全草稿分享给 ByteQuant 开源社区。";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "community")) };
export default function Page() { return <CommunityPage locale="zh" />; }
