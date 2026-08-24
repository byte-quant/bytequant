import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { absoluteUrl, localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const title = "指南";
const description = "ByteQuant 详细指南库以清晰语言标识提供浏览器内工具、隐私、安全与工作流方法，并包含实践示例、适用边界和可重复的核验步骤。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...localizedAlternates("zh", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/zh/feed.xml") } },
  ...localizedSocialMetadata("zh", title, description, "/zh/blog"),
};
export default function ChineseBlog() { return <LocalizedBlogIndex locale="zh" />; }
