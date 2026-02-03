/**
 * Root Navigator
 * Main navigation container with stack + modal screens
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeContext';
import { RootStackParamList } from './types';
import { isOnboardingComplete } from '../services/storage';

// Navigators
import { MainTabs } from './MainTabs';

// Screens
import { ChatScreen } from '../screens/ChatScreen';
import { CoachDetailScreen } from '../screens/CoachDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if onboarding is needed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const complete = await isOnboardingComplete();
        setShowOnboarding(!complete);
      } catch (error) {
        console.log('Onboarding check failed, showing onboarding:', error);
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboarding();
  }, []);
  
  // Show loading while checking
  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.textPrimary} />
      </View>
    );
  }
  
  return (
    <Stack.Navigator
      initialRouteName={showOnboarding ? 'Onboarding' : 'Main'}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="CoachDetail"
        component={CoachDetailScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

