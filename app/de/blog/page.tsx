import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { localizedAlternates } from "../../lib/site";
export const metadata: Metadata = { title: "Ratgeber", description: "Ausführliche ByteQuant-Ratgeber in transparent gekennzeichneten Sprachen.", alternates: localizedAlternates("de", "/blog", "/en/blog") };
export default function GermanBlog() { return <LocalizedBlogIndex locale="de" />; }
