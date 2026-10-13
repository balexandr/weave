// Weave's own definition of what counts as winning: hints used, lower
// is better (matches the 'asc' sort_direction seeded for 'weave' in
// leaderboard_games), with solve time as a tiebreak (also 'asc') for
// the common case of multiple 0-hint solves on the same day — the
// first game in the suite that actually needs the tiebreak field this
// schema was built to support.
export function toLeaderboardScore(hintsUsed, elapsedSeconds) {
  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')
  const ss = String(elapsedSeconds % 60).padStart(2, '0')
  const hintLabel = hintsUsed === 0 ? 'no hints' : `${hintsUsed} hint${hintsUsed === 1 ? '' : 's'}`
  return { score: hintsUsed, tiebreak: elapsedSeconds, scoreDisplay: `${hintLabel} · ${mm}:${ss}` }
}
