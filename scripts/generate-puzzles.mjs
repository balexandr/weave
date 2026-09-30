// Generates src/data/puzzles.json: one full-coverage letter grid per day.
//
// The hard part (see GAME_DESIGN.md "Generation"): partition an N-cell
// grid into a set of self-avoiding, 8-directionally-connected paths, each
// spelling a real word from the closed bank, with zero leftover cells,
// where every word also has exactly one valid embedding anywhere on the
// grid (not just its own cells) so there's never a "wrong instance of a
// repeated letter" trap for the player. Naive random placement essentially
// never succeeds at full coverage, so this uses backtracking word
// placement (longest word first) with whole-puzzle retry on failure, same
// "best-of-N random, keep hardest" class of approach Mirror's multi-beam
// generator used once exact search stopped scaling.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WORD_BANK } from '../src/data/wordBank.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EPOCH = '2026-09-27';
const END_DATE = '2026-12-31';

// Monday through Sunday, ramping up same shape as Mirror/Pathways/Sprout/
// Realm's weekday difficulty curves: small and easy early in the week,
// Sunday as the "boss day". [rows, cols]. Sunday's 6x8=48 cells matches
// real Strands' usual size; Monday's 4x5=20 is a genuinely quick solve.
const WEEKLY_GRID_SIZE = {
  1: [4, 5], // Monday, 20 cells
  2: [4, 6], // Tuesday, 24 cells
  3: [5, 5], // Wednesday, 25 cells
  4: [5, 6], // Thursday, 30 cells (the original flat-difficulty size)
  5: [5, 7], // Friday, 35 cells
  6: [6, 7], // Saturday, 42 cells
  0: [6, 8], // Sunday, 48 cells, boss day
};

function gridSizeForDate(dateStr) {
  const dayOfWeek = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
  return WEEKLY_GRID_SIZE[dayOfWeek];
}

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Randomized greedy subset-sum: pick distinct words whose lengths sum to
// exactly `cellCount`. Retries with a fresh shuffle on failure rather than
// backtracking the sum itself. Cheap, and the bank is diverse enough in
// length that a fresh shuffle usually finds an exact fit quickly.
function pickWordSet(cellCount) {
  for (let attempt = 0; attempt < 500; attempt++) {
    const pool = shuffle(WORD_BANK);
    const picked = [];
    let remaining = cellCount;
    for (const w of pool) {
      if (w.length <= remaining) {
        picked.push(w);
        remaining -= w.length;
      }
      if (remaining === 0) break;
    }
    if (remaining === 0 && picked.length >= 4) return picked;
  }
  return null;
}

function cellKey(r, c) {
  return `${r},${c}`;
}

// Does `word` have MORE THAN ONE valid 8-adjacent self-avoiding path
// anywhere in `grid` (not just its own assigned cells)? Stops as soon as
// a second one turns up, existence of a second is all that matters.
// Confirmed via a live user report that a puzzle with an ambiguous word
// is genuinely confusing to play: a correctly-spelled word starting
// from the "wrong" instance of a repeated letter looks right to the
// player but gets rejected. Fixing this at generation time, so it can't
// happen at all, beats explaining the distinction to the player at
// runtime.
function hasAmbiguousEmbedding(word, grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  function dfs(path, visited) {
    if (count > 1) return;
    if (path.length === word.length) { count++; return; }
    const [r, c] = path[path.length - 1];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const key = cellKey(nr, nc);
      if (visited.has(key) || grid[nr][nc] !== word[path.length]) continue;
      visited.add(key);
      dfs([...path, [nr, nc]], visited);
      visited.delete(key);
      if (count > 1) return;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== word[0]) continue;
      dfs([[r, c]], new Set([cellKey(r, c)]));
      if (count > 1) return true;
    }
  }
  return false;
}

// Returns every word in `words` that has more than one valid embedding
// in `grid` (see hasAmbiguousEmbedding above).
function ambiguousWordsIn(words, grid) {
  return words.filter((word) => hasAmbiguousEmbedding(word, grid));
}

// Randomized DFS with backtracking: find a self-avoiding, 8-adjacent path
// of exactly `word.length` cells through currently-unassigned cells.
function placeWord(word, assigned, rows, cols) {
  const targetLen = word.length;
  const startCells = shuffle(
    Array.from({ length: rows * cols }, (_, i) => [Math.floor(i / cols), i % cols])
      .filter(([r, c]) => !assigned.has(cellKey(r, c)))
  );

  const MAX_STEPS = 6000;
  let steps = 0;

  function dfs(path, visited) {
    steps++;
    if (steps > MAX_STEPS) return null;
    if (path.length === targetLen) return path;
    const [r, c] = path[path.length - 1];
    const neighbors = shuffle(DIRECTIONS)
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols)
      .filter(([nr, nc]) => !assigned.has(cellKey(nr, nc)) && !visited.has(cellKey(nr, nc)));
    for (const [nr, nc] of neighbors) {
      const key = cellKey(nr, nc);
      visited.add(key);
      const result = dfs([...path, [nr, nc]], visited);
      if (result) return result;
      visited.delete(key);
      if (steps > MAX_STEPS) return null;
    }
    return null;
  }

  for (const start of startCells) {
    const visited = new Set([cellKey(...start)]);
    const result = dfs([start], visited);
    if (result) return result;
    if (steps > MAX_STEPS) break;
  }
  return null;
}

// Bank words grouped by length, for the repair step below: swapping an
// ambiguous word for a different word of the SAME length (so it still
// fits the cells it was placed in) without needing to re-run placement.
const BANK_BY_LENGTH = {};
for (const w of WORD_BANK) {
  const upper = w.toUpperCase();
  (BANK_BY_LENGTH[upper.length] ??= []).push(upper);
}

// First cut of this generator rejected the whole puzzle and restarted
// from scratch on any ambiguous word. Measured that as unworkably rare
// at larger grid sizes (6x8 Sunday: roughly 1 success in 20,000 full
// attempts) since requiring a from-scratch random tiling to ALSO be
// ambiguity-free everywhere gets combinatorially harder as the grid
// grows. This repair step instead keeps a successfully-placed grid and
// patches just the ambiguous word(s): swap in a different same-length
// bank word (not already used elsewhere in this puzzle) into the exact
// same cells, re-check, keep the swap if it actually reduces the
// ambiguous count, revert and try another candidate otherwise. Cheap
// (a letter swap + a re-check, no new placement search) and reuses the
// expensive part (a valid full-coverage tiling) instead of discarding
// it. Measured success per base attempt across all 7 weekday sizes:
// 11.9% (Mon, 4x5) down to 0.57% (Sun, 6x8), all under 350ms for 3000
// attempts, versus ~0.005%-0.06% without repair.
function repairAmbiguity(grid, paths) {
  const used = new Set(Object.keys(paths));
  for (let attempt = 0; attempt < 200; attempt++) {
    const bad = ambiguousWordsIn(Object.keys(paths), grid);
    if (bad.length === 0) return true;

    const target = bad[Math.floor(Math.random() * bad.length)];
    const candidates = shuffle((BANK_BY_LENGTH[target.length] || []).filter((w) => w !== target && !used.has(w)));

    let repaired = false;
    for (const candidate of candidates) {
      const path = paths[target];
      const oldLetters = path.map(([r, c]) => grid[r][c]);
      path.forEach(([r, c], i) => { grid[r][c] = candidate[i]; });
      used.delete(target);
      used.add(candidate);
      delete paths[target];
      paths[candidate] = path;

      if (ambiguousWordsIn(Object.keys(paths), grid).length < bad.length) {
        repaired = true;
        break;
      }
      // Revert: this candidate didn't help, put the original word back.
      path.forEach(([r, c], i) => { grid[r][c] = oldLetters[i]; });
      used.delete(candidate);
      used.add(target);
      delete paths[candidate];
      paths[target] = path;
    }
    if (!repaired) return false; // ran out of candidates for this word, give up on this base puzzle
  }
  return false; // repair loop itself exhausted, give up
}

const OUTER_ATTEMPTS = 20000;

function generatePuzzle(rows, cols) {
  const cellCount = rows * cols;
  for (let outer = 0; outer < OUTER_ATTEMPTS; outer++) {
    const words = pickWordSet(cellCount);
    if (!words) continue;
    // Longest first, since fewer free cells later makes long words harder to
    // place, so place them while there's the most room.
    const ordered = [...words].sort((a, b) => b.length - a.length);

    const assigned = new Set();
    const paths = {};
    let ok = true;
    for (const word of ordered) {
      const path = placeWord(word, assigned, rows, cols);
      if (!path) { ok = false; break; }
      path.forEach(([r, c]) => assigned.add(cellKey(r, c)));
      paths[word.toUpperCase()] = path;
    }
    if (!ok || assigned.size !== cellCount) continue;

    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (const [word, path] of Object.entries(paths)) {
      path.forEach(([r, c], i) => { grid[r][c] = word[i]; });
    }
    if (grid.some((row) => row.some((cell) => !cell))) continue;

    // Every word must have EXACTLY one valid grid embedding, its own
    // assigned path, so there's never a "wrong instance of a repeated
    // letter" trap.
    if (!repairAmbiguity(grid, paths)) continue;

    return { grid, words: Object.keys(paths).sort(), paths };
  }
  return null;
}

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const puzzles = {};
let dateKey = EPOCH;
let day = 0;
while (dateKey <= END_DATE) {
  const [rows, cols] = gridSizeForDate(dateKey);
  const puzzle = generatePuzzle(rows, cols);
  if (!puzzle) {
    console.error(`FAILED to generate puzzle for ${dateKey} (${rows}x${cols})`);
    process.exit(1);
  }
  puzzles[dateKey] = puzzle;
  day += 1;
  dateKey = addDays(EPOCH, day);
}

writeFileSync(join(__dirname, '../src/data/puzzles.json'), JSON.stringify(puzzles, null, 2));
console.log(`Generated ${Object.keys(puzzles).length} puzzles, ${EPOCH} through ${END_DATE}, sized by weekday (Mon 4x5 -> Sun 6x8).`);
