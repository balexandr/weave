export function GameLogo() {
  const amber = '#f59e0b';
  const light = '#fbbf24';

  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* Two threads weaving over/under each other. Over-under crossing
          reads as "woven", distinct from Chain Link's single straight
          link icon and Tandem's arrow-between-tiles icon. */}
      <path d="M 6 14 Q 24 14 24 24 Q 24 34 42 34" fill="none" stroke={amber} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 6 34 Q 18 34 21 27" fill="none" stroke={light} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 27 21 Q 30 14 42 14" fill="none" stroke={light} strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}
