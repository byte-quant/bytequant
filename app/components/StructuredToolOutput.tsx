type MarkdownTable = {
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

function parseLeadingMarkdownTable(output: string): MarkdownTable | null {
  const lines = output.split(/\r?\n/);
  if (lines.length < 2 || !/^\s*\|/.test(lines[0])) return null;
  const headers = splitRow(lines[0]);
  const divider = splitRow(lines[1]);
  if (headers.length < 2 || divider.length !== headers.length || divider.some((cell) => !/^:?-{3,}:?$/.test(cell))) return null;

  const rows: string[][] = [];
  let cursor = 2;
  while (cursor < lines.length && /^\s*\|/.test(lines[cursor])) {
    const row = splitRow(lines[cursor]);
    rows.push(headers.map((_, index) => row[index] ?? ""));
    cursor += 1;
  }
  return { headers, rows, remainder: lines.slice(cursor).join("\n").trim() };
}

export function StructuredToolOutput({ output, empty, compact = false }: { output: string; empty: string; compact?: boolean }) {
  const table = output ? parseLeadingMarkdownTable(output) : null;
  if (!table) {
    return <pre data-agent-output data-ready={output ? "true" : "false"} className={output ? "has-output" : ""}>{output || empty}</pre>;
  }

  return (
    <div className={`structured-tool-output${compact ? " compact" : ""}`} data-agent-output data-ready="true">
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
