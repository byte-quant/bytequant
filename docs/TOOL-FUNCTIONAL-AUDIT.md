# ByteQuant functional tool audit

Audit date: 2026-08-09
Scope: AdSense remediation programme, Stage 3

This report records automated evidence and targeted regression work. It is not a professional certification, a security guarantee, or a claim that every possible real-world input has been tested.

## Catalog-wide controls

- All 309 public canonical tools map to an implemented workbench family. The test suite fails if a canonical slug loses its runtime route.
- Every tool has a unique canonical identity, four localized titles and substantive descriptions, at least three localized use cases, and three localized HowTo steps.
- Every tool page provides an example-data action, explicit processing state, copy/download controls where output exists, a visible local-processing statement, and related-tool handoff.
- Legacy aliases remain separate from canonical pages so duplicate URLs do not compete in search results.

## Deep runtime lane

Catalog marks 234–321 (88 tools) receive executable demo checks in Turkish, English, German, and Simplified Chinese. The automated checks assert:

- the demo is meaningful and produces non-empty, measurable output;
- the processor never falls through to a placeholder implementation;
- Markdown tables contain a valid divider and can be rendered as accessible HTML tables;
- review boundaries and result metrics are localized;
- previously reported tools return purpose-specific results rather than a shared generic report.

The 75 frontier tools additionally receive localized input-format guidance, localized mode labels, actionable error messages, and structured key/value result cards where the output shape permits them.

## Edge-case regression set

The current suite deliberately covers malformed JSON, a non-array pagination input, invalid Base32, invalid numeric configuration, invalid iCalendar dates, a non-object tool-call payload, and malformed NDJSON. These inputs must either stop with an actionable error or report the invalid row explicitly; they must not produce a plausible-looking success result.

One concrete defect was found and corrected during this audit: the tool-call JSON validator accepted an array as a root value and returned an issues report. It now rejects every non-object root before validating the declared local tool contract.

## Presentation and accessibility

- Pipe-delimited result tables render as semantic HTML tables inside a keyboard-focusable, horizontally scrollable region.
- Label/value reports render as definition-list cards instead of one large monospace block.
- Machine formats such as JSON, vCard, and iCalendar remain verbatim so copy/download output is not corrupted.
- Error state is connected to the input with `aria-invalid` and `aria-errormessage`.
- Mobile layouts collapse result cards to one column and retain scroll access for genuinely wide tables.

## Stage 2 — applied editorial depth

- All 309 canonical tool pages now expose a tool-specific acceptance path, a successful-use definition, and a fourth FAQ answer tied to that tool's own scenario and steps.
- Every tool category has at least one directly relevant TR/EN guide and one editorially localized DE/ZH guide. Tools without a one-to-one article receive a category-relevant guide path instead of an unrelated or empty panel.
- All 96 TR/EN guides and all 68 DE/ZH localized guides now include a visible, related-tool verification worksheet: preparation, action, acceptance check, expected output, stop conditions, and a privacy-safe audit record.
- `pnpm run audit:editorial` verifies unique four-language tool copy, minimum article structure, valid tool references, guide coverage, visible worksheets, and matching FAQ/HowTo structured data in the static export.

## Stage 3 — guided input and runtime usability

- All 309 canonical tools now carry a verifiable Stage 3 workbench contract across 1,236 localized pages, including a visible example action, localized input profile, processing state, recovery path, and on-device privacy confirmation.
- Twenty configuration-heavy tools now expose labeled guided fields instead of requiring users to understand raw `key=value` syntax. The original text contract remains available for advanced use and Local Agent handoff.
- Twelve row-oriented tools now expose responsive row editors with localized column labels, add/remove controls, and a raw-data view for bulk editing.
- The 75 frontier processors are executed against their demonstrations in all four locales (300 runtime checks). Error paths must produce actionable localized feedback instead of silent failure.
- Generic and frontier workbenches expose consistent busy, success, and error states; output controls cannot be triggered while processing; input errors are connected through `aria-invalid` and `aria-errormessage`.
- `pnpm run audit:stage3` verifies the protected AdSense integration, guided-input coverage, responsive controls, localized runtime execution, and the static export contract.

## What continues after Stage 3

Runtime-family coverage is broader than exhaustive combinatorial testing. Less frequently used legacy tools remain in continuous review, and professional/legal/security decisions still require verification in their real context. Later programme stages cover trust/policy presentation and final crawl/performance validation.
