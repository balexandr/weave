// Simulates real playthroughs against the actual generated puzzle data,
// exercising the same matchWord() the app uses at runtime. This is a
// logic-level check, not a substitute for driving the real UI in a
// browser, since no browser-automation tool was available in this
// session. That verification step is flagged as not done, not silently
// skipped.
//
// Rewritten twice: first after matchWord's flexible-matching rework
// (accept any valid grid trace of a word, not just the one canonical
// path, with a solvability check against stranding other words), then
// again after the generator itself was changed to reject any puzzle
// with an ambiguous word in the first place (see GAME_DESIGN.md). The
// matcher's flexible-matching/solvability-guard logic stays as defense
// in depth even though real puzzle data should no longer exercise its
// "accept an alternate" branch at all.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { matchWord, pathToText } from '../src/utils/matchWord.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const puzzles = JSON.parse(readFileSync(join(__dirname, '../src/data/puzzles.json'), 'utf-8'));

let failures = 0;
function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); failures++; }
}

function cellKey(r, c) { return `${r},${c}`; }

const dates = Object.keys(puzzles);
const sample = [dates[0], dates[Math.floor(dates.length / 2)], dates[dates.length - 1]];

for (const date of sample) {
  const puzzle = puzzles[date];
  const foundWords = new Set();
  const foundCells = new Set();

  for (const word of puzzle.words) {
    const path = puzzle.paths[word];

    // Forward canonical path matches.
    assert(matchWord(path, puzzle, foundWords, foundCells) === word, `${date}: forward path for "${word}" should match`);

    // Reversed drag also matches (direction-agnostic).
    assert(matchWord([...path].reverse(), puzzle, foundWords, foundCells) === word, `${date}: reversed path for "${word}" should match`);

    // A truncated path (one cell short) should NOT match any word.
    if (path.length > 3) {
      const truncated = path.slice(0, -1);
      assert(matchWord(truncated, puzzle, foundWords, foundCells) === null, `${date}: truncated path for "${word}" should not match`);
    }

    path.forEach(([r, c]) => foundCells.add(cellKey(r, c)));
    foundWords.add(word);

    // Once found, re-dragging the same path should not match again
    // (already in foundWords, so matchWord should skip it) and its
    // cells are now blocked for anything else too.
    assert(matchWord(path, puzzle, foundWords, foundCells) === null, `${date}: already-found "${word}" should not re-match`);
  }

  assert(foundWords.size === puzzle.words.length, `${date}: all words found by end of simulated playthrough`);
}

// Positive proof the generator's ambiguity constraint actually holds on
// real data, not just trusted from the generator's own logic: every
// word in every sampled puzzle should have EXACTLY ONE valid grid
// embedding (its own canonical path), full stop. The authoritative,
// full-dataset version of this check is scripts/check-ambiguity.mjs
// (all 96 puzzles, 0% ambiguous after the generator fix); this repeats
// it on the sample here so a matching-logic test run alone still catches
// a regression.
function findAllEmbeddings(word, grid) {
  const rows = grid.length, cols = grid[0].length;
  const results = [];
  function dfs(path, visited) {
    if (results.length > 1) return;
    if (path.length === word.length) { results.push([...path]); return; }
    const [r, c] = path[path.length - 1];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const key = `${nr},${nc}`;
      if (visited.has(key) || grid[nr][nc] !== word[path.length]) continue;
      visited.add(key);
      dfs([...path, [nr, nc]], visited);
      visited.delete(key);
      if (results.length > 1) return;
    }
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] === word[0]) dfs([[r, c]], new Set([`${r},${c}`]));
    if (results.length > 1) return results;
  }
  return results;
}

for (const date of sample) {
  const puzzle = puzzles[date];
  for (const word of puzzle.words) {
    const embeddings = findAllEmbeddings(word, puzzle.grid);
    assert(embeddings.length === 1, `${date}: "${word}" should have exactly one grid embedding, found ${embeddings.length}`);
    if (embeddings.length === 1) {
      const text = pathToText(embeddings[0], puzzle.grid);
      assert(text === word, `${date}: "${word}"'s sole embedding actually spells it (got "${text}")`);
    }
  }
}

// A path that spells a real solution word but would strand another
// remaining word (consumes cells it has no other embedding without)
// must be rejected, not silently accepted. Construct a case directly:
// two 3-letter words sharing letters such that claiming one via an
// overlapping alternate route leaves the other with zero embeddings.
{
  const grid = [
    ['C', 'A', 'T'],
    ['X', 'X', 'X'],
  ];
  const fakePuzzle = {
    grid,
    words: ['CAT', 'ATX'],
    paths: { CAT: [[0, 0], [0, 1], [0, 2]], ATX: [[0, 1], [0, 2], [1, 2]] },
  };
  // CAT's only embedding uses (0,0),(0,1),(0,2). ATX's only embedding
  // uses (0,1),(0,2),(1,2). They share (0,1) and (0,2): claiming CAT
  // first via its only path consumes ATX's only two shared cells,
  // stranding it. matchWord must refuse to accept CAT in that case,
  // since doing so would make ATX unfindable.
  const result = matchWord(fakePuzzle.paths.CAT, fakePuzzle, new Set(), new Set());
  assert(result === null, `synthetic stranding case: claiming CAT should be rejected since it strands ATX (got ${result})`);
}

console.log(`Simulated full playthroughs for ${sample.length} puzzles (${sample.join(', ')}), confirmed every word in them has exactly one grid embedding, plus a synthetic stranding case.`);
console.log(failures === 0 ? 'PASS: 0 failures.' : `FAIL: ${failures} failures.`);
process.exit(failures === 0 ? 0 : 1);
