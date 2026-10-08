import { useRef, useCallback, useEffect } from 'react';
import styles from './WeaveGrid.module.css';

// A distinct thread color per found word, by its stable index in the
// sorted word list. Generated from evenly-spaced hues rather than a
// fixed palette array: a fixed 6-color array silently reused colors on
// any puzzle with more than 6 words (today's has 7), since index 6
// would wrap back to index 0's color. Spacing hues by 360/total instead
// guarantees exactly `total` mutually distinct colors no matter how many
// words a given day's puzzle has.
const HUE_OFFSET = 18; // shifts word 0 off pure red, cosmetic only

function threadColorFor(index, total) {
  const hue = Math.round(HUE_OFFSET + (360 / total) * index) % 360;
  return `hsl(${hue}, 76%, 58%)`;
}

function isAdjacent8([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2);
}

function cellKey([r, c]) {
  return `${r},${c}`;
}

export default function WeaveGrid({ puzzle, currentPath, onPathChange, onSubmit, onTapCheck, foundCells, foundWords, foundWordPaths, hintedCells, wrongFlashToken, locked }) {
  const { grid } = puzzle;
  const rows = grid.length;
  const cols = grid[0].length;

  const drawingRef = useRef(false);
  // Tracks whether the pointer actually moved to a different cell during
  // this gesture. A tap (down+up on the same cell, no move) builds the
  // word one letter at a time with no penalty on a non-match, since it
  // might just be a partial word so far. A real drag still submits on
  // release with the existing wrong-flash-and-reset behavior, since
  // releasing after dragging across cells is a deliberate "try this" act.
  const movedRef = useRef(false);
  const downCellRef = useRef(null);
  const gridRef = useRef(null);
  // Mirrors currentPath, written synchronously by this component's own
  // handlers instead of read back from the currentPath prop. On a fast
  // tap (touchstart immediately followed by touchend), there isn't
  // always a render between the two events, so the currentPath prop can
  // still reflect the PREVIOUS tap's path when pointerUp fires, one
  // gesture behind. That made the match-check on the final letter of a
  // word run against the path as it stood before that letter was added,
  // so tapping a word out never completed it (dragging worked because a
  // drag has real time between moves for React to re-render). Reading
  // and writing this ref imperatively in the same call as each pointer
  // event removes any dependency on render timing.
  const pathRef = useRef(currentPath);
  useEffect(() => {
    pathRef.current = currentPath;
  }, [currentPath]);

  const currentPathSet = new Set(currentPath.map(cellKey));

  const wordColorByCell = {};
  const sortedWords = puzzle.words;
  sortedWords.forEach((word, i) => {
    const color = threadColorFor(i, sortedWords.length);
    if (foundWords.has(word)) {
      const path = foundWordPaths[word] || puzzle.paths[word];
      path.forEach(([r, c]) => { wordColorByCell[cellKey([r, c])] = color; });
    }
  });

  const cellFromPoint = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const cell = el.closest('[data-row]');
    if (!cell) return null;
    return [parseInt(cell.dataset.row), parseInt(cell.dataset.col)];
  }, []);

  // Tapping/clicking the last cell again undoes it; tapping an adjacent
  // free cell extends the path; anything else starts a fresh path there.
  // Used both to seed a gesture on pointerdown and to build up a path
  // purely by tapping, letter by letter, across separate gestures.
  const nextPathFor = useCallback((r, c) => {
    const path = pathRef.current;
    if (path.length === 0) return [[r, c]];
    const last = path[path.length - 1];
    if (last[0] === r && last[1] === c) return path.slice(0, -1);
    if (isAdjacent8(last, [r, c]) && !path.some(([pr, pc]) => pr === r && pc === c)) {
      return [...path, [r, c]];
    }
    return [[r, c]];
  }, []);

  const handlePointerDown = useCallback((r, c) => {
    if (locked) return;
    if (foundCells.has(cellKey([r, c]))) return;
    drawingRef.current = true;
    movedRef.current = false;
    downCellRef.current = [r, c];
    const next = nextPathFor(r, c);
    pathRef.current = next;
    onPathChange(next);
  }, [locked, foundCells, onPathChange, nextPathFor]);

  const handlePointerMove = useCallback((e) => {
    if (!drawingRef.current || locked) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pos = cellFromPoint(clientX, clientY);
    if (!pos) return;
    const [r, c] = pos;
    const down = downCellRef.current;
    if (down && (r !== down[0] || c !== down[1])) movedRef.current = true;
    if (foundCells.has(cellKey(pos))) return;

    const prev = pathRef.current;
    if (prev.length === 0) return;
    const last = prev[prev.length - 1];
    if (last[0] === r && last[1] === c) return;
    let next = null;
    if (prev.length >= 2) {
      const secondLast = prev[prev.length - 2];
      if (secondLast[0] === r && secondLast[1] === c) next = prev.slice(0, -1);
    }
    if (next === null) {
      if (!isAdjacent8(last, pos)) return;
      const prevSet = new Set(prev.map(cellKey));
      if (prevSet.has(cellKey(pos))) return;
      next = [...prev, pos];
    }
    pathRef.current = next;
    onPathChange(next);
  }, [locked, cellFromPoint, foundCells, onPathChange]);

  // Reads pathRef (synced imperatively by this component's own handlers,
  // see the comment on its declaration above) rather than the currentPath
  // prop, and rather than a setCurrentPath functional updater. Both of
  // those depend on React's render/commit timing, which this doesn't:
  // - A functional updater nests badly: onSubmit/onTapCheck can themselves
  //   call setCurrentPath (applyFound clears it to [] on a match), and
  //   nesting that inside this updater's own setCurrentPath call meant
  //   React could apply this updater's "return prev unchanged" AFTER the
  //   nested clear, silently reviving the just-completed word's path
  //   instead of leaving it cleared (confirmed live: finishing CLOSET
  //   then starting VINEGAR showed "CLOSETVINEGAR").
  // - The currentPath prop lags by a gesture on a fast tap: touchstart
  //   immediately followed by touchend doesn't always leave time for a
  //   render in between, so the prop can still be the PREVIOUS tap's path
  //   when this fires. That made tapping a word's last letter check the
  //   path as it stood before that letter was added, so tap-to-build
  //   never actually completed a word, only dragging did.
  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const path = pathRef.current;
    if (path.length === 0) return;
    if (movedRef.current) {
      onSubmit(path);
    } else {
      onTapCheck(path);
    }
  }, [onSubmit, onTapCheck]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handlePointerMove, { passive: false });
    el.addEventListener('touchend', handlePointerUp, { passive: false });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    return () => {
      el.removeEventListener('touchmove', handlePointerMove);
      el.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div className={styles.boardFrame}>
      <div
        className={styles.gridWrap}
        style={{ aspectRatio: `${cols} / ${rows}` }}
        ref={gridRef}
        onMouseDown={(e) => {
          const cell = e.target.closest('[data-row]');
          if (cell) handlePointerDown(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
        }}
        onTouchStart={(e) => {
          const cell = e.target.closest('[data-row]');
          if (cell) handlePointerDown(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
        }}
      >
        <svg className={styles.pathSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {currentPath.map((pos, i) => {
            if (i === 0) return null;
            const prev = currentPath[i - 1];
            const cellW = 100 / cols;
            const cellH = 100 / rows;
            const x1 = (prev[1] + 0.5) * cellW;
            const y1 = (prev[0] + 0.5) * cellH;
            const x2 = (pos[1] + 0.5) * cellW;
            const y2 = (pos[0] + 0.5) * cellH;
            return (
              <line
                key={i}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                className={`${styles.pathLine} ${wrongFlashToken ? styles.pathLineWrong : ''}`}
              />
            );
          })}
        </svg>

        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey([r, c]);
              const isFound = foundCells.has(key);
              const isCurrent = currentPathSet.has(key);
              const isHinted = hintedCells.has(key);
              const threadColor = wordColorByCell[key];

              let cellClass = styles.cell;
              if (isFound) cellClass += ` ${styles.cellFound}`;
              if (isCurrent) cellClass += ` ${styles.cellCurrent}`;
              if (isHinted && !isFound) cellClass += ` ${styles.cellHinted}`;

              return (
                <div
                  key={key}
                  className={cellClass}
                  data-row={r}
                  data-col={c}
                  style={isFound ? { '--thread': threadColor } : undefined}
                >
                  <span className={styles.cellLetter}>{letter}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
