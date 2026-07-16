import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function patchDirectory(directory, language) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return patchDirectory(path, language);
    if (!entry.isFile() || !entry.name.endsWith(".html")) return;

    const html = await readFile(path, "utf8");
    const localized = html.replace('<html lang="tr"', `<html lang="${language}"`);
    if (localized !== html) await writeFile(path, localized, "utf8");
  }));
}

for (const [folder, language] of [["en", "en"], ["de", "de"], ["zh", "zh-CN"]]) {
  await patchDirectory(fileURLToPath(new URL(`../out/${folder}/`, import.meta.url)), language);
}
