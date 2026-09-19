# Readable interfaces and reproducible content — 19 September 2026

The AI composer could overlap the welcome and conversation at desktop widths. Community profile setup was hidden between 701 and 860 pixels, so the create-post action could open an invisible form. A fixed community navigation bar covered mobile content. A 320px body minimum also exceeded the usable viewport when a scrollbar was present.

## Changes

- Keep the composer in document flow; retain the scrollable desktop conversation and mobile controls. Move the existing explanation of the model-free layer's limits before its worked examples. Add direct links to examples, capabilities, and answers.
- Remove the obsolete community tablet rail that hid profile setup. Keep topic/privacy information reachable at tablet widths. Put mobile navigation in normal flow and reduce unnecessary post indentation. Correct the feed heading level and give the search field an accessible name.
- Replace undefined border tokens with the shared theme token. Make guided fields respond to their available column width, restore small-screen sizing, and synchronize native date input events with the raw input representation.
- Add an explicitly publisher-authored community guide in Turkish, English, German, and Chinese. It explains how to reproduce a CSV quoting problem and a Unicode Base64 round trip, what a useful issue report contains, and how public relays, local archives, and direct sessions differ. No invented user activity or fabricated engagement is added.
- Add two original, executable tool examples in all four locales: leap-year month-end addition and a Unicode Content-Disposition filename. Each includes exact input, decisive expected output, an invalid input, interpretation, limitations, and a primary method reference. Replace the two tools' generic guidance with descriptions checked against their implementation.
- Give published examples stable fragment links, keep explanatory content in static HTML, and use the same date source for visible updates and metadata. Replace “validated output” labels where successful execution was being confused with independent validation.

## Verification

- Production build and ESLint pass. 215 tests pass, including both new fixtures through the real processing function in all four locales, invalid-input rejection, exported content, and unique example anchors.
- All 22 repository audits pass. The Stage 2 report was regenerated after the number of distinct guidance profiles increased; its check then passed. No gate was relaxed.
- Static audit: 1,905 HTML files, 1,860 valid JSON-LD blocks, 1,840 sitemap URLs, zero broken internal links.
- Browser geometry: AI, community, date addition, and Content-Disposition pages at 320, 390, 820, and 1280px; no document overflow or input controls outside the viewport. AI composer no longer overlaps its conversation. Community profile setup remains visible. English, German, and Chinese AI/community/header-tool pages also fit at 390px.
- Light and dark appearances inspected. Tablet create-post opens the profile form without connecting to relays or creating an identity. Real UI checks: 200 × 15% → 30; 2024-01-31 plus one month → 2024-02-29; çay raporu.pdf → the documented ASCII/UTF-8 response header.
- 25 local HTTP checks cover 24 pages in four languages plus the unchanged ads.txt hash. They check visible content outside scripts, one H1, canonical metadata, parsable schema, and working fragment targets. Deployment and live results are recorded separately in the task handoff after push.

## Scope and interpretation

The 342 tools and four languages remain available. No new dependency, paid service, model download, relay publication, or AdSense application was used. The AdSense script in app/layout.tsx and public/ads.txt remain byte-for-byte unchanged.

This is a focused improvement, not a claim that all tools received individual editorial review. Existing common guidance still exists elsewhere. Automated checks and extra word count do not demonstrate site-wide originality or guarantee AdSense approval. The publication date describes a page update, not a fresh expert review of every algorithm.

Google's [AdSense page-readiness guidance](https://support.google.com/adsense/answer/7299563?hl=en) emphasizes useful original content and usable navigation. Its [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) does not prescribe a preferred word count. This release follows those principles with inspectable examples and clear limitations; it makes no ranking or AI-answer inclusion promise.
