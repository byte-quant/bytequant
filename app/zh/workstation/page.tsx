import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "工作站 · 可视化浏览器工具流程";
const description = "将 131 个 ByteQuant 工具连接为可视化节点，在设备上加密项目，并通过 URL 配方或无服务器 WebRTC 分享。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "workstation")) };
export default function Page() { return <WorkstationPage locale="zh" />; }
