"use client";

/* eslint-disable @next/next/no-img-element -- previews use ephemeral local blob URLs that next/image cannot optimize */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { createVisualDraftSvg, DEFAULT_VISUAL_SETTINGS, detectVisualIntent, parseVisualInstruction, sanitizeVisualSettings, VISUAL_MAX_FILE_BYTES, type VisualOutputMime, type VisualSettings } from "../lib/visual-studio";
import { WORKSPACE_TOOL_START_KEY } from "../lib/workspace-handoff";

type Result = { url: string; blob: Blob; width: number; height: number; filename: string };
type Status = "idle" | "processing" | "ready" | "error";

const copy = {
  tr: {
    edit: "Görsel düzenle", create: "Taslak oluştur", editTitle: "Değişikliği günlük dille anlatın", editText: "Parlaklık, kontrast, doygunluk, siyah-beyaz, bulanıklık, döndürme, çevirme ve boyutlandırmayı birlikte uygulayabilirsiniz.", upload: "PNG, JPG veya WebP seçin", limit: "En fazla 25 MB ve 40 MP", command: "Örn. 1200×630 yap, kontrastı 15 artır, siyah-beyaz ve sağa döndür", understand: "Talimatı ayarlara uygula", noCommand: "Desteklenen bir düzenleme bulunamadı. Aşağıdaki kontrolleri elle de kullanabilirsiniz.", understood: "Anlaşılan değişiklikler", brightness: "Parlaklık", contrast: "Kontrast", saturation: "Doygunluk", blur: "Bulanıklık", grayscale: "Siyah-beyaz", rotate: "Döndür", flipX: "Yatay çevir", flipY: "Dikey çevir", width: "Genişlik", height: "Yükseklik", format: "Çıktı", quality: "Kalite", process: "Görseli cihazda işle", processing: "Görsel cihazınızda işleniyor…", before: "Önce", after: "Sonra", empty: "İşlenmiş görsel burada görünecek.", download: "Görseli indir", reset: "Ayarları sıfırla", createTitle: "İstemden özgün bir vektör taslak oluşturun", createText: "Bu özellik fotoğraf üreten büyük bir model değildir. İsteminize göre yerel ve tekrar üretilebilir bir SVG kompozisyonu hazırlar; metni, renkleri ve şekilleri başka araçlarda düzenleyebilirsiniz.", prompt: "Örn. gizlilik odaklı mavi teknoloji etkinliği kapağı", style: "Görsel dil", soft: "Yumuşak", bold: "Canlı", mono: "Tek renk", size: "Boyut", generate: "Taslağı oluştur", draftEmpty: "Vektör taslak burada görünecek.", privacy: "Görsel sunucuya yüklenmez. Düzenleme sırasında Canvas yeniden kodlama yaptığı için EXIF ve çoğu gömülü metadata çıktıya taşınmaz.", honest: "Bu alan nesne silme, yüz üretme veya fotogerçekçi üretken model iddiasında bulunmaz.", related: "Ayrıntılı araçlarla devam edin", converter: "Biçim dönüştür", compressor: "Sıkıştır", resizer: "Boyutlandır", workflow: "İş İstasyonu'nda akış kur", workflowReselect: "Görsel dosyası gizliliğiniz için sayfalar arasında taşınmadı. Aracı açınca dosyayı yeniden seçin.", workflowDraft: "Yerel SVG taslağını sonraki görsel araçlarında işlemeye devam edin.", planned: "Planlanan çıktı", originalSize: "özgün boyut", errorType: "Yalnız PNG, JPG ve WebP desteklenir.", errorSize: "Dosya 25 MB sınırını aşıyor.", errorProcess: "Görsel işlenemedi. Daha küçük bir dosya veya güncel bir tarayıcı deneyin.", ready: "Çıktı hazır", dimensions: "boyut", bytes: "dosya", modeLabel: "Görsel stüdyo modu",
  },
  en: {
    edit: "Edit image", create: "Create draft", editTitle: "Describe the change in everyday language", editText: "Combine brightness, contrast, saturation, grayscale, blur, rotation, flipping, and resizing.", upload: "Choose PNG, JPG, or WebP", limit: "Up to 25 MB and 40 MP", command: "Example: make it 1200×630, add 15 contrast, grayscale, and rotate right", understand: "Apply instruction to controls", noCommand: "No supported edit was found. You can still use the controls below.", understood: "Understood changes", brightness: "Brightness", contrast: "Contrast", saturation: "Saturation", blur: "Blur", grayscale: "Grayscale", rotate: "Rotate", flipX: "Flip horizontal", flipY: "Flip vertical", width: "Width", height: "Height", format: "Output", quality: "Quality", process: "Process on this device", processing: "Processing on your device…", before: "Before", after: "After", empty: "The processed image will appear here.", download: "Download image", reset: "Reset controls", createTitle: "Create an original vector draft from a prompt", createText: "This is not a large photorealistic image model. It creates a local, reproducible SVG composition from your prompt so text, colors, and shapes remain editable.", prompt: "Example: privacy-first blue technology event cover", style: "Visual style", soft: "Soft", bold: "Bold", mono: "Monochrome", size: "Size", generate: "Create draft", draftEmpty: "The vector draft will appear here.", privacy: "The image is not uploaded. Canvas re-encoding means EXIF and most embedded metadata are not carried into the output.", honest: "This workspace does not claim object removal, face synthesis, or photorealistic generative output.", related: "Continue with focused tools", converter: "Convert format", compressor: "Compress", resizer: "Resize", workflow: "Build a Workstation flow", workflowReselect: "For privacy, the image file was not moved between pages. Select it again when the tool opens.", workflowDraft: "Continue processing the local SVG draft with focused image tools.", planned: "Planned output", originalSize: "original size", errorType: "Only PNG, JPG, and WebP are supported.", errorSize: "The file exceeds the 25 MB limit.", errorProcess: "The image could not be processed. Try a smaller file or a current browser.", ready: "Output ready", dimensions: "dimensions", bytes: "file", modeLabel: "Visual Studio mode",
  },
  de: {
    edit: "Bild bearbeiten", create: "Entwurf erstellen", editTitle: "Änderung in Alltagssprache beschreiben", editText: "Helligkeit, Kontrast, Sättigung, Graustufen, Unschärfe, Drehung, Spiegelung und Größe lassen sich kombinieren.", upload: "PNG, JPG oder WebP wählen", limit: "Bis 25 MB und 40 MP", command: "Beispiel: 1200×630, Kontrast 15, Graustufen und nach rechts drehen", understand: "Anweisung auf Regler anwenden", noCommand: "Keine unterstützte Änderung erkannt. Die Regler können weiterhin manuell genutzt werden.", understood: "Erkannte Änderungen", brightness: "Helligkeit", contrast: "Kontrast", saturation: "Sättigung", blur: "Unschärfe", grayscale: "Graustufen", rotate: "Drehen", flipX: "Horizontal spiegeln", flipY: "Vertikal spiegeln", width: "Breite", height: "Höhe", format: "Ausgabe", quality: "Qualität", process: "Auf diesem Gerät verarbeiten", processing: "Bild wird auf Ihrem Gerät verarbeitet…", before: "Vorher", after: "Nachher", empty: "Das bearbeitete Bild erscheint hier.", download: "Bild herunterladen", reset: "Regler zurücksetzen", createTitle: "Eigenen Vektorentwurf aus einem Prompt erstellen", createText: "Dies ist kein großes fotorealistisches Bildmodell. Aus dem Prompt entsteht lokal eine reproduzierbare SVG-Komposition, deren Text, Farben und Formen bearbeitbar bleiben.", prompt: "Beispiel: blaues Technologie-Cover mit Datenschutzfokus", style: "Bildsprache", soft: "Sanft", bold: "Kräftig", mono: "Einfarbig", size: "Größe", generate: "Entwurf erstellen", draftEmpty: "Der Vektorentwurf erscheint hier.", privacy: "Das Bild wird nicht hochgeladen. Durch die Canvas-Neukodierung werden EXIF und die meisten eingebetteten Metadaten nicht übernommen.", honest: "Dieser Bereich verspricht weder Objektentfernung noch Gesichtssynthese oder fotorealistische Generierung.", related: "Mit spezialisierten Werkzeugen fortfahren", converter: "Format konvertieren", compressor: "Komprimieren", resizer: "Größe ändern", workflow: "Ablauf in Workstation bauen", workflowReselect: "Zum Schutz Ihrer Daten wurde die Bilddatei nicht zwischen Seiten übertragen. Wählen Sie sie im Werkzeug erneut aus.", workflowDraft: "Den lokalen SVG-Entwurf mit spezialisierten Bildwerkzeugen weiterverarbeiten.", planned: "Geplante Ausgabe", originalSize: "Originalgröße", errorType: "Nur PNG, JPG und WebP werden unterstützt.", errorSize: "Die Datei überschreitet 25 MB.", errorProcess: "Das Bild konnte nicht verarbeitet werden. Verwenden Sie eine kleinere Datei oder einen aktuellen Browser.", ready: "Ausgabe bereit", dimensions: "Abmessungen", bytes: "Datei", modeLabel: "Modus des Bildstudios",
  },
  zh: {
    edit: "编辑图片", create: "创建草稿", editTitle: "用日常语言描述修改要求", editText: "可以组合调整亮度、对比度、饱和度、灰度、模糊、旋转、翻转和尺寸。", upload: "选择 PNG、JPG 或 WebP", limit: "最大 25 MB、4000 万像素", command: "例如：改为 1200×630、对比度加 15、灰度并向右旋转", understand: "将指令应用到控件", noCommand: "未识别到支持的修改。您仍可手动使用下方控件。", understood: "已识别的修改", brightness: "亮度", contrast: "对比度", saturation: "饱和度", blur: "模糊", grayscale: "灰度", rotate: "旋转", flipX: "水平翻转", flipY: "垂直翻转", width: "宽度", height: "高度", format: "输出", quality: "质量", process: "在此设备处理", processing: "正在您的设备上处理…", before: "处理前", after: "处理后", empty: "处理后的图片将显示在这里。", download: "下载图片", reset: "重置控件", createTitle: "根据提示词创建原创矢量草稿", createText: "这不是大型照片级图片模型。它会根据提示词在本地创建可重复的 SVG 构图，文字、颜色和形状仍可继续编辑。", prompt: "例如：隐私优先的蓝色科技活动封面", style: "视觉风格", soft: "柔和", bold: "鲜明", mono: "单色", size: "尺寸", generate: "创建草稿", draftEmpty: "矢量草稿将显示在这里。", privacy: "图片不会上传。Canvas 会重新编码，因此 EXIF 和大多数嵌入元数据不会进入输出文件。", honest: "此区域不声称能够移除物体、合成人脸或生成照片级内容。", related: "使用专用工具继续处理", converter: "转换格式", compressor: "压缩", resizer: "调整尺寸", workflow: "在工作站创建流程", workflowReselect: "为保护隐私，图片文件不会跨页面传递。打开工具后请重新选择该文件。", workflowDraft: "继续使用专用图片工具处理本地 SVG 草稿。", planned: "计划输出", originalSize: "原始尺寸", errorType: "仅支持 PNG、JPG 和 WebP。", errorSize: "文件超过 25 MB 限制。", errorProcess: "无法处理图片。请尝试较小文件或使用新版浏览器。", ready: "输出已准备", dimensions: "尺寸", bytes: "文件", modeLabel: "视觉工作室模式",
  },
} as const;

const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KiB` : `${(bytes / 1024 / 1024).toFixed(2)} MiB`;

type AgentVisualStudioProps = {
  locale: Locale;
  initialCommand?: string;
  initialFile?: File | null;
  embedded?: boolean;
  onClose?: () => void;
};

export function AgentVisualStudio({ locale, initialCommand = "", initialFile = null, embedded = false, onClose }: AgentVisualStudioProps) {
  const c = copy[locale];
  const seededIntent = detectVisualIntent(initialCommand, Boolean(initialFile));
  const seededParse = parseVisualInstruction(initialCommand, DEFAULT_VISUAL_SETTINGS, locale);
  const seededFile = initialFile && ["image/png", "image/jpeg", "image/webp"].includes(initialFile.type) && initialFile.size <= VISUAL_MAX_FILE_BYTES ? initialFile : null;
  const seededFileError = initialFile && !seededFile ? (initialFile.size > VISUAL_MAX_FILE_BYTES ? c.errorSize : c.errorType) : "";
  const [mode, setMode] = useState<"edit" | "create">(seededIntent.kind === "create" ? "create" : "edit");
  const [file, setFile] = useState<File | null>(seededFile);
  const [originalUrl, setOriginalUrl] = useState(() => seededFile ? URL.createObjectURL(seededFile) : "");
  const [command, setCommand] = useState(seededIntent.kind === "edit" ? initialCommand : "");
  const [commandNote, setCommandNote] = useState(seededParse.changed.length ? `${c.understood}: ${seededParse.summary}` : "");
  const [settings, setSettings] = useState<VisualSettings>(seededParse.settings);
  const [outputMime, setOutputMime] = useState<VisualOutputMime>(seededParse.outputMime ?? "image/webp");
  const [quality, setQuality] = useState(seededParse.quality ?? 86);
  const [status, setStatus] = useState<Status>(seededFileError ? "error" : "idle");
  const [error, setError] = useState(seededFileError);
  const [result, setResult] = useState<Result | null>(null);
  const [prompt, setPrompt] = useState(seededIntent.kind === "create" ? initialCommand.trim().slice(0, 120) : "");
  const [draftStyle, setDraftStyle] = useState<"soft" | "bold" | "mono">("soft");
  const [draftSize, setDraftSize] = useState("1200x630");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const setSetting = <K extends keyof VisualSettings>(key: K, value: VisualSettings[K]) => setSettings((current) => sanitizeVisualSettings({ ...current, [key]: value }));
  const resultMeta = useMemo(() => result ? `${result.width} × ${result.height} · ${formatSize(result.blob.size)}` : "", [result]);

  useEffect(() => () => { if (originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  function clearResult() { setResult(null); setStatus("idle"); setError(""); }
  function chooseFile(next: File | null) {
    clearResult(); setCommandNote("");
    if (!next) { setFile(null); setOriginalUrl(""); return; }
    if (!["image/png", "image/jpeg", "image/webp"].includes(next.type)) { setError(c.errorType); setStatus("error"); setFile(null); setOriginalUrl(""); return; }
    if (next.size > VISUAL_MAX_FILE_BYTES) { setError(c.errorSize); setStatus("error"); setFile(null); setOriginalUrl(""); return; }
    setFile(next); setOriginalUrl(URL.createObjectURL(next)); setStatus("idle"); setError("");
  }
  function interpretCommand() {
    const parsed = parseVisualInstruction(command, settings, locale);
    if (!parsed.changed.length) { setCommandNote(c.noCommand); return; }
    setSettings(parsed.settings); if (parsed.outputMime) setOutputMime(parsed.outputMime); if (parsed.quality) setQuality(parsed.quality); setCommandNote(`${c.understood}: ${parsed.summary}`); clearResult();
  }
  async function processImage() {
    if (!file || status === "processing") return;
    setError(""); clearResult(); setStatus("processing");
    try {
      const { processVisualFile } = await import("../lib/visual-worker-client");
      const processed = await processVisualFile(file, settings, outputMime, quality / 100);
      const extension = outputMime === "image/jpeg" ? "jpg" : outputMime.split("/")[1];
      const blob = processed.blob;
      setResult({ url: URL.createObjectURL(blob), blob, width: processed.width, height: processed.height, filename: `bytequant-visual.${extension}` });
      setStatus("ready");
    } catch { setError(c.errorProcess); setStatus("error"); }
  }
  function generateDraft() {
    if (!prompt.trim()) return;
    clearResult();
    const [width, height] = draftSize.split("x").map(Number);
    const svg = createVisualDraftSvg(prompt, width, height, draftStyle);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    setResult({ url: URL.createObjectURL(blob), blob, width, height, filename: "bytequant-visual-draft.svg" }); setStatus("ready");
  }
  function download() {
    if (!result) return;
    const anchor = document.createElement("a"); anchor.href = result.url; anchor.download = result.filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  }
  function openWorkflow() {
    const sizeLabel = settings.width && settings.height ? `${settings.width} × ${settings.height}` : c.originalSize;
    const formatLabel = outputMime === "image/jpeg" ? "JPG" : outputMime.split("/")[1].toUpperCase();
    const input = mode === "create"
      ? `${c.workflowDraft}\n${c.planned}: SVG · ${draftSize}\n${prompt.trim().slice(0, 120)}`
      : `${c.workflowReselect}\n${c.planned}: ${formatLabel} · ${sizeLabel}`;
    try { sessionStorage.setItem(WORKSPACE_TOOL_START_KEY, JSON.stringify({ version: 1, toolSlug: "gorsel-format-donusturucu", input, locale, createdAt: Date.now() })); } catch { /* Workstation still opens without the optional recipe */ }
    window.location.assign(pathFor(locale, "workstation"));
  }

  const slider = (key: "brightness" | "contrast" | "saturation" | "blur", label: string, min: number, max: number) => <label className="agent-visual-slider"><span>{label}<b>{settings[key]}{key === "blur" ? " px" : "%"}</b></span><input type="range" min={min} max={max} value={settings[key]} onChange={(event) => { setSetting(key, Number(event.target.value)); clearResult(); }} /></label>;

  return <section className={`agent-visual-studio${embedded ? " is-embedded" : ""}`} aria-labelledby="agent-visual-title">
    <header><div><span className="kicker">BYTEQUANT VISUAL · ON-DEVICE</span><h2 id="agent-visual-title">{mode === "edit" ? c.editTitle : c.createTitle}</h2><p>{mode === "edit" ? c.editText : c.createText}</p></div><div className="agent-visual-header-actions"><div className="agent-visual-tabs" role="tablist" aria-label={c.modeLabel}><button type="button" role="tab" aria-selected={mode === "edit"} onClick={() => { setMode("edit"); clearResult(); }}>{c.edit}</button><button type="button" role="tab" aria-selected={mode === "create"} onClick={() => { setMode("create"); clearResult(); }}>{c.create}</button></div>{onClose && <button className="agent-visual-close" type="button" onClick={onClose} aria-label={locale === "tr" ? "Stüdyoyu kapat" : locale === "de" ? "Bildstudio schließen" : locale === "zh" ? "关闭视觉工作室" : "Close Visual Studio"}>×</button>}</div></header>
    {mode === "edit" ? <div className="agent-visual-layout"><div className="agent-visual-controls">
      <label className="agent-visual-upload"><span aria-hidden="true">＋</span><strong>{c.upload}</strong><small>{file ? `${file.name} · ${formatSize(file.size)}` : c.limit}</small><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} /></label>
      <label className="field-label"><span>{c.editTitle}</span><textarea rows={3} value={command} placeholder={c.command} onChange={(event) => setCommand(event.target.value)} /></label><button type="button" className="secondary-button agent-visual-interpret" disabled={!command.trim()} onClick={interpretCommand}>✦ {c.understand}</button>{commandNote && <p className="agent-visual-command-note" role="status">{commandNote}</p>}
      <div className="agent-visual-sliders">{slider("brightness", c.brightness, -80, 80)}{slider("contrast", c.contrast, -80, 80)}{slider("saturation", c.saturation, -100, 100)}{slider("blur", c.blur, 0, 20)}</div>
      <div className="agent-visual-toggles"><button type="button" aria-pressed={settings.grayscale} onClick={() => { setSetting("grayscale", !settings.grayscale); clearResult(); }}>{c.grayscale}</button><button type="button" onClick={() => { setSetting("rotation", ((settings.rotation + 90) % 360) as VisualSettings["rotation"]); clearResult(); }}>{c.rotate} · {settings.rotation}°</button><button type="button" aria-pressed={settings.flipX} onClick={() => { setSetting("flipX", !settings.flipX); clearResult(); }}>{c.flipX}</button><button type="button" aria-pressed={settings.flipY} onClick={() => { setSetting("flipY", !settings.flipY); clearResult(); }}>{c.flipY}</button></div>
      <div className="agent-visual-fields"><label><span>{c.width}</span><input type="number" min="1" max="8192" value={settings.width ?? ""} placeholder="auto" onChange={(event) => { setSetting("width", event.target.value ? Number(event.target.value) : null); clearResult(); }} /></label><label><span>{c.height}</span><input type="number" min="1" max="8192" value={settings.height ?? ""} placeholder="auto" onChange={(event) => { setSetting("height", event.target.value ? Number(event.target.value) : null); clearResult(); }} /></label><label><span>{c.format}</span><select value={outputMime} onChange={(event) => { setOutputMime(event.target.value as VisualOutputMime); clearResult(); }}><option value="image/webp">WebP</option><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></label><label><span>{c.quality} · {quality}</span><input type="range" min="40" max="100" value={quality} disabled={outputMime === "image/png"} onChange={(event) => { setQuality(Number(event.target.value)); clearResult(); }} /></label></div>
      <div className="agent-visual-primary-actions"><button className="primary-button" type="button" disabled={!file || status === "processing"} onClick={() => void processImage()}>{status === "processing" ? c.processing : c.process}</button><button type="button" onClick={() => { setSettings(DEFAULT_VISUAL_SETTINGS); setCommand(""); setCommandNote(""); clearResult(); }}>{c.reset}</button></div>
    </div><div className="agent-visual-preview"><div className="agent-visual-before-after"><figure><figcaption>{c.before}</figcaption>{originalUrl ? <img src={originalUrl} alt={c.before} /> : <div><span aria-hidden="true">◫</span>{c.upload}</div>}</figure><figure><figcaption>{c.after}</figcaption>{result ? <img src={result.url} alt={c.after} /> : <div><span aria-hidden="true">✦</span>{status === "processing" ? c.processing : c.empty}</div>}</figure></div>{error && <p className="error-block" role="alert">{error}</p>}{result && <div className="agent-visual-result-bar"><span><strong>✓ {c.ready}</strong><small>{resultMeta}</small></span><button type="button" onClick={download}>{c.download} ↓</button></div>}</div></div> : <div className="agent-visual-create"><div className="agent-visual-controls"><label className="field-label"><span>{c.prompt}</span><textarea rows={5} value={prompt} placeholder={c.prompt} maxLength={120} onChange={(event) => { setPrompt(event.target.value); clearResult(); }} /></label><div className="agent-visual-fields"><label><span>{c.style}</span><select value={draftStyle} onChange={(event) => { setDraftStyle(event.target.value as typeof draftStyle); clearResult(); }}><option value="soft">{c.soft}</option><option value="bold">{c.bold}</option><option value="mono">{c.mono}</option></select></label><label><span>{c.size}</span><select value={draftSize} onChange={(event) => { setDraftSize(event.target.value); clearResult(); }}><option value="1200x630">1200 × 630 · Social</option><option value="1080x1080">1080 × 1080 · Square</option><option value="1080x1350">1080 × 1350 · Portrait</option><option value="1920x1080">1920 × 1080 · Wide</option></select></label></div><button type="button" className="primary-button" disabled={!prompt.trim()} onClick={generateDraft}>✦ {c.generate}</button><p className="agent-visual-boundary">ⓘ {c.honest}</p></div><div className="agent-visual-preview agent-visual-draft-preview">{result ? <img src={result.url} alt={prompt} /> : <div><span aria-hidden="true">✦</span>{c.draftEmpty}</div>}{result && <div className="agent-visual-result-bar"><span><strong>✓ {c.ready}</strong><small>{resultMeta}</small></span><button type="button" onClick={download}>{c.download} ↓</button></div>}</div></div>}
    <footer><p><span aria-hidden="true">●</span>{c.privacy}</p><nav aria-label={c.related}><strong>{c.related}</strong><Link href={toolPath(locale, "gorsel-format-donusturucu")}>{c.converter}</Link><Link href={toolPath(locale, "gorsel-sikistirici")}>{c.compressor}</Link><Link href={toolPath(locale, "gorsel-boyutlandirici")}>{c.resizer}</Link><button type="button" onClick={openWorkflow}>{c.workflow}</button></nav></footer>
  </section>;
}
