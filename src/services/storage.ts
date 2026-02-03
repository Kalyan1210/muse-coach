/**
 * Storage Service
 * AsyncStorage wrapper for persistent data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  THEME_MODE: '@muse/themeMode',
  USER_CONTEXT: '@muse/userContext',
  CONVERSATIONS: '@muse/conversations',
  SAVED_WISDOM: '@muse/savedWisdom',
  IS_PRO: '@muse/isPro',
  ONBOARDING_COMPLETE: '@muse/onboardingComplete',
  DAILY_MESSAGE_COUNT: '@muse/dailyMessageCount',
  LAST_MESSAGE_DATE: '@muse/lastMessageDate',
} as const;

/**
 * Save data to storage
 */
export const saveToStorage = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return false;
  }
};

/**
 * Load data from storage
 */
export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from storage
 */
export const removeFromStorage = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key}:`, error);
    return false;
  }
};

/**
 * Clear all app data
 */
export const clearAllStorage = async (): Promise<boolean> => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};

/**
 * Check if onboarding is complete
 */
export const isOnboardingComplete = async (): Promise<boolean> => {
  const complete = await loadFromStorage<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return complete === true;
};

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = async (): Promise<void> => {
  await saveToStorage(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
};

/**
 * Get stored theme mode
 */
export const getStoredThemeMode = async (): Promise<'light' | 'dark' | 'system' | null> => {
  return loadFromStorage<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME_MODE);
};

/**
 * Save theme mode
 */
export const saveThemeMode = async (mode: 'light' | 'dark' | 'system'): Promise<void> => {
  await saveToStorage(STORAGE_KEYS.THEME_MODE, mode);
};
