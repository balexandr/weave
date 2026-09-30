// Independent re-verification of generate-puzzles.mjs's output. Checks
// the actual generated data, not the generator's own logic, same
// precedent as Realm/Mirror's "re-verified with a solver" step.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WORD_BANK } from '../src/data/wordBank.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BANK_SET = new Set(WORD_BANK.map((w) => w.toUpperCase()));

const puzzles = JSON.parse(readFileSync(join(__dirname, '../src/data/puzzles.json'), 'utf-8'));

function isAdjacent8([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2);
}

let errors = 0;
let totalWords = 0;
const dates = Object.keys(puzzles).sort();

for (const date of dates) {
  const { grid, words, paths } = puzzles[date];
  const label = (msg) => { console.error(`[${date}] ${msg}`); errors++; };

  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  if (rows === 0 || grid.some((row) => row.length !== cols)) {
    label('grid dimensions inconsistent'); continue;
  }
  if (grid.some((row) => row.some((cell) => !cell || typeof cell !== 'string'))) {
    label('grid has empty/invalid cell');
  }

  const claimedCells = new Set();
  for (const word of words) {
    if (!BANK_SET.has(word)) label(`word "${word}" not in bank`);
    const path = paths[word];
    if (!path || path.length !== word.length) { label(`path length mismatch for "${word}"`); continue; }

    const seenInPath = new Set();
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];
      const key = `${r},${c}`;
      if (r < 0 || r >= rows || c < 0 || c >= cols) label(`"${word}" path cell out of bounds`);
      if (seenInPath.has(key)) label(`"${word}" revisits its own cell`);
      seenInPath.add(key);
      if (claimedCells.has(key)) label(`"${word}" overlaps another word's cell at ${key}`);
      claimedCells.add(key);
      if (i > 0 && !isAdjacent8(path[i - 1], path[i])) label(`"${word}" path not 8-adjacent at step ${i}`);
      if (grid[r][c] !== word[i]) label(`grid letter at ${key} doesn't match "${word}"[${i}]`);
    }
  }

  if (claimedCells.size !== rows * cols) {
    label(`coverage incomplete: ${claimedCells.size}/${rows * cols} cells claimed (leftover letters)`);
  }
  if (new Set(words).size !== words.length) label('duplicate word in same puzzle');
  totalWords += words.length;
}

console.log(`Checked ${dates.length} puzzles, ${totalWords} total words, avg ${(totalWords / dates.length).toFixed(2)} words/puzzle.`);
console.log(errors === 0 ? 'PASS: 0 errors.' : `FAIL: ${errors} errors.`);
process.exit(errors === 0 ? 0 : 1);
