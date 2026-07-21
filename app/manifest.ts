import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ByteQuant · Privacy-First Browser Tools",
    short_name: "ByteQuant",
    description: "104 privacy-first tools, an explainable local agent, and a visual workstation with encrypted on-device projects and serverless P2P.",
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
      { name: "ByteQuant Workstation", short_name: "Workstation", description: "Build visual workflows with encrypted local projects", url: "/en/workstation/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "ByteQuant Local Agent", short_name: "Local Agent", description: "Plan a private multi-step tool workflow", url: "/en/agent/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
      { name: "JSON Formatter", short_name: "JSON", description: "Validate and format JSON locally", url: "/en/tools/json-bicimlendirici/?source=pwa-shortcut", icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml" }] },
    ],
  };
}
