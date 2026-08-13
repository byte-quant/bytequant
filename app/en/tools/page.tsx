import type { Metadata } from "next";
import { ToolLibraryPage } from "../../components/ToolLibraryPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const description = "Explore 317 free in-browser tools for text, data, PDF, images, calculations, code, and privacy. Search, choose a category, and start without an account.";
export const metadata: Metadata = {
  title: "Free In-Browser Tools",
  description,
  alternates: localizedAlternates("en", "/araclar", "/en/tools"),
  ...localizedSocialMetadata("en", "Free In-Browser Tools", description, "/en/tools"),
};

export default function EnglishToolLibrary() { return <div lang="en"><ToolLibraryPage locale="en" /></div>; }
