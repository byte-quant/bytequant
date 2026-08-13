import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("tool pages expose visible answer-first content that matches richer structured data", async () => {
  const source = await read("app/components/ToolPage.tsx");
  assert.match(source, /"@type": "WebPage"/);
  assert.match(source, /mainEntity: \{ "@id": `\$\{pageUrl\}#application` \}/);
  assert.match(source, /mainEntityOfPage: \{ "@id": `\$\{pageUrl\}#page` \}/);
  assert.match(source, /className="container tool-answer-card"/);
  assert.match(source, /id="tool-workbench"/);
  assert.match(source, /id="how-to"/);
  assert.match(source, /id="tool-faq"/);
  assert.match(source, /Input.*Output.*Verification/s);
});

test("home discovery schema stays useful without serializing the full catalog twice", async () => {
  const [source, library] = await Promise.all([read("app/components/HomePage.tsx"), read("app/components/ToolLibraryPage.tsx")]);
  assert.match(source, /"@type": "CollectionPage"/);
  assert.match(source, /"@type": "ItemList"/);
  assert.match(source, /"@type": "FAQPage"/);
  assert.match(source, /numberOfItems: featuredTools\.length/);
  assert.match(library, /numberOfItems: publicTools\.length/);
  assert.doesNotMatch(source, /featureList:[^\n]+\.\.\.tools\.map/);
});

test("review dates are synchronized across sitemap, visible tools, and schema", async () => {
  const [review, sitemap, toolPage, experience] = await Promise.all([
    read("app/lib/content-review.ts"),
    read("app/sitemap.ts"),
    read("app/components/ToolPage.tsx"),
    read("app/components/ToolExperience.tsx"),
  ]);
  assert.match(review, /CONTENT_REVIEW_DATE = "2026-08-11"/);
  assert.match(sitemap, /CONTENT_REVIEW_DATE_TIME/);
  assert.match(toolPage, /schemaDate\(CONTENT_REVIEW_DATE\)/);
  assert.match(experience, /dateTime=\{CONTENT_REVIEW_DATE\}/);
});

test("progressive Three.js scene adapts by page and pauses in hidden tabs", async () => {
  const [scene, styles] = await Promise.all([
    read("app/components/AmbientScene.tsx"),
    read("app/globals.css"),
  ]);
  for (const mode of ["tools", "agent", "workstation", "community", "updates", "editorial"]) assert.match(scene, new RegExp(`${mode}:`));
  assert.match(scene, /document\.addEventListener\("visibilitychange"/);
  assert.match(scene, /document\.removeEventListener\("visibilitychange"/);
  assert.match(scene, /canvas\.dataset\.scene = mode/);
  assert.match(styles, /Release 4\.8: answer-first tool pages/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});

test("llms discovery file states canonical, locale, and claim boundaries", async () => {
  const source = await read("public/llms.txt");
  assert.match(source, /Last editorial and interface review: 2026-08-13/);
  assert.match(source, /Authoritative discovery and citation rules/);
  assert.match(source, /Canonical HTML is the source of truth/);
  assert.match(source, /does not assert ratings/);
});
