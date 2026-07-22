# ByteQuant AdSense approval checklist

Audit date: 2026-07-22
Scope: four-language static export, 131 tools, guides, Local Agent, Workstation, and Community.

This checklist is a readiness audit, not a promise of Google approval. Google makes the final account and site decision.

## Automated checks — PASS

- [x] Advertising areas are labelled only as “Advertisement / Reklam / Werbung / 广告”.
- [x] Ad areas are visually separated from editorial content and do not resemble buttons, downloads, navigation, or tool output.
- [x] Reserved areas have stable dimensions to reduce layout shift.
- [x] Tool ads appear after the tool and its substantive usage guide, away from run/copy/download actions.
- [x] Guide ads appear only after substantial publisher content.
- [x] Home has two content-separated placements; the page still contains substantially more publisher content than advertising space.
- [x] No ad placement exists in Local Agent, Workstation, P2P, or Community composition/comment surfaces.
- [x] No auto-refresh, sticky overlay, pop-up, animation, arrow, or attention-forcing treatment is used.
- [x] No AdSense script, publisher identifier, advertising cookie, analytics tag, or tracking SDK is active.
- [x] Privacy and storage disclosures explain the activation gate and optional-storage behavior.
- [x] Content, contact, privacy, terms, cookie/storage, security, About, and editorial-method pages are present.
- [x] Static SEO, hreflang, canonical, sitemap, robots, structured-data, accessibility, build, and dependency-license audits are part of release verification.

Run: `pnpm audit:adsense`

## External activation gates — PENDING

- [ ] Obtain and verify the real AdSense publisher account and site ownership.
- [ ] Add the exact `ca-pub-…` identifier only after verification; never invent an ID.
- [ ] Add `public/ads.txt` using the exact authorized-seller record shown in AdSense.
- [ ] Configure a Google-certified CMP integrated with the current IAB TCF requirement for the EEA, UK, and Switzerland.
- [ ] Keep Google ad tags blocked until the required consent signal exists; test accept, reject, withdraw, and regional behavior.
- [ ] Choose responsive units in AdSense and verify real creatives at 320, 375, 768, 1024, and 1440 CSS pixels.
- [ ] Re-check accidental-click distance, content-to-ad balance, Core Web Vitals, policy center, and crawler access on the live domain.
- [ ] Submit the live domain to AdSense and resolve any account-specific policy findings.

## Dört dilde durum / four-language status

- TR: Kod ve yerleşim denetimi geçti. Gerçek reklam etkinleştirme; doğrulanmış yayıncı kimliği, `ads.txt`, Google sertifikalı CMP ve canlı hesap incelemesini bekliyor.
- EN: Code and placement audit passed. Activation still requires a verified publisher ID, `ads.txt`, a Google-certified CMP, and live-account review.
- DE: Code- und Platzierungsprüfung bestanden. Für die Aktivierung fehlen noch bestätigte Publisher-ID, `ads.txt`, Google-zertifizierte CMP und Live-Prüfung.
- ZH: 代码与广告位审核已通过。启用前仍需验证发布商 ID、配置 `ads.txt`、Google 认证 CMP，并完成线上账号审核。

## Placement inventory

| Surface | Placement | Maximum | Reason |
| --- | --- | ---: | --- |
| Home | after tool library; after editorial guides | 2 | Long, crawlable publisher-content page |
| Tool detail | after tool UI + method/use-case guide | 1 | Keeps ads away from actions and errors |
| Guide index | after complete guide list | 1 | Clear separation from navigation |
| Guide article | after second substantive section | 1 | In-content placement on editorial pages |
| Agent / Workstation / Community / P2P | none | 0 | Interactive/private-context and accidental-click risk |
