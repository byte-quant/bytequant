import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { localizedAlternates } from "../../lib/site";
export const metadata: Metadata = { title: "指南", description: "以明确语言标识提供的 ByteQuant 详细指南。", alternates: localizedAlternates("zh", "/blog", "/en/blog") };
export default function ChineseBlog() { return <LocalizedBlogIndex locale="zh" />; }
