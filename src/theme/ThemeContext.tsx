/**
 * Theme Context
 * Provides theme access throughout the app with light/dark mode support
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme, ThemeMode } from './index';
import { getStoredThemeMode, saveThemeMode } from '../services/storage';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  themePreference: ThemeMode | 'system';
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
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await getStoredThemeMode();
      if (savedMode) {
        setThemePreference(savedMode);
      }
      setIsLoaded(true);
    };
    loadTheme();
  }, []);
  
  // Determine actual theme mode
  const themeMode: ThemeMode = 
    themePreference === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themePreference;
  
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDark = themeMode === 'dark';
  
  const setThemeMode = async (mode: ThemeMode | 'system') => {
    setThemePreference(mode);
    await saveThemeMode(mode);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, themePreference, setThemeMode, isDark }}>
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

