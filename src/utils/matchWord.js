// Path-identity matching (accept only the one canonical path the
// generator happened to draw) turned out to be badly wrong in practice:
// measured across all 96 generated puzzles, 47.3% of words have at
// least one OTHER valid 8-adjacent self-avoiding route spelling the
// same word elsewhere on the grid (often through cells that "belong" to
// a different word), and 98% of puzzles have at least one such word.
// Confirmed live: on 2026-09-28's puzzle, ANCHOR has a second valid
// spelling running through cells that are also PANTS's and STORY's
// canonical letters. A player who traces that real, valid spelling was
// getting rejected. See GAME_DESIGN.md.
//
// Fix: accept ANY path the player actually traces (forward or reverse)
// whose letters spell a remaining word, not just the pre-generated one.
// The risk that creates: accepting an alternate route can consume cells
// another still-unfound word needs, potentially making that word
// impossible to complete later (the puzzle's core promise is that the
// whole grid can always be fully covered). So before accepting a
// non-canonical route, this verifies every OTHER remaining word still
// has at least one valid embedding using only the cells that would
// still be free afterward. If accepting would strand another word, this
// path is rejected, same as any other non-match.
//
// This is a per-word existence check, not a full exact-cover proof
// (individually-findable doesn't strictly guarantee they can all be
// placed simultaneously without conflicting with each other), a
// cheaper approximation, not a complete guarantee. See GAME_DESIGN.md
// for why that gap was accepted rather than solved.
const ROWS_COLS_DIAGONALS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function cellKey(r, c) {
  return `${r},${c}`;
}

function isAdjacent8([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2);
}

export function pathToText(path, grid) {
  return path.map(([r, c]) => grid[r][c]).join('');
}

function pathIsSelfAvoidingAndConnected(path) {
  const seen = new Set();
  for (let i = 0; i < path.length; i++) {
    const key = cellKey(...path[i]);
    if (seen.has(key)) return false;
    seen.add(key);
    if (i > 0 && !isAdjacent8(path[i - 1], path[i])) return false;
  }
  return true;
}

// Does `word` have at least one valid 8-adjacent self-avoiding path
// anywhere in `grid`, using only cells not in `blocked`? Stops at the
// first one found, existence is all that's needed here.
function hasEmbedding(word, grid, blocked) {
  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(path, visited) {
    if (path.length === word.length) return true;
    const [r, c] = path[path.length - 1];
    for (const [dr, dc] of ROWS_COLS_DIAGONALS) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const key = cellKey(nr, nc);
      if (visited.has(key) || blocked.has(key)) continue;
      if (grid[nr][nc] !== word[path.length]) continue;
      visited.add(key);
      if (dfs([...path, [nr, nc]], visited)) return true;
      visited.delete(key);
    }
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== word[0]) continue;
      const key = cellKey(r, c);
      if (blocked.has(key)) continue;
      if (dfs([[r, c]], new Set([key]))) return true;
    }
  }
  return false;
}

// Returns the matched word if `path` is a valid, acceptable find:
// spells a remaining word (forward or reverse), uses only free cells,
// and doesn't strand any other remaining word. Returns null otherwise.
export function matchWord(path, puzzle, foundWords, foundCells) {
  if (path.length === 0) return null;
  if (!pathIsSelfAvoidingAndConnected(path)) return null;

  const pathCellKeys = path.map((p) => cellKey(...p));
  if (pathCellKeys.some((k) => foundCells.has(k))) return null;

  const forwardText = pathToText(path, puzzle.grid);
  const reverseText = [...forwardText].reverse().join('');

  const word = puzzle.words.find((w) => !foundWords.has(w) && (w === forwardText || w === reverseText));
  if (!word) return null;

  const blockedAfter = new Set(foundCells);
  pathCellKeys.forEach((k) => blockedAfter.add(k));

  const otherRemaining = puzzle.words.filter((w) => w !== word && !foundWords.has(w));
  const wouldStrand = otherRemaining.some((w) => !hasEmbedding(w, puzzle.grid, blockedAfter));
  if (wouldStrand) return null;

  return word;
}
