import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");

test("the shared shell applies the final design system to every page family", async () => {
  const [shell, styles] = await Promise.all([
    read("app/components/SiteShell.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(shell, /site-shell experience-v2 experience-v3/);
  assert.match(styles, /Experience 8\.0 · unified, accessible product surfaces/);
  assert.match(styles, /--control-height:46px/);
  assert.match(styles, /\.experience-v3 small\{font-size:12px!important/);
  assert.match(styles, /:where\(button,input,textarea,select,a,summary\):focus-visible/);
  assert.match(styles, /\.community-global-post>footer button[^}]+min-height:44px/);
  assert.match(styles, /\.tool-answer-card dl\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.workstation-app\{overflow:hidden;border-radius:26px/);
});

test("responsive product surfaces keep a single-column mobile reading path", async () => {
  const styles = await read("app/globals.css");
  const finalLayer = styles.slice(styles.indexOf("Experience 8.0"));

  assert.match(finalLayer, /@media\(max-width:760px\)/);
  assert.match(finalLayer, /\.community-social-layout\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(finalLayer, /\.tool-answer-card dl\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(finalLayer, /\.info-section-nav>\.container\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(finalLayer, /\.workstation-hero\{min-height:auto;padding-block:64px\}/);
});
