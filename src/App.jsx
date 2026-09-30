import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import WeaveGrid from './components/WeaveGrid';
import ResultScreen from './components/ResultScreen';
import HowToPlay from './components/HowToPlay';
import StatsScreen from './components/StatsScreen';
import styles from './App.module.css';
import { GameLogo } from './components/GameLogo';
import { NoodleLogoIcon } from './components/NoodleLogo';
import { recordTodayShare, getCompletedTodayCount, buildShareAllText, TOTAL_GAMES } from './utils/shareAll';
import { getTierFromHints, formatElapsed } from './utils/scoring';

const HOW_TO_PLAY_KEY = 'weave-how-to-play-seen';

export default function App() {
  const {
    dateKey,
    puzzleNumber,
    puzzle,
    initialized,
    foundWords,
    foundWordPaths,
    foundCells,
    hintedCells,
    hintsUsed,
    maxHints,
    currentPath,
    setCurrentPath,
    wrongFlashToken,
    gameStatus,
    elapsedSeconds,
    submitPath,
    checkTap,
    useHint,
    generateShareText,
  } = useGameState();

  const { stats, recordGame } = useStats();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [resultDismissed, setResultDismissed] = useState(false);
  const [revealResult, setRevealResult] = useState(false);
  const [shareAllCount, setShareAllCount] = useState(0);
  const [shareAllCopied, setShareAllCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (gameStatus !== 'won') { setRevealResult(false); return; }
    const t = setTimeout(() => setRevealResult(true), 900);
    return () => clearTimeout(t);
  }, [gameStatus]);

  useEffect(() => {
    try {
      if (!localStorage.getItem(HOW_TO_PLAY_KEY)) setShowHowToPlay(true);
    } catch {}
  }, []);

  const dismissHowToPlay = () => {
    setShowHowToPlay(false);
    try { localStorage.setItem(HOW_TO_PLAY_KEY, '1'); } catch {}
  };

  useEffect(() => {
    if (gameStatus === 'won') {
      const tier = getTierFromHints(hintsUsed);
      recordGame(dateKey, tier);
      recordTodayShare('weave', dateKey, generateShareText());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  useEffect(() => {
    setShareAllCount(getCompletedTodayCount(dateKey));
  }, [gameStatus, dateKey]);

  const handleShareAll = async () => {
    const text = buildShareAllText(dateKey);
    if (!text) return;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareAllCopied(true);
    setTimeout(() => setShareAllCopied(false), 2500);
  };

  const footer = (
    <footer className={styles.footer}>
      <a href="https://noodlegames.co" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
        <NoodleLogoIcon size={18} /> NoodleGames
      </a>
      {shareAllCount > 0 && (
        <button
          className={`${styles.footerShareAll} ${shareAllCopied ? styles.copied : ''}`}
          onClick={handleShareAll}
        >
          {shareAllCopied ? '✓ Copied' : `⬆ Share all completed (${shareAllCount}/${TOTAL_GAMES})`}
        </button>
      )}
      <a href="https://noodlegames.co/privacy" target="_blank" rel="noopener noreferrer" className={styles.footerPrivacy}>Privacy Policy</a>
      <span className={styles.footerCopy}>© {currentYear} NoodleGames.co</span>
    </footer>
  );

  const Logo = () => (
    <h1 className={styles.logo}>
      <GameLogo />
      <span className={styles.logoText}>Weave</span>
    </h1>
  );

  if (!initialized) return null;

  if (!puzzle) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}><Logo /></div>
        </header>
        <main className={styles.main}>
          <div className={styles.noPuzzle}>
            <span className={styles.noPuzzleEmoji}>🧶</span>
            No puzzle today
            <span className={styles.muted}>Check back tomorrow</span>
          </div>
        </main>
        {footer}
      </div>
    );
  }

  const hintsLeft = maxHints - hintsUsed;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Logo />
          {puzzleNumber > 0 && <span className={styles.puzzleNumber}>#{puzzleNumber}</span>}
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton} onClick={() => setShowStats(true)} aria-label="Statistics">
            <svg className={styles.statsIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 20H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <rect x="6" y="11" width="2.8" height="7" rx="1" fill="currentColor" />
              <rect x="10.6" y="7" width="2.8" height="11" rx="1" fill="currentColor" opacity="0.9" />
              <rect x="15.2" y="4" width="2.8" height="14" rx="1" fill="currentColor" opacity="0.8" />
            </svg>
          </button>
          <button className={styles.iconButton} onClick={() => setShowHowToPlay(true)} aria-label="How to play">?</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statusBar}>
          <div className={styles.timerBlock} style={{ paddingLeft: 0, borderLeft: 'none' }}>
            <span className={styles.timerLabel}>Time</span>
            <span className={styles.timerValue}>{formatElapsed(elapsedSeconds)}</span>
          </div>
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>Words</span>
            <span key={foundWords.size} className={styles.scoreValue}>{foundWords.size} / {puzzle.words.length}</span>
          </div>
          <button
            type="button"
            className={styles.hintButton}
            onClick={useHint}
            disabled={gameStatus !== 'playing' || hintsLeft === 0}
            aria-label="Use a hint"
          >
            💡 Hint ({hintsLeft})
          </button>
        </div>

        <div className={styles.attemptBox} aria-live="polite">
          <span key={wrongFlashToken} className={`${styles.attemptText} ${currentPath.length === 0 ? styles.attemptEmpty : ''}`}>
            {currentPath.length > 0
              ? currentPath.map(([r, c]) => puzzle.grid[r][c]).join('')
              : 'Drag or tap letters'}
          </span>
        </div>

        <WeaveGrid
          puzzle={puzzle}
          currentPath={currentPath}
          onPathChange={setCurrentPath}
          onSubmit={submitPath}
          onTapCheck={checkTap}
          foundCells={foundCells}
          foundWords={foundWords}
          foundWordPaths={foundWordPaths}
          hintedCells={hintedCells}
          wrongFlashToken={wrongFlashToken}
          locked={gameStatus === 'won'}
        />

        {gameStatus === 'playing' && (
          <p className={styles.hint}>
            Every letter belongs to exactly one word. No theme connects them, just find them all
          </p>
        )}
      </main>

      {gameStatus === 'won' && revealResult && !resultDismissed && (
        <ResultScreen
          puzzleNumber={puzzleNumber}
          wordCount={puzzle.words.length}
          hintsUsed={hintsUsed}
          elapsedSeconds={elapsedSeconds}
          generateShareText={generateShareText}
          stats={stats}
          onDismiss={() => setResultDismissed(true)}
        />
      )}

      {showHowToPlay && <HowToPlay onClose={dismissHowToPlay} />}
      {showStats && <StatsScreen stats={stats} onClose={() => setShowStats(false)} />}

      {footer}
    </div>
  );
}
