/* eslint-disable @next/next/no-img-element -- Blob URL previews cannot use Next Image static optimization. */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "../lib/site";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";

const MAX_IMAGE_BYTES = 25_000_000;
const MAX_PDF_BYTES = 50_000_000;
const MAX_PIXELS = 40_000_000;

type PdfLib = typeof import("pdf-lib");
type ImageMime = "image/png" | "image/jpeg" | "image/webp";
type BlobResult = { url: string; blob: Blob; filename: string };

function Frame({ locale, children, onDemo, onClear, busy = false }: { locale: Locale; children: ReactNode; onDemo: () => void | Promise<void>; onClear: () => void; busy?: boolean }) {
  const isTr = locale === "tr";
  return <section className="workbench specialized-workbench converter-workbench" aria-label={isTr ? "Dönüştürücü çalışma alanı" : "Converter workbench"}>
    <div className="workbench-bar"><span className="local-status"><i />{isTr ? "Dosyalar yalnızca etkin tarayıcı sekmesinde işlenir." : "Files are processed only in the active browser tab."}</span><div className="workbench-bar-actions"><button type="button" className="demo-button" disabled={busy} onClick={() => void onDemo()}>{isTr ? "Örnek veri yükle" : "Load example"}</button><button type="button" className="ghost-button" disabled={busy} onClick={onClear}>{isTr ? "Temizle" : "Clear"}</button></div></div>
    {children}
  </section>;
}

function useBlobResult() {
  const [result, setResultState] = useState<BlobResult | null>(null);
  const currentUrl = useRef("");
  const clearResult = () => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = "";
    setResultState(null);
  };
  const setResult = (blob: Blob, filename: string) => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const url = URL.createObjectURL(blob);
    currentUrl.current = url;
    setResultState({ url, blob, filename });
  };
  useEffect(() => () => { if (currentUrl.current) URL.revokeObjectURL(currentUrl.current); }, []);
  return { result, setResult, clearResult };
}

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function blobPart(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function downloadResult(result: BlobResult) {
  const link = document.createElement("a");
  link.href = result.url;
  link.download = result.filename;
  link.click();
}

function errorText(error: unknown, locale: Locale) {
  const isTr = locale === "tr";
  const detail = error instanceof Error ? error.message : String(error);
  if (/image too large/i.test(detail)) return isTr ? "Görsel 25 MB sınırını aşıyor. Daha küçük bir kaynak seçin." : "The image exceeds the 25 MB limit. Choose a smaller source.";
  if (/dimensions|40 megapixel/i.test(detail)) return isTr ? "Görselin çözünürlüğü 40 megapiksel güvenlik sınırını aşıyor veya boyut bilgisi okunamıyor." : "The image exceeds the 40-megapixel safety limit or its dimensions cannot be read.";
  if (/canvas unavailable|encoding failed/i.test(detail)) return isTr ? "Tarayıcı bu görsel biçimi için gerekli Canvas kodlayıcısını sunmuyor. Güncel bir tarayıcıda PNG/JPG çıktısını deneyin." : "The browser does not provide the Canvas encoder needed for this format. Try PNG/JPG output in a current browser.";
  if (/encrypted/i.test(detail)) return isTr ? "Şifreli PDF açılamadı. ByteQuant parola istemez veya şifre korumasını aşmaz; dosyanın kilidini yetkili uygulamada kaldırıp yeniden deneyin." : "The encrypted PDF could not be opened. ByteQuant does not request passwords or bypass protection; unlock an authorized copy in its source application and try again.";
  if (/invalid|parse|header|pdf/i.test(detail)) return isTr ? "Dosya geçerli veya desteklenen bir PDF/görsel olarak okunamadı. Dosyanın bozuk olmadığını ve doğru uzantıyı kullandığını kontrol edin." : "The file could not be read as a valid supported PDF or image. Check that it is not corrupted and uses the correct extension.";
  return isTr ? `İşlem tamamlanamadı: ${detail}` : `The operation could not be completed: ${detail}`;
}

function FilePicker({ locale, files, accept, multiple, onFiles, hint }: { locale: Locale; files: File[]; accept: string; multiple?: boolean; onFiles: (files: File[]) => void; hint: string }) {
  const isTr = locale === "tr";
  return <div className="converter-picker"><label><input type="file" accept={accept} multiple={multiple} onChange={(event) => onFiles(Array.from(event.target.files ?? []))} /><span>＋</span><strong>{isTr ? "Dosya seçin" : "Choose files"}</strong><small>{hint}</small></label>{files.length > 0 && <ul className="file-queue">{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`}><span><strong>{file.name}</strong><small>{sizeLabel(file.size)}</small></span><button type="button" onClick={() => onFiles(files.filter((_, fileIndex) => fileIndex !== index))} aria-label={isTr ? `${file.name} dosyasını kaldır` : `Remove ${file.name}`}>×</button></li>)}</ul>}</div>;
}

function ResultPanel({ locale, result, children, preview }: { locale: Locale; result: BlobResult | null; children?: ReactNode; preview?: boolean }) {
  const isTr = locale === "tr";
  return <section className="converter-result"><div className="result-header"><span>{isTr ? "Yerel çıktı" : "Local output"}</span><div className="output-actions"><button type="button" disabled={!result} onClick={() => result && downloadResult(result)}>{isTr ? "İndir" : "Download"}</button></div></div>{result ? <>{preview && <img src={result.url} alt={isTr ? "Dönüştürülen görsel önizlemesi" : "Converted image preview"} />}<dl className="converter-summary"><div><dt>{isTr ? "Dosya" : "File"}</dt><dd>{result.filename}</dd></div><div><dt>{isTr ? "Boyut" : "Size"}</dt><dd>{sizeLabel(result.blob.size)}</dd></div></dl>{children}</> : <div className="empty-result">{isTr ? "Çıktı, işlem tamamlandığında burada görünür." : "The output appears here after processing."}</div>}</section>;
}

async function loadImage(file: Blob) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("invalid image"));
      image.src = url;
    });
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > MAX_PIXELS) throw new Error("invalid image dimensions");
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasBlob(canvas: HTMLCanvasElement, type: ImageMime, quality: number) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image encoding failed")), type, quality));
}

async function convertImage(file: File, type: ImageMime, quality: number, maxDimension?: number) {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("image too large");
  const image = await loadImage(file);
  const scale = maxDimension ? Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight)) : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas unavailable");
  if (type === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height); }
  context.drawImage(image, 0, 0, width, height);
  return { blob: await canvasBlob(canvas, type, quality), width, height };
}

async function makeDemoImage(locale: Locale) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 1200, 800);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#3157ff");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1200, 800);
  context.fillStyle = "#ffffff";
  context.font = "700 76px system-ui";
  context.fillText("ByteQuant", 90, 330);
  context.font = "32px system-ui";
  context.fillText(locale === "tr" ? "Yerel dönüştürme demosu" : "Local conversion demo", 95, 395);
  const blob = await canvasBlob(canvas, "image/png", 1);
  return new File([blob], "bytequant-demo.png", { type: "image/png" });
}

async function loadPdfLib(): Promise<PdfLib> {
  return import("pdf-lib");
}

async function makeDemoPdf(locale: Locale, pages = 3, name = "bytequant-demo.pdf") {
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < pages; index += 1) {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawText("ByteQuant", { x: 64, y: 730, size: 32, font, color: rgb(0.19, 0.34, 1) });
    // StandardFonts.Helvetica uses WinAnsi, so the synthetic demo copy stays
    // ASCII-safe. User documents are copied as PDF pages and are not re-encoded.
    page.drawText(locale === "tr" ? `Yerel PDF demo - Sayfa ${index + 1}` : `Local PDF demo - Page ${index + 1}`, { x: 64, y: 680, size: 18, font });
    page.drawText(locale === "tr" ? "Yapay dosya yalnizca tarayici belleginde uretildi." : "This synthetic file was generated only in browser memory.", { x: 64, y: 640, size: 11, font });
  }
  return new File([blobPart(await pdf.save())], name, { type: "application/pdf" });
}

function validateFiles(files: File[], maxCount: number, maxBytes: number) {
  if (files.length > maxCount) throw new Error(`At most ${maxCount} files`);
  if (files.reduce((sum, file) => sum + file.size, 0) > maxBytes) throw new Error("files too large");
}

function ImageFormatWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<ImageMime>("image/webp");
  const [quality, setQuality] = useState(88);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  const { result, setResult, clearResult } = useBlobResult();
  const updateFiles = (next: File[]) => { setFiles(next.slice(0, 1)); clearResult(); setNotice(null); };
  const run = async () => {
    const file = files[0]; if (!file) return;
    setBusy(true); setNotice(null);
    try {
      const converted = await convertImage(file, type, quality / 100);
      const extension = type === "image/jpeg" ? "jpg" : type.split("/")[1];
      setResult(converted.blob, `${file.name.replace(/\.[^.]+$/, "")}.${extension}`);
      setNotice({ kind: "success", text: isTr ? `${converted.width}×${converted.height} görsel bu sekmede dönüştürüldü.` : `${converted.width}×${converted.height} image converted in this tab.` });
    } catch (error) { setNotice({ kind: "error", text: errorText(error, locale) }); }
    finally { setBusy(false); }
  };
  const clear = () => { setFiles([]); clearResult(); setNotice(null); };
  return <Frame locale={locale} busy={busy} onDemo={async () => updateFiles([await makeDemoImage(locale)])} onClear={clear}><div className="converter-grid"><section className="converter-controls"><FilePicker locale={locale} files={files} accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" onFiles={updateFiles} hint={isTr ? "PNG, JPG, WebP veya SVG · en fazla 25 MB / 40 MP" : "PNG, JPG, WebP, or SVG · max 25 MB / 40 MP"} /><div className="form-pair"><label className="field-label"><span>{isTr ? "Çıktı biçimi" : "Output format"}</span><select value={type} onChange={(event) => setType(event.target.value as ImageMime)}><option value="image/webp">WebP</option><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></label><label className="field-label"><span>{isTr ? "Kalite" : "Quality"} · {quality}%</span><input type="range" min="40" max="100" value={quality} disabled={type === "image/png"} onChange={(event) => setQuality(Number(event.target.value))} /></label></div><button className="primary-button converter-run" type="button" disabled={!files.length || busy} onClick={() => void run()}>{busy ? (isTr ? "Dönüştürülüyor…" : "Converting…") : (isTr ? "Görseli dönüştür" : "Convert image")}</button><ToolNotice notice={notice} locale={locale} /><p className="privacy-hint">{isTr ? "SVG girdisi rasterleştirilir; PNG'den SVG'ye gerçek vektörleştirme yapılmaz. JPG şeffaf alanları beyazla doldurur." : "SVG input is rasterized; this does not claim to vectorize PNG into SVG. JPG fills transparent areas with white."}</p></section><ResultPanel locale={locale} result={result} preview /></div></Frame>;
}

function ImageCompressorWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<ImageMime>("image/webp");
  const [quality, setQuality] = useState(76);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  const { result, setResult, clearResult } = useBlobResult();
  const updateFiles = (next: File[]) => { setFiles(next.slice(0, 1)); clearResult(); setNotice(null); };
  const run = async () => {
    const file = files[0]; if (!file) return;
    setBusy(true); setNotice(null);
    try {
      const converted = await convertImage(file, type, quality / 100, maxDimension);
      const extension = type === "image/jpeg" ? "jpg" : "webp";
      setResult(converted.blob, `${file.name.replace(/\.[^.]+$/, "")}-compressed.${extension}`);
      const change = Math.round((1 - converted.blob.size / file.size) * 100);
      setNotice({ kind: change >= 0 ? "success" : "info", text: change >= 0 ? (isTr ? `Dosya boyutu %${change} azaltıldı.` : `File size reduced by ${change}%.`) : (isTr ? "Bu ayarlarda çıktı kaynaktan büyük. Kaliteyi veya boyutu azaltın." : "These settings produced a larger file. Reduce quality or dimensions.") });
    } catch (error) { setNotice({ kind: "error", text: errorText(error, locale) }); }
    finally { setBusy(false); }
  };
  const clear = () => { setFiles([]); clearResult(); setNotice(null); };
  return <Frame locale={locale} busy={busy} onDemo={async () => updateFiles([await makeDemoImage(locale)])} onClear={clear}><div className="converter-grid"><section className="converter-controls"><FilePicker locale={locale} files={files} accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onFiles={updateFiles} hint={isTr ? "PNG, JPG veya WebP · en fazla 25 MB / 40 MP" : "PNG, JPG, or WebP · max 25 MB / 40 MP"} /><div className="form-pair"><label className="field-label"><span>{isTr ? "Çıktı" : "Output"}</span><select value={type} onChange={(event) => setType(event.target.value as ImageMime)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option></select></label><label className="field-label"><span>{isTr ? "En uzun kenar" : "Longest edge"}</span><select value={maxDimension} onChange={(event) => setMaxDimension(Number(event.target.value))}><option value="3840">3840 px</option><option value="2560">2560 px</option><option value="1920">1920 px</option><option value="1280">1280 px</option><option value="800">800 px</option></select></label></div><label className="field-label"><span>{isTr ? "Kalite" : "Quality"} · {quality}%</span><input type="range" min="35" max="95" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label><button className="primary-button converter-run" type="button" disabled={!files.length || busy} onClick={() => void run()}>{busy ? (isTr ? "Sıkıştırılıyor…" : "Compressing…") : (isTr ? "Görseli sıkıştır" : "Compress image")}</button><ToolNotice notice={notice} locale={locale} /></section><ResultPanel locale={locale} result={result} preview>{result && files[0] && <p className="result-comparison">{isTr ? "Önce" : "Before"}: {sizeLabel(files[0].size)} · {isTr ? "Sonra" : "After"}: {sizeLabel(result.blob.size)}</p>}</ResultPanel></div></Frame>;
}

async function imageAsPngBytes(file: File) {
  const converted = await convertImage(file, "image/png", 1);
  return new Uint8Array(await converted.blob.arrayBuffer());
}

function ImagesToPdfWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [files, setFiles] = useState<File[]>([]);
  const [pageMode, setPageMode] = useState<"a4" | "image">("a4");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  const { result, setResult, clearResult } = useBlobResult();
  const updateFiles = (next: File[]) => { try { validateFiles(next, 20, MAX_PDF_BYTES); setFiles(next); clearResult(); setNotice(null); } catch { setNotice({ kind: "error", text: isTr ? "En fazla 20 görsel ve toplam 50 MB seçebilirsiniz." : "Choose at most 20 images totaling no more than 50 MB." }); } };
  const run = async () => {
    if (!files.length) return; setBusy(true); setNotice(null);
    try {
      const { PDFDocument } = await loadPdfLib(); const pdf = await PDFDocument.create();
      for (const file of files) {
        const png = await pdf.embedPng(await imageAsPngBytes(file)); const source = png.scale(1);
        const pageSize: [number, number] = pageMode === "a4" ? (source.width > source.height ? [841.89, 595.28] : [595.28, 841.89]) : [source.width, source.height];
        const page = pdf.addPage(pageSize); const scale = Math.min((pageSize[0] - 48) / source.width, (pageSize[1] - 48) / source.height, 1);
        const width = source.width * scale; const height = source.height * scale;
        page.drawImage(png, { x: (pageSize[0] - width) / 2, y: (pageSize[1] - height) / 2, width, height });
      }
      setResult(new Blob([blobPart(await pdf.save())], { type: "application/pdf" }), "bytequant-images.pdf");
      setNotice({ kind: "success", text: isTr ? `${files.length} görsel, aynı sırayla PDF sayfalarına dönüştürüldü.` : `${files.length} images converted to PDF pages in the same order.` });
    } catch (error) { setNotice({ kind: "error", text: errorText(error, locale) }); }
    finally { setBusy(false); }
  };
  const clear = () => { setFiles([]); clearResult(); setNotice(null); };
  return <Frame locale={locale} busy={busy} onDemo={async () => { const first = await makeDemoImage(locale); const second = new File([first], "bytequant-demo-2.png", { type: first.type }); updateFiles([first, second]); }} onClear={clear}><div className="converter-grid"><section className="converter-controls"><FilePicker locale={locale} files={files} accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" multiple onFiles={updateFiles} hint={isTr ? "En fazla 20 görsel · toplam 50 MB" : "Up to 20 images · 50 MB total"} /><label className="field-label"><span>{isTr ? "Sayfa boyutu" : "Page size"}</span><select value={pageMode} onChange={(event) => setPageMode(event.target.value as typeof pageMode)}><option value="a4">A4 · {isTr ? "otomatik yön" : "automatic orientation"}</option><option value="image">{isTr ? "Görsel boyutu" : "Image dimensions"}</option></select></label><button className="primary-button converter-run" type="button" disabled={!files.length || busy} onClick={() => void run()}>{busy ? (isTr ? "PDF hazırlanıyor…" : "Building PDF…") : (isTr ? "PDF oluştur" : "Create PDF")}</button><ToolNotice notice={notice} locale={locale} /><p className="privacy-hint">{isTr ? "Görseller dosya sırasıyla sayfalara yerleştirilir. Çok büyük görseller bellek sınırına takılabilir; önce sıkıştırıcıyı kullanın." : "Images are placed on pages in file order. Very large images can exceed browser memory; use the compressor first."}</p></section><ResultPanel locale={locale} result={result} /></div></Frame>;
}

function PdfMergeWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  const { result, setResult, clearResult } = useBlobResult();
  const updateFiles = (next: File[]) => { try { validateFiles(next, 15, MAX_PDF_BYTES); setFiles(next); clearResult(); setNotice(null); } catch { setNotice({ kind: "error", text: isTr ? "En fazla 15 PDF ve toplam 50 MB seçebilirsiniz." : "Choose at most 15 PDFs totaling no more than 50 MB." }); } };
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= files.length) return; const next = [...files]; [next[index], next[target]] = [next[target], next[index]]; updateFiles(next); };
  const run = async () => {
    if (files.length < 2) return; setBusy(true); setNotice(null);
    try {
      const { PDFDocument } = await loadPdfLib(); const output = await PDFDocument.create(); let pages = 0;
      for (const file of files) { const source = await PDFDocument.load(await file.arrayBuffer()); const copied = await output.copyPages(source, source.getPageIndices()); copied.forEach((page) => output.addPage(page)); pages += copied.length; }
      setResult(new Blob([blobPart(await output.save())], { type: "application/pdf" }), "bytequant-merged.pdf");
      setNotice({ kind: "success", text: isTr ? `${files.length} PDF ve ${pages} sayfa birleştirildi.` : `${files.length} PDFs and ${pages} pages merged.` });
    } catch (error) { setNotice({ kind: "error", text: errorText(error, locale) }); }
    finally { setBusy(false); }
  };
  const clear = () => { setFiles([]); clearResult(); setNotice(null); };
  return <Frame locale={locale} busy={busy} onDemo={async () => updateFiles([await makeDemoPdf(locale, 2, "demo-a.pdf"), await makeDemoPdf(locale, 2, "demo-b.pdf")])} onClear={clear}><div className="converter-grid"><section className="converter-controls"><FilePicker locale={locale} files={files} accept=".pdf,application/pdf" multiple onFiles={updateFiles} hint={isTr ? "En fazla 15 PDF · toplam 50 MB" : "Up to 15 PDFs · 50 MB total"} />{files.length > 1 && <div className="file-order" aria-label={isTr ? "Birleştirme sırası" : "Merge order"}>{files.map((file, index) => <div key={`${file.name}-${index}`}><span>{index + 1}. {file.name}</span><span><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" disabled={index === files.length - 1} onClick={() => move(index, 1)}>↓</button></span></div>)}</div>}<button className="primary-button converter-run" type="button" disabled={files.length < 2 || busy} onClick={() => void run()}>{busy ? (isTr ? "Birleştiriliyor…" : "Merging…") : (isTr ? "PDF'leri birleştir" : "Merge PDFs")}</button><ToolNotice notice={notice} locale={locale} /><p className="privacy-hint">{isTr ? "Şifreli belgeler desteklenmez ve koruma aşılmaz. Birleştirme, görünür dosya sırasını izler; çıktı imzaları geçerli tutmayabilir." : "Encrypted documents are unsupported and protection is never bypassed. Merge order follows the visible list; existing digital signatures may not remain valid."}</p></section><ResultPanel locale={locale} result={result} /></div></Frame>;
}

function parsePageRanges(value: string, pageCount: number) {
  const pages: number[] = [];
  for (const token of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    const match = token.match(/^(\d+)(?:-(\d+))?$/); if (!match) throw new Error("invalid page range");
    const start = Number(match[1]); const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start || end > pageCount) throw new Error("invalid page range");
    for (let page = start; page <= end; page += 1) if (!pages.includes(page - 1)) pages.push(page - 1);
  }
  if (!pages.length) throw new Error("invalid page range");
  return pages;
}

function PdfSplitWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  const { result, setResult, clearResult } = useBlobResult();
  const updateFiles = async (next: File[]) => {
    const file = next[0]; setFiles(file ? [file] : []); setPageCount(0); setRange(""); clearResult(); setNotice(null); if (!file) return;
    if (file.size > MAX_PDF_BYTES) { setFiles([]); setNotice({ kind: "error", text: isTr ? "PDF en fazla 50 MB olabilir." : "The PDF can be at most 50 MB." }); return; }
    try { const { PDFDocument } = await loadPdfLib(); const pdf = await PDFDocument.load(await file.arrayBuffer()); setPageCount(pdf.getPageCount()); setRange(`1-${Math.min(2, pdf.getPageCount())}`); }
    catch (error) { setFiles([]); setNotice({ kind: "error", text: errorText(error, locale) }); }
  };
  const run = async () => {
    const file = files[0]; if (!file || !pageCount) return; setBusy(true); setNotice(null);
    try {
      const indices = parsePageRanges(range, pageCount); const { PDFDocument } = await loadPdfLib(); const source = await PDFDocument.load(await file.arrayBuffer()); const output = await PDFDocument.create(); const copied = await output.copyPages(source, indices); copied.forEach((page) => output.addPage(page));
      setResult(new Blob([blobPart(await output.save())], { type: "application/pdf" }), `${file.name.replace(/\.pdf$/i, "")}-pages.pdf`);
      setNotice({ kind: "success", text: isTr ? `${indices.length} sayfa yeni PDF'e ayrıldı.` : `${indices.length} pages extracted into a new PDF.` });
    } catch (error) { setNotice({ kind: "error", text: /page range/i.test(String(error)) ? (isTr ? `Sayfa aralığı geçerli değil. 1-${pageCount} arasında “1-3,5” biçimini kullanın.` : `Invalid page range. Use a value such as “1-3,5” within 1-${pageCount}.`) : errorText(error, locale) }); }
    finally { setBusy(false); }
  };
  const clear = () => { setFiles([]); setPageCount(0); setRange(""); clearResult(); setNotice(null); };
  return <Frame locale={locale} busy={busy} onDemo={async () => void updateFiles([await makeDemoPdf(locale, 4)])} onClear={clear}><div className="converter-grid"><section className="converter-controls"><FilePicker locale={locale} files={files} accept=".pdf,application/pdf" onFiles={(next) => void updateFiles(next)} hint={isTr ? "Tek PDF · en fazla 50 MB" : "One PDF · max 50 MB"} />{pageCount > 0 && <><div className="document-facts"><span><strong>{pageCount}</strong>{isTr ? " toplam sayfa" : " total pages"}</span></div><label className="field-label"><span>{isTr ? "Ayırılacak sayfalar" : "Pages to extract"}</span><input value={range} onChange={(event) => { setRange(event.target.value); clearResult(); }} placeholder="1-3,5" /></label></>}<button className="primary-button converter-run" type="button" disabled={!pageCount || !range || busy} onClick={() => void run()}>{busy ? (isTr ? "Sayfalar ayrılıyor…" : "Extracting pages…") : (isTr ? "Yeni PDF oluştur" : "Create extracted PDF")}</button><ToolNotice notice={notice} locale={locale} /><p className="privacy-hint">{isTr ? "Bu araç seçilen sayfaları yeni bir PDF'e kopyalar. Şifre kaldırmaz; dijital imzalar ve etkileşimli form davranışı değişebilir." : "This tool copies selected pages into a new PDF. It does not remove encryption; digital signatures and interactive forms may change."}</p></section><ResultPanel locale={locale} result={result} /></div></Frame>;
}

export function ConverterWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  if (slug === "gorsel-format-donusturucu") return <ImageFormatWorkbench locale={locale} />;
  if (slug === "gorsel-sikistirici") return <ImageCompressorWorkbench locale={locale} />;
  if (slug === "gorselden-pdf") return <ImagesToPdfWorkbench locale={locale} />;
  if (slug === "pdf-birlestirme") return <PdfMergeWorkbench locale={locale} />;
  return <PdfSplitWorkbench locale={locale} />;
}
