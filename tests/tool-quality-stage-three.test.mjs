import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("routes JSON and CSV conversion through the loss-prevention contract", async () => {
  const workbench = await read("../app/components/ToolWorkbench.tsx");
  assert.match(workbench, /import \{ csvToJson, jsonToCsv, parseCsv, detectCsvDelimiter \}/);
  assert.match(workbench, /const converted = csvToJson\(input, locale\)/);
  assert.match(workbench, /const converted = jsonToCsv\(input, locale\)/);
  assert.match(workbench, /protectedFormulaCells/);
  assert.doesNotMatch(workbench, /Object\.fromEntries\(headers\.map\(\(header, index\) => \[header, row\[index\]/);
});

test("links high-intent pages to a uniquely addressable worked example", async () => {
  const [page, review] = await Promise.all([
    read("../app/components/ToolPage.tsx"),
    read("../app/components/ToolEditorialReview.tsx"),
  ]);
  assert.match(page, /deepDive \? <a href="#worked-example">/);
  assert.match(page, /deepDive\.fixture\[locale\]/);
  assert.match(page, /deepDive\.evidence\[locale\]/);
  assert.match(page, /deepDive\.failure\[locale\]/);
  assert.match(review, /id="worked-example"/);
});
