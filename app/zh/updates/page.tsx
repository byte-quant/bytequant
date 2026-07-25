import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "科学、技术与安全动态 | ByteQuant";
const description = "ByteQuant 从 NASA 与 NIST 官方 RSS 生成的透明动态页，收藏保存在设备端，并直接链接原始来源。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "news")) };
export default function Page() { return <NewsPage locale="zh" />; }
