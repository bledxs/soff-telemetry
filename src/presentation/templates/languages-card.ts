import { LanguagesCardOptions, LanguagesData, Theme } from '../../domain/types.js';
import {
  createSVG,
  createRect,
  createText,
  createLinearGradient,
} from '../components/svg-utils.js';

/**
 * Generates the Top Languages Card SVG
 * Color-coded bars by language percentage
 */
export function renderLanguagesCard(data: LanguagesData, options: LanguagesCardOptions): string {
  const {
    width,
    theme,
    username,
    layout = 'default',
    hideLanguages = [],
    languagesCount = 5,
  } = options;

  const padding = 20;
  const titleHeight = 40;
  const rowHeight = layout === 'compact' ? 30 : 36;

  const hidden = new Set(hideLanguages.map((l) => l.toLowerCase()));
  const visibleLanguages = data.languages
    .filter((l) => !hidden.has(l.name.toLowerCase()))
    .slice(0, Math.max(0, languagesCount));

  const cardHeight = titleHeight + visibleLanguages.length * rowHeight + padding * 2 + 20;

  const gradient = createLinearGradient('languagesGradient', [
    { offset: '0%', color: theme.accentColor },
    { offset: '100%', color: theme.secondaryColor },
  ]);

  const shadow = `  <defs>
    <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
    </filter>
  </defs>`;

  const cardBg = createRect({ x: 0, y: 0, width, height: cardHeight, rx: 10 }, theme.background);

  const titleText = createText(
    `${username}'s Top Languages`,
    { x: padding, y: padding + 20 },
    { fontSize: 18, fontWeight: 'bold', fill: theme.textColor },
  );

  const divider = `  <line x1="${padding}" y1="${titleHeight + padding}" x2="${width - padding}" y2="${titleHeight + padding}" stroke="${theme.borderColor}" stroke-width="1" opacity="0.3"/>`;

  const barX = padding + 10;
  const barMaxWidth = width - padding * 2 - 90;

  let rows = '';

  visibleLanguages.forEach((lang, index) => {
    const y = titleHeight + padding + index * rowHeight;
    const labelY = y + 18;
    const barY = y + (layout === 'compact' ? 22 : 24);

    const percentText = `${lang.percentage.toFixed(1)}%`;

    const color = lang.color || theme.secondaryColor;
    const fillWidth = Math.max(0, Math.min(1, lang.percentage / 100)) * barMaxWidth;

    const name = createText(
      lang.name,
      { x: padding, y: labelY },
      { fontSize: 14, fill: theme.textColor },
    );

    const percentage = createText(
      percentText,
      { x: width - padding, y: labelY },
      { fontSize: 14, fontWeight: 'bold', fill: theme.accentColor, textAnchor: 'end' },
    );

    const barBg = createRect(
      { x: barX, y: barY, width: barMaxWidth, height: 6, rx: 3 },
      theme.progressBarBg,
    );

    const barFill = createRect({ x: barX, y: barY, width: fillWidth, height: 6, rx: 3 }, color);

    rows += `  <g>${name}${percentage}${barBg}${barFill}</g>\n`;
  });

  // Empty state
  if (visibleLanguages.length === 0) {
    const emptyText = createText(
      'No language data available',
      { x: padding, y: titleHeight + padding + 30 },
      { fontSize: 14, fill: theme.textColor },
    );
    rows = `  <g>${emptyText}</g>\n`;
  }

  return createSVG(
    width,
    cardHeight,
    `${shadow}\n${gradient}\n${cardBg}\n${titleText}\n${divider}\n${rows}`,
  );
}

/**
 * Returns default options for the Languages Card
 */
export function getDefaultLanguagesCardOptions(
  theme: Theme,
  username: string,
): LanguagesCardOptions {
  return {
    width: 500,
    height: 300, // adjusted dynamically
    theme,
    username,
    layout: 'default',
    hideLanguages: [],
    languagesCount: 5,
  };
}
