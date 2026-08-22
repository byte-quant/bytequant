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
  assert.match(styles, /Release 4\.9 · final visual integrity/);
  assert.match(styles, /Release 6\.0 · unified visual, responsive, accessibility, and readability system/);
  assert.match(styles, /--bq-design-release:6/);
  assert.match(styles, /--bq-section-space:clamp\(68px,8vw,112px\)/);
  assert.match(styles, /@media\(prefers-contrast:more\)/);
  assert.match(styles, /@media\(forced-colors:active\)/);
  assert.match(styles, /font-size:16px\}\s*\.experience-v3 :where\(\.workbench-actions/);
  assert.match(styles, /\.workspace-journey>\*\{min-width:0\}/);
  assert.match(styles, /\.community-identity-card,\.experience-v3 \.community-identity-card>\*\{min-width:0\}/);
  assert.match(styles, /\.hero-product \.floating-note\{right:4px;bottom:-12px/);
  assert.match(styles, /\.install-icon i\{right:0;bottom:0\}/);
  assert.match(styles, /\.workstation-feature-grid li\{min-width:0;overflow:hidden\}/);
});

test("responsive product surfaces keep a single-column mobile reading path", async () => {
  const styles = await read("app/globals.css");
  const finalLayer = styles.slice(styles.indexOf("Experience 8.0"));

  assert.match(finalLayer, /@media\(max-width:760px\)/);
  assert.match(finalLayer, /\.community-social-layout\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(finalLayer, /\.tool-answer-card dl\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(finalLayer, /\.info-section-nav>\.container\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(finalLayer, /\.workstation-hero\{min-height:auto;padding-block:64px\}/);
  assert.match(finalLayer, /\.workspace-journey\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(finalLayer, /\.community-social-layout\{grid-template-areas:"profile" "feed" "aside"\}/);
  assert.match(finalLayer, /\.workbench-grid,\s*\.experience-v3 :where\(\.frontier-workbench-grid/);
  assert.match(finalLayer, /\.tool-transfer-control>\*\{width:100%\}/);
});

test("CI blocks missing styles and social metadata regressions across generated pages", async () => {
  const [workflow, packageJson, audit] = await Promise.all([
    read(".github/workflows/deploy.yml"),
    read("package.json"),
    read("scripts/audit-experience-integrity.mjs"),
  ]);
  assert.match(workflow, /pnpm audit:experience/);
  assert.match(packageJson, /"audit:experience": "node scripts\/audit-experience-integrity\.mjs"/);
  assert.match(audit, /Open Graph URL does not match the canonical/);
  assert.match(audit, /Stylesheet asset is missing/);
  assert.match(audit, /Final design system is not applied/);
});
