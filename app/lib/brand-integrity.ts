export const BYTEQUANT_CANONICAL_ORIGIN = "https://bytequant.org";
export const BYTEQUANT_BUILD_SIGNATURE = "bq-org-agent-v1-20260718";

export function isAuthorizedByteQuantHostname(hostname: string) {
  const normalized = hostname.toLocaleLowerCase("en-US").replace(/\.$/, "");
  return normalized === "bytequant.org"
    || normalized === "www.bytequant.org"
    || normalized === "localhost"
    || normalized === "127.0.0.1"
    || normalized === "[::1]"
    || normalized === "::1";
}
