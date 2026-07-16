import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";
import { absoluteUrl, localizedAlternates, ogImageUrl } from "../lib/site";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · 隐私优先的浏览器内工具" },
  description: "53 个免费工具，涵盖数据、文件、计算、AI 工作流和代码安全预检查。核心处理保留在浏览器中。",
  alternates: localizedAlternates("zh", "/", "/en"),
  openGraph: { type: "website", siteName: "ByteQuant", locale: "zh_CN", alternateLocale: ["tr_TR", "en_US", "de_DE"], url: absoluteUrl("/zh"), title: "ByteQuant · 隐私优先的浏览器内工具", description: "53 个免费工具，无需账户或服务器上传。", images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "ByteQuant 隐私优先工具" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant", description: "在浏览器中运行的隐私优先工具。", images: [ogImageUrl] },
};
export default function ChineseHome() { return <div lang="zh-CN"><HomePage locale="zh" /></div>; }
