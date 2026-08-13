"use client";

import { sanitizeVisualSettings, VISUAL_MAX_FILE_BYTES, VISUAL_MAX_PIXELS, type VisualOutputMime, type VisualSettings } from "./visual-studio";

export type VisualProcessResult = { blob: Blob; width: number; height: number };
const supportedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
let requestId = 0;

function validateFile(file: File) {
  if (!supportedTypes.has(file.type)) throw new Error("unsupported-image-type");
  if (file.size <= 0 || file.size > VISUAL_MAX_FILE_BYTES) throw new Error("image-file-limit");
}

async function processOnMainThread(file: File, settings: VisualSettings, outputMime: VisualOutputMime, quality: number): Promise<VisualProcessResult> {
  const bitmap = await createImageBitmap(file);
  if (bitmap.width * bitmap.height > VISUAL_MAX_PIXELS) { bitmap.close(); throw new Error("image-pixel-limit"); }
  const ratio = bitmap.width / bitmap.height;
  const width = settings.width ?? (settings.height ? Math.round(settings.height * ratio) : bitmap.width);
  const height = settings.height ?? (settings.width ? Math.round(settings.width / ratio) : bitmap.height);
  const swap = settings.rotation === 90 || settings.rotation === 270;
  const canvas = document.createElement("canvas"); canvas.width = swap ? height : width; canvas.height = swap ? width : height;
  const context = canvas.getContext("2d", { alpha: outputMime !== "image/jpeg" });
  if (!context) { bitmap.close(); throw new Error("canvas-unavailable"); }
  if (outputMime === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
  context.translate(canvas.width / 2, canvas.height / 2); context.rotate(settings.rotation * Math.PI / 180); context.scale(settings.flipX ? -1 : 1, settings.flipY ? -1 : 1);
  context.filter = `brightness(${100 + settings.brightness}%) contrast(${100 + settings.contrast}%) saturate(${100 + settings.saturation}%) grayscale(${settings.grayscale ? 100 : 0}%) blur(${settings.blur}px)`;
  context.drawImage(bitmap, -width / 2, -height / 2, width, height); bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("image-encoding-failed")), outputMime, quality));
  return { blob, width: canvas.width, height: canvas.height };
}

export async function processVisualFile(file: File, inputSettings: VisualSettings, outputMime: VisualOutputMime, quality = .86): Promise<VisualProcessResult> {
  validateFile(file);
  const settings = sanitizeVisualSettings(inputSettings);
  if (!("Worker" in window) || !("OffscreenCanvas" in window)) return processOnMainThread(file, settings, outputMime, quality);
  const worker = new Worker(new URL("../workers/visual-edit.worker.ts", import.meta.url), { type: "module", name: "bytequant-visual-editor" });
  const id = ++requestId;
  try {
    const buffer = await file.arrayBuffer();
    return await new Promise<VisualProcessResult>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("visual-processing-timeout")), 45_000);
      worker.onmessage = (event: MessageEvent<{ id: number; ok: boolean; error?: string; buffer?: ArrayBuffer; mime?: VisualOutputMime; width?: number; height?: number }>) => {
        if (event.data.id !== id) return;
        window.clearTimeout(timeout);
        if (!event.data.ok || !event.data.buffer || !event.data.mime || !event.data.width || !event.data.height) { reject(new Error(event.data.error || "visual-processing-failed")); return; }
        resolve({ blob: new Blob([event.data.buffer], { type: event.data.mime }), width: event.data.width, height: event.data.height });
      };
      worker.onerror = () => { window.clearTimeout(timeout); reject(new Error("visual-worker-failed")); };
      worker.postMessage({ id, buffer, mime: file.type, settings, outputMime, quality }, [buffer]);
    });
  } catch (error) {
    if (/worker|timeout/iu.test(error instanceof Error ? error.message : "")) return processOnMainThread(file, settings, outputMime, quality);
    throw error;
  } finally { worker.terminate(); }
}
