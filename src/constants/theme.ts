import { Platform } from 'react-native';

/**
 * StarLens is a night-sky app: every screen uses this dark space palette
 * rather than following the system light/dark scheme.
 */
export const Night = {
  bg0: '#03040c',
  bg1: '#080b1f',
  bg2: '#111633',
  bg3: '#1b2147',
  surface: 'rgba(255,255,255,0.06)',
  surfaceStrong: 'rgba(255,255,255,0.1)',
  border: 'rgba(255,255,255,0.12)',
  text: '#F4F5FB',
  textSecondary: '#A9AFCC',
  textMuted: '#838BB8',
  star: '#FFFFFF',
  starDim: 'rgba(255,255,255,0.6)',
  line: 'rgba(139,148,255,0.55)',
  accent: '#8B7CFA',
  accentAlt: '#5CC9E8',
  gold: '#F3C969',
  success: '#3ED6A8',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
