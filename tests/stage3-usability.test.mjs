import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { frontierDemos, frontierGuidedInputKind, localizeFrontierError, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";

test("replaces delimiter-only entry with guided forms where the contract is structured", () => {
  const counts = { "key-value": 0, rows: 0, raw: 0 };
  for (const slug of frontierToolSlugs) counts[frontierGuidedInputKind(slug)] += 1;
  assert.deepEqual(counts, { "key-value": 20, rows: 12, raw: 43 });
});

test("keeps guided frontier inputs connected to the Local Agent and accessible recovery", async () => {
  const source = await readFile(new URL("../app/components/FrontierWorkbenches.tsx", import.meta.url), "utf8");
  assert.match(source, /data-guided-input=/);
  assert.match(source, /data-agent-input data-agent-key="input"/);
  assert.match(source, /aria-errormessage=/);
  assert.match(source, /data-workbench-quality="stage-3"/);
  assert.match(source, /GuidedFrontierInput/);
});

test("runs every frontier demo after the guided-input upgrade", async () => {
  for (const slug of frontierToolSlugs) {
    const demo = frontierDemos[slug];
    assert.ok(demo?.input.trim(), slug);
    const result = await runFrontierTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", "tr");
    assert.ok(result.output.trim(), `${slug}: empty output`);
    assert.ok(result.metrics?.length, `${slug}: missing metrics`);
  }
});

test("publishes localized actionable input recovery", () => {
  for (const locale of ["tr", "en", "de", "zh"]) {
    assert.ok(localizeFrontierError(new Error("Expected key=value: broken"), locale).length >= 24);
    assert.ok(localizeFrontierError(new Error("Invalid JSON"), locale).length >= 24);
  }
});

test("keeps guided editors responsive and visible without clipping controls", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.frontier-guided-fields/);
  assert.match(css, /\.frontier-row-editor/);
  assert.match(css, /@media\(max-width:680px\)[\s\S]*\.frontier-editable-row/);
  assert.match(css, /overflow-wrap:anywhere/);
});
