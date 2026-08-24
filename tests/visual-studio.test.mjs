import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createVisualDraftSvg,
  DEFAULT_VISUAL_SETTINGS,
  detectVisualIntent,
  parseVisualInstruction,
  sanitizeVisualSettings,
  VISUAL_MAX_EDGE,
  VISUAL_MAX_FILE_BYTES,
  VISUAL_MAX_PIXELS,
} from "../app/lib/visual-studio.ts";

test("visual instruction parser understands bounded edits in all four locales", () => {
  const tr = parseVisualInstruction("1200x630 yap, kontrastı 15 artır, siyah-beyaz ve sağa döndür", DEFAULT_VISUAL_SETTINGS, "tr");
  assert.equal(tr.settings.width, 1200);
  assert.equal(tr.settings.height, 630);
  assert.equal(tr.settings.contrast, 15);
  assert.equal(tr.settings.grayscale, true);
  assert.equal(tr.settings.rotation, 90);

  assert.equal(parseVisualInstruction("brightness -22 and flip horizontal", DEFAULT_VISUAL_SETTINGS, "en").settings.brightness, -22);
  assert.equal(parseVisualInstruction("Helligkeit 18 und Graustufen", DEFAULT_VISUAL_SETTINGS, "de").settings.grayscale, true);
  assert.equal(parseVisualInstruction("亮度 20，向左旋转", DEFAULT_VISUAL_SETTINGS, "zh").settings.rotation, 270);
  const exportRequest = parseVisualInstruction("1200x630, WebP, quality 82", DEFAULT_VISUAL_SETTINGS, "en");
  assert.equal(exportRequest.outputMime, "image/webp");
  assert.equal(exportRequest.quality, 82);
});

test("visual intent routing is explicit, multilingual, and does not hijack ordinary chat", () => {
  assert.deepEqual(detectVisualIntent("Bu görseli 1200x630 boyutlandır"), { kind: "edit", confidence: "high" });
  assert.equal(detectVisualIntent("1200x630 mavi teknoloji kapağı oluştur").kind, "create");
  assert.equal(detectVisualIntent("Create a privacy-first event cover").kind, "create");
  assert.equal(detectVisualIntent("Bitte dieses Bild nach rechts drehen").kind, "edit");
  assert.equal(detectVisualIntent("创建一个蓝色科技海报").kind, "create");
  assert.equal(detectVisualIntent("Create a short checklist").kind, "none");
  assert.equal(detectVisualIntent("Ben görseli PDF'e dönüştürmeni istiyorum").kind, "none");
  assert.equal(detectVisualIntent("Convert these images into one PDF", true).kind, "none");
  assert.equal(detectVisualIntent("", true).kind, "edit");
});

test("visual settings reject non-finite values and clamp expensive dimensions", () => {
  const settings = sanitizeVisualSettings({ brightness: Number.NaN, contrast: 900, blur: -5, width: 99_999, height: -2 });
  assert.equal(settings.brightness, 0);
  assert.equal(settings.contrast, 80);
  assert.equal(settings.blur, 0);
  assert.equal(settings.width, VISUAL_MAX_EDGE);
  assert.equal(settings.height, null);
  assert.equal(VISUAL_MAX_FILE_BYTES, 25 * 1024 * 1024);
  assert.equal(VISUAL_MAX_PIXELS, 40_000_000);
});

test("prompt visual drafts are deterministic, self-contained, and XML-safe", () => {
  const prompt = "Privacy <script>alert('x')</script> & blue";
  const first = createVisualDraftSvg(prompt, 1200, 630, "bold");
  const second = createVisualDraftSvg(prompt, 1200, 630, "bold");
  assert.equal(first, second);
  assert.match(first, /^<svg[^>]+width="1200"[^>]+height="630"/);
  assert.match(first, /Privacy &lt;script&gt;/);
  assert.doesNotMatch(first, /<script>|javascript:/i);
  assert.doesNotMatch(first, /(?:href|src)="https?:\/\//i);
  assert.match(first, /BYTEQUANT · LOCAL VISUAL DRAFT/);
});

test("visual studio stays lazy, worker-first, localized, and integrated with Workstation", async () => {
  const [loader, studio, worker, agentPage, agentConversation, homePage, workstation] = await Promise.all([
    readFile(new URL("../app/components/AgentVisualStudioLoader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AgentVisualStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/workers/visual-edit.worker.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AgentPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AgentConversation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HomePage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/WorkstationClient.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(loader, /lazy\(\(\) => import\("\.\/AgentVisualStudio"\)/);
  assert.match(worker, /OffscreenCanvas/);
  assert.match(studio, /WORKSPACE_TOOL_START_KEY/);
  assert.match(studio, /the image file was not moved between pages/);
  assert.doesNotMatch(studio, /const input = JSON\.stringify/);
  assert.match(studio, /tr:\s*\{|en:\s*\{|de:\s*\{|zh:\s*\{/s);
  assert.match(agentPage, /id="agent-visual"/);
  assert.match(agentConversation, /detectVisualIntent/);
  assert.match(agentConversation, /AgentVisualStudioLoader/);
  assert.match(agentConversation, /image\/png/);
  assert.match(loader, /openOnMount/);
  assert.match(studio, /initialCommand/);
  assert.match(homePage, /#agent-visual/);
  assert.match(workstation, /id: "visual"/);
  assert.match(workstation, /"gorsel-boyutlandirici", "gorsel-sikistirici", "gorsel-format-donusturucu"/);
});
