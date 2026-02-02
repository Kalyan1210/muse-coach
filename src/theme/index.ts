/**
 * Muse Theme System
 * Central export for all theme values
 */

import { colors, ThemeColors, CoachColorKey } from './colors';
import { typography, fontFamily, fontWeight, TypographyKey } from './typography';
import { spacing, borderRadius, shadows, animation } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  coachColors: typeof colors.coaches;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  animation: typeof animation;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === 'light' ? colors.light : colors.dark,
  coachColors: colors.coaches,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
});

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

// Re-export everything
export { colors, typography, fontFamily, fontWeight, spacing, borderRadius, shadows, animation };
export type { ThemeColors, CoachColorKey, TypographyKey };

