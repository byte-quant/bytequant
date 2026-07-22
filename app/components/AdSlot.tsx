import type { Locale } from "../lib/site";

export type AdPlacement = "home-library" | "home-editorial" | "tool-after-guide" | "guide-in-article" | "guide-index";

export function AdSlot({ locale, placement, format = "horizontal" }: { locale: Locale; placement: AdPlacement; format?: "horizontal" | "rectangle" }) {
  const labels = {
    tr: ["Reklam", "Reklam alanı", "İçerikten ayrılmış, etkin olmayan yerleşim"],
    en: ["Advertisement", "Advertising area", "Separated from content; placement is not active"],
    de: ["Werbung", "Werbefläche", "Vom Inhalt getrennt; Platzierung ist nicht aktiv"],
    zh: ["广告", "广告区域", "与内容分隔；当前未启用"],
  }[locale];
  return (
    <aside className={`ad-slot ad-${format}`} aria-label={labels[1]} data-ad-placement={placement} data-ad-status="reserved">
      <span>{labels[0]}</span>
      <small>{labels[2]}</small>
    </aside>
  );
}
