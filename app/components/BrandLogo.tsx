/* eslint-disable @next/next/no-img-element */

export function BrandLogo() {
  return <span className="brand-mark" aria-hidden="true">{/* The source is a tiny local brand asset; bypassing image optimization keeps static hosts and dev runtimes consistent. */}<img src="/favicon.png" alt="" width="42" height="42" /></span>;
}
