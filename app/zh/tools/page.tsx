import type { Metadata } from "next";
import { ToolLibraryPage } from "../../components/ToolLibraryPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const description = "浏览 327 个免费的浏览器内工具，涵盖文本、数据、PDF、图像、计算、代码和隐私。无需账户即可搜索并开始使用。";
export const metadata: Metadata = {
  title: "免费浏览器内工具",
  description,
  alternates: localizedAlternates("zh", "/araclar", "/en/tools"),
  ...localizedSocialMetadata("zh", "免费浏览器内工具", description, "/zh/tools"),
};

export default function ChineseToolLibrary() { return <div lang="zh-CN"><ToolLibraryPage locale="zh" /></div>; }
