/// <reference lib="webworker" />

import { sanitizeVisualSettings, VISUAL_MAX_PIXELS, type VisualOutputMime, type VisualSettings } from "../lib/visual-studio";

type RequestMessage = { id: number; buffer: ArrayBuffer; mime: string; settings: VisualSettings; outputMime: VisualOutputMime; quality: number };
type ResponseMessage = { id: number; ok: true; buffer: ArrayBuffer; mime: VisualOutputMime; width: number; height: number } | { id: number; ok: false; error: string };

self.onmessage = async (event: MessageEvent<RequestMessage>) => {
  const { id, buffer, mime, outputMime } = event.data;
  try {
    const settings = sanitizeVisualSettings(event.data.settings);
    const bitmap = await createImageBitmap(new Blob([buffer], { type: mime }));
    if (bitmap.width * bitmap.height > VISUAL_MAX_PIXELS) { bitmap.close(); throw new Error("image-pixel-limit"); }
    const sourceRatio = bitmap.width / bitmap.height;
    let width = settings.width ?? (settings.height ? Math.round(settings.height * sourceRatio) : bitmap.width);
    let height = settings.height ?? (settings.width ? Math.round(settings.width / sourceRatio) : bitmap.height);
    width = Math.max(1, width); height = Math.max(1, height);
    const swap = settings.rotation === 90 || settings.rotation === 270;
    const canvas = new OffscreenCanvas(swap ? height : width, swap ? width : height);
    const context = canvas.getContext("2d", { alpha: outputMime !== "image/jpeg" });
    if (!context) { bitmap.close(); throw new Error("canvas-unavailable"); }
    if (outputMime === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); }
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(settings.rotation * Math.PI / 180);
    context.scale(settings.flipX ? -1 : 1, settings.flipY ? -1 : 1);
    context.filter = `brightness(${100 + settings.brightness}%) contrast(${100 + settings.contrast}%) saturate(${100 + settings.saturation}%) grayscale(${settings.grayscale ? 100 : 0}%) blur(${settings.blur}px)`;
    context.drawImage(bitmap, -width / 2, -height / 2, width, height);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: outputMime, quality: Math.max(.35, Math.min(1, event.data.quality)) });
    const resultBuffer = await blob.arrayBuffer();
    const response: ResponseMessage = { id, ok: true, buffer: resultBuffer, mime: outputMime, width: canvas.width, height: canvas.height };
    self.postMessage(response, { transfer: [resultBuffer] });
  } catch (error) {
    const response: ResponseMessage = { id, ok: false, error: error instanceof Error ? error.message : "visual-processing-failed" };
    self.postMessage(response);
  }
};

export {};
