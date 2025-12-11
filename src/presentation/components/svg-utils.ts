/**
 * SVG generation utilities
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
}

/**
 * Creates the root SVG element
 */
export function createSVG(width: number, height: number, content: string): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
${content}
</svg>`;
}

/**
 * Creates a rectangle with rounded corners
 */
export function createRect(rect: Rect, fill: string, stroke?: string): string {
  const { x, y, width, height, rx = 0 } = rect;
  const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="1"` : '';
  return `  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" ${strokeAttr}/>`;
}

/**
 * Creates an SVG text element
 */
export function createText(
  text: string | number,
  point: Point,
  options: {
    fontSize?: number;
    fontWeight?: string;
    fill?: string;
    fontFamily?: string;
    textAnchor?: 'start' | 'middle' | 'end';
  } = {},
): string {
  const {
    fontSize = 14,
    fontWeight = 'normal',
    fill = '#fff',
    fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    textAnchor = 'start',
  } = options;

  return `  <text x="${point.x}" y="${
    point.y
  }" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" font-family="${fontFamily}" text-anchor="${textAnchor}">${escapeXML(
    String(text),
  )}</text>`;
}

/**
 * Creates an SVG group
 */
export function createGroup(content: string, transform?: string): string {
  const transformAttr = transform ? ` transform="${transform}"` : '';
  return `  <g${transformAttr}>
${content}
  </g>`;
}

/**
 * Creates a linear gradient
 */
export function createLinearGradient(
  id: string,
  colors: Array<{ offset: string; color: string }>,
): string {
  const stops = colors
    .map(({ offset, color }) => `    <stop offset="${offset}" stop-color="${color}"/>`)
    .join('\n');

  return `  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
${stops}
    </linearGradient>
  </defs>`;
}

/**
 * Crea un ícono SVG (eye, fire, star, code)
 */
export function createIcon(
  point: Point,
  size: number,
  fill: string,
  icon: 'eye' | 'fire' | 'star' | 'code' = 'eye',
): string {
  const { x, y } = point;
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  const icons = {
    // Realistic eye icon
    eye: `
    <g transform="translate(${x}, ${y})">
      <ellipse cx="${size / 2}" cy="${size / 2}" rx="${size * 0.5}" ry="${
        size * 0.35
      }" fill="${fill}" opacity="0.9"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.25}" fill="${fill}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.15}" fill="white"/>
    </g>`,

    // Fire icon
    fire: `
    <g transform="translate(${x}, ${y})">
      <path d="M${size / 2},0 L${size * 0.75},${
        size * 0.4
      } L${size},${size} L0,${size} L${size * 0.25},${size * 0.4} Z" fill="${fill}"/>
      <path d="M${size / 2},${size * 0.3} L${size * 0.6},${size * 0.6} L${
        size * 0.7
      },${size} L${size * 0.3},${size} L${size * 0.4},${size * 0.6} Z" fill="white" opacity="0.5"/>
    </g>`,

    // Star
    star: `
    <g transform="translate(${centerX}, ${centerY})">
      <path d="M0,-${size * 0.5} L${size * 0.12},-${size * 0.15} L${
        size * 0.5
      },-${size * 0.15} L${size * 0.2},${size * 0.05} L${size * 0.3},${
        size * 0.5
      } L0,${size * 0.2} L-${size * 0.3},${size * 0.5} L-${size * 0.2},${
        size * 0.05
      } L-${size * 0.5},-${size * 0.15} L-${size * 0.12},-${size * 0.15} Z" fill="${fill}"/>
    </g>`,

    // Code
    code: `
    <g transform="translate(${x}, ${y})">
      <path d="M${size * 0.3},${size * 0.25} L${size * 0.1},${size * 0.5} L${size * 0.3},${
        size * 0.75
      }" stroke="${fill}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M${size * 0.7},${size * 0.25} L${size * 0.9},${size * 0.5} L${size * 0.7},${
        size * 0.75
      }" stroke="${fill}" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`,
  };

  return icons[icon];
}

/**
 * Escapes XML special characters
 */
export function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats large numbers with abbreviations (1.2k, 3.4M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toString();
}
