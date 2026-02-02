/**
 * Muse - AI Coaching App
 * Main entry point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Theme
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

// Navigation
import { RootNavigator } from './src/navigation';

// Services
import { initializeRevenueCat } from './src/services/revenue-cat';

// Inner app with theme access
const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  
  useEffect(() => {
    // Initialize RevenueCat on app start
    initializeRevenueCat();
  }, []);
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

// Main App component
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
