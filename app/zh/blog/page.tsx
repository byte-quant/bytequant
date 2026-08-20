import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { absoluteUrl, localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const title = "指南";
const description = "以明确语言标识提供的 ByteQuant 详细指南。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...localizedAlternates("zh", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/zh/feed.xml") } },
  ...localizedSocialMetadata("zh", title, description, "/zh/blog"),
};
export default function ChineseBlog() { return <LocalizedBlogIndex locale="zh" />; }
