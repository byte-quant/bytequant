import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "科学、技术与安全动态 | ByteQuant";
const description = "ByteQuant 从 NASA、NIST 与开放许可的 GOV.UK 官方 Feed 生成有限且透明的动态页，提供中文阅读提示、本地筛选与设备端收藏。";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("zh", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("zh", title, description, pathFor("zh", "news")) };
export default function Page() { return <NewsPage locale="zh" />; }
