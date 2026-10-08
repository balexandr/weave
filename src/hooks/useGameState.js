import { useState, useEffect, useCallback, useRef } from 'react';
import puzzles from '../data/puzzles.json';
import { getTierFromHints, formatElapsed } from '../utils/scoring';
import { matchWord } from '../utils/matchWord';

const STORAGE_KEY = 'weave-game-state';
const EPOCH = '2026-10-08';
const MAX_HINTS = 3;

function getTodayKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

// Content fingerprint, per the Mirror lesson: if a puzzle's words ever get
// edited after someone may have already played it, a save keyed only by
// date must not silently serve stale/mismatched state.
function fingerprintOf(puzzle) {
  return puzzle ? puzzle.words.join(',') : '';
}

function cellKey(r, c) {
  return `${r},${c}`;
}

function loadState(dateKey, fingerprint) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.dateKey !== dateKey || saved.fingerprint !== fingerprint) return null;
    return saved;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function useGameState() {
  const dateKey = getTodayKey();
  const puzzle = puzzles[dateKey] || null;
  const puzzleNumber = puzzle ? Math.floor((new Date(dateKey) - new Date(EPOCH)) / 86400000) + 1 : 0;
  const fingerprint = fingerprintOf(puzzle);

  const [foundWords, setFoundWords] = useState(new Set());
  // The actual cells the player traced for each found word, not the
  // generator's canonical path. A player can validly find a word via a
  // different route than the one the generator happened to draw (see
  // matchWord.js), so rendering has to reflect what they really did.
  const [foundWordPaths, setFoundWordPaths] = useState({});
  // How many letters of each word have been revealed via hints so far
  // (word -> count), not just which words have been hinted at all.
  // Hints build up ONE word at a time: the second hint continues
  // revealing the word the first hint already started, rather than
  // spreading across different words, until that word is found or
  // fully revealed.
  const [hintProgress, setHintProgress] = useState({});
  const [activeHintWord, setActiveHintWord] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentPath, setCurrentPath] = useState([]);
  const [wrongFlashToken, setWrongFlashToken] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const timerRunningRef = useRef(false);

  useEffect(() => {
    if (!puzzle) { setInitialized(true); return; }
    const saved = loadState(dateKey, fingerprint);
    if (saved) {
      setFoundWords(new Set(saved.foundWords));
      setFoundWordPaths(saved.foundWordPaths || {});
      setHintProgress(saved.hintProgress || {});
      setActiveHintWord(saved.activeHintWord || null);
      setHintsUsed(saved.hintsUsed || 0);
      setGameStatus(saved.gameStatus);
      elapsedRef.current = saved.elapsedSeconds || 0;
      setElapsedSeconds(elapsedRef.current);
      // Only resume ticking if they'd already found at least one word
      // before reloading. The clock doesn't start until the first word,
      // so a reload before that point shouldn't start it either.
      if (saved.gameStatus === 'playing' && (saved.foundWords || []).length > 0) startTimer();
    }
    // Fresh puzzle, no saved state: timer stays stopped until the first
    // word is found (see applyFound below).
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function startTimer() {
    if (timerRunningRef.current) return;
    timerRunningRef.current = true;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
    }, 1000);
  }

  function stopTimer() {
    timerRunningRef.current = false;
    clearInterval(timerRef.current);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (!initialized || !puzzle) return;
    saveState({
      dateKey,
      fingerprint,
      foundWords: [...foundWords],
      foundWordPaths,
      hintProgress,
      activeHintWord,
      hintsUsed,
      gameStatus,
      elapsedSeconds,
    });
  }, [dateKey, fingerprint, foundWords, foundWordPaths, hintProgress, activeHintWord, hintsUsed, gameStatus, elapsedSeconds, initialized]);

  const foundCells = new Set();
  foundWords.forEach((word) => {
    (foundWordPaths[word] || puzzle?.paths[word])?.forEach(([r, c]) => foundCells.add(cellKey(r, c)));
  });

  const hintedCells = new Set();
  if (puzzle) {
    Object.entries(hintProgress).forEach(([word, count]) => {
      const path = puzzle.paths[word];
      if (!path) return;
      path.slice(0, count).forEach(([r, c]) => hintedCells.add(cellKey(r, c)));
    });
  }

  // Shared by both submit paths (a released drag and a completed tap
  // sequence): records the word as found (with the actual cells the
  // player traced, which may differ from the generator's canonical
  // path) and checks for a win.
  const applyFound = useCallback((word, path) => {
    // The clock starts on the first word actually found, not on load,
    // so scanning/thinking time before the first find isn't counted.
    if (foundWords.size === 0) startTimer();
    const nextFound = new Set(foundWords);
    nextFound.add(word);
    setFoundWords(nextFound);
    setFoundWordPaths((prev) => ({ ...prev, [word]: path }));
    setHintProgress((prev) => {
      if (!(word in prev)) return prev;
      const next = { ...prev };
      delete next[word];
      return next;
    });
    setActiveHintWord((prev) => (prev === word ? null : prev));
    setCurrentPath([]);
    if (nextFound.size === puzzle.words.length) {
      stopTimer();
      setGameStatus('won');
    }
  }, [puzzle, foundWords]);

  // A released drag is a deliberate "try this" act: wrong-flash and reset
  // on a miss.
  const submitPath = useCallback((path) => {
    if (!puzzle || gameStatus !== 'playing' || path.length === 0) return;
    const word = matchWord(path, puzzle, foundWords, foundCells);
    if (word) {
      applyFound(word, path);
    } else {
      setWrongFlashToken((t) => t + 1);
      setTimeout(() => setCurrentPath([]), 350);
    }
  }, [puzzle, gameStatus, foundWords, foundCells, applyFound]);

  // A tap just extends/undoes the path one letter at a time (handled in
  // WeaveGrid before this is called) and checks silently: no penalty on a
  // miss, since the path so far might just be a partial word. Only acts
  // when it happens to complete a real word.
  const checkTap = useCallback((path) => {
    if (!puzzle || gameStatus !== 'playing' || path.length === 0) return;
    const word = matchWord(path, puzzle, foundWords, foundCells);
    if (word) applyFound(word, path);
  }, [puzzle, gameStatus, foundWords, foundCells, applyFound]);

  const useHint = useCallback(() => {
    if (!puzzle || gameStatus !== 'playing' || hintsUsed >= MAX_HINTS) return;

    // Keep revealing the word already in progress, as long as it's
    // still unfound and hasn't been fully spelled out already. Only
    // start a new word once that one's done (found, or every letter
    // already revealed).
    const activeStillGoing = activeHintWord
      && !foundWords.has(activeHintWord)
      && (hintProgress[activeHintWord] || 0) < activeHintWord.length;

    let target = activeStillGoing ? activeHintWord : null;
    if (!target) {
      const remaining = puzzle.words.filter((w) => !foundWords.has(w));
      if (remaining.length === 0) return;
      target = [...remaining].sort()[0];
      setActiveHintWord(target);
    }

    setHintProgress((prev) => ({ ...prev, [target]: (prev[target] || 0) + 1 }));
    setHintsUsed((n) => n + 1);
  }, [puzzle, gameStatus, hintsUsed, foundWords, activeHintWord, hintProgress]);

  const generateShareText = useCallback(() => {
    if (!puzzle || gameStatus !== 'won') return '';
    const tier = getTierFromHints(hintsUsed);
    const stars = '⭐'.repeat(tier);
    const hintLine = hintsUsed === 0 ? 'No hints used' : `💡 ${hintsUsed} hint${hintsUsed === 1 ? '' : 's'} used`;
    return `Weave #${puzzleNumber} 🧶\n${puzzle.words.length} words in ${formatElapsed(elapsedSeconds)} • ${hintLine}\n${stars}`;
  }, [puzzle, gameStatus, hintsUsed, puzzleNumber, elapsedSeconds]);

  return {
    dateKey,
    puzzleNumber,
    puzzle,
    initialized,
    foundWords,
    foundWordPaths,
    foundCells,
    hintedCells,
    hintsUsed,
    maxHints: MAX_HINTS,
    currentPath,
    setCurrentPath,
    wrongFlashToken,
    gameStatus,
    elapsedSeconds,
    submitPath,
    checkTap,
    useHint,
    generateShareText,
  };
}
