import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ByteQuant · Privacy-First Browser Tools",
    short_name: "ByteQuant",
    description: "62 privacy-first tools for data, files, calculations, AI workflows, and code-security pre-checks. Core processing stays in your browser.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f5f7fb",
    theme_color: "#0a6c74",
    lang: "en",
    categories: ["productivity", "utilities", "developer tools", "security"],
    icons: [
      { src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/app-icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "JSON Formatter", short_name: "JSON", description: "Validate and format JSON locally", url: "/en/tools/json-bicimlendirici/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "File Risk Pre-Scan", short_name: "File scan", description: "Inspect file risk signals without uploading", url: "/en/tools/dosya-risk-on-taramasi/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "Unit Converter", short_name: "Units", description: "Convert common measurement units locally", url: "/en/tools/birim-donusturucu/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
    ],
  };
}
