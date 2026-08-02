import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { localizedGuides } from "../app/lib/localized-guides.ts";

const locales = ["de", "zh"];

test("all German and Chinese guides contain substantial, non-placeholder localized copy", () => {
  assert.ok(localizedGuides.length >= 68);
  assert.equal(new Set(localizedGuides.map((guide) => guide.slug)).size, localizedGuides.length);

  for (const guide of localizedGuides) {
    for (const locale of locales) {
      const copy = guide.copy[locale];
      assert.ok(copy.title.length >= (locale === "de" ? 24 : 10), `${guide.slug}/${locale}: short title`);
      assert.ok(copy.description.length >= (locale === "de" ? 70 : 28), `${guide.slug}/${locale}: short description`);
      assert.ok(copy.sections.length >= 3, `${guide.slug}/${locale}: fewer than three sections`);
      assert.equal(new Set(copy.sections.map((section) => section.heading)).size, copy.sections.length, `${guide.slug}/${locale}: repeated headings`);

      const bulletSignatures = [];
      for (const section of copy.sections) {
        assert.ok(section.heading.trim().length >= 4, `${guide.slug}/${locale}: empty heading`);
        assert.ok(section.paragraphs.length >= 1, `${guide.slug}/${locale}: missing section copy`);
        assert.ok(section.paragraphs.join(" ").length >= (locale === "de" ? 150 : 50), `${guide.slug}/${locale}/${section.heading}: shallow section`);
        const signature = (section.bullets ?? []).join("|");
        if (signature) bulletSignatures.push(signature);
        for (const bullet of section.bullets ?? []) {
          assert.doesNotMatch(bullet, /^\d+\.\s[a-z0-9]+(?:-[a-z0-9]+){2,}$/i, `${guide.slug}/${locale}: raw tool slug exposed to readers`);
        }
      }
      assert.ok(new Set(bulletSignatures).size >= Math.min(2, bulletSignatures.length), `${guide.slug}/${locale}: every section repeats the same checklist`);
    }
  }
});

test("localized guide layout keeps navigation beside, not around, the article", async () => {
  const source = await readFile(new URL("../app/components/LocalizedGuidePage.tsx", import.meta.url), "utf8");
  const tocIndex = source.indexOf('className="article-toc localized-guide-toc"');
  const bodyIndex = source.indexOf('className="article-body"');

  assert.ok(tocIndex > -1, "localized table of contents is missing");
  assert.ok(bodyIndex > tocIndex, "article body must follow the table of contents in the responsive grid");
  assert.match(source, /Intl\.Segmenter/, "Chinese word counts need locale-aware segmentation");
  assert.doesNotMatch(source, /article-sidebar/, "the old narrow summary sidebar must not return");
});
