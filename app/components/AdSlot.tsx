import type { Locale } from "../lib/site";

export type AdPlacement = "home-library" | "home-editorial" | "tool-after-guide" | "guide-in-article" | "guide-index";

export function AdSlot({ locale, placement, format = "horizontal" }: { locale: Locale; placement: AdPlacement; format?: "horizontal" | "rectangle" }) {
  const labels = {
    tr: ["Reklam", "Reklam alanı", "İçerikten ayrılmış Google Auto Ads alanı"],
    en: ["Advertisement", "Advertising area", "Google Auto Ads area, separated from content"],
    de: ["Werbung", "Werbefläche", "Vom Inhalt getrennter Google-Auto-Ads-Bereich"],
    zh: ["广告", "广告区域", "与内容分隔的 Google 自动广告区域"],
  }[locale];
  return (
    <aside className={`ad-slot ad-${format}`} aria-label={labels[1]} data-ad-placement={placement} data-ad-status="auto-ads-eligible">
      <span>{labels[0]}</span>
      <small>{labels[2]}</small>
    </aside>
  );
}
