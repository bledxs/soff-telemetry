import { ContributionBadgeOptions, ContributionData, Theme } from '../../domain/types.js';
import {
  createSVG,
  createRect,
  createText,
  formatNumber,
  createIcon,
  createLinearGradient,
} from '../components/svg-utils.js';

/**
 * Generates the Contribution Days Badge SVG
 * Modern design with gradients, calendar icon and shadows
 */
export function renderContributionBadge(
  data: ContributionData,
  options: ContributionBadgeOptions,
): string {
  const { height, theme, label, icon } = options;

  // Calculate dimensions
  const padding = 10;
  const iconSize = 14;
  const iconMargin = icon ? iconSize + 6 : 0;
  const labelWidth = label.length * 7 + padding * 2 + iconMargin;
  const countText = formatNumber(data.totalDays);
  const countWidth = Math.max(countText.length * 10 + padding * 2, 40);
  const actualWidth = labelWidth + countWidth;

  // Create gradient for counter
  const gradient = createLinearGradient('countGradient', [
    { offset: '0%', color: theme.accentColor },
    { offset: '100%', color: theme.secondaryColor },
  ]);

  // Create shadow
  const shadow = `  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>`;

  // Label background with subtle shadow
  const labelRect = createRect({ x: 0, y: 0, width: labelWidth, height, rx: 5 }, theme.borderColor);

  // Counter background with gradient
  const countRect = `  <rect x="${labelWidth}" y="0" width="${countWidth}" height="${height}" rx="5" fill="url(#countGradient)" filter="url(#shadow)"/>`;

  // Calendar icon if enabled (changed from eye to calendar for active days)
  const calendarIcon = icon
    ? createIcon({ x: padding, y: height / 2 - iconSize / 2 }, iconSize, theme.textColor, 'fire')
    : '';

  // Label text
  const labelText = createText(
    label,
    { x: padding + iconMargin, y: height / 2 + 5 },
    {
      fontSize: 11,
      fontWeight: '600',
      fill: theme.textColor,
    },
  );

  // Counter text with better styling
  const countValueText = createText(
    countText,
    { x: labelWidth + countWidth / 2, y: height / 2 + 5 },
    {
      fontSize: 13,
      fontWeight: '700',
      fill: '#ffffff',
      textAnchor: 'middle',
    },
  );

  // Subtle shine on counter badge
  const shine = `  <rect x="${labelWidth}" y="0" width="${countWidth}" height="${
    height * 0.4
  }" rx="5" fill="white" opacity="0.15"/>`;

  const content = `${gradient}
${shadow}
${labelRect}
${countRect}
${shine}
${calendarIcon}
${labelText}
${countValueText}`;

  return createSVG(actualWidth, height, content);
}

/**
 * Gets default options for the badge
 */
export function getDefaultContributionBadgeOptions(theme: Theme): ContributionBadgeOptions {
  return {
    width: 150,
    height: 28,
    theme,
    label: 'active days',
    icon: true,
  };
}
