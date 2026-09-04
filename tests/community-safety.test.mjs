import assert from "node:assert/strict";
import test from "node:test";
import { reviewCommunityText } from "../app/lib/community-safety.ts";

test("community safety catches secrets, personal data, abuse, restricted offers, and spam", () => {
  assert.deepEqual(reviewCommunityText("A useful workflow without personal data"), []);
  assert.ok(reviewCommunityText("api_key=abcdefghijklmnopqrstuv").includes("credential"));
  assert.ok(reviewCommunityText("Contact me at person@example.com").includes("email"));
  assert.ok(reviewCommunityText("ÇOCUK---PORNOSU paylaşımı").includes("restricted"));
  assert.ok(reviewCommunityText("BUY   COCAINE here").includes("restricted"));
  assert.ok(reviewCommunityText("word word word word word word").includes("spam"));
  assert.ok(reviewCommunityText("https://example.com/article").includes("external"));
  assert.deepEqual(reviewCommunityText("https://bytequant.org/yayin-ilkeleri/"), []);
});

test("normalization closes simple separator bypasses without rejecting ordinary multilingual text", () => {
  assert.ok(reviewCommunityText("s.i.k.e.y.i.m").includes("abusive"));
  assert.deepEqual(reviewCommunityText("Veri kalitesini adım adım değerlendiren açık ve yararlı bir açıklama."), []);
  assert.deepEqual(reviewCommunityText("这是一个说明数据清理步骤的实用社区帖子。"), []);
});
