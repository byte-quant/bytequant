import type { Locale } from "./site";

type CsvConversionResult = {
  output: string;
  records: number;
  columns: number;
  delimiter: string;
  protectedFormulaCells: number;
};

const text = (locale: Locale, values: Record<Locale, string>) => values[locale];

function countUnquoted(line: string, delimiter: string) {
  let quoted = false;
  let count = 0;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (line[index] === delimiter && !quoted) count += 1;
  }
  return count;
}

export function detectCsvDelimiter(input: string) {
  const lines = input.replace(/^\uFEFF/u, "").split(/\r?\n/u).filter((line) => line.trim()).slice(0, 12);
  const candidates = [",", ";", "\t"];
  const scored = candidates.map((delimiter) => {
    const counts = lines.map((line) => countUnquoted(line, delimiter));
    const positive = counts.filter((count) => count > 0);
    const consistent = positive.length > 1 && positive.every((count) => count === positive[0]);
    return { delimiter, score: positive.reduce((sum, count) => sum + count, 0) + (consistent ? 100 : 0) };
  });
  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best?.score ? best.delimiter : ",";
}

export function parseCsv(input: string, locale: Locale, delimiter = detectCsvDelimiter(input)): string[][] {
  const source = input.replace(/^\uFEFF/u, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  let closedQuote = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { cell += '"'; index += 1; }
      else if (char === '"') { quoted = false; closedQuote = true; }
      else cell += char;
      continue;
    }
    if (closedQuote && char !== delimiter && char !== "\n" && char !== "\r") {
      throw new Error(text(locale, {
        tr: "Kapanan tırnaktan sonra yalnızca ayraç veya satır sonu kullanılabilir.",
        en: "Only a delimiter or line break may follow a closing quote.",
        de: "Nach einem schließenden Anführungszeichen ist nur ein Trennzeichen oder Zeilenumbruch zulässig.",
        zh: "结束引号后只能出现分隔符或换行。",
      }));
    }
    if (char === '"') {
      if (cell.length) throw new Error(text(locale, {
        tr: "Tırnaklı CSV alanı çift tırnakla başlamalıdır.",
        en: "A quoted CSV field must begin with a double quote.",
        de: "Ein zitiertes CSV-Feld muss mit einem doppelten Anführungszeichen beginnen.",
        zh: "带引号的 CSV 字段必须以双引号开头。",
      }));
      quoted = true;
    } else if (char === delimiter) { row.push(cell); cell = ""; closedQuote = false; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = ""; closedQuote = false;
    } else cell += char;
  }
  if (quoted) throw new Error(text(locale, {
    tr: "CSV içinde kapanmamış bir çift tırnaklı alan var.",
    en: "The CSV contains an unclosed quoted field.",
    de: "Die CSV-Datei enthält ein nicht geschlossenes Feld in Anführungszeichen.",
    zh: "CSV 中存在未闭合的带引号字段。",
  }));
  row.push(cell);
  if (row.some((value) => value.length) || rows.length === 0) rows.push(row);
  return rows;
}

function validateHeaders(rows: string[][], locale: Locale) {
  const headers = (rows[0] ?? []).map((header) => header.trim());
  if (!headers.length || headers.every((header) => !header)) throw new Error(text(locale, {
    tr: "CSV ilk satırda en az bir başlık içermelidir.", en: "The first CSV row must contain at least one header.", de: "Die erste CSV-Zeile muss mindestens einen Header enthalten.", zh: "CSV 第一行必须至少包含一个表头。",
  }));
  const blankIndex = headers.findIndex((header) => !header);
  if (blankIndex >= 0) throw new Error(text(locale, {
    tr: `${blankIndex + 1}. sütunun başlığı boş; veri kaybını önlemek için benzersiz bir ad verin.`,
    en: `Column ${blankIndex + 1} has no header; give it a unique name to prevent data loss.`,
    de: `Spalte ${blankIndex + 1} hat keinen Header; vergeben Sie einen eindeutigen Namen, um Datenverlust zu vermeiden.`,
    zh: `第 ${blankIndex + 1} 列缺少表头；请设置唯一名称以避免数据丢失。`,
  }));
  const seen = new Map<string, number>();
  for (let index = 0; index < headers.length; index += 1) {
    const key = headers[index].toLocaleLowerCase(locale === "tr" ? "tr-TR" : locale);
    if (seen.has(key)) throw new Error(text(locale, {
      tr: `“${headers[index]}” başlığı yineleniyor; JSON alanlarının üzerine yazılmaması için başlıkları benzersiz yapın.`,
      en: `The “${headers[index]}” header is duplicated; make headers unique so JSON fields are not overwritten.`,
      de: `Der Header „${headers[index]}“ ist doppelt; machen Sie Header eindeutig, damit JSON-Felder nicht überschrieben werden.`,
      zh: `表头“${headers[index]}”重复；请使用唯一表头，避免 JSON 字段被覆盖。`,
    }));
    seen.set(key, index);
  }
  if (headers.length > 500) throw new Error(text(locale, {
    tr: "CSV güvenli işlem sınırı olan 500 sütunu aşıyor.", en: "The CSV exceeds the safe limit of 500 columns.", de: "Die CSV überschreitet die sichere Grenze von 500 Spalten.", zh: "CSV 超出 500 列的安全处理上限。",
  }));
  return headers;
}

function csvEscape(value: unknown) {
  const raw = value == null ? "" : String(value);
  // Preserve ordinary negative numbers while neutralizing values that spreadsheet
  // software can interpret as formulas when the CSV is opened.
  const formulaLike = /^[\t ]*(?:[=+@]|-(?!\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?$))/u.test(raw);
  const protectedValue = formulaLike ? `'${raw}` : raw;
  return { text: /[",\r\n]/u.test(protectedValue) ? `"${protectedValue.replace(/"/g, '""')}"` : protectedValue, protected: protectedValue !== raw };
}

export function csvToJson(input: string, locale: Locale): CsvConversionResult {
  const delimiter = detectCsvDelimiter(input);
  const rows = parseCsv(input, locale, delimiter).filter((row) => row.some((cell) => cell.length));
  const headers = validateHeaders(rows, locale);
  const dataRows = rows.slice(1);
  if (dataRows.length > 10_000) throw new Error(text(locale, {
    tr: "CSV güvenli işlem sınırı olan 10.000 veri satırını aşıyor.", en: "The CSV exceeds the safe limit of 10,000 data rows.", de: "Die CSV überschreitet die sichere Grenze von 10.000 Datenzeilen.", zh: "CSV 超出 10,000 行的安全处理上限。",
  }));
  const irregularIndex = dataRows.findIndex((row) => row.length !== headers.length);
  if (irregularIndex >= 0) throw new Error(text(locale, {
    tr: `${irregularIndex + 2}. satır ${rowCount(dataRows[irregularIndex])} alan içeriyor; başlık satırında ${headers.length} alan var.`,
    en: `Row ${irregularIndex + 2} has ${rowCount(dataRows[irregularIndex])} fields; the header has ${headers.length}.`,
    de: `Zeile ${irregularIndex + 2} enthält ${rowCount(dataRows[irregularIndex])} Felder; der Header hat ${headers.length}.`,
    zh: `第 ${irregularIndex + 2} 行有 ${rowCount(dataRows[irregularIndex])} 个字段，而表头有 ${headers.length} 个。`,
  }));
  const records = dataRows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
  return { output: JSON.stringify(records, null, 2), records: records.length, columns: headers.length, delimiter, protectedFormulaCells: 0 };
}

function rowCount(row: string[]) { return row.length; }

export function jsonToCsv(input: string, locale: Locale): CsvConversionResult {
  const parsed: unknown = JSON.parse(input);
  if (!Array.isArray(parsed) || !parsed.length || !parsed.every((item) => item && typeof item === "object" && !Array.isArray(item))) throw new Error(text(locale, {
    tr: "En az bir düz nesne içeren JSON dizisi gerekir.", en: "A JSON array containing at least one flat object is required.", de: "Erforderlich ist ein JSON-Array mit mindestens einem flachen Objekt.", zh: "需要至少包含一个扁平对象的 JSON 数组。",
  }));
  if (parsed.length > 10_000) throw new Error(text(locale, {
    tr: "JSON güvenli işlem sınırı olan 10.000 kaydı aşıyor.", en: "The JSON exceeds the safe limit of 10,000 records.", de: "Das JSON überschreitet die sichere Grenze von 10.000 Datensätzen.", zh: "JSON 超出 10,000 条记录的安全处理上限。",
  }));
  const data = parsed as Array<Record<string, unknown>>;
  const headers = [...new Set(data.flatMap((item) => Object.keys(item)))];
  if (!headers.length || headers.length > 500) throw new Error(text(locale, {
    tr: "JSON nesnelerinde 1–500 arasında alan bulunmalıdır.", en: "JSON objects must contain between 1 and 500 fields.", de: "JSON-Objekte müssen zwischen 1 und 500 Felder enthalten.", zh: "JSON 对象必须包含 1 至 500 个字段。",
  }));
  for (let rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
    for (const header of headers) {
      const value = data[rowIndex][header];
      if (value !== null && typeof value === "object") throw new Error(text(locale, {
        tr: `${rowIndex + 1}. kayıttaki “${header}” alanı iç içe veri içeriyor; CSV'ye geçmeden önce düzleştirin.`,
        en: `Field “${header}” in record ${rowIndex + 1} contains nested data; flatten it before converting to CSV.`,
        de: `Feld „${header}“ in Datensatz ${rowIndex + 1} enthält verschachtelte Daten; vor der CSV-Konvertierung abflachen.`,
        zh: `第 ${rowIndex + 1} 条记录的“${header}”字段包含嵌套数据；转换为 CSV 前请先扁平化。`,
      }));
    }
  }
  let protectedFormulaCells = 0;
  const encode = (value: unknown) => { const escaped = csvEscape(value); if (escaped.protected) protectedFormulaCells += 1; return escaped.text; };
  const output = [headers.map((header) => csvEscape(header).text).join(","), ...data.map((item) => headers.map((header) => encode(item[header])).join(","))].join("\n");
  return { output, records: data.length, columns: headers.length, delimiter: ",", protectedFormulaCells };
}
