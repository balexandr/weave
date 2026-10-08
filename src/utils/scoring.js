// Star tiers by hints used, not raw score. Weave has no fail state and
// no timer pressure, so hints-used is the only lever. Untested thresholds,
// same caveat every sibling doc carries: expect to retune after real play.
export function getTierFromHints(hintsUsed) {
  if (hintsUsed === 0) return 3;
  if (hintsUsed === 1) return 2;
  return 1;
}

export function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}
