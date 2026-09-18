# ByteQuant AI 7.7 — conversational input and guided tools

7.7 improves the existing deterministic assistant. It is not a new trained model or a claim of general intelligence. The optional on-device LLM profiles, runtime pins and download consent remain unchanged.

## User-visible changes

- A waiting, confidently matched workflow accepts JSON, CSV/TSV, fenced or labelled data in the next message. CSV headers and every record are retained. A failed run also accepts corrected input.
- Short Base64 and URL follow-ups such as “Now decode this” reuse a completed result. A separate task does not automatically inherit it. Partial failed output is not treated as a completed result.
- Consecutive percentage corrections reuse the original base value until the topic changes. Worked JSON, CSV, Base64 and URL examples retrieve maintained explanations, actual fixtures and source URLs.
- Seven tools expose named fields: CAGR, ROAS/ROI, Content-Disposition, PICO, date addition, CSV pivot rules and JSON sorting/filtering rules. Raw input remains available. Duplicate keys, invalid field values and unsupported lines fall back to raw editing instead of being discarded.
- JSON/CSV direction defaults to input detection. Commas, semicolons and spreadsheet tabs use the same converter as agent automation. Examples respect the selected direction; generic tools can restore input from before loading an example. Complete Markdown fences can be removed explicitly.
- Four localized assistant pages contain reproducible two-message examples, expected outputs, recovery instructions and clear capability limits. WebApplication data exposes version 7.7.

## Integrity and privacy

The agent uses the shared CSV converter, including duplicate/blank-header rejection, nested JSON rejection and formula-cell protection. Instructions embedded in a strongly delimited payload do not select extra operations. Uncertain plans do not auto-run. Date offsets are bounded to prevent an unbounded business-day loop. Valid 7.6 sessions migrate through the existing full schema validation.

No paid service, dependency, model download, account operation or AdSense resubmission was introduced. The existing 342 canonical tools and TR/EN/DE/ZH remain. AdSense script and ads.txt are unchanged. The preceding editorial release ce5cf7140303f3fa6a67dffcef5a298d564bc044 is retained.

## Validation

Meaningful regression coverage includes four-language data continuations and codec operations, multi-row header preservation, operation/data separation, CSV data loss and spreadsheet formula handling, chained percentage changes, guided-field round trips, bounded date processing and session migration.

Browser checks cover a two-message CSV conversion preserving “007”, a field-based CAGR calculation (100 → 121 over two years = 10%), spreadsheet TSV import, direction-specific examples and a 390px mobile form without horizontal overflow.

Final local validation: 213/213 tests, lint, production build and all 22 audits passed. The static export contains 1,905 HTML files, 1,860 valid JSON-LD blocks and 1,840 sitemap URLs, with no broken internal links. Browser checks also verified restoring the pre-example input, explicit Markdown-fence removal, and a two-record CSV reply retaining its header and both records.

Protected SHA-256 values:
- app/layout.tsx: C54722C7232F1E729ECD7CC08F26561FDC3D26E512963B03826A19A5C2C37317
- public/ads.txt: 615D7AEA69AFEECC9D6CBDBD5692DB5329EAD488C685CFD6E73F5A67F5EEBC61

Deployment and live verification are recorded in the task handoff after completion. Passing automated checks does not establish universal conversational correctness, manual review of all tools, or Google AdSense approval.
