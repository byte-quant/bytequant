import type { Locale } from "../lib/site";

export type ToolNoticeData = {
  kind: "error" | "success" | "info";
  text: string;
};

export function ToolNotice({ notice, locale }: { notice: ToolNoticeData | null; locale: Locale }) {
  if (!notice) return null;
  const titles = locale === "tr"
    ? { error: "İşlem tamamlanamadı", success: "İşlem tamamlandı", info: "Bilgi" }
    : { error: "Could not complete the operation", success: "Operation completed", info: "Information" };
  return (
    <div className={`tool-notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"} aria-live={notice.kind === "error" ? "assertive" : "polite"}>
      <span aria-hidden="true">{notice.kind === "error" ? "!" : notice.kind === "success" ? "✓" : "i"}</span>
      <div><strong>{titles[notice.kind]}</strong><p>{notice.text}</p></div>
    </div>
  );
}
