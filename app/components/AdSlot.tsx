import type { Locale } from "../lib/site";

export function AdSlot({ locale, format = "horizontal" }: { locale: Locale; format?: "horizontal" | "rectangle" }) {
  return (
    <aside className={`ad-slot ad-${format}`} aria-label={locale === "tr" ? "Reklam için ayrılan alan" : "Reserved advertising area"}>
      <span>{locale === "tr" ? "Reklam" : "Advertisement"}</span>
      <small>{locale === "tr" ? "İçerikten açıkça ayrılmış alan" : "Clearly separated from editorial content"}</small>
    </aside>
  );
}

