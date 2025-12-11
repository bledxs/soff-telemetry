import { Theme } from '../domain/types.js';

/**
 * Custom color palette
 * Inspired by VTEX/React aesthetics with blue tones
 */

export const defaultTheme: Theme = {
  // Main background (elegant dark blue)
  background: '#0d1117',

  // Main text (soft white)
  textColor: '#c9d1d9',

  // Primary accent color (VTEX/React blue)
  accentColor: '#58a6ff',

  // Secondary color (softer blue)
  secondaryColor: '#1f6feb',

  // Borders and separators
  borderColor: '#30363d',

  // Progress bar - background
  progressBarBg: '#21262d',

  // Progress bar - fill
  progressBarFill: '#58a6ff',
};

export const lightTheme: Theme = {
  background: '#ffffff',
  textColor: '#24292f',
  accentColor: '#0969da',
  secondaryColor: '#0550ae',
  borderColor: '#d0d7de',
  progressBarBg: '#eaeef2',
  progressBarFill: '#0969da',
};

export const themes = {
  default: defaultTheme,
  dark: defaultTheme,
  light: lightTheme,
};

export function getTheme(themeName: string = 'default'): Theme {
  const validTheme = themeName as keyof typeof themes;
  return themes[validTheme] || defaultTheme;
}
