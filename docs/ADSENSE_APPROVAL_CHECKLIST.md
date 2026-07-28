# ByteQuant AdSense approval checklist

Audit date: 2026-07-28
Scope: four-language static export, 211 tools, localized guides, Local Agent, Workstation, Community, and the finite Updates feed.

This checklist is a readiness audit, not a promise of Google approval. Google makes the final account and site decision.

## Automated checks — PASS

- [x] Advertising areas are labelled only as “Advertisement / Reklam / Werbung / 广告”.
- [x] Ad areas are visually separated from editorial content and do not resemble buttons, downloads, navigation, or tool output.
- [x] Reserved areas have stable dimensions to reduce layout shift.
- [x] Tool ads appear after the tool and its substantive usage guide, away from run/copy/download actions.
- [x] Guide ads appear only after substantial publisher content.
- [x] Home has two content-separated placements; the page still contains substantially more publisher content than advertising space.
- [x] No ad placement exists in Local Agent, Workstation, P2P, or Community composition/comment surfaces.
- [x] The Updates feed republishes no article body or image, links visibly to official sources, uses a finite list, and contains no advertising placement beside save/share controls.
- [x] No auto-refresh, sticky overlay, pop-up, animation, arrow, or attention-forcing treatment is used.
- [x] The exact Google site tag and meta identifier use publisher `ca-pub-4158794981134847` once per rendered page.
- [x] `public/ads.txt` contains `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0`.
- [x] CSP permits the documented Google advertising origins while retaining same-origin defaults, blocked objects, denied framing, and restricted form actions.
- [x] No analytics SDK is active; privacy and storage disclosures explain Google advertising separately from local personalization.
- [x] Content, contact, privacy, terms, cookie/storage, security, About, and editorial-method pages are present.
- [x] Static SEO, hreflang, canonical, sitemap, robots, structured-data, accessibility, build, and dependency-license audits are part of release verification.

Run: `pnpm audit:adsense`

## External account and live-site checks — REQUIRED

- [x] Add the user-supplied AdSense site code for publisher `ca-pub-4158794981134847`.
- [x] Add the matching authorized-seller record to `public/ads.txt`.
- [ ] Confirm `bytequant.org` shows **Ready** in the owner's AdSense Sites page.
- [ ] Publish a Google-certified CMP integrated with the current IAB TCF requirement for the EEA, UK, and Switzerland from **AdSense → Privacy & messaging**.
- [ ] Test accept, reject, withdraw, and regional behavior with Google's live consent message; the ByteQuant local-personalization control is not a substitute for this CMP.
- [ ] Configure Auto ads page exclusions for Local Agent, Workstation, Community, P2P, and other private or high-interaction routes.
- [ ] Choose responsive units in AdSense and verify real creatives at 320, 375, 768, 1024, and 1440 CSS pixels.
- [ ] Re-check accidental-click distance, content-to-ad balance, Core Web Vitals, policy center, and crawler access on the live domain.
- [ ] Submit the live domain to AdSense and resolve any account-specific policy findings.

## Dört dilde durum / four-language status

- TR: Kod, yayıncı kimliği, `ads.txt` ve yerleşim denetimi geçti. Sertifikalı CMP, sayfa hariç tutmaları ve canlı hesap durumu AdSense panelinde doğrulanmalıdır.
- EN: Code, publisher ID, `ads.txt`, and placement audits pass. The certified CMP, page exclusions, and live account state must be verified in AdSense.
- DE: Code, Publisher-ID, `ads.txt` und Platzierungen bestehen die Prüfung. Zertifizierte CMP, Seitenausschlüsse und Live-Kontostatus müssen in AdSense geprüft werden.
- ZH: 代码、发布商 ID、`ads.txt` 与广告位审计已通过；仍须在 AdSense 中确认认证 CMP、页面排除规则和线上账户状态。

## Placement inventory

| Surface | Placement | Maximum | Reason |
| --- | --- | ---: | --- |
| Home | after tool library; after editorial guides | 2 | Long, crawlable publisher-content page |
| Tool detail | after tool UI + method/use-case guide | 1 | Keeps ads away from actions and errors |
| Guide index | after complete guide list | 1 | Clear separation from navigation |
| Guide article | after second substantive section | 1 | In-content placement on editorial pages |
| Agent / Workstation / Community / P2P / Updates | none | 0 | Interactive/private-context, third-party-source, and accidental-click risk |
