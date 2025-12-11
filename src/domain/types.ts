/**
 * Domain Types & Interfaces
 */

// ========== Common Types ==========

export interface Theme {
  background: string;
  textColor: string;
  accentColor: string;
  secondaryColor: string;
  borderColor: string;
  progressBarBg: string;
  progressBarFill: string;
}

export interface SVGOptions {
  width: number;
  height: number;
  theme: Theme;
}

// ========== Contribution Days Badge Types ==========

export interface ContributionData {
  totalDays: number;
  lastUpdated: string;
  currentStreak?: number;
}

export interface ContributionBadgeOptions extends SVGOptions {
  label: string;
  icon?: boolean;
}

// ========== GitHub Stats Types ==========

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  contributedTo: number;
  rank: string;
}

export interface StatsCardOptions extends SVGOptions {
  username: string;
  hideStats?: string[];
  showIcons?: boolean;
}

// ========== Top Languages Types ==========

export interface Language {
  name: string;
  percentage: number;
  color: string;
  size: number;
}

export interface LanguagesData {
  languages: Language[];
  totalSize: number;
}

export interface LanguagesCardOptions extends SVGOptions {
  username: string;
  layout?: 'compact' | 'default';
  hideLanguages?: string[];
  languagesCount?: number;
}

// ========== Streak Types ==========

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  firstContribution: string;
  lastContribution: string;
}

export interface StreakCardOptions extends SVGOptions {
  username: string;
  dateFormat?: string;
}

// ========== Storage Interface ==========

export interface IStorage {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, data: T): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// ========== Service Types ==========

export type ServiceType = 'visitor' | 'stats' | 'languages' | 'streak' | 'all';

export interface ServiceConfig {
  enabled: boolean;
  outputPath: string;
  updateInterval?: number; // en minutos
}
