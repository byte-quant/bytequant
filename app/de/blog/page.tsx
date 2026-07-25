import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { absoluteUrl, localizedAlternates } from "../../lib/site";
export const metadata: Metadata = { title: "Ratgeber", description: "Ausführliche ByteQuant-Ratgeber in transparent gekennzeichneten Sprachen.", alternates: { ...localizedAlternates("de", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/de/feed.xml") } } };
export default function GermanBlog() { return <LocalizedBlogIndex locale="de" />; }
