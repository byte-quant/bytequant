import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Stage 3 keeps the protected AdSense files byte-for-byte", async () => {
  const [layout, ads] = await Promise.all([read("app/layout.tsx"), read("public/ads.txt")]);
  assert.match(layout, /ca-pub-4158794981134847/);
  assert.equal(ads, "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n");
  assert.equal(createHash("sha256").update(ads).digest("hex").toUpperCase(), "615D7AEA69AFEECC9D6CBDBD5692DB5329EAD488C685CFD6E73F5A67F5EEBC61");
});

test("community presents a familiar feed before technical connection details", async () => {
  const [page, network, css] = await Promise.all([
    read("app/components/CommunityPage.tsx"),
    read("app/components/CommunityNetwork.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(page, /community-value-strip/);
  assert.match(page, /Hesap açmadan okuyun/);
  assert.match(network, /community-status-summary/);
  assert.match(network, /community-connection-details/);
  assert.match(network, /Gönderi sahibini doğrular/);
  assert.match(css, /grid-template-areas:"profile feed aside"/);
  assert.match(css, /community-global-post>p\{font-size:15px/);
});

test("editorial and policy chrome is complete in all four languages", async () => {
  const [blog, article, localizedBlog, localizedGuide, info, localizedInfo, shell] = await Promise.all([
    read("app/components/BlogIndex.tsx"),
    read("app/components/ArticlePage.tsx"),
    read("app/components/LocalizedBlogIndex.tsx"),
    read("app/components/LocalizedGuidePage.tsx"),
    read("app/components/InfoPage.tsx"),
    read("app/components/LocalizedInfoPage.tsx"),
    read("app/components/SiteShell.tsx"),
  ]);
  for (const marker of ["Primary sources", "Birincil kaynak", "TR · EN · DE · ZH"]) assert.match(blog, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const marker of ["In this guide", "Bu rehberde", "Sources and verification", "Kaynaklar ve doğrulama"]) assert.match(article, new RegExp(marker));
  for (const marker of ["Methoden, Grenzen", "方法、限制", "DURCHSUCHBARE BIBLIOTHEK", "可搜索指南库"]) assert.match(localizedBlog, new RegExp(marker));
  for (const marker of ["In diesem Ratgeber", "本指南内容", "Passendes Werkzeug", "相关工具"]) assert.match(localizedGuide, new RegExp(marker));
  assert.match(info, /info-section-nav/);
  assert.match(localizedInfo, /info-section-nav/);
  assert.match(shell, /experience-v2 experience-v3/);
});

test("community metadata describes topics rather than nonexistent shared groups", async () => {
  const routes = await Promise.all(["app/topluluk/page.tsx", "app/en/community/page.tsx", "app/de/community/page.tsx", "app/zh/community/page.tsx"].map(read));
  for (const route of routes) {
    assert.doesNotMatch(route, /Groups|Gruppen|grupları|小组/);
    assert.match(route, /questions|Questions|Sorular|Fragen|问题|fikir|ideas|Ideen|想法/i);
  }
});
