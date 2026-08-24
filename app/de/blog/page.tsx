import type { Metadata } from "next";
import { LocalizedBlogIndex } from "../../components/LocalizedBlogIndex";
import { absoluteUrl, localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const title = "Ratgeber";
const description = "Ausführliche ByteQuant-Ratgeber mit nachvollziehbaren Methoden, Praxisbeispielen, Grenzen und Prüfwegen für lokale Browser-Werkzeuge, Datenschutz und sichere digitale Abläufe.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...localizedAlternates("de", "/blog", "/en/blog"), types: { "application/rss+xml": absoluteUrl("/de/feed.xml") } },
  ...localizedSocialMetadata("de", title, description, "/de/blog"),
};
export default function GermanBlog() { return <LocalizedBlogIndex locale="de" />; }
