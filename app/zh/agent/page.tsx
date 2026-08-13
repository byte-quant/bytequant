import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "ByteQuant AI · 私密设备端对话与工具自动化";
const description = "讨论日常问题、查找合适的 ByteQuant 工具并在设备上完成受支持任务；不会把对话或工具输入发送到远程 AI API。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "agent")) };
export default function Page() { return <AgentPage locale="zh" />; }
