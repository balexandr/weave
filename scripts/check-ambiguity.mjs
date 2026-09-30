// Checks whether any solution word in a generated puzzle has MORE than
// one valid 8-adjacent self-avoiding path spelling it anywhere on the
// grid, not just its own assigned cells. Confirmed live: a user tracing
// ANCHOR on 2026-09-28's puzzle found a real alternate route through
// PANTS's and STORY's cells that spells ANCHOR just as validly as the
// canonical path, and the current path-identity-only matching rejected
// it. This script measures how widespread that risk is across all
// generated puzzles before deciding on a fix.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const puzzles = JSON.parse(readFileSync(join(__dirname, '../src/data/puzzles.json'), 'utf-8'));

// Counts every distinct path spelling `word` anywhere in the grid,
// capped once it finds a second one (we only need to know "1" vs "more").
function countEmbeddings(word, grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  const target = word;

  function dfs(path, visited) {
    if (count > 1) return;
    if (path.length === target.length) { count++; return; }
    const [r, c] = path[path.length - 1];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;
        if (grid[nr][nc] !== target[path.length]) continue;
        visited.add(key);
        dfs([...path, [nr, nc]], visited);
        visited.delete(key);
        if (count > 1) return;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === target[0]) {
        dfs([[r, c]], new Set([`${r},${c}`]));
      }
      if (count > 1) return count;
    }
  }
  return count;
}

let totalWords = 0;
let ambiguousWords = 0;
let puzzlesWithAmbiguity = 0;
const examples = [];

for (const [date, puzzle] of Object.entries(puzzles)) {
  let thisHasAmbiguity = false;
  for (const word of puzzle.words) {
    totalWords++;
    const n = countEmbeddings(word, puzzle.grid);
    if (n > 1) {
      ambiguousWords++;
      thisHasAmbiguity = true;
      if (examples.length < 10) examples.push(`${date}: "${word}" has ${n > 1 ? '2+' : n} embeddings`);
    }
  }
  if (thisHasAmbiguity) puzzlesWithAmbiguity++;
}

console.log(`Checked ${Object.keys(puzzles).length} puzzles, ${totalWords} total words.`);
console.log(`Ambiguous words (2+ valid grid embeddings): ${ambiguousWords} (${(100 * ambiguousWords / totalWords).toFixed(1)}%)`);
console.log(`Puzzles with at least one ambiguous word: ${puzzlesWithAmbiguity} (${(100 * puzzlesWithAmbiguity / Object.keys(puzzles).length).toFixed(1)}%)`);
console.log('Examples:');
examples.forEach((e) => console.log('  ' + e));
