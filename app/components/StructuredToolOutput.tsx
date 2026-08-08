type MarkdownTable = {
  intro: string;
  headers: string[];
  rows: string[][];
  remainder: string;
};

type KeyValueOutput = {
  intro: string;
  pairs: Array<[string, string]>;
  remainder: string;
};

function splitRow(line: string) {
  const value = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let cell = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "\\" && value[index + 1] === "|") {
      cell += "|";
      index += 1;
    } else if (character === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function parseMarkdownTable(output: string): MarkdownTable | null {
  const lines = output.split(/\r?\n/);
  const start = lines.findIndex((line, index) => /^\s*\|/.test(line) && index + 1 < lines.length && /^\s*\|/.test(lines[index + 1]));
  if (start < 0) return null;
  const headers = splitRow(lines[start]);
  const divider = splitRow(lines[start + 1]);
  if (headers.length < 2 || divider.length !== headers.length || divider.some((cell) => !/^:?-{3,}:?$/.test(cell))) return null;

  const rows: string[][] = [];
  let cursor = start + 2;
  while (cursor < lines.length && /^\s*\|/.test(lines[cursor])) {
    const row = splitRow(lines[cursor]);
    rows.push(headers.map((_, index) => row[index] ?? ""));
    cursor += 1;
  }
  return {
    intro: lines.slice(0, start).join("\n").trim(),
    headers,
    rows,
    remainder: lines.slice(cursor).join("\n").trim(),
  };
}

function parseKeyValueOutput(output: string): KeyValueOutput | null {
  const trimmed = output.trim();
  if (!trimmed || /^[\[{]/u.test(trimmed) || /^(?:BEGIN|END|VERSION|UID|DT|FN|EMAIL|TEL|ORG|PRODID|SUMMARY|LOCATION|DESCRIPTION):/m.test(trimmed)) return null;
  const source = trimmed.split(/\r?\n/u);
  const pairs: Array<[string, string]> = [];
  const remainder: string[] = [];
  const labelPattern = /^([\p{L}][\p{L}\p{N} ()/%²×'’._-]{1,62}):\s+(.+)$/u;
  for (const line of source) {
    const match = labelPattern.exec(line.trim());
    if (match) pairs.push([match[1], match[2]]);
    else if (line.trim()) remainder.push(line);
  }
  if (pairs.length < 2 || pairs.length < Math.ceil(source.filter((line) => line.trim()).length / 2)) return null;
  return { intro: "", pairs, remainder: remainder.join("\n").trim() };
}

export function StructuredToolOutput({ output, empty, compact = false }: { output: string; empty: string; compact?: boolean }) {
  const table = output ? parseMarkdownTable(output) : null;
  const keyValue = !table && output ? parseKeyValueOutput(output) : null;
  if (!table && !keyValue) {
    return <pre data-agent-output data-ready={output ? "true" : "false"} className={output ? "has-output" : ""}>{output || empty}</pre>;
  }

  if (keyValue) {
    return (
      <div className={`structured-tool-output structured-kv-output${compact ? " compact" : ""}`} data-agent-output data-ready="true">
        <dl>{keyValue.pairs.map(([label, value], index) => <div key={`${label}-${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {keyValue.remainder && <pre className="structured-output-notes">{keyValue.remainder}</pre>}
      </div>
    );
  }

  if (!table) return <pre data-agent-output data-ready="false">{empty}</pre>;

  return (
    <div className={`structured-tool-output${compact ? " compact" : ""}`} data-agent-output data-ready="true">
      {table.intro && <pre className="structured-output-notes structured-output-intro">{table.intro}</pre>}
      <div className="structured-table-scroll" tabIndex={0} role="region" aria-label={table.headers.join(", ")}>
        <table>
          <thead><tr>{table.headers.map((header, index) => <th scope="col" key={`${header}-${index}`}>{header}</th>)}</tr></thead>
          <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {table.remainder && <pre className="structured-output-notes">{table.remainder}</pre>}
    </div>
  );
}
