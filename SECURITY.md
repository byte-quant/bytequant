# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to **bytequant@yahoo.com**. Include the affected URL or component, reproducible steps, impact, browser/environment details, and a safe way to contact you.

Do not include active malware, private keys, passwords, unredacted personal datasets, or data obtained without authorization. Do not publicly disclose a finding before ByteQuant has had a reasonable opportunity to investigate and remediate it.

The canonical machine-readable policy is also available at https://bytequant.org/.well-known/security.txt.

## Supported version

The current production revision on the repository's default branch is supported. Historical static exports and forks may not receive fixes.

## Trust boundaries

- Tool inputs are designed to remain in the active browser tab.
- The PWA service worker caches same-origin application resources and visited GET pages, never tool inputs or generated results.
- File and code scanners do not execute selected content.
- URL checks make no DNS, HTTP, TLS, or reputation request.
- Heuristic findings can contain false positives and false negatives; a clean result is not proof of safety.
- Client-side code must never contain deploy-time or production secrets.
- Local Agent uses deterministic semantic scoring and versioned rules. It calls no remote model, executes no tool without user action, and keeps its bounded plan state in tab-scoped sessionStorage.
- Voice input is disabled unless the browser confirms on-device speech recognition and forced local processing; remote fallback is prohibited.
- The interactive application is authorized for bytequant.org and www.bytequant.org only, with localhost exceptions for development. A browser-side domain guard, hardcoded canonical origin, and build signature support attribution but cannot prevent inspection or copying of code already delivered to a browser.
- Production source maps are disabled. Deliberate obfuscation is avoided because it is not a secret-management control and impairs review.

For critical decisions, use current professional security controls, qualified human review, isolation, and defense in depth.
