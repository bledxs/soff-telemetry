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
  CircleDot,
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
  CircleDot,
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

  // Extract all SVG elements (path, circle, line, polyline, polygon, rect, ellipse)
  const svgContent = iconSvg
    .replace(/<svg[^>]*>/, '') // Remove opening svg tag
    .replace(/<\/svg>/, '') // Remove closing svg tag
    .trim();

  if (!svgContent) {
    console.warn(`No SVG content found in icon "${name}"`);
    return '';
  }

  // Apply stroke color and attributes to all elements
  let coloredContent = svgContent
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/fill="currentColor"/g, `fill="${color}"`);

  // Ensure all shape elements are properly self-closing and have stroke attributes
  coloredContent = coloredContent.replace(
    /<(circle|line|path|polyline|polygon|rect|ellipse)([^>]*?)(\s*\/?>)/g,
    (_match: string, tag: string, attrs: string, _closing: string): string => {
      // Normalize attributes - trim whitespace
      const normalizedAttrs: string = attrs.trim();

      // Check if it already has a stroke attribute
      const hasStroke: boolean = normalizedAttrs.includes('stroke=');

      // Build the element with proper self-closing format
      if (hasStroke) {
        return `<${tag} ${normalizedAttrs} />`;
      } else {
        return `<${tag} ${normalizedAttrs} stroke="${color}" />`;
      }
    },
  );

  return `  <g transform="translate(${point.x}, ${point.y}) scale(${scale})">
    ${coloredContent}
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
  'git-commit': 'GitCommit' as IconName,
  'git-pull-request': 'GitPullRequest' as IconName,
  'circle-dot': 'CircleDot' as IconName,
  star: 'Star' as IconName,
  'git-branch': 'GitBranch' as IconName,
};
