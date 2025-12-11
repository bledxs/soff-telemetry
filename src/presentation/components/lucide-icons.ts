/**
 * Lucide Icons Integration
 * Provides easy access to high-quality SVG icons from Lucide
 */

import {
  Flame,
  Calendar,
  Eye,
  Star,
  Code,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Activity,
  TrendingUp,
  Award,
  Zap,
  Heart,
  ThumbsUp,
  Target,
  Trophy,
  Sparkles,
} from 'lucide-static';

export interface Point {
  x: number;
  y: number;
}

/**
 * Icon map - add more icons as needed from: https://lucide.dev/icons/
 */
const iconMap = {
  Flame,
  Calendar,
  Eye,
  Star,
  Code,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Activity,
  TrendingUp,
  Award,
  Zap,
  Heart,
  ThumbsUp,
  Target,
  Trophy,
  Sparkles,
} as const;

/**
 * Available icon names
 */
export type IconName = keyof typeof iconMap;

/**
 * Creates a Lucide icon at the specified position
 *
 * @param name - Icon name from Lucide
 * @param point - Position (x, y)
 * @param size - Icon size in pixels
 * @param color - Fill/stroke color
 * @returns SVG string
 */
export function createLucideIcon(
  name: IconName,
  point: Point,
  size: number,
  color: string,
): string {
  const iconSvg = iconMap[name];

  if (!iconSvg) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return '';
  }

  // Lucide icons are 24x24 by default, so we scale them
  const scale = size / 24;

  // Extract path data from SVG string
  const pathMatches = iconSvg.matchAll(/<path\s+d="([^"]+)"/g);
  const paths: string[] = [];

  for (const match of pathMatches) {
    if (match[1]) {
      paths.push(match[1]);
    }
  }

  if (paths.length === 0) {
    console.warn(`No paths found in icon "${name}"`);
    return '';
  }

  return `  <g transform="translate(${point.x}, ${point.y}) scale(${scale})">
    ${paths.map((path) => `<path d="${path}" stroke="${color}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`).join('\n    ')}
  </g>`;
}

/**
 * Gets available icon names for documentation
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap).sort();
}

/**
 * Common icon presets for convenience
 */
export const IconPresets = {
  contribution: 'Flame' as IconName,
  calendar: 'Calendar' as IconName,
  stats: 'Activity' as IconName,
  stars: 'Star' as IconName,
  commits: 'GitCommit' as IconName,
  pullRequests: 'GitPullRequest' as IconName,
  branches: 'GitBranch' as IconName,
  trending: 'TrendingUp' as IconName,
  award: 'Award' as IconName,
  code: 'Code' as IconName,
  zap: 'Zap' as IconName,
};
