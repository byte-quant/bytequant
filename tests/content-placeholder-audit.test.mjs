import test from "node:test";
import assert from "node:assert/strict";
import { findStandalonePlaceholder } from "../scripts/lib/placeholder-content.mjs";

test("placeholder audit catches standalone unfinished-page labels", () => {
  assert.equal(findStandalonePlaceholder("<main><h1>Coming soon</h1></main>"), "Coming soon");
  assert.equal(findStandalonePlaceholder("<main><p>Under construction.</p></main>"), "Under construction.");
  assert.equal(findStandalonePlaceholder("<main><p>Lorem ipsum dolor sit amet</p></main>"), "Lorem ipsum dolor sit amet");
});

test("placeholder audit does not reject legitimate editorial sentences or script data", () => {
  assert.equal(findStandalonePlaceholder("<article><p>The accessibility update is coming soon after the public review.</p></article>"), null);
  assert.equal(findStandalonePlaceholder('<script type="application/json">{"title":"Coming soon"}</script><main><p>Published report</p></main>'), null);
});
