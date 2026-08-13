import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "ByteQuant AI · 私密设备端对话与工具自动化";
const description = "与 ByteQuant AI 对话、查找合适工具、自动完成受支持任务并在设备端编辑图片；内容不会发送到远程 AI API。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "agent")) };
export default function Page() { return <AgentPage locale="zh" />; }
