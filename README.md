# Weave: Daily Word Grid

A daily word-find puzzle: trace every word hidden in the grid. Every
letter belongs to exactly one word, no leftovers, no theme.

Part of the [NoodleGames](https://noodlegames.co) family.

---

## How to play

Drag through adjacent letters, or tap them one at a time, to trace a
word. Any direction, including diagonals.

- Spell a real word from the puzzle and it locks in, those letters light
  up and stay found.
- No theme connects the words, just find every one until the whole grid
  is highlighted.
- Wrong guess costs nothing: the path just resets. No penalty, no fail
  state, take your time.
- Stuck? Use a hint (3 available). Each one reveals the starting letter
  of an unfound word. Fewer hints used, more stars.
- The clock starts on your first word found, not on load, so scanning
  time before that isn't counted.
- Grid size ramps by day of week: Monday's a quick 4x5, Sunday's a
  48-cell "boss day" grid.

---

## Scoring

Star rating by hints used: 0 hints is 3 stars, 1 hint is 2 stars, 2-3
hints is 1 star.

---

## Sharing

After solving, share your result: word count, time, hints used, and
your star rating. Once you've finished at least one NoodleGame today, a
**Share all completed** button appears in the footer.

---

## Stack

React + Vite · CSS Modules · localStorage · GitHub Pages

---

## Puzzle generation

`src/data/wordBank.js` holds a hand-curated bank of common English
words (not a scraped dictionary, see `GAME_DESIGN.md` for why).
`scripts/generate-puzzles.mjs` builds each day's grid offline: picks a
word set that exactly fills the day's cell count, places each word as a
self-avoiding path via backtracking, and repairs any word that turns
out to have more than one valid spelling elsewhere on the grid by
swapping in a different same-length word, so every word has exactly one
findable route. `scripts/verify-puzzles.mjs` and
`scripts/check-ambiguity.mjs` independently re-check the generated
output rather than trusting the generator's own logic.

Full design history and every decision made along the way is in
`GAME_DESIGN.md`.
