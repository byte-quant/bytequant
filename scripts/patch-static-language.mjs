import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const englishRoot = fileURLToPath(new URL("../out/en/", import.meta.url));

async function patchDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return patchDirectory(path);
    if (!entry.isFile() || !entry.name.endsWith(".html")) return;

    const html = await readFile(path, "utf8");
    const localized = html.replace('<html lang="tr"', '<html lang="en"');
    if (localized !== html) await writeFile(path, localized, "utf8");
  }));
}

await patchDirectory(englishRoot);
