import type { Locale } from "../lib/site";

export function AdSlot({ locale, format = "horizontal" }: { locale: Locale; format?: "horizontal" | "rectangle" }) {
  const labels = { tr: ["Reklam için ayrılan alan", "Reklam", "İçerikten açıkça ayrılmış alan"], en: ["Reserved advertising area", "Advertisement", "Clearly separated from editorial content"], de: ["Reservierte Werbefläche", "Werbung", "Klar vom redaktionellen Inhalt getrennt"], zh: ["预留广告区域", "广告", "与编辑内容明确分隔"] }[locale];
  return (
    <aside className={`ad-slot ad-${format}`} aria-label={labels[0]}>
      <span>{labels[1]}</span>
      <small>{labels[2]}</small>
    </aside>
  );
}
