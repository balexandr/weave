// Small line-art icon set replacing emoji in Weave's UI. Matches the
// style the header's stats icon already established (24x24 viewBox,
// stroke-based, currentColor, rounded caps) rather than inventing a new
// visual language. Share text is NOT touched by this: it's plain text
// sent via SMS/clipboard, so stars/emoji there are the actual payload,
// not a rendering choice, and have to stay real Unicode characters.
function base(props) {
  return { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true, ...props };
}

export function IconDrag({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M9 3v8M9 11l-2.5-2M9 11l2.5-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="12" width="10" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 15.5c2.2-1 4 .3 4 2.3s-1.8 3.3-4 2.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheckCircle({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.3l2.6 2.6L16.2 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconXCircle({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconBulb({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M12 3a6.5 6.5 0 0 0-3.8 11.8c.6.45 1 1.17 1 1.95V18h5.6v-1.25c0-.78.4-1.5 1-1.95A6.5 6.5 0 0 0 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.6 21h4.8M10.2 18.6h3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrophy({ size = 44, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 5H4.5A2.5 2.5 0 0 0 5 10h2M17 5h2.5A2.5 2.5 0 0 1 19 10h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 14v3.5M9 21h6M10 17.5h4l.6 3.5H9.4l.6-3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFlame({ size = 44, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M12 3c1 2.5-.5 3.8-1.6 5.1C9.3 9.3 8.5 10.6 8.5 12.5a3.5 3.5 0 0 0 7 0c0-1.2-.5-1.9-1-2.5.9.4 1.5 1.5 1.5 2.9A4.5 4.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5C6.5 9.5 9 7.5 12 3Z"
        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconThumbsUp({ size = 44, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M8 11v9H5.5A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11H8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 11l3.2-6.4a1.8 1.8 0 0 1 3.3 1.1L13.8 9H18a2 2 0 0 1 1.9 2.7l-2 6A2 2 0 0 1 16 19H8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconShare({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M12 15V4M12 4l-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheckmark({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ size = 18, filled = true, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path
        d="M12 3.2l2.6 5.4 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8L12 3.2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Weave's "nothing to show" mark: two crossing threads, the same motif
// as GameLogo.jsx, scaled up, rather than a generic empty-state glyph.
export function IconWeaveMark({ size = 56, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M 6 14 Q 24 14 24 24 Q 24 34 42 34" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 6 34 Q 18 34 21 27" fill="none" stroke="#fbbf24" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M 27 21 Q 30 14 42 14" fill="none" stroke="#fbbf24" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}
