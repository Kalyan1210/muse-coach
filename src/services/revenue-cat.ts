/**
 * RevenueCat Service
 * Handles subscription management and purchases
 */

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// API keys from environment variables via expo-constants
const API_KEYS = {
  ios: Constants.expoConfig?.extra?.revenuecatIosApiKey || '',
  android: Constants.expoConfig?.extra?.revenuecatAndroidApiKey || '',
};

// Entitlement ID for Pro features
export const PRO_ENTITLEMENT_ID = 'pro';

// Product IDs
export const PRODUCT_IDS = {
  monthly: 'muse_pro_monthly',
  annual: 'muse_pro_annual',
};

/**
 * Check if RevenueCat is configured
 */
export const isRevenueCatConfigured = (): boolean => {
  // RevenueCat doesn't support web
  if (Platform.OS === 'web') return false;
  
  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  return !!apiKey && apiKey.length > 0 && !apiKey.includes('xxxxx');
};

/**
 * Initialize RevenueCat SDK
 */
export const initializeRevenueCat = async (): Promise<void> => {
  try {
    // Skip initialization on web or if not configured
    if (Platform.OS === 'web') {
      console.log('RevenueCat not supported on web - skipping');
      return;
    }
    
    if (!isRevenueCatConfigured()) {
      console.log('RevenueCat not configured - skipping initialization');
      return;
    }
    
    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    
    const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
    
    await Purchases.configure({ apiKey });
    
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
};

/**
 * Check if user has Pro entitlement
 */
export const checkProStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('Failed to check pro status:', error);
    return false;
  }
};

/**
 * Get available offerings/packages
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return [];
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
    
    return {
      success: isPro,
      customerInfo,
    };
  } catch (error: any) {
    // Check if user cancelled
    if (error.userCancelled) {
      return { success: false, error: 'cancelled' };
    }
    
    console.error('Purchase failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Restore purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  isPro: boolean;
  error?: string;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
    
    return { success: true, isPro };
  } catch (error: any) {
    console.error('Restore failed:', error);
    return { success: false, isPro: false, error: error.message };
  }
};

/**
 * Get customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return null;
  }
};

/**
 * Set user ID for RevenueCat (optional, for user identification)
 */
export const setUserId = async (userId: string): Promise<void> => {
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
};

/**
 * Log out user from RevenueCat
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};

