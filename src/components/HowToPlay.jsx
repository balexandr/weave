import styles from './HowToPlay.module.css';

export default function HowToPlay({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>How to Play</h2>
        <p className={styles.intro}>
          Trace every word hidden in the grid. Every letter belongs to
          exactly one word, no leftovers.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepIcon}>👆</span>
            <div>
              <p className={styles.stepTitle}>Drag or tap through adjacent letters</p>
              <p className={styles.stepDesc}>Drag across letters, or tap them one at a time. Any direction, including diagonals. Tap the last letter again to undo it.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>✅</span>
            <div>
              <p className={styles.stepTitle}>Spell a real word? It locks in</p>
              <p className={styles.stepDesc}>Those letters light up and stay found. No theme connects the words, just find them all.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>❌</span>
            <div>
              <p className={styles.stepTitle}>Wrong guess costs nothing</p>
              <p className={styles.stepDesc}>The path just resets. No penalty, no fail state, take your time.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>💡</span>
            <div>
              <p className={styles.stepTitle}>Stuck? Use a hint</p>
              <p className={styles.stepDesc}>3 hints available. The first reveals a word's starting letter; each one after that reveals the next letter of that same word. Fewer hints used, more stars.</p>
            </div>
          </div>
        </div>

        <button className={styles.playButton} onClick={onClose}>
          Start playing
        </button>
      </div>
    </div>
  );
}
