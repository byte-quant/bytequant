# Third-party open-source notices

ByteQuant uses free, open-source libraries under licenses that allow commercial use. The project does not add a paid SDK or trial-only dependency. Direct browser/runtime dependencies are MIT or Apache-2.0; transitive build and optimization packages retain their own notice and redistribution conditions.

| Package | Version | License | Purpose |
| --- | ---: | --- | --- |
| Next.js | 16.2.6 | MIT | App Router and static export |
| React / React DOM | 19.2.6 | MIT | User interface |
| qrcode | 1.5.4 | MIT | Local QR generation |
| pdf-lib | 1.17.1 | MIT | Local PDF creation, page copy, merge, and extraction |
| drizzle-orm | 0.45.2 | Apache-2.0 | Typed data layer retained by the project |

The image converter and compressor use browser-native Canvas, Blob, File, and Object URL APIs and add no image-processing dependency. PDF functionality dynamically imports pdf-lib only when a PDF operation is requested.

Full license texts and transitive dependency information remain available in each installed package and its upstream source repository. This notice is informational and does not replace the license text.

The production dependency scan currently reports 0BSD, Apache-2.0, BSD-3-Clause, CC-BY-4.0, ISC, MIT, Zlib, and an optional Sharp platform binary reported as Apache-2.0 AND LGPL-3.0-or-later. These licenses allow commercial use subject to their applicable attribution, notice, source/relinking, or redistribution terms. Run `pnpm licenses list --prod` against the lockfile before distribution and retain upstream license files where required.
