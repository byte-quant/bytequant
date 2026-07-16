# Contributing to ByteQuant

Thank you for helping improve ByteQuant.

## Before opening a change

1. Keep core tool processing local to the active browser tab.
2. Do not introduce remote AI, analytics, advertising, reputation, or scanning APIs without an explicit product/privacy review.
3. Use only open-source dependencies that are free for commercial use; pin versions and update THIRD_PARTY_NOTICES.md.
4. Add Turkish, English, German, and Simplified Chinese tool metadata for every new tool.
5. Update related-tool links, sitemap coverage, llms.txt, schema output, tests, and visible legal limitations.
6. Never commit credentials, personal datasets, or malware samples.

## Quality gate

~~~bash
pnpm lint
pnpm build
pnpm test
~~~

Changes should preserve TypeScript safety, keyboard operation, mobile layout, reduced-motion support, local error UI, example data, and copy/download consistency.

## Security changes

Do not open a public issue for an undisclosed vulnerability. Follow SECURITY.md.
