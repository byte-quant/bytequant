import assert from "node:assert/strict";
import test from "node:test";

import { csvToJson, detectCsvDelimiter, jsonToCsv, parseCsv } from "../app/lib/csv-conversion.ts";

test("CSV conversion handles BOM, semicolons, escaped quotes, and quoted newlines", () => {
  const input = '\uFEFFname;note\r\nAda;"line one\nline two"\r\nLin;"said ""hello"""';
  assert.equal(detectCsvDelimiter(input), ";");
  assert.deepEqual(parseCsv(input, "en"), [
    ["name", "note"],
    ["Ada", "line one\nline two"],
    ["Lin", 'said "hello"'],
  ]);
  const converted = csvToJson(input, "en");
  assert.equal(converted.records, 2);
  assert.equal(converted.columns, 2);
  assert.deepEqual(JSON.parse(converted.output), [
    { name: "Ada", note: "line one\nline two" },
    { name: "Lin", note: 'said "hello"' },
  ]);
});

test("CSV to JSON rejects blank, duplicate, and irregular fields before data loss", () => {
  assert.throws(() => csvToJson("name,,role\nAda,x,Editor", "en"), /Column 2 has no header/);
  assert.throws(() => csvToJson("name,Name\nAda,Lin", "en"), /duplicated/);
  assert.throws(() => csvToJson("name,role\nAda\nLin,Editor", "en"), /Row 2 has 1 fields/);
  assert.throws(() => parseCsv('name,note\nAda,"open', "en"), /unclosed quoted field/);
});

test("JSON to CSV requires flat records and neutralizes spreadsheet formulas", () => {
  assert.throws(() => jsonToCsv('[{"name":"Ada","meta":{"role":"Editor"}}]', "en"), /contains nested data/);
  assert.throws(() => jsonToCsv("[]", "en"), /at least one flat object/);
  const converted = jsonToCsv('[{"name":"Ada","note":"=HYPERLINK(\\"https://example.test\\")","score":-7}]', "en");
  assert.equal(converted.records, 1);
  assert.equal(converted.columns, 3);
  assert.equal(converted.protectedFormulaCells, 1);
  assert.match(converted.output, /"'=HYPERLINK\(""https:\/\/example\.test""\)"/);
  assert.match(converted.output, /,-7$/m);
});
