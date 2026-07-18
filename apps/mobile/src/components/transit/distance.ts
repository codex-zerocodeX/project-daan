/**
 * Human-readable metres. Kept deliberately coarse: these numbers come from
 * "nearest node on a community answer", so false precision would overstate how
 * much we actually know.
 */
export function formatDistance(metres: number): string {
  if (!Number.isFinite(metres) || metres < 0) return "";
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}
