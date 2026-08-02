type MarkdownTable = {
  intro: string;
  headers: string[];
  rows: string[][];
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

export function StructuredToolOutput({ output, empty, compact = false }: { output: string; empty: string; compact?: boolean }) {
  const table = output ? parseMarkdownTable(output) : null;
  if (!table) {
    return <pre data-agent-output data-ready={output ? "true" : "false"} className={output ? "has-output" : ""}>{output || empty}</pre>;
  }

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
