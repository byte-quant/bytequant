import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishingStandards } from "../app/lib/publishing-standards.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = {
  tr: { standards: "yayin-ilkeleri", about: "hakkimizda", privacy: "gizlilik-politikasi", contact: "iletisim" },
  en: { standards: "en/publishing-standards", about: "en/about", privacy: "en/privacy", contact: "en/contact" },
  de: { standards: "de/publishing-standards", about: "de/about", privacy: "de/privacy", contact: "de/contact" },
  zh: { standards: "zh/publishing-standards", about: "zh/about", privacy: "zh/privacy", contact: "zh/contact" },
};

const readOut = (route) => readFile(path.join(root, "out", route, "index.html"), "utf8");

for (const [locale, localeRoutes] of Object.entries(routes)) {
  const copy = publishingStandards[locale];
  assert.equal(copy.evidence.length, 4, `${locale} needs four publisher evidence points`);
  assert.equal(copy.sections.length, 6, `${locale} needs six publishing-standard sections`);
  assert.ok(copy.sections.every((section) => section.paragraphs.length >= 2 && section.checks.length >= 3), `${locale} standards must explain method and checks`);
  assert.ok(copy.sources.length >= 6, `${locale} standards need primary policy and project evidence`);

  const standards = await readOut(localeRoutes.standards);
  assert.match(standards, /data-publisher-standards="applied"/, `${locale} standards page is not visibly applied`);
  assert.match(standards, /data-publisher-evidence="verified"/, `${locale} standards page lacks publisher evidence`);
  assert.match(standards, /PublishingPrinciples|publishingPrinciples|yayin-ilkeleri/i, `${locale} standards page lacks publishing-principles semantics`);
  assert.match(standards, /BreadcrumbList/, `${locale} standards page lacks breadcrumb schema`);
  assert.match(standards, /bytequant@yahoo\.com/, `${locale} standards page lacks a correction route`);
  assert.match(standards, /developers\.google\.com\/search\/docs\/fundamentals\/creating-helpful-content/, `${locale} standards page lacks the primary helpful-content source`);
  assert.match(standards, /support\.google\.com\/publisherpolicies\/answer\/10502938/, `${locale} standards page lacks the primary publisher-policy source`);
  assert.doesNotMatch(standards, /guaranteed AdSense approval|garantili AdSense onayı/i, `${locale} must not promise approval`);

  for (const key of ["about", "privacy", "contact"]) {
    const html = await readOut(localeRoutes[key]);
    assert.match(html, /data-publisher-trust="visible"/, `${locale}/${key} lacks a visible trust route`);
    assert.match(html, new RegExp(`href="/${locale === "tr" ? "yayin-ilkeleri" : `${locale}/publishing-standards`}/?"`), `${locale}/${key} does not link to standards`);
  }
}

const home = await readFile(path.join(root, "out", "index.html"), "utf8");
assert.match(home, /publishingPrinciples/, "organization schema lacks publishingPrinciples");
assert.match(home, /https:\/\/bytequant\.org\/yayin-ilkeleri\//, "organization schema points to the wrong publishing policy");
assert.match(home, /href="\/yayin-ilkeleri\/?"/, "footer or navigation lacks the trust center");

console.log("Publisher trust audit: PASS (4 localized standards pages, 12 trust entry points, accountable schema and primary sources)");
