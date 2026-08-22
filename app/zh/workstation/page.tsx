import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "可视化工作流生成器 · 工作站";
const description = "把重复的文本与数据任务变成清晰的分步流程。使用 327 个免费浏览器工具，工作进度仅保存在您的设备上。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "workstation")) };
export default function Page() { return <WorkstationPage locale="zh" />; }
