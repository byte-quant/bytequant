import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "本地助手 · 浏览器内工具编排";
const description = "描述目标，在 89 个 ByteQuant 工具之间建立可解释、用户控制的工作流；无需远程模型或上传数据。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "agent")) };
export default function Page() { return <AgentPage locale="zh" />; }
