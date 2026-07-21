"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toolPath, type Locale } from "../lib/site";

type DemoId = "json" | "mask" | "clean" | "base64";
const demos: Array<{ id: DemoId; slug: string; name: Record<Locale, string>; sample: Record<Locale, string> }> = [
  { id: "json", slug: "json-bicimlendirici", name: { tr: "JSON biçimle", en: "Format JSON", de: "JSON formatieren", zh: "格式化 JSON" }, sample: { tr: '{"proje":"ByteQuant","gizlilik":true,"diller":["tr","en","de","zh"]}', en: '{"project":"ByteQuant","privacy":true,"languages":["tr","en","de","zh"]}', de: '{"projekt":"ByteQuant","datenschutz":true,"sprachen":["tr","en","de","zh"]}', zh: '{"项目":"ByteQuant","隐私优先":true,"语言":["tr","en","de","zh"]}' } },
  { id: "mask", slug: "kvkk-veri-maskeleyici", name: { tr: "Hassas veriyi maskele", en: "Mask sensitive data", de: "Sensible Daten maskieren", zh: "遮蔽敏感数据" }, sample: { tr: "Demo iletişim: ada@example.test · +90 555 123 45 67 · 192.0.2.10", en: "Demo contact: ada@example.test · +1 202 555 0142 · 192.0.2.10", de: "Demo-Kontakt: ada@example.test · +49 151 23456789 · 192.0.2.10", zh: "演示联系信息：ada@example.test · +86 138 0013 8000 · 192.0.2.10" } },
  { id: "clean", slug: "metin-temizleyici", name: { tr: "Metni temizle", en: "Clean text", de: "Text bereinigen", zh: "清理文本" }, sample: { tr: "  ByteQuant\tmetni   cihazda işler.  \n\n\n  Gereksiz boşlukları temizleyin. ", en: "  ByteQuant\tprocesses text   on-device.  \n\n\n  Remove unnecessary spacing. ", de: "  ByteQuant\tverarbeitet Text   lokal.  \n\n\n  Unnötige Abstände entfernen. ", zh: "  ByteQuant\t在设备上   处理文本。  \n\n\n  清理多余空格。 " } },
  { id: "base64", slug: "base64-kodlayici", name: { tr: "Base64 kodla", en: "Encode Base64", de: "Base64 kodieren", zh: "Base64 编码" }, sample: { tr: "Merhaba ByteQuant ✓", en: "Hello ByteQuant ✓", de: "Hallo ByteQuant ✓", zh: "你好 ByteQuant ✓" } },
];

export function InteractiveDemo({ locale }: { locale: Locale }) {
  const t = {
    tr: { kicker: "TEK EKRANDA 4 CANLI DEMO", title: "Yazın, sonucu anında görün", body: "JSON biçimleme, hassas veri maskeleme, metin temizleme ve Base64 kodlama arasında geçiş yapın. Her deneme yalnızca bu sekmede çalışır.", restore: "Örneği geri yükle", ready: "Yerel sonuç hazır", error: "Girdiyi düzeltin", empty: "Önce bir girdi yazın.", open: "Tam aracı aç", chars: "karakter", changed: "değişiklik", input: "GİRDİ", output: "ÇIKTI" },
    en: { kicker: "4 LIVE DEMOS IN ONE VIEW", title: "Type and see the result instantly", body: "Switch among JSON formatting, sensitive-data masking, text cleanup, and Base64 encoding. Every demo runs only in this tab.", restore: "Restore example", ready: "Local result ready", error: "Fix the input", empty: "Enter some input first.", open: "Open the full tool", chars: "characters", changed: "changes", input: "INPUT", output: "OUTPUT" },
    de: { kicker: "4 LIVE-DEMOS IN EINER ANSICHT", title: "Eingeben und das Ergebnis sofort sehen", body: "Wechseln Sie zwischen JSON-Formatierung, Datenmaskierung, Textbereinigung und Base64. Jede Demo läuft nur in diesem Tab.", restore: "Beispiel wiederherstellen", ready: "Lokales Ergebnis fertig", error: "Eingabe korrigieren", empty: "Geben Sie zuerst etwas ein.", open: "Vollständiges Werkzeug", chars: "Zeichen", changed: "Änderungen", input: "EINGABE", output: "AUSGABE" },
    zh: { kicker: "一个视图中的 4 个交互演示", title: "输入内容，即时查看结果", body: "在 JSON 格式化、敏感数据遮蔽、文本清理和 Base64 编码之间切换。所有演示仅在当前标签页运行。", restore: "恢复示例", ready: "本地结果已就绪", error: "请修正输入", empty: "请先输入内容。", open: "打开完整工具", chars: "字符", changed: "项更改", input: "输入", output: "输出" },
  }[locale];
  const [active, setActive] = useState<DemoId>("json");
  const current = demos.find((demo) => demo.id === active) ?? demos[0];
  const [inputs, setInputs] = useState<Record<DemoId, string>>(() => Object.fromEntries(demos.map((demo) => [demo.id, demo.sample[locale]])) as Record<DemoId, string>);
  const input = inputs[active];
  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: t.empty, changes: 0 };
    try {
      if (active === "json") { const value: unknown = JSON.parse(input); return { output: JSON.stringify(value, null, 2), error: "", changes: value && typeof value === "object" ? Object.keys(value).length : 1 }; }
      if (active === "mask") { let changes = 0; const output = input.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu, () => { changes += 1; return "[EMAIL]"; }).replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/gu, () => { changes += 1; return "[IP]"; }).replace(/\+?\d(?:[\s().-]*\d){8,14}/gu, () => { changes += 1; return "[PHONE]"; }); return { output, error: "", changes }; }
      if (active === "clean") { const output = input.replace(/\r\n?/gu, "\n").split("\n").map((line) => line.replace(/[\t ]+/gu, " ").trim()).join("\n").replace(/\n{3,}/gu, "\n\n").trim(); return { output, error: "", changes: input === output ? 0 : 1 }; }
      const bytes = new TextEncoder().encode(input); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return { output: btoa(binary), error: "", changes: bytes.length };
    } catch (error) { return { output: "", error: error instanceof Error ? error.message : t.error, changes: 0 }; }
  }, [active, input, t.empty, t.error]);
  return <section className="section interactive-demo-section" aria-labelledby={`interactive-demo-${locale}`}><div className="container interactive-demo-grid"><div className="interactive-demo-copy"><span className="kicker">{t.kicker}</span><h2 id={`interactive-demo-${locale}`}>{t.title}</h2><p>{t.body}</p><div className="interactive-demo-tabs" role="tablist" aria-label={t.title}>{demos.map((demo) => <button key={demo.id} type="button" role="tab" aria-selected={active === demo.id} onClick={() => setActive(demo.id)}>{demo.name[locale]}</button>)}</div><div className="interactive-demo-trust"><span>✓ 0 API</span><span>✓ {input.length.toLocaleString()} {t.chars}</span></div><button type="button" className="secondary-button" onClick={() => setInputs((value) => ({ ...value, [active]: current.sample[locale] }))}>{t.restore}</button></div><div className="interactive-demo-console"><label><span>{t.input} · {current.name[locale]}</span><textarea value={input} onChange={(event) => setInputs((value) => ({ ...value, [active]: event.target.value }))} spellCheck="false" /></label><div><header><span className={result.error ? "demo-status-error" : "demo-status-ok"}>{result.error ? "!" : "✓"} {result.error ? t.error : t.ready}</span>{!result.error && <small>{result.changes} {t.changed}</small>}</header><pre>{result.error || result.output}</pre><Link href={toolPath(locale, current.slug)}>{t.open} →</Link></div></div></div></section>;
}
