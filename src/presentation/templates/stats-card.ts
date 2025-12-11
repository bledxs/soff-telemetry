import { StatsCardOptions, GitHubStats, Theme } from '../../domain/types.js';
import {
  createSVG,
  createRect,
  createText,
  formatNumber,
  createLinearGradient,
} from '../components/svg-utils.js';
import { createLucideIcon, IconPresets } from '../components/lucide-icons.js';

/**
 * Generates the GitHub Stats Card SVG
 * Modern design showing commits, PRs, issues, stars, contributed repos, and rank
 */
export function renderStatsCard(stats: GitHubStats, options: StatsCardOptions): string {
  const { width, theme, username, hideStats = [], showIcons = true } = options;

  const padding = 20;
  const titleHeight = 40;
  const rowHeight = 30;
  const iconSize = 16;

  // Determine which stats to show
  const allStats = [
    { key: 'totalCommits', label: 'Total Commits', value: stats.totalCommits, icon: 'git-commit' },
    { key: 'totalPRs', label: 'Pull Requests', value: stats.totalPRs, icon: 'git-pull-request' },
    { key: 'totalIssues', label: 'Total Issues', value: stats.totalIssues, icon: 'circle-dot' },
    { key: 'totalStars', label: 'Total Stars', value: stats.totalStars, icon: 'star' },
    {
      key: 'contributedTo',
      label: 'Contributed To',
      value: stats.contributedTo,
      icon: 'git-branch',
    },
  ];

  const visibleStats = allStats.filter((stat) => !hideStats.includes(stat.key));

  // Calculate card height
  const cardHeight = titleHeight + visibleStats.length * rowHeight + padding * 2 + 20;

  // Create gradient
  const gradient = createLinearGradient('statsGradient', [
    { offset: '0%', color: theme.accentColor },
    { offset: '100%', color: theme.secondaryColor },
  ]);

  // Shadow definition
  const shadow = `  <defs>
    <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
    </filter>
  </defs>`;

  // Main card background
  const cardBg = createRect({ x: 0, y: 0, width, height: cardHeight, rx: 10 }, theme.background);

  // Title section
  const titleText = createText(
    `${username}'s GitHub Stats`,
    { x: padding, y: padding + 20 },
    {
      fontSize: 18,
      fontWeight: 'bold',
      fill: theme.textColor,
    },
  );

  // Rank badge (top right)
  const rankBadgeSize = 60;
  const rankBadgeX = width - rankBadgeSize - padding;
  const rankBadgeY = padding;

  const rankBadge = `  <g>
    <circle cx="${rankBadgeX + rankBadgeSize / 2}" cy="${rankBadgeY + rankBadgeSize / 2}" r="${rankBadgeSize / 2 - 2}" fill="${theme.accentColor}" opacity="0.2" stroke="${theme.accentColor}" stroke-width="2"/>
    ${createText(stats.rank, { x: rankBadgeX + rankBadgeSize / 2, y: rankBadgeY + rankBadgeSize / 2 + 7 }, { fontSize: 24, fontWeight: 'bold', fill: theme.accentColor, textAnchor: 'middle' })}
  </g>`;

  // Stats rows
  let statsRows = '';
  visibleStats.forEach((stat, index) => {
    const y = titleHeight + padding + index * rowHeight;
    const iconX = padding + 5;
    const iconY = y + 5;
    const labelX = showIcons ? iconX + iconSize + 10 : iconX;
    const valueX = width - padding;

    // Icon (Lucide)
    const iconName = IconPresets[stat.icon as keyof typeof IconPresets];
    const icon =
      showIcons && iconName
        ? createLucideIcon(iconName, { x: iconX, y: iconY }, iconSize, theme.secondaryColor)
        : '';

    // Label
    const label = createText(
      stat.label,
      { x: labelX, y: y + 18 },
      {
        fontSize: 14,
        fill: theme.textColor,
      },
    );

    // Value
    const value = createText(
      formatNumber(stat.value),
      { x: valueX, y: y + 18 },
      {
        fontSize: 14,
        fontWeight: 'bold',
        fill: theme.accentColor,
        textAnchor: 'end',
      },
    );

    statsRows += `  <g>${icon}${label}${value}</g>\n`;
  });

  // Divider line after title
  const divider = `  <line x1="${padding}" y1="${titleHeight + padding}" x2="${width - padding}" y2="${titleHeight + padding}" stroke="${theme.borderColor}" stroke-width="1" opacity="0.3"/>`;

  // Assemble SVG
  return createSVG(
    width,
    cardHeight,
    `${shadow}\n${gradient}\n${cardBg}\n${titleText}\n${rankBadge}\n${divider}\n${statsRows}`,
  );
}

/**
 * Returns default options for the Stats Card
 */
export function getDefaultStatsCardOptions(theme: Theme, username: string): StatsCardOptions {
  return {
    width: 500,
    height: 300, // Will be adjusted dynamically
    theme,
    username,
    showIcons: true,
    hideStats: [],
  };
}
