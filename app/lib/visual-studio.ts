import type { Locale } from "./site";

export const VISUAL_MAX_FILE_BYTES = 25 * 1024 * 1024;
export const VISUAL_MAX_PIXELS = 40_000_000;
export const VISUAL_MAX_EDGE = 8192;

export type VisualOutputMime = "image/png" | "image/jpeg" | "image/webp";
export type VisualIntentKind = "none" | "edit" | "create";
export type VisualIntent = { kind: VisualIntentKind; confidence: "none" | "medium" | "high" };
export type VisualSettings = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  width: number | null;
  height: number | null;
};

export const DEFAULT_VISUAL_SETTINGS: VisualSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grayscale: false,
  rotation: 0,
  flipX: false,
  flipY: false,
  width: null,
  height: null,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(value)));
const normalizeRotation = (value: number): VisualSettings["rotation"] => {
  const normalized = ((Math.round(value / 90) * 90) % 360 + 360) % 360;
  return (normalized === 90 || normalized === 180 || normalized === 270 ? normalized : 0);
};

const visualNouns = /(?:görsel|resim|foto(?:ğraf)?|logo|afiş|kapa(?:k|ğ)|image|picture|photo|poster|cover|graphic|bild|foto|grafik|plakat|封面|图片|图像|照片|海报|徽标)/iu;
const createVerbs = /(?:oluştur|üret|tasarla|çiz|hazırla|create|generate|design|draw|make|erstell|generier|gestalt|entwirf|zeichne|创建|生成|设计|绘制|制作)/iu;
const editVerbs = /(?:düzenle|boyutlandır|küçült|büyüt|döndür|çevir|parlak|kontrast|doygun|bulan|siyah.?beyaz|edit|resize|rotate|flip|brightness|contrast|saturat|blur|grayscale|bearbeit|skalier|dreh|spiegel|hellig|kontrast|sättig|unschär|graustuf|编辑|调整大小|缩放|旋转|翻转|亮度|对比度|饱和度|模糊|灰度)/iu;

/** Detects only explicit visual work requests; ordinary uses of "show" or "create" stay in chat. */
export function detectVisualIntent(instruction: string, hasImage = false): VisualIntent {
  const text = instruction.replace(/\s+/g, " ").trim();
  if (!text) return hasImage ? { kind: "edit", confidence: "high" } : { kind: "none", confidence: "none" };
  const mentionsVisual = visualNouns.test(text);
  if (hasImage && (mentionsVisual || editVerbs.test(text) || createVerbs.test(text))) return { kind: "edit", confidence: "high" };
  if (mentionsVisual && editVerbs.test(text)) return { kind: "edit", confidence: "high" };
  if (mentionsVisual && createVerbs.test(text)) return { kind: "create", confidence: "high" };
  if (hasImage) return { kind: "edit", confidence: "medium" };
  return { kind: "none", confidence: "none" };
}

export function sanitizeVisualSettings(value: Partial<VisualSettings>): VisualSettings {
  const finiteOr = (candidate: unknown, fallback: number) => {
    const numeric = Number(candidate);
    return Number.isFinite(numeric) ? numeric : fallback;
  };
  const width = Number(value.width);
  const height = Number(value.height);
  return {
    brightness: clamp(finiteOr(value.brightness, 0), -80, 80),
    contrast: clamp(finiteOr(value.contrast, 0), -80, 80),
    saturation: clamp(finiteOr(value.saturation, 0), -100, 100),
    blur: clamp(finiteOr(value.blur, 0), 0, 20),
    grayscale: Boolean(value.grayscale),
    rotation: normalizeRotation(Number(value.rotation ?? 0)),
    flipX: Boolean(value.flipX),
    flipY: Boolean(value.flipY),
    width: Number.isFinite(width) && width > 0 ? clamp(width, 1, VISUAL_MAX_EDGE) : null,
    height: Number.isFinite(height) && height > 0 ? clamp(height, 1, VISUAL_MAX_EDGE) : null,
  };
}

const labels = {
  tr: { brightness: "parlaklık", contrast: "kontrast", saturation: "doygunluk", blur: "bulanıklık", grayscale: "siyah-beyaz", rotation: "döndürme", flipX: "yatay çevirme", flipY: "dikey çevirme", size: "boyut" },
  en: { brightness: "brightness", contrast: "contrast", saturation: "saturation", blur: "blur", grayscale: "grayscale", rotation: "rotation", flipX: "horizontal flip", flipY: "vertical flip", size: "size" },
  de: { brightness: "Helligkeit", contrast: "Kontrast", saturation: "Sättigung", blur: "Unschärfe", grayscale: "Graustufen", rotation: "Drehung", flipX: "horizontal spiegeln", flipY: "vertikal spiegeln", size: "Größe" },
  zh: { brightness: "亮度", contrast: "对比度", saturation: "饱和度", blur: "模糊", grayscale: "灰度", rotation: "旋转", flipX: "水平翻转", flipY: "垂直翻转", size: "尺寸" },
} as const;

function readAmount(text: string, words: string[], fallback: number) {
  const group = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const direct = text.match(new RegExp(`(?:${group})[^+\\-\\d]{0,12}([+\\-]?\\d{1,3})\\s*%?`, "iu"));
  if (direct) return Number(direct[1]);
  const reverse = text.match(new RegExp(`([+\\-]?\\d{1,3})\\s*%?[^a-zA-ZÀ-ž\u4e00-\u9fff]{0,6}(?:${group})`, "iu"));
  return reverse ? Number(reverse[1]) : fallback;
}

export function parseVisualInstruction(instruction: string, current: VisualSettings = DEFAULT_VISUAL_SETTINGS, locale: Locale = "tr") {
  const text = instruction.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : locale);
  const next: Partial<VisualSettings> = { ...current };
  const changed: Array<keyof VisualSettings> = [];
  const update = <K extends keyof VisualSettings>(key: K, value: VisualSettings[K]) => { next[key] = value; if (!changed.includes(key)) changed.push(key); };
  const dimensions = text.match(/(?:^|\D)(\d{2,4})\s*[x×]\s*(\d{2,4})(?:\D|$)/u);
  if (dimensions) { update("width", Number(dimensions[1])); update("height", Number(dimensions[2])); }
  if (/(siyah.?beyaz|gri ton|grayscale|black.?and.?white|graustufen|schwarz.?wei[ßs]|灰度|黑白)/iu.test(text)) update("grayscale", true);
  if (/(rengi geri|renkli yap|remove grayscale|color again|farbe zurück|彩色)/iu.test(text)) update("grayscale", false);
  if (/(parlak|brightness|hellig|亮度)/iu.test(text)) update("brightness", readAmount(text, ["parlaklık", "parlak", "brightness", "helligkeit", "heller", "亮度"], /(koyu|dark|dunkler|暗)/iu.test(text) ? -18 : 18));
  if (/(kontrast|contrast|对比度)/iu.test(text)) update("contrast", readAmount(text, ["kontrast", "contrast", "对比度"], 18));
  if (/(doygun|saturation|sättig|饱和度)/iu.test(text)) update("saturation", readAmount(text, ["doygunluk", "doygun", "saturation", "sättigung", "饱和度"], /(azalt|reduce|weniger|降低)/iu.test(text) ? -20 : 20));
  if (/(bulan|blur|unschär|模糊)/iu.test(text)) update("blur", readAmount(text, ["bulanıklık", "bulanık", "blur", "unschärfe", "模糊"], 4));
  if (/(sağa döndür|rotate right|rechts drehen|向右旋转)/iu.test(text)) update("rotation", normalizeRotation(current.rotation + 90));
  else if (/(sola döndür|rotate left|links drehen|向左旋转)/iu.test(text)) update("rotation", normalizeRotation(current.rotation - 90));
  else {
    const rotation = text.match(/(?:döndür|rotate|drehen|旋转)[^\d-]{0,8}(-?\d{1,3})/iu);
    if (rotation) update("rotation", normalizeRotation(Number(rotation[1])));
  }
  if (/(yatay (?:çevir|yansıt)|flip horizontal|horizontal spiegel|水平翻转)/iu.test(text)) update("flipX", !current.flipX);
  if (/(dikey (?:çevir|yansıt)|flip vertical|vertikal spiegel|垂直翻转)/iu.test(text)) update("flipY", !current.flipY);
  const outputMime: VisualOutputMime | undefined = /(?:\bwebp\b)/iu.test(text) ? "image/webp" : /(?:\b(?:jpg|jpeg)\b)/iu.test(text) ? "image/jpeg" : /(?:\bpng\b)/iu.test(text) ? "image/png" : undefined;
  const qualityMatch = text.match(/(?:kalite|quality|qualität|质量)[^\d]{0,8}(\d{2,3})/iu);
  const quality = qualityMatch ? clamp(Number(qualityMatch[1]), 40, 100) : undefined;
  const sanitized = sanitizeVisualSettings(next);
  const names = labels[locale];
  const summary = changed.length ? changed.map((key) => {
    if (key === "width" || key === "height") return names.size;
    return names[key];
  }).filter((item, index, all) => all.indexOf(item) === index).join(" · ") : "";
  return { settings: sanitized, changed, summary, outputMime, quality };
}

function hashPrompt(value: string) {
  let hash = 2166136261;
  for (const character of value) { hash ^= character.codePointAt(0) ?? 0; hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[character] ?? character));

export function createVisualDraftSvg(prompt: string, width = 1200, height = 630, style: "soft" | "bold" | "mono" = "soft") {
  const safeWidth = clamp(width, 320, 2400);
  const safeHeight = clamp(height, 320, 2400);
  const cleanPrompt = prompt.replace(/\s+/g, " ").trim().slice(0, 120) || "ByteQuant visual draft";
  const hash = hashPrompt(cleanPrompt);
  const hue = hash % 360;
  const secondHue = (hue + 48 + (hash % 72)) % 360;
  const chroma = style === "mono" ? 0 : style === "bold" ? 86 : 68;
  const light = style === "bold" ? 48 : 58;
  const title = escapeXml(cleanPrompt);
  const words = cleanPrompt.split(" ");
  const lines = [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")].filter(Boolean).map(escapeXml);
  const seedA = 18 + (hash % 44);
  const seedB = 24 + ((hash >>> 8) % 52);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">Prompt-based abstract vector draft created locally by ByteQuant.</desc><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} ${chroma}% ${light}%)"/><stop offset="1" stop-color="hsl(${secondHue} ${chroma}% ${Math.max(28, light - 18)}%)"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="${Math.round(safeWidth / 55)}"/></filter></defs><rect width="100%" height="100%" rx="${Math.round(safeWidth / 28)}" fill="#0c111b"/><circle cx="${seedA}%" cy="${seedB}%" r="${Math.round(safeWidth / 4.2)}" fill="url(#bg)" opacity=".96" filter="url(#blur)"/><circle cx="${100 - seedB}%" cy="${100 - seedA}%" r="${Math.round(safeWidth / 5.5)}" fill="hsl(${secondHue} ${chroma}% ${light}%)" opacity=".62" filter="url(#blur)"/><path d="M0 ${Math.round(safeHeight * .76)} C ${Math.round(safeWidth * .28)} ${Math.round(safeHeight * .52)}, ${Math.round(safeWidth * .62)} ${Math.round(safeHeight * .96)}, ${safeWidth} ${Math.round(safeHeight * .64)} V ${safeHeight} H0Z" fill="rgba(8,13,23,.62)"/><g fill="#fff" font-family="system-ui,-apple-system,Segoe UI,sans-serif"><text x="${Math.round(safeWidth * .08)}" y="${Math.round(safeHeight * .70)}" font-size="${Math.round(safeWidth / 24)}" font-weight="750">${lines[0] ?? ""}</text>${lines[1] ? `<text x="${Math.round(safeWidth * .08)}" y="${Math.round(safeHeight * .79)}" font-size="${Math.round(safeWidth / 24)}" font-weight="750">${lines[1]}</text>` : ""}<text x="${Math.round(safeWidth * .08)}" y="${Math.round(safeHeight * .90)}" font-size="${Math.round(safeWidth / 58)}" opacity=".72" letter-spacing="2">BYTEQUANT · LOCAL VISUAL DRAFT</text></g></svg>`;
}
