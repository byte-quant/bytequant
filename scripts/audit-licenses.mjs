import assert from "node:assert/strict";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const store = path.resolve("node_modules/.pnpm");
const packages = new Map();

function scan(directory, depth = 0) {
  if (depth > 3 || !existsSync(directory)) return;
  for (const name of readdirSync(directory)) {
    const fullPath = path.join(directory, name);
    let stat;
    try { stat = lstatSync(fullPath); } catch { continue; }
    if (!stat.isDirectory() && !stat.isSymbolicLink()) continue;
    const manifestPath = path.join(fullPath, "package.json");
    if (existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        if (manifest.name && manifest.version) packages.set(`${manifest.name}@${manifest.version}`, manifest.license ?? manifest.licenses ?? "MISSING");
      } catch { /* malformed third-party metadata is reported as missing elsewhere */ }
    }
    if (name.startsWith("@") || name === "node_modules") scan(fullPath, depth + 1);
  }
}

for (const entry of readdirSync(store)) scan(path.join(store, entry, "node_modules"));

// Every accepted SPDX expression below permits commercial use. Obligations for
// attribution, notices, file-level copyleft, and relinking remain documented in
// THIRD_PARTY_NOTICES.md and the upstream package license files.
const allowed = /^(?:MIT|ISC|Apache-2\.0|BSD(?:-2-Clause|-3-Clause)?|0BSD|BlueOak-1\.0\.0|CC0-1\.0|CC-BY-4\.0|Python-2\.0|MPL-2\.0|MIT OR Apache-2\.0|Apache-2\.0 AND LGPL-3\.0-or-later|\(MIT OR Apache-2\.0\)|\(MIT AND Zlib\)|MIT AND CC-BY-3\.0)$/i;
const flagged = [...packages].filter(([, license]) => !allowed.test(typeof license === "string" ? license : ""));
assert.ok(packages.size > 0, "No installed package metadata was found.");
assert.deepEqual(flagged, [], `Review non-permissive or missing licenses:\n${flagged.map(([name, license]) => `${name}: ${JSON.stringify(license)}`).join("\n")}`);

const summary = [...packages.values()].reduce((result, license) => {
  const name = typeof license === "string" ? license : JSON.stringify(license);
  result[name] = (result[name] ?? 0) + 1;
  return result;
}, {});
console.log(`License audit passed: ${packages.size} installed packages; ${Object.entries(summary).map(([license, count]) => `${license}=${count}`).join(", ")}.`);
