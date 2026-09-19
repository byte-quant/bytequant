"use client";

import { useState, type ReactNode } from "react";
import { guidedPairFields, readGuidedPairs, updateGuidedPair } from "../lib/guided-pairs";
import type { Locale } from "../lib/site";

export function GuidedPairInput({ slug, slot, locale, value, onChange, children }: {
  slug: string; slot: "input" | "secondary"; locale: Locale; value: string; onChange: (value: string) => void; children: ReactNode;
}) {
  const [rawOpen, setRawOpen] = useState(false);
  const fields = guidedPairFields[slug]?.[slot];
  if (!fields) return children;
  const rawPairs = readGuidedPairs(value);
  const optionsFor = (key: string) => key === "direction" ? ["asc", "desc"] : key === "operation" ? ["sum", "count", "avg"] : key === "type" ? ["attachment", "inline"] : null;
  const parsed = rawPairs && fields.every((field) => {
    const current = rawPairs[field.key];
    if (!current) return true;
    if (field.type === "number") return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/iu.test(current) && Number.isFinite(Number(current));
    if (field.type === "date") return /^\d{4}-\d{2}-\d{2}$/u.test(current) && !Number.isNaN(Date.parse(current)) && new Date(current).toISOString().slice(0, 10) === current;
    return !optionsFor(field.key) || optionsFor(field.key)!.includes(current);
  }) ? rawPairs : null;
  const text = {
    tr: ["Alanları doldurun", "Ayraç yazmanız gerekmez. Örnek yükle düğmesi bu alanları da doldurur.", "Ham girdi / gelişmiş düzenleme", "Girdi alanlara kayıpsız aktarılamadı. Aşağıdaki ham girdiyi düzenleyin."],
    en: ["Fill in the fields", "No separators to type. Load example also fills these fields.", "Raw input / advanced editing", "This input cannot be mapped to fields without loss. Edit the raw input below."],
    de: ["Felder ausfüllen", "Keine Trennzeichen nötig. Beispiel laden füllt auch diese Felder.", "Roheingabe / erweiterte Bearbeitung", "Die Eingabe lässt sich nicht verlustfrei auf Felder abbilden. Roheingabe unten bearbeiten."],
    zh: ["填写字段", "无需输入分隔符。“加载示例”也会填入这些字段。", "原始输入 / 高级编辑", "无法无损地将此输入映射到字段。请编辑下面的原始输入。"],
  }[locale];
  return <div className="guided-pair-editor">
    <strong>{text[0]}</strong><p className="field-help">{text[1]}</p>
    {parsed ? <div className="guided-pair-fields">{fields.map((field) => <label className="field-label" key={field.key}>
      <span>{field.label[locale]}</span>
      {["direction", "operation", "type"].includes(field.key) ? <select value={parsed[field.key] ?? ""} onChange={(event) => onChange(updateGuidedPair(value, field.key, event.target.value))}><option value="">—</option>{(field.key === "direction" ? ["asc", "desc"] : field.key === "operation" ? ["sum", "count", "avg"] : ["attachment", "inline"]).map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={field.type ?? "text"} step={field.type === "number" ? "any" : undefined} value={parsed[field.key] ?? ""} placeholder={field.example} maxLength={2000}
        onChange={(event) => onChange(updateGuidedPair(value, field.key, event.target.value))}
        onInput={field.type === "date" ? (event) => onChange(updateGuidedPair(value, field.key, event.currentTarget.value)) : undefined} />}
    </label>)}</div> : <p role="status">{text[3]}</p>}
    <details open={rawOpen || !parsed} onToggle={(event) => setRawOpen(event.currentTarget.open)}><summary>{text[2]}</summary>{children}</details>
  </div>;
}
