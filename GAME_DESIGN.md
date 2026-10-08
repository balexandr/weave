# Weave: Design Doc

Status: **concept locked 2026-09-27, build starting same session.**

## Core mechanic

Grid of letters (starting size 5×6 = 30 cells). Drag through adjacent
cells (8-directional, including diagonals, Strands-style, not straight-
lines-only) to trace a word. Every letter in the grid belongs to exactly
one solution word: **full coverage, no leftover filler letters** (locked
with user). No theme, no spangram, no category grouping, just find every
word until the whole grid is highlighted. That's the entire pitch: like
NYT Strands, minus the theme layer.

Decisions locked with user 2026-09-27:
- **Full coverage**: every cell is part of exactly one word.
- **Strands-style path**: 8-directional adjacency, path can twist,
  a cell can't be reused within the same word's path.
- **No theme/spangram**: deliberately dropped vs. Strands. Just tiling.
- **No fail state**: same philosophy as Pathways/Realm. You can't lose,
  only take longer or use hints. A wrong drag just doesn't register
  (snaps back), no penalty, no guess counter ticking against you.
- **3 hints max, star rating**: matches the Squint/Mirror "Wordle-shape"
  convention already established across the suite. A hint reveals the
  first letter of one un-found word. 0 hints used = 3 stars, 1 = 2 stars,
  2-3 = 1 star. (Untested thresholds, same caveat every sibling doc has:
  expect to retune after real play.)
- **Name: Weave, accent amber `#f59e0b`.**

## Fact-check on existing suite state before building (2026-09-27)

Read the actual current hub (`noodle_games/src/data/games.js`) and all 11
sibling `shareAll.js` files rather than trusting the project memory
summary, which turned out stale in three ways:
- **Squint is NOT in the current hub or any sibling roster.** Memory
  listed it as active; it apparently was retired/removed at some point
  without the memory getting updated. Not investigated further here,
  flagged to the user, not silently "fixed."
- **Dial exists** (a word-cryptex game, sky blue `#0ea5e9`/`#38bdf8`) and
  isn't in the project memory table at all. It's in the current 11-game
  roster.
- **Actual accent colors differ from memory**: Odd One Out is lime
  `#84cc16` (memory said green/amber/red), Knot is `#e0932a` (memory said
  rose), Tandem is also lime `#84cc16`, same color as Odd One Out, an
  existing collision, not something introduced here.
- Current 11-game roster (verified byte-identical across all sibling
  `shareAll.js` files): pathways, sprout, chain-link, sequence, knot,
  zero-in, odd-one-out, mirror, realm, tandem, dial.

**Color crowding note**: amber `#f59e0b` is not an exact duplicate of
anything live, but it sits close to three existing warm colors already in
the suite: the hub's own orange `#ff6b35`, Knot's `#e0932a`, and Zero
In's gold `#c9a227`. User picked amber anyway after this was flagged,
proceeding, easy to swap later (icon shape and background theme still
carry most of the "unique feel" per the CLAUDE.md rule, color is one
signal among several).

## Generation: the hard part (per every prior game's precedent)

This is a real exact-cover-style constraint problem: partition an N-cell
grid into a set of self-avoiding, 8-directionally-connected paths, each
spelling a real word, with zero leftover cells. Naive random placement
essentially never succeeds at full coverage (same class of problem Realm
hit with region carving and Mirror hit with multi-beam layouts).

Approach: **backtracking word placement**, longest-word-first, random
retry on failure, generation done offline by a script
(`scripts/generate-puzzles.mjs`), never at runtime:
1. Pick a random subset of words from the bank whose lengths sum to
   exactly the grid's cell count (30 for the 5×6 default).
2. Shuffle word order, try longest first (fewer remaining cells to fail
   into later).
3. For each word, attempt to lay it down as a self-avoiding walk on the
   remaining free cells via randomized DFS with backtracking.
4. If any word fails to place after a bounded number of attempts,
   abandon this word combo and pick a new random subset, don't backtrack
   forever across combos, just retry (same "best-of-N random" pattern
   Mirror's multi-beam generator used once exact search stopped scaling).
5. Verified successful puzzles get a script-level check: every cell
   assigned exactly once, every path 8-adjacent and self-avoiding, every
   word actually in the bank.

## Word bank: closed bank, not an npm dictionary

Checked `an-array-of-english-words` and `word-list` (both live on npm,
~275k words) as a possible dictionary source, but they're raw Linux
wordlists, full of abbreviations, archaic terms, offensive entries, and
obscure inflections that would need heavy filtering before they're fit
for a casual daily puzzle. Following the same precedent Tandem set
(`wordBank.js`, hand-curated and fact-checked rather than scraped): Weave
uses its own curated `src/data/wordBank.js`, common everyday words only,
lengths 3-9, no proper nouns, no abbreviations.

This is also what makes "is this traced word valid" unambiguous at
runtime, same closed-bank trade-off Tandem's doc already flags (a fixed
list can never cover every real word a player tries; content gaps get
reported and patched over time, not pre-solved).

## Board sizing (proposed, tune after first playtest)

- Grid: 5×6 = 30 cells, ~5-6 words/puzzle, average length 5.
- **No difficulty ramp by weekday for v1**: same call Tandem made,
  simplest starting point. Can add a Mon-to-Sun scaling pass later
  (Mirror/Pathways/Sprout/Realm precedent) if it feels flat.
- EPOCH: set to actual ship date (Realm/Tandem precedent, no backdating,
  no multi-day tuning-window risk).

## Persistence (matches suite convention)

- `weave-game-state`: keyed by date, content-fingerprinted (Mirror
  lesson: puzzle data edited after someone might have played it must not
  silently serve stale/broken state).
- `weave-stats`: streak + star-tier distribution.
- `weave-how-to-play-seen`: first-visit modal flag.

## Suite-wide conformance (per CLAUDE.md NoodleGames rule)

- Same footer, same logo font, same how-to-play/stats modal structure as
  every sibling.
- Icon: unique to Weave, same "feel" as siblings' icons, proposing
  something that reads as threads/strands crossing into a completed
  shape, distinct from Chain Link's existing link icon and Tandem's
  arrow-between-tiles icon.
- Text-message share, same convention. Proposed format (grid of squares
  showing hint usage per word found, similar spirit to Knot's colored
  squares):
  ```
  Weave #1 🧶
  6 words, 0 hints
  ⭐⭐⭐
  noodlegames.co
  ```
- Must add to `noodle_games/src/data/games.js` hub AND all 11 sibling
  `shareAll.js` GAMES rosters (byte-identical file, per its own
  "copied byte-for-byte" contract comment) at build time.

## Not decided yet: needs a build-time call, not blocking the doc

- Whether extra (non-solution) dictionary words a player traces should
  count as bonus points. Real Strands has this, deliberately deferred
  here since it needs a broader validity dictionary than the closed
  bank provides. Starting without it.
- Exact hint copy / which un-found word a hint targets (shortest
  remaining vs. random).

## Built: 2026-09-27/28

Live at `/Users/bryanalexander/Code/weave`, React 19 + Vite + CSS Modules
+ localStorage, same stack as every sibling.

- **Word bank**: `src/data/wordBank.js`, 323 unique curated common
  words, lengths 3-9. Considered `an-array-of-english-words`/`word-list`
  (both real npm packages, ~275k words) but they're raw Linux wordlists
  needing heavy filtering for offensive/obscure/abbreviated entries, so
  went with a hand-curated closed bank instead, matching Tandem's
  precedent. Validated by script: 0 duplicates, all lengths in 3-9.
- **Generator**: `scripts/generate-puzzles.mjs`. Randomized greedy
  subset-sum picks a word set summing to exactly 30 cells (5×6 grid),
  then backtracking DFS places each word (longest first) as a
  self-avoiding 8-directional path through unassigned cells, retrying
  the whole puzzle on failure. Generated 96 puzzles (2026-09-27 through
  2026-12-31) in 0.2s with zero failures. The subset-sum + backtracking
  combo converges fast at this grid size, no need for the
  connectivity-pruning optimization flagged as a fallback option.
- **Independently re-verified**, not just trusted from the generator's
  own logic (Realm/Mirror precedent): `scripts/verify-puzzles.mjs`
  re-checks every puzzle from the output file: full 30-cell coverage,
  every word in the bank, every path genuinely 8-adjacent and
  self-avoiding, grid letters match each path exactly, no cell claimed
  by two words. 96/96 puzzles, 567 total words (avg 5.91/puzzle), 0
  errors.
- **Match validation**: closed-bank, path-identity based, not an open
  dictionary. A dragged path counts as finding a word only if its cell
  sequence matches that word's canonical generated path, forwards or
  backwards. Pulled into `src/utils/matchWord.js` as a pure function
  specifically so it could be tested standalone
  (`scripts/test-matching.mjs`): simulated full playthroughs of 3 sample
  puzzles (first/middle/last generated date). Every word's forward and
  reversed path matches, truncated paths don't match anything, a path
  stitched across two different words' cells doesn't spuriously match
  either, already-found words don't re-match. 0 failures.
- **`npm run build` passes clean**, including after the matchWord
  extraction refactor.
- **Not verified live in a real browser**. No browser-automation tool
  (Playwright, computer-use, Chrome extension) was available in this
  session, so the actual pointer-drag interaction, path-drawing SVG, hint
  highlighting, win/result-screen flow, and mobile touch handling are
  confirmed correct only at the logic level above, not by driving the
  real UI. Dev server was left running at `localhost:5183` for the user
  to check by hand. This is a real gap, flagged per house rule rather
  than claimed as done: every prior sibling's "Built" section confirms
  with an actual browser pass, this one doesn't yet.
- **Hub + all 11 sibling repos wired same pass**: added Weave to
  `noodle_games/src/data/games.js`, and confirmed all 12 `shareAll.js`
  files (11 existing siblings + Weave's own) are byte-identical
  (single md5 across all 12) with Weave appended after Dial.
- **Not done, deliberately left for the user to trigger** (all
  outward-facing, per standing instruction to never commit/push without
  asking first): no git init/commit in the new `weave` repo, no push, no
  deploy, no og-image.png.

## Tap-to-build added, plus a live attempt display: 2026-09-28

User tried the dev server and asked for two things: tap letters one at a
time as an alternative to dragging, and a visible display of the word
being attempted.

**Tap-to-build**: unified with drag rather than bolted on separately.
`WeaveGrid.jsx` now distinguishes a real drag from a plain tap by
tracking whether the pointer actually moved to a different cell during
the gesture (`movedRef`). A drag still submits on release with the
existing wrong-flash-and-reset behavior (a deliberate "try this" act). A
plain tap extends or undoes the path silently, no penalty on a
non-match, since a partial tap sequence isn't a real attempt yet, and
only succeeds/clears when it happens to complete a real word. Tapping the
path's last cell again undoes it; tapping a non-adjacent cell starts a
fresh path there, same reset behavior a fresh drag already had.

Split the hook's success logic out into a shared `applyFound(word)`
helper used by both `submitPath` (drag release) and the new `checkTap`
(silent per-tap check), so the found-word and win-check logic isn't
duplicated. Explicitly avoided the ref-inside-functional-updater pattern
that broke Tandem's time bonus (documented in
[[project_noodle_games]]): `checkTap`/`nextPathFor` read `currentPath`
directly from the hook's normal render closure rather than trying to
read a ref synchronously right after a `setState` call.

**Live attempt display**: a small text row above the grid in `App.jsx`
shows the letters of the current path joined together (reading straight
off `puzzle.grid`), updating on every drag/tap. Shows a muted placeholder
("Drag or tap letters") when the path is empty.

Rebuilt clean, re-ran both `verify-puzzles.mjs` and `test-matching.mjs`
(unaffected by this change, still 0 errors/failures). Still not verified
in an actual browser, same gap as the initial build.

## Real bug: path-identity matching was rejecting valid words: 2026-09-28

User reported tracing ANCHOR and RAIN on the live puzzle and neither
registered as correct. Investigated rather than guessing: today's
puzzle (2026-09-28) has ANCHOR at canonical path
`[[4,4],[4,3],[4,2],[3,2],[2,3],[1,4]]`, starting from the A at (4,4).
The grid also has an A at (2,1) and (2,4). Traced by hand: starting from
(2,1) instead, A-N-C-H-O-R is spellable via a completely different,
fully valid 8-adjacent route through cells that are actually PANTS's
and STORY's canonical letters. The original design (documented above as
a known, accepted trade-off: "not accepting a coincidental alternate
route through the same letters") rejected this, exactly reproducing the
report.

Measured how common this actually is before deciding it was worth a
structural fix rather than a one-off patch: `scripts/check-ambiguity.mjs`
found **47.3% of all 567 words across all 96 puzzles have at least one
alternate valid grid embedding, and 98% of puzzles have at least one
such word.** This isn't a rare edge case, it's close to the norm at this
grid density (30 real-letter cells, ~26-letter alphabet, short common
words). The original "closed-bank, path-identity" design decision was a
real bug waiting to surface on almost every puzzle, not a narrow
theoretical caveat.

**Fix, in `src/utils/matchWord.js`**: accept ANY path the player
actually traces (forward or reverse) whose letters spell a remaining
word, not just the generator's one canonical path. The obvious risk:
accepting an alternate route can consume cells another still-unfound
word needs, potentially making it permanently unfindable and breaking
the game's core "the whole grid can always be fully covered" promise.
Guarded against that: before accepting a non-canonical route, verifies
every OTHER remaining word still has at least one valid embedding using
only the cells that would still be free afterward (`hasEmbedding()`, a
DFS existence check, not a full exact-cover proof, an approximation
documented as such in the code). If accepting would strand another
word, the attempt is rejected, same as any other non-match.

**This does NOT fully resolve the ANCHOR case as reported.** Brute-force
checked every alternate embedding of ANCHOR on the live puzzle
(`scripts/test-matching.mjs`): the one starting from the "wrong" A at
(2,1) is correctly REJECTED by the new solvability guard, because
accepting it really would strand PANTS and/or STORY. Only one of
ANCHOR's several alternates (a route that reuses most of the canonical
path but exits through a different final R) is safe and gets accepted.
So if the user's actual attempt started from that other A, the new fix
still correctly refuses it, and the real gap becomes: there's no UI
distinction between "not a real word" and "a real word, but accepting
it would break the puzzle", both currently look identical (silent
no-op on a tap, wrong-flash on a drag). Flagged, not fixed, needs a
real conversation with the user about whether/how to surface that
distinction rather than guessing at copy.

**Found cells now track what the player actually traced, not the
generator's assignment.** `useGameState.js` gained `foundWordPaths`
(persisted alongside `foundWords`), since a found word's highlighted
cells may no longer match `puzzle.paths[word]` once an alternate route
is accepted. `WeaveGrid.jsx`'s thread-color rendering reads from
`foundWordPaths` first, falling back to the canonical path.

Verified: `scripts/test-matching.mjs` rewritten to brute-force every
embedding of ANCHOR/RAIN/RIB on the live 2026-09-28 puzzle and assert
against the real matcher (not hand-picked examples), plus a synthetic
2-word stranding case. All pass, and the test explicitly proves both
branches of the guard fire on real data (something gets accepted,
something gets correctly rejected), not just the synthetic case.
`verify-puzzles.mjs` still passes (puzzle data itself is unaffected by
this, it's a matching-logic change only). Rebuilt clean.

**Still not verified in an actual browser** (same standing gap as the
rest of this doc), so whether this actually resolves what the user saw
depends on which exact path they traced, which I can't observe.

## Weekday difficulty ramp added: 2026-09-30

User asked to add the Mon-to-Sun difficulty ramp that was left as a v1
simplification (see "Board sizing" above). Followed the established
suite shape (Mirror/Pathways/Sprout/Realm): small and easy early in the
week, Sunday as the "boss day". Grid sizes in `WEEKLY_GRID_SIZE`
(`scripts/generate-puzzles.mjs`):

| Day | Size | Cells |
|---|---|---|
| Monday | 4x5 | 20 |
| Tuesday | 4x6 | 24 |
| Wednesday | 5x5 | 25 |
| Thursday | 5x6 | 30 (the original flat-difficulty size) |
| Friday | 5x7 | 35 |
| Saturday | 6x7 | 42 |
| Sunday | 6x8 | 48 (matches real Strands' usual size) |

**The zero-ambiguity constraint from the previous fix broke at larger
sizes, and had to be fixed properly, not just re-tuned.** First attempt
kept the "generate a full random tiling, reject the whole thing and
retry from scratch if anything's ambiguous" strategy from before,
just parameterized by day. Regenerating failed outright on the first
Saturday (6x7, 42 cells) even at `OUTER_ATTEMPTS = 20000`. Measured why
rather than just cranking the retry budget further: instrumented the
generator and found only ~1.3% of attempts even reach a full valid
tiling at 42 cells (placement itself gets harder as the grid grows, a
separate problem from ambiguity), and of THOSE, essentially none were
also ambiguity-free (1 success in 20,000 full attempts, i.e. ~0.005%).
Tried the obvious mitigations first: biasing word selection toward
fewer/longer words (fewer letters in play should mean fewer accidental
collisions) and raising the minimum word length. Both helped some
(minLen=8 got to ~0.025%) but not nearly enough to be reliable, and
Sunday's 48-cell grid would only be worse.

**Real fix: repair instead of reject.** Measured that discarding a
successfully-placed grid over ONE ambiguous word was wasteful, most of
a 42-or-48-cell tiling is expensive to find and was already fine.
`repairAmbiguity()` in `scripts/generate-puzzles.mjs` keeps the grid and
patches just the ambiguous word(s): swaps in a different same-length
bank word (not already used elsewhere in the puzzle) into the exact
same cells, no new placement search needed, and re-checks; keeps the
swap if it actually reduces the ambiguous-word count, reverts and tries
another candidate otherwise. This is cheap (a letter swap plus a
re-check) and reuses the one expensive part (a valid full-coverage
tiling) instead of throwing it away.

Measured success rate per base attempt across all 7 sizes before
shipping, not assumed: 11.9% (Monday, 4x5) down to 0.57% (Sunday, 6x8),
all achieved in well under 350ms for 3000 test attempts per size. Even
the worst case makes a from-scratch failure astronomically unlikely
within the existing 20,000-attempt outer budget. Regenerating all 96
puzzles (now spanning all 7 sizes across the date range) took 0.5s,
down from the already-fast 5.3s the flat-grid zero-ambiguity fix needed.

**Verified**: `verify-puzzles.mjs` (full coverage, valid words, correct
adjacency, now derives rows/cols from each puzzle's own grid instead of
a hardcoded constant, since size now varies by day) passes clean, 576
total words across 96 puzzles. `check-ambiguity.mjs` (also updated to
derive grid dimensions per-puzzle) confirms 0% ambiguous words, 0%
ambiguous puzzles, across every size. `test-matching.mjs` passes
unchanged (its helper functions already derived grid dimensions from
the grid itself, not a hardcoded constant). Spot-checked the first full
week of generated dates by hand: each date's grid size matches its
actual day-of-week exactly (Sun 6x8, Mon 4x5, Tue 4x6, Wed 5x5, Thu
5x6, Fri 5x7, Sat 6x7).

**UI updated for variable grid dimensions**: `WeaveGrid.jsx`'s board
aspect ratio was a hardcoded `6/5` in CSS, now set inline per-puzzle
from the actual `cols/rows` the generator produced. `npm run build`
passes clean.

**Not verified in an actual browser** (standing gap, same as everywhere
else in this doc): whether the letter size/legibility actually holds up
on a 48-cell Sunday grid on a real phone screen is a real visual
question this doc can't answer without a browser tool.

## Ambiguity eliminated at generation time: 2026-09-28

User feedback on the previous fix: don't just make the runtime matcher
smarter about alternate spellings, make sure they don't exist at all.
Fair call: the flexible-matcher fix above still left a confusing
experience (a correctly-spelled word silently rejected because
accepting it would strand another word, indistinguishable from "not a
word"), and that's worse UX than just not generating puzzles with the
problem in the first place.

Added a real constraint to `scripts/generate-puzzles.mjs`:
`hasAnyAmbiguousWord()` checks, for a candidate puzzle, whether ANY
solution word has more than one valid 8-adjacent embedding anywhere on
the grid (not just its own assigned cells). Wired into `generatePuzzle`'s
success condition: a candidate that places all words AND achieves full
coverage AND has zero ambiguous words is accepted; anything else is
discarded and a completely different random word-set/placement is
tried, same "best-of-N random" retry pattern the generator already used.

**This is a real cost, not free**: since 98% of previously-valid random
tilings had at least one ambiguous word (measured earlier this session),
finding one clean tiling now takes on the order of 50-100x more
attempts. Bumped the outer retry budget from 300 to 20,000 to
accommodate that. Measured actual cost rather than assuming it was fine:
regenerating all 96 puzzles took 5.3s (was 0.2s), still trivially fast
for an offline script that only runs when content changes.

**Verified two ways**: `scripts/check-ambiguity.mjs` re-run against the
full regenerated 96-puzzle dataset: 0 ambiguous words, 0 ambiguous
puzzles (was 47.3% / 97.9%). `scripts/verify-puzzles.mjs` (full
coverage, valid words, correct adjacency) still passes clean on the new
data. `scripts/test-matching.mjs` rewritten again: the old
ANCHOR/RAIN-specific brute-force section no longer applies (those exact
puzzles don't exist anymore, today's 2026-09-28 puzzle is now CLOCK,
CRANBERRY, HAT, PEANUT, PENGUIN), replaced with a general check that
every word in the sampled puzzles has exactly one grid embedding, plus
the synthetic stranding-guard test (kept, still exercises
`matchWord.js`'s guard logic directly regardless of whether real data
ever needs it now).

**The flexible-matching/solvability-guard logic in `matchWord.js` from
the previous fix is kept as defense in depth**, not reverted, even
though real puzzle data should no longer exercise its "accept a
non-canonical alternate" branch at all. Cheap to keep, protects against
any future edit to the generator or word bank re-introducing ambiguity
without the runtime behavior silently regressing to the original bug.

**Today's puzzle changed as a side effect of regenerating**: anyone with
in-progress saved state for 2026-09-28's old content will see a fresh
board on reload, the existing content-fingerprint guard in
`useGameState.js` (the Mirror lesson) already handles this correctly,
confirmed this is the mechanism doing the invalidation, not a new gap.

## Thread-color collision fixed: 2026-09-28

User asked to make sure every found word gets a genuinely unique color.
Checked and it was a real bug, not a hypothetical: `THREAD_COLORS` was a
fixed 6-color array cycled with `i % 6`, and the actual generated puzzle
distribution has 23 five-word, 59 six-word, and 14 seven-word puzzles,
including today's (2026-09-28, 7 words). Any 7-plus-word puzzle silently
reused word index 0's color for word index 6.

Fixed by generating hues on the fly (`threadColorFor(index, total)` in
`WeaveGrid.jsx`): spaces `total` colors evenly around the hue circle
(`360 / total` apart) instead of drawing from a fixed-size palette, so
it's correct for any word count rather than only the counts someone
happened to pick colors for. Verified with a script across word counts
5/6/7/8/10: all produce that many mutually distinct colors, no
duplicates.

## Color-crowding flag, revisited after seeing the grid live

Not yet revisited, flagged once already in the "Fact-check" section
above (amber sits near 3 other warm suite colors). No further action
taken since the user hasn't weighed in again; still swappable via
`--accent`/`--accent-hover` in `src/index.css` plus `threadColorFor()`
in `WeaveGrid.jsx` (the hue-spacing function that replaced the old
fixed `THREAD_COLORS` array, see "Thread-color collision fixed" above)
if it turns out to look wrong once seen in a real browser.

## Found-cell hover affordance fixed: 2026-10-07

User asked that already-solved letters not be selectable at all.
Checked the actual code before changing anything: both
`handlePointerDown` and `handlePointerMove` in `WeaveGrid.jsx` already
refuse to start or extend a path into a found cell, and have since the
original build, tap-building routes through the same `handlePointerDown`
guard, so this was already fully correct functionally. What WAS a real
gap: `.cell:hover` in `WeaveGrid.module.css` applied to every cell
including found ones, so hovering a solved letter on desktop still
brightened it and glowed its border like it was clickable, even though
clicking did nothing. Scoped the hover rule to `.cell:hover:not(.cellFound)`.

## Progressive hints, one word at a time: 2026-10-07

User asked that a second hint continue revealing the SAME word the
first hint started (its next letter), rather than jumping to a
different word's first letter. Reworked the hint model in
`useGameState.js`: `hintedWords` (a Set of which words got a hint) is
now `hintProgress` (a word -> revealed-letter-count map), plus
`activeHintWord` tracking which word is currently being built up.
`useHint()` continues the active word (reveals its next letter) as long
as it's still unfound and not already fully revealed; only picks a
fresh word once that one's done (found, independently or via hints
exhausting it). `hintedCells` now lights up every revealed letter of
the active word, not just its first.

Verified with a standalone simulation against real puzzle data (not
just reasoning about the code): 3 hints in a row on the same puzzle
correctly revealed a 4-letter word's first 3 letters one at a time
(`C` -> `CO` -> `COR`); a separate scenario confirmed that if the
active word gets found independently (not via hints) between hint
presses, the next hint correctly starts a new word rather than trying
to continue one that's already done. `npm run build` passes clean.

## Real bug: completed word's letters leaked into the next attempt: 2026-10-07

User reported: finished CLOSET, then started tracing VINEGAR, and the
attempt display showed "CLOSETVINEGAR". CLOSET's path never actually
cleared.

Root cause, in `WeaveGrid.jsx`'s `handlePointerUp`: it called
`onSubmit`/`onTapCheck` from INSIDE a `setCurrentPath` functional
updater (`onPathChange((prev) => { onSubmit(prev); return prev; })`,
read-prev-as-a-side-channel, same shape the pointerdown/pointermove
handlers also use). But `onSubmit`/`onTapCheck` can themselves trigger
`applyFound`, which calls `setCurrentPath([])` directly. That's a
SECOND, independent dispatch to the same piece of state, fired while
React was still in the middle of resolving the FIRST one. Nothing
guarantees the outer updater's `return prev` (the stale, unchanged
path) gets applied before rather than after the nested clear, so the
"finished, clear it" turned out to not reliably win, silently reviving
the just-completed word's path as the apparent start of the next one.

This is the exact nested-setState-in-a-functional-updater hazard
Tandem's time-bonus bug hit before (a ref read right after a `setState`
call, assuming eager/synchronous execution that React doesn't
guarantee). Different mechanism (a ref there, a second `setState` call
here), same root mistake: relying on ordering between two updates to
one piece of state instead of just reading state that's already
current.

Fixed by not going through the updater at all for this read:
`handlePointerUp` now reads `currentPath` directly (the prop, already
fresh by the time a genuinely separate pointerup event fires) and calls
`onSubmit`/`onTapCheck` as plain top-level calls, not nested inside
another `setCurrentPath` dispatch. Swept the rest of the codebase for
the same pattern (any functional updater that calls another setter
inside it): `applyFound` in `useGameState.js` has several, but all of
them compute and return pure derived values, no nested setState calls,
and it's now called directly from the event handler rather than from
inside an outer updater, so the hazard doesn't apply there. `npm run
build` passes clean.

**Not independently verified beyond rebuilding**: this is a React
scheduling/batching bug, not a pure-logic one, so it can't be caught by
a Node script the way `matchWord.js` was fuzz-tested. Confirming it's
actually fixed needs a real browser, the standing gap this whole doc
keeps flagging.

## Social-share OG image added: 2026-10-07

No sibling repo had a committed generator for this (each one's
`og-image.png` was designed directly, no script found in any of them),
and no image-generation tool was available in this session, so built
one from scratch: `scripts/generate-og-image.mjs` renders an SVG
(2400x1260, matching every sibling's size) to PNG with `sharp` (added
as a devDependency). Layout follows the same template Realm's and
Mirror's images use: icon + wordmark centered, a two-line tagline below,
a small `NOODLEGAMES · DAILY WORD PUZZLE` brand label at the bottom.
The icon is the same two-thread weave mark as `GameLogo.jsx`, scaled up
as plain SVG paths rather than a font glyph, so it renders identically
regardless of what fonts are installed on the machine doing the
rendering. Iterated on centering by actually rendering and viewing the
PNG (the icon+wordmark row was initially off-center, measured and
corrected), not just eyeballing the SVG coordinates.

## Emoji replaced with real icons: 2026-10-07

User asked to replace emoji in the UI with real icons across every
NoodleGame, one game at a time, to read less like default AI output.
Checked a sibling (Realm) first to confirm scope: every game in the
suite uses the same emoji-heavy pattern (👑, 🏆, 🎯, ✕, ⬆, etc.), so
this isn't a Weave-specific fix, it's a suite-wide pass. Starting with
Weave since it's the one open; the rest of the suite is a separate pass,
not done in this session (11 other live, deployed repos, too much to
responsibly rush through in one sitting).

**What was NOT touched, deliberately**: the actual share text
(`useGameState.js`'s `generateShareText`, and `shareAll.js`'s shared
header) still uses real emoji (🧶, ⭐, 💡, 🍜). That text gets sent
through SMS/clipboard as plain characters, a custom SVG icon can't
survive that trip, so the Wordle-style "emoji result grid" convention
the whole suite already uses there is correct and stays as-is. Swapping
those would just break sharing.

**What changed**: every emoji in the rendered UI. New file
`src/components/Icons.jsx`, ten small line-art components (drag, check-
circle, x-circle, bulb, trophy, flame, thumbs-up, close, share,
checkmark) plus a star and an empty-state weave-mark, all matching the
visual language the header's stats icon already established (24x24
viewBox, `currentColor` stroke, rounded caps) rather than inventing a
new style. Wired into `HowToPlay.jsx` (4 step icons), `ResultScreen.jsx`
(rating badge, close button, star rating row, share button),
`StatsScreen.jsx` (close button, star distribution rows), and
`App.jsx` (hint button, empty-state mark, footer share-all button).
Removed `starsText()` from `scoring.js`, dead code once its only
caller (StatsScreen) switched to rendering real `IconStar` elements.

**Verified by actually rendering the icons**, not just reading the SVG
markup: rasterized all 11 with `sharp` into a sprite sheet and viewed
it, caught nothing wrong but confirmed every shape reads correctly at
the actual size used (checkmark, X, bulb, trophy, flame, thumbs-up,
star, close, share-arrow, drag, and the weave-mark empty-state icon all
legible and on-theme). `npm run build` passes clean, re-scanned the
whole `src/` tree afterward and confirmed only the two share-text files
still contain emoji, by design.

**Not verified**: how these actually look laid out in the real running
app (spacing, alignment, hover states) still needs a real browser pass,
same standing gap as everywhere else in this doc. The rendered-sprite-
sheet check proves the icon shapes are correct, not that they're
positioned well inside their buttons/rows.

## Epoch reset for real launch: 2026-10-07

User asked that tomorrow's puzzle show as #1 when real players see it.
Same move Mirror made before its own real launch (see that section
above): everything generated and played since the original build
(2026-09-27) was build/iteration content, not real puzzle history, so
resetting the epoch rather than trying to preserve day-count continuity
is correct here, not a shortcut.

`EPOCH` moved from `2026-09-27` to `2026-10-08` (tomorrow, relative to
today 2026-10-07) in both `scripts/generate-puzzles.mjs` and
`useGameState.js` (these two copies have to agree, same as every
constant that exists in both the offline generator and the runtime).
`END_DATE` pushed from `2026-12-31` to `2027-01-11`, matching the
original ~96-day runway rather than shrinking it by the 11 days the
epoch moved forward. Puzzle data fully regenerated from the new epoch
(today, 2026-10-07, is no longer in `puzzles.json` at all, it was
dev/testing content under the old epoch and doesn't carry forward).

Verified: `(2026-10-08 - EPOCH)/86400000 + 1 = 1` checked directly
against the real formula, not assumed. `verify-puzzles.mjs` and
`check-ambiguity.mjs` pass clean on the regenerated 96 puzzles (596
total words this time, the weekday-size mix shifted slightly since
which day-of-week lands on which calendar date changed). `npm run
build` passes clean. Today (2026-10-07) falling out of the puzzle
data means the app will show its "No puzzle today" empty state if
visited today, by design, not a bug, exactly mirroring what a genuine
reset should do.
