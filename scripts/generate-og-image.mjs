// Builds public/og-image.png: the social-share preview image, same
// convention every sibling NoodleGame ships (Realm/Mirror/Pathways/etc,
// 2400x1260, dark background, wordmark + tagline + brand label). No
// generator script for those was found in any sibling repo (they were
// designed directly as PNGs), so this one renders an SVG to PNG with
// sharp instead, kept as a real script rather than a one-off so it can
// be regenerated if the copy or colors ever change.
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 2400;
const HEIGHT = 1260;
const AMBER = '#f59e0b';
const AMBER_LIGHT = '#fbbf24';
const TEXT_SECONDARY = '#d9c9a3';
const TEXT_DIM = '#8a7658';

// Same two-thread weave mark as GameLogo.jsx, scaled up from its 48x48
// viewBox. Kept as plain paths (no font dependency) so the icon always
// renders identically regardless of what fonts are on the machine doing
// the rendering.
const iconScale = 3.6;
const iconSvg = `
  <g transform="translate(800, 330) scale(${iconScale})">
    <path d="M 6 14 Q 24 14 24 24 Q 24 34 42 34" fill="none" stroke="${AMBER}" stroke-width="4.2" stroke-linecap="round" />
    <path d="M 6 34 Q 18 34 21 27" fill="none" stroke="${AMBER_LIGHT}" stroke-width="4.2" stroke-linecap="round" />
    <path d="M 27 21 Q 30 14 42 14" fill="none" stroke="${AMBER_LIGHT}" stroke-width="4.2" stroke-linecap="round" />
  </g>
`;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#120d07" />
      <stop offset="55%" stop-color="#0a0805" />
      <stop offset="100%" stop-color="#050302" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="55%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  ${iconSvg}

  <text x="980" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="800"
        font-size="200" fill="${AMBER}">Weave</text>

  <text x="${WIDTH / 2}" y="660" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="400" font-size="62" fill="${TEXT_SECONDARY}">
    Trace every word hidden in the grid.
  </text>
  <text x="${WIDTH / 2}" y="740" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="400" font-size="62" fill="${TEXT_SECONDARY}">
    No theme, just words.
  </text>

  <text x="${WIDTH / 2}" y="880" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="700" font-size="38" letter-spacing="4" fill="${TEXT_DIM}">
    NOODLEGAMES · DAILY WORD PUZZLE
  </text>
</svg>
`;

const outPath = join(__dirname, '../public/og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT}).`);
