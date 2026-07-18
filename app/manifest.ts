import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ByteQuant · Privacy-First Browser Tools",
    short_name: "ByteQuant",
    description: "89 privacy-first tools plus a local, explainable workflow agent. Core processing, plans, and tool input stay in your browser.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#f5f7fb",
    theme_color: "#0a6c74",
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
    categories: ["productivity", "utilities", "developer tools", "security"],
    icons: [
      { src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/app-icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "ByteQuant Local Agent", short_name: "Local Agent", description: "Plan a private multi-step tool workflow", url: "/en/agent/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "JSON Formatter", short_name: "JSON", description: "Validate and format JSON locally", url: "/en/tools/json-bicimlendirici/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "File Risk Pre-Scan", short_name: "File scan", description: "Inspect file risk signals without uploading", url: "/en/tools/dosya-risk-on-taramasi/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
    ],
  };
}
