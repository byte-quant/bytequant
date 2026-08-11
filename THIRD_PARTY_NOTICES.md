# Third-party open-source notices

ByteQuant uses free, open-source libraries under licenses that allow commercial use. The project does not add a paid SDK or trial-only dependency. Direct browser/runtime dependencies are MIT or Apache-2.0; transitive build and optimization packages retain their own notice and redistribution conditions.

| Package | Version | License | Purpose |
| --- | ---: | --- | --- |
| Next.js | 16.2.12 | MIT | App Router and static export |
| React / React DOM | 19.2.6 | MIT | User interface |
| qrcode | 1.5.4 | MIT | Local QR generation |
| pdf-lib | 1.17.1 | MIT | Local PDF creation, page copy, merge, and extraction |
| yaml | 2.8.3 | ISC | Strict local YAML parsing and serialization with bounded alias expansion |
| drizzle-orm | 0.45.2 | Apache-2.0 | Typed data layer retained by the project |
| nostr-tools | 2.24.1 | Unlicense | Opt-in Nostr event signing, verification, relay subscriptions, and portable identifiers |
| @mlc-ai/web-llm | 0.2.84 | Apache-2.0 | Opt-in WebGPU language-model inference in a dedicated browser Web Worker |

The optional local AI uses the Apache-2.0 `Qwen3-0.6B-q4f16_1-MLC` model distribution prepared by the MLC project. Model weights, tokenizer assets, and the compatible WebAssembly library are fetched only after a visitor explicitly enables local AI, then cached by the browser. Inference and chat content stay on-device; ByteQuant calls no hosted inference endpoint. Upstream model and runtime notices remain controlling.

The Nostr client dependency brings small cryptographic/encoding packages from the Noble and Scure projects plus `nostr-wasm`; the installed versions are MIT licensed. Community code is dynamically imported only when a visitor uses the global network or identity actions. ByteQuant operates no relay and does not bundle relay content.

The image converter and compressor use browser-native Canvas, Blob, File, and Object URL APIs and add no image-processing dependency. PDF functionality dynamically imports pdf-lib only when a PDF operation is requested.

Full license texts and transitive dependency information remain available in each installed package and its upstream source repository. This notice is informational and does not replace the license text.

The dependency scan performed on 2026-07-28 reports 0BSD, Apache-2.0, BSD-2-Clause, BSD-3-Clause, BlueOak-1.0.0, CC0-1.0, CC-BY-4.0, ISC, MIT, Unlicense, MIT OR Apache-2.0, MPL-2.0, Python-2.0, Zlib, and optional Sharp/libvips platform binaries reported as either LGPL-3.0-or-later or Apache-2.0 AND LGPL-3.0-or-later. All are open-source or open-content licenses that permit commercial use, subject to their applicable attribution, notice, source/relinking, file-level copyleft, or redistribution conditions. Run `pnpm audit:licenses` against the frozen lockfile before distribution and retain upstream license files where required.

ByteQuant articles and UI copy are original project content. External standards and official documentation are linked as sources and summarized rather than republished. The ByteQuant logo/favicon is a project-provided asset; generated application icons are first-party derivatives of that mark. No stock-photo, proprietary icon-font, paid SDK, trial asset, remotely hosted script, or third-party article body is bundled into the site.

## Official update-feed records

The build-time update synchronizer reads allowlisted official feeds from NASA, NIST, GOV.UK, NSF, NIH, ESA, NCSC, CISA, and NOAA. It retains a headline, publication date, source name, category, original HTTPS URL, and a visibly attributed feed description capped at 24 words. When a feed has no description it produces a clearly labeled metadata-only note instead of inventing reporting. It does not copy article bodies or images, and each card identifies and links to the original source. Source names identify attribution and do not imply endorsement; logos, insignia, third-party media, and page branding are not bundled as ByteQuant assets.

GOV.UK information is reused under the Open Government Licence v3.0 with visible source attribution and a link to the original record. The OGL does not cover personal data, third-party rights, departmental logos, crests, insignia, or other excluded material; ByteQuant republishes none of those assets. See https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/ for the controlling terms.
