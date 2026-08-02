import { readFile } from "node:fs/promises";
import ts from "typescript";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !specifier.match(/\.[a-z]+$/i)) {
      try {
        return await nextResolve(`${specifier}.ts`, context);
      } catch (typescriptError) {
        if (typescriptError?.code === "ERR_MODULE_NOT_FOUND") return nextResolve(`${specifier}.tsx`, context);
        throw typescriptError;
      }
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".tsx")) return nextLoad(url, context);
  const source = await readFile(new URL(url), "utf8");
  const result = ts.transpileModule(source, {
    fileName: new URL(url).pathname,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return { format: "module", source: result.outputText, shortCircuit: true };
}
