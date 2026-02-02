/**
 * Muse Color System
 * Inspired by Apple's warm, minimal aesthetic
 */

export const colors = {
  // Light Mode
  light: {
    // Backgrounds
    background: '#FAF9F7',      // Warm cream - primary background
    surface: '#FFFFFF',          // Pure white - cards, sheets
    surfaceSecondary: '#F5F4F2', // Subtle gray - secondary surfaces
    
    // Text
    textPrimary: '#1C1C1E',      // Near black - headings, body
    textSecondary: '#6B6B6B',    // Medium gray - secondary text
    textTertiary: '#9A9A9A',     // Light gray - hints, captions
    textInverse: '#FFFFFF',      // White text on dark backgrounds
    
    // Borders & Dividers
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    divider: '#EBEBEB',
    
    // Interactive
    buttonPrimary: '#1C1C1E',
    buttonSecondary: '#F5F4F2',
    
    // System
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
  },
  
  // Dark Mode
  dark: {
    // Backgrounds
    background: '#1C1C1E',       // Soft black - not pure black
    surface: '#2C2C2E',          // Elevated surface
    surfaceSecondary: '#3A3A3C', // Secondary surface
    
    // Text
    textPrimary: '#F5F5F7',      // Off-white - easy on eyes
    textSecondary: '#98989D',    // Medium gray
    textTertiary: '#636366',     // Dimmed text
    textInverse: '#1C1C1E',
    
    // Borders & Dividers
    border: '#3A3A3C',
    borderLight: '#2C2C2E',
    divider: '#38383A',
    
    // Interactive
    buttonPrimary: '#FFFFFF',
    buttonSecondary: '#3A3A3C',
    
    // System
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
  },
  
  // Coach Accent Colors (same for both modes)
  coaches: {
    stoic: {
      primary: '#64748B',     // Slate blue - calm wisdom
      secondary: '#94A3B8',
      background: '#F1F5F9',
      backgroundDark: '#1E293B',
    },
    productivity: {
      primary: '#F59E0B',     // Amber - energizing
      secondary: '#FCD34D',
      background: '#FFFBEB',
      backgroundDark: '#451A03',
    },
    creative: {
      primary: '#8B5CF6',     // Violet - imaginative
      secondary: '#A78BFA',
      background: '#F5F3FF',
      backgroundDark: '#2E1065',
    },
    wellness: {
      primary: '#22C55E',     // Green - grounding
      secondary: '#4ADE80',
      background: '#F0FDF4',
      backgroundDark: '#14532D',
    },
    career: {
      primary: '#14B8A6',     // Teal - professional growth
      secondary: '#5EEAD4',
      background: '#F0FDFA',
      backgroundDark: '#134E4A',
    },
  },
};

export type ThemeColors = typeof colors.light;
export type CoachColorKey = keyof typeof colors.coaches;

