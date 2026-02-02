/**
 * Muse Typography System
 * Based on Apple's SF Pro font family
 * 
 * On iOS: Uses SF Pro automatically via 'System'
 * On Android: Falls back to Roboto (system default)
 * 
 * SF Pro variants:
 * - SF Pro Display: Optimized for large text (34pt+)
 * - SF Pro Text: Optimized for body text (<20pt)
 * - SF Pro Rounded: Friendly, approachable variant
 */

import { Platform, TextStyle } from 'react-native';

// Font family definitions
const fontFamily = {
  // System font (SF Pro on iOS, Roboto on Android)
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Rounded variant (SF Pro Rounded on iOS)
  rounded: Platform.select({
    ios: 'System', // Use fontWeight + custom rendering
    android: 'Roboto',
    default: 'System',
  }),
  
  // Serif for quotes and wisdom (New York on iOS)
  serif: Platform.select({
    ios: 'Georgia', // New York not directly accessible, Georgia is close
    android: 'serif',
    default: 'Georgia',
  }),
  
  // Monospace for any code/numbers
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Menlo',
  }),
};

// Font weights mapped to iOS system font weights
const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Type scale based on Apple HIG
// Using iOS Dynamic Type sizes as reference
export const typography = {
  // Large Titles - Hero text, screen titles
  largeTitle: {
    fontFamily: fontFamily.system,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
  } as TextStyle,
  
  // Title 1 - Primary headings
  title1: {
    fontFamily: fontFamily.system,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.36,
  } as TextStyle,
  
  // Title 2 - Secondary headings
  title2: {
    fontFamily: fontFamily.system,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  } as TextStyle,
  
  // Title 3 - Tertiary headings
  title3: {
    fontFamily: fontFamily.system,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.38,
  } as TextStyle,
  
  // Headline - Emphasized body text
  headline: {
    fontFamily: fontFamily.system,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  } as TextStyle,
  
  // Body - Primary reading text
  body: {
    fontFamily: fontFamily.system,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.41,
  } as TextStyle,
  
  // Body Large - Comfortable reading (chat messages)
  bodyLarge: {
    fontFamily: fontFamily.system,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.4,
  } as TextStyle,
  
  // Callout - Secondary body text
  callout: {
    fontFamily: fontFamily.system,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.32,
  } as TextStyle,
  
  // Subheadline - Labels, small headers
  subheadline: {
    fontFamily: fontFamily.system,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.24,
  } as TextStyle,
  
  // Footnote - Supplementary text
  footnote: {
    fontFamily: fontFamily.system,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.08,
  } as TextStyle,
  
  // Caption 1 - Small labels
  caption1: {
    fontFamily: fontFamily.system,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  } as TextStyle,
  
  // Caption 2 - Smallest text
  caption2: {
    fontFamily: fontFamily.system,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.07,
  } as TextStyle,
  
  // === Special Styles ===
  
  // Quote - For coach wisdom and quotes
  quote: {
    fontFamily: fontFamily.serif,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: fontWeight.regular,
    fontStyle: 'italic' as TextStyle['fontStyle'],
    letterSpacing: 0.2,
  } as TextStyle,
  
  // Quote Large - Hero quotes
  quoteLarge: {
    fontFamily: fontFamily.serif,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.regular,
    fontStyle: 'italic' as TextStyle['fontStyle'],
    letterSpacing: 0.3,
  } as TextStyle,
  
  // Button - Button labels
  button: {
    fontFamily: fontFamily.system,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  } as TextStyle,
  
  // Button Small
  buttonSmall: {
    fontFamily: fontFamily.system,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.24,
  } as TextStyle,
  
  // Tab Bar
  tabBar: {
    fontFamily: fontFamily.system,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  } as TextStyle,
  
  // Numeric - For statistics, numbers
  numeric: {
    fontFamily: fontFamily.system,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,
  
  // Numeric Small
  numericSmall: {
    fontFamily: fontFamily.system,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.41,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,
};

export { fontFamily, fontWeight };
export type TypographyKey = keyof typeof typography;

