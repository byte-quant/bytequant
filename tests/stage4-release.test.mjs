import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("keeps the protected publisher identity exact through the final gate", async () => {
  const [ads, layout] = await Promise.all([read("public/ads.txt"), read("app/layout.tsx")]);
  assert.equal(ads, "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n");
  assert.equal(createHash("sha256").update(ads).digest("hex"), "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61");
  assert.match(layout, /<Script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" \/>/);
});

test("limits global identity schema to home and About surfaces", async () => {
  const [shell, home, info, localizedInfo] = await Promise.all([
    read("app/components/SiteShell.tsx"), read("app/components/HomePage.tsx"), read("app/components/InfoPage.tsx"), read("app/components/LocalizedInfoPage.tsx"),
  ]);
  assert.match(shell, /includeGlobalSchema = false/);
  assert.match(shell, /includeGlobalSchema \? <SchemaScript data=\{globalSchema\}/);
  assert.match(home, /includeGlobalSchema/);
  assert.match(info, /includeGlobalSchema=\{pageKey === "about"\}/);
  assert.match(localizedInfo, /includeGlobalSchema=\{pageKey === "about"\}/);
});

test("keeps security and cache policies aligned for deployable hosting", async () => {
  const [headers, worker] = await Promise.all([read("public/_headers"), read("worker/index.ts")]);
  for (const name of ["Cross-Origin-Opener-Policy", "Cross-Origin-Resource-Policy", "Permissions-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "X-Permitted-Cross-Domain-Policies", "Origin-Agent-Cluster"]) {
    assert.ok(headers.includes(name), `public/_headers omits ${name}`);
    assert.ok(worker.includes(name), `worker omits ${name}`);
  }
  assert.match(headers, /\/sw\.js[\s\S]*no-cache, no-store, must-revalidate/);
  assert.doesNotMatch(headers, /\/service-worker\.js/);
  assert.match(headers, /\/_next\/static\/\*[\s\S]*immutable/);
  assert.match(worker, /pathname === "\/sw\.js"/);
  assert.match(worker, /pathname\.startsWith\("\/_next\/static\/"\)/);
});

test("publishes a current RFC 9116 security contact", async () => {
  const [security, workflow] = await Promise.all([read("public/.well-known/security.txt"), read(".github/workflows/deploy.yml")]);
  assert.match(security, /^Contact: mailto:bytequant@yahoo\.com$/m);
  assert.match(security, /^Canonical: https:\/\/bytequant\.org\/\.well-known\/security\.txt$/m);
  assert.match(security, /^Preferred-Languages: tr, en, de, zh$/m);
  assert.ok(new Date(/^Expires: (.+)$/m.exec(security)?.[1] ?? 0) > new Date("2026-08-09"));
  assert.match(workflow, /include-hidden-files:\s*true/, "GitHub Pages must deploy the audited .well-known path");
});
