import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest { return { name: "ByteQuant", short_name: "ByteQuant", description: "Privacy-first in-browser productivity tools", start_url: "/", display: "standalone", background_color: "#f5f7fb", theme_color: "#0a6c74", lang: "tr", icons: [{ src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" }] }; }
