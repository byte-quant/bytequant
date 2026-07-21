"use client";

import { useMemo, useState } from "react";
import { toolPath, type Locale } from "../lib/site";
import Link from "next/link";

const samples = {
  tr: '{"proje":"ByteQuant","gizlilik":true,"diller":["tr","en","de","zh"]}',
  en: '{"project":"ByteQuant","privacy":true,"languages":["tr","en","de","zh"]}',
  de: '{"projekt":"ByteQuant","datenschutz":true,"sprachen":["tr","en","de","zh"]}',
  zh: '{"项目":"ByteQuant","隐私优先":true,"语言":["tr","en","de","zh"]}',
};

export function InteractiveDemo({ locale }: { locale: Locale }) {
  const t = {
    tr: { kicker: "30 SANİYELİK CANLI DEMO", title: "Okumakla kalmayın; JSON'u şimdi deneyin", body: "Metni değiştirin. Ayrıştırma ve biçimlendirme yalnızca bu sekmede çalışır.", load: "Örneği geri yükle", valid: "Geçerli JSON", invalid: "Düzeltmeniz gereken JSON", empty: "Bir JSON nesnesi yazın.", open: "Tam JSON aracını aç", chars: "karakter" },
    en: { kicker: "30-SECOND LIVE DEMO", title: "Don’t just read—try JSON now", body: "Edit the text. Parsing and formatting run only in this tab.", load: "Restore example", valid: "Valid JSON", invalid: "JSON needs attention", empty: "Enter a JSON object.", open: "Open the full JSON tool", chars: "characters" },
    de: { kicker: "30-SEKUNDEN-LIVE-DEMO", title: "Nicht nur lesen – JSON direkt testen", body: "Text bearbeiten. Prüfung und Formatierung laufen nur in diesem Tab.", load: "Beispiel wiederherstellen", valid: "Gültiges JSON", invalid: "JSON muss korrigiert werden", empty: "Geben Sie ein JSON-Objekt ein.", open: "Vollständiges JSON-Werkzeug", chars: "Zeichen" },
    zh: { kicker: "30 秒交互演示", title: "不要只阅读，立即试用 JSON", body: "编辑文本；解析与格式化仅在当前标签页运行。", load: "恢复示例", valid: "JSON 有效", invalid: "JSON 需要修正", empty: "请输入 JSON 对象。", open: "打开完整 JSON 工具", chars: "字符" },
  }[locale];
  const [input, setInput] = useState(samples[locale]);
  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: t.empty, keys: 0 };
    try { const value: unknown = JSON.parse(input); const keys = value && typeof value === "object" ? Object.keys(value).length : 0; return { output: JSON.stringify(value, null, 2), error: "", keys }; }
    catch (error) { return { output: "", error: error instanceof Error ? error.message : t.invalid, keys: 0 }; }
  }, [input, t.empty, t.invalid]);
  return <section className="section interactive-demo-section" aria-labelledby={`interactive-demo-${locale}`}><div className="container interactive-demo-grid"><div className="interactive-demo-copy"><span className="kicker">{t.kicker}</span><h2 id={`interactive-demo-${locale}`}>{t.title}</h2><p>{t.body}</p><div><span>✓ 0 API</span><span>✓ {input.length.toLocaleString()} {t.chars}</span></div><button type="button" className="secondary-button" onClick={() => setInput(samples[locale])}>{t.load}</button></div><div className="interactive-demo-console"><label><span>INPUT · JSON</span><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck="false" /></label><div><header><span className={result.error ? "demo-status-error" : "demo-status-ok"}>{result.error ? "!" : "✓"} {result.error ? t.invalid : t.valid}</span>{!result.error && <small>{result.keys} keys</small>}</header><pre>{result.error || result.output}</pre><Link href={toolPath(locale, "json-bicimlendirici")}>{t.open} →</Link></div></div></div></section>;
}
