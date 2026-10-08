import { useState, useEffect } from 'react';
import { getTierFromHints, formatElapsed } from '../utils/scoring';
import { IconTrophy, IconFlame, IconThumbsUp, IconClose, IconShare, IconCheckmark, IconStar } from './Icons';
import styles from './ResultScreen.module.css';

function getTimeToMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow - now;
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

function getRating(tier) {
  if (tier === 3) return { Icon: IconTrophy, label: 'Every Thread' };
  if (tier === 2) return { Icon: IconFlame, label: 'Well Woven' };
  return { Icon: IconThumbsUp, label: 'Solved' };
}

export default function ResultScreen({ puzzleNumber, wordCount, hintsUsed, elapsedSeconds, generateShareText, stats, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(getTimeToMidnight());
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeToMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tier = getTierFromHints(hintsUsed);
  const rating = getRating(tier);
  const shareText = generateShareText();

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: shareText }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(shareText); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = shareText;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`${styles.overlay} ${showContent ? styles.visible : ''}`}>
      <div className={styles.modal}>
        <div className={styles.sparkContainer} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={styles.spark} style={{
              left: `${8 + i * (84 / 11)}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#f59e0b' : '#fbbf24',
              boxShadow: '0 0 4px #f59e0b, 0 0 8px #f59e0b88',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }} />
          ))}
        </div>

        <div className={styles.resultHeader}>
          <button className={styles.dismissBtn} onClick={onDismiss} aria-label="Close"><IconClose /></button>
          <span className={styles.ratingEmoji}><rating.Icon /></span>
          <h2 className={styles.title}>{rating.label}!</h2>
          <p className={styles.subtitle}>Weave #{puzzleNumber}</p>
        </div>

        <div className={styles.metricsRow}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{wordCount}</span>
            <span className={styles.metricLabel}>Words</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>{formatElapsed(elapsedSeconds)}</span>
            <span className={styles.metricLabel}>Time</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>
              {tier > 0
                ? Array.from({ length: tier }).map((_, i) => <IconStar key={i} size={20} />)
                : '0'}
            </span>
            <span className={styles.metricLabel}>Rating</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.gamesPlayed}</span>
            <span className={styles.statLabel}>Played</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{hintsUsed}</span>
            <span className={styles.statLabel}>Hints used</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.currentStreak}</span>
            <span className={styles.statLabel}>Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.maxStreak}</span>
            <span className={styles.statLabel}>Best streak</span>
          </div>
        </div>

        <div className={styles.sharePreview}>
          <p className={styles.sharePreviewLabel}>Share text</p>
          <div className={styles.sharePreviewBox}>
            {shareText.split('\n').map((line, i) => (
              <span key={i} className={styles.sharePreviewLine}>{line}</span>
            ))}
          </div>
        </div>

        <button
          className={`${styles.shareButton} ${copied ? styles.copied : ''}`}
          onClick={handleShare}
        >
          {copied ? <><IconCheckmark /> Copied to clipboard</> : <><IconShare /> Share your result</>}
        </button>

        <div className={styles.countdown}>
          <span className={styles.countdownLabel}>Next puzzle in</span>
          <span className={styles.countdownTime}>
            {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
