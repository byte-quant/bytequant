# ByteQuant

ByteQuant is a production-ready, bilingual (Turkish/English) static website for privacy-first browser tools. It contains 38 working utilities, 21 full guides in both languages, standalone trust/legal pages, structured data, a complete sitemap, and a GitHub Pages deployment workflow.

## What is included

- 38 on-device tools across Prompt, Text & NLP, Data & Developer, Converters, and Privacy & Security categories
- Individual SEO page, usage guide, limitations, FAQ schema, and related-tool links for every tool
- Turkish and English home, tool, guide, About, Privacy, Terms, Contact, and FAQ pages
- Eight original long-form guides in both languages
- `WebSite`, `WebApplication`, `BlogPosting`, and `FAQPage` JSON-LD
- Static `sitemap.xml`, `robots.txt`, web manifest, CNAME, and no-Jekyll marker
- Responsive light/dark interface with keyboard focus, reduced-motion support, and mobile navigation
- Reserved ad areas that are visibly separated from editorial content
- A bespoke 1200×630 Open Graph card and matching favicon

## Privacy model

Core tool operations run in the active browser tab. Tool input is not transmitted to a ByteQuant server and is not persisted to `localStorage`. Local storage is limited to `bq-theme` (light/dark) and `bq-tool-usage-v1` (non-sensitive per-tool visit counts used for personal shortcuts). Copying or downloading a result creates a user-controlled copy outside the page.

The tools deliberately avoid remote AI APIs, analytics SDKs, and active advertising scripts. Pattern masking and heuristic scores are pre-checks, not legal or security guarantees.

## Local development

Requirements: Node.js 22+ and pnpm 11.

```bash
pnpm install
pnpm dev
```

The production build is a fully static export:

```bash
pnpm build
pnpm test
```

The deployable site is written to `out/`. Next.js production compilation minifies JavaScript and CSS. The maintainable source is intentionally not obfuscated: obfuscation does not protect client-side secrets and makes security review and maintenance harder.

## GitHub Pages deployment

1. Push this project to the repository's `main` branch.
2. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the source.
3. The included `.github/workflows/deploy.yml` workflow installs dependencies, builds, tests, and publishes `out/`.
4. `public/CNAME` is already set to `bytequant.org`. Confirm the domain's DNS records in GitHub before enforcing HTTPS.

## AdSense integration checklist

The site reserves `.ad-slot` areas but intentionally ships without a publisher ID or ad script. Before activating ads:

1. Replace reserved slots only with the official responsive ad markup tied to the verified publisher account.
2. Add a Google-certified consent management flow where required and update the Privacy Policy before any ad cookie is set.
3. Keep tool input isolated from advertising code; never expose textarea or result values as ad targeting data.
4. Test mobile layout, accidental-click spacing, navigation, policy pages, and content availability without ads.
5. Review the current Google Publisher Policies immediately before applying. Site quality raises approval readiness but cannot guarantee approval.

## Content and product maintenance

- Tools: `app/lib/tools.ts`
- Guides: `app/lib/posts.ts`
- Institutional/legal content: `app/lib/info.ts`
- Client-side tool logic: `app/components/ToolWorkbench.tsx`
- Design system: `app/globals.css`

Direct runtime dependency licenses and the converter package's commercial-use status are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Update the visible revision date when legal or privacy behavior changes. Do not add analytics, external models, or advertising without updating the data-flow disclosure and consent behavior.

## Contact

- Email: bytequant@yahoo.com
- X: [@byte_quant](https://x.com/byte_quant)
- Instagram: [@byte.quant](https://www.instagram.com/byte.quant)
