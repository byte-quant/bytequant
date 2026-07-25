# Third-party open-source notices

ByteQuant uses free, open-source libraries under licenses that allow commercial use. The project does not add a paid SDK or trial-only dependency. Direct browser/runtime dependencies are MIT or Apache-2.0; transitive build and optimization packages retain their own notice and redistribution conditions.

| Package | Version | License | Purpose |
| --- | ---: | --- | --- |
| Next.js | 16.2.6 | MIT | App Router and static export |
| React / React DOM | 19.2.6 | MIT | User interface |
| qrcode | 1.5.4 | MIT | Local QR generation |
| pdf-lib | 1.17.1 | MIT | Local PDF creation, page copy, merge, and extraction |
| yaml | 2.8.3 | ISC | Strict local YAML parsing and serialization with bounded alias expansion |
| drizzle-orm | 0.45.2 | Apache-2.0 | Typed data layer retained by the project |

The image converter and compressor use browser-native Canvas, Blob, File, and Object URL APIs and add no image-processing dependency. PDF functionality dynamically imports pdf-lib only when a PDF operation is requested.

Full license texts and transitive dependency information remain available in each installed package and its upstream source repository. This notice is informational and does not replace the license text.

The dependency scan performed on 2026-07-25 reports 0BSD, Apache-2.0, BSD-2-Clause, BSD-3-Clause, BlueOak-1.0.0, CC0-1.0, CC-BY-4.0, ISC, MIT, MIT OR Apache-2.0, MPL-2.0, Python-2.0, Zlib, and an optional Sharp platform binary reported as Apache-2.0 AND LGPL-3.0-or-later. All are open-source or open-content licenses that permit commercial use, subject to their applicable attribution, notice, source/relinking, file-level copyleft, or redistribution conditions. Run `pnpm audit:licenses` against the frozen lockfile before distribution and retain upstream license files where required.

ByteQuant articles and UI copy are original project content. External standards and official documentation are linked as sources and summarized rather than republished. The ByteQuant logo/favicon is a project-provided asset; generated application icons are first-party derivatives of that mark. No stock-photo, proprietary icon-font, paid SDK, trial asset, remotely hosted script, or third-party article body is bundled into the site.

## Official update-feed records

The build-time update synchronizer reads allowlisted official RSS endpoints from NASA and NIST. It retains only a headline, publication date, source name, category, and original HTTPS URL. It does not copy article bodies or images, and each card visibly identifies and links to the original source. NASA and NIST names identify the source and do not imply endorsement. NASA insignia, logotypes, third-party material on NASA pages, and NIST marks are not bundled or presented as ByteQuant assets.
