/**
 * Theme Context
 * Provides theme access throughout the app with light/dark mode support
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme, ThemeMode } from './index';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode | 'system') => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeMode | 'system'>('system');
  
  // Determine actual theme mode
  const themeMode: ThemeMode = 
    themePreference === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themePreference;
  
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDark = themeMode === 'dark';
  
  const setThemeMode = (mode: ThemeMode | 'system') => {
    setThemePreference(mode);
    // TODO: Persist to AsyncStorage
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Convenience hook for just the theme object
export const useAppTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

// Hook for getting coach-specific colors
export const useCoachColors = (coachType: keyof typeof lightTheme.coachColors) => {
  const { theme, isDark } = useTheme();
  const coachColor = theme.coachColors[coachType];
  
  return {
    primary: coachColor.primary,
    secondary: coachColor.secondary,
    background: isDark ? coachColor.backgroundDark : coachColor.background,
  };
};

