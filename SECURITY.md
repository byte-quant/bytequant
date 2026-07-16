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

For critical decisions, use current professional security controls, qualified human review, isolation, and defense in depth.
