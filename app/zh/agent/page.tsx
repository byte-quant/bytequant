import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "本地 AI 助手 · 私密浏览器对话与工具自动化";
const description = "使用真正的设备端 Qwen3 对话或快速可解释规划，在浏览器中协调 317 个 ByteQuant 工具；无需远程推理 API 或上传数据。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "agent")) };
export default function Page() { return <AgentPage locale="zh" />; }
