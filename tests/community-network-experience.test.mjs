import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("community network requires an explicit connection in every session", async () => {
  const source = await read("app/components/CommunityNetwork.tsx");

  assert.doesNotMatch(source, /networkConsentKey|autoConnectTimer|nostr-network-consent/);
  assert.match(source, /function consentAndConnect\(\) \{ void connect\(\); \}/);
  assert.match(source, /Network access always requires a fresh, explicit click/);
  assert.match(source, /only for this session and only after you press the button/);
  assert.match(source, /nur für diese Sitzung und erst nach Ihrem Klick/);
  assert.match(source, /仅在本次会话中/);
});

test("community distinguishes reading, posting, and advanced private tools", async () => {
  const [page, network] = await Promise.all([
    read("app/components/CommunityPage.tsx"),
    read("app/components/CommunityNetwork.tsx"),
  ]);

  assert.match(page, /href="#community-feed"/);
  assert.match(page, /href="#community-compose"/);
  assert.match(page, /id="community-private-tools"/);
  assert.match(page, /Gelişmiş \/ özel topluluk araçları/);
  assert.match(page, /Advanced \/ private community tools/);
  assert.match(page, /Erweiterte \/ private Community-Werkzeuge/);
  assert.match(page, /高级 \/ 私密社区工具/);
  assert.ok(page.indexOf('id="community-private-tools"') < page.indexOf('id="community-local"'));
  assert.ok(page.indexOf('id="community-private-tools"') < page.indexOf('id="community-live"'));
  assert.match(network, /profileExperienceCopy/);
  assert.match(network, /A profile is needed only to post, reply, or react/);
  assert.match(network, /id="community-compose"/);
});

test("network topics and editorial examples are represented honestly", async () => {
  const source = await read("app/components/CommunityNetwork.tsx");

  assert.match(source, /group: "Konu"/);
  assert.match(source, /group: "Topic"/);
  assert.match(source, /group: "Thema"/);
  assert.match(source, /group: "主题"/);
  assert.match(source, /id="community-topics"/);
  assert.doesNotMatch(source, /id="community-groups"/);
  assert.match(source, /const showingStarterFeed = events\.length === 0 && !filtersActive/);
  assert.match(source, /data-origin=\{isExample \? "editorial-example" : "nostr-relay"\}/);
  assert.match(source, /Editorial example · Not a relay post/);
  assert.match(source, /Redaktionelles Beispiel · Kein Relay-Beitrag/);
  assert.match(source, /编辑示例 · 不是中继帖子/);
  assert.match(source, /\{showingStarterFeed && <div className="community-starter-label"/);
  assert.match(source, /\{!isExample && <button type="button" aria-label=\{networkText\.savedLabel\}/);
  assert.doesNotMatch(source, /disabled=\{isExample\}[^>]+aria-label=\{networkText\.savedLabel\}/);
});

test("relay state and post actions expose accessible status and controls", async () => {
  const source = await read("app/components/CommunityNetwork.tsx");

  assert.match(source, /const \[relayHealth, setRelayHealth\]/);
  assert.match(source, /pool\.listConnectionStatus\(\)/);
  assert.match(source, /networkText\.relayHealth/);
  assert.match(source, /role="status" aria-live="polite"/);
  assert.match(source, /aria-label=\{networkText\.postActions\}/);
  assert.match(source, /aria-label=\{networkText\.ownerActions\}/);
  assert.match(source, /aria-controls=\{repliesId\}/);
  assert.match(source, /aria-pressed=\{likedByMe\}/);
  assert.ok(source.includes('aria-label={`${t.repost}: ${reposts}`}'));
  assert.match(source, /filtersActive && <button[^>]+onClick=\{clearFeedFilters\}/);
});

test("social feed supports device-local following and bounded progressive rendering", async () => {
  const [source, styles] = await Promise.all([
    read("app/components/CommunityNetwork.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(source, /bytequant:nostr-following:v1/);
  assert.match(source, /const \[followingOnly, setFollowingOnly\]/);
  assert.match(source, /following\.includes\(event\.pubkey\)/);
  assert.match(source, /aria-pressed=\{following\.includes\(event\.pubkey\)\}/);
  assert.match(source, /Your following list stays only on this device/);
  assert.match(source, /const \[feedLimit, setFeedLimit\] = useState\(12\)/);
  assert.match(source, /const displayedPosts = visiblePosts\.slice\(0, feedLimit\)/);
  assert.match(source, /setFeedLimit\(\(current\) => current \+ 12\)/);
  assert.match(styles, /\.community-load-more/);
  assert.match(styles, /\.community-post-author-actions/);
});

test("community safer view rejects warning-tagged events and supports local report-and-hide", async () => {
  const [source, styles] = await Promise.all([
    read("app/components/CommunityNetwork.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(source, /bytequant:nostr-reported:v1/);
  assert.match(source, /function hasRestrictedNostrTags/);
  assert.match(source, /tag\[0\] === "content-warning"/);
  assert.match(source, /function reportPost\(event: NostrEvent\)/);
  assert.match(source, /className="community-report-button"/);
  assert.match(source, /Community and publishing standards/);
  assert.match(source, /pathFor\(locale, "standards"\)/);
  assert.match(styles, /\.community-social-v61 \.community-safety-live/);
  assert.match(styles, /\.community-social-v61 \.community-report-button/);
});
