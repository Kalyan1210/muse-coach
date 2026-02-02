/**
 * Navigation Types
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Root stack (contains tabs + modal screens)
export type RootStackParamList = {
  Main: undefined;
  Chat: { coachId: string };
  CoachDetail: { coachId: string };
  Settings: undefined;
  Paywall: undefined;
  Onboarding: undefined;
};

// Bottom tabs
export type MainTabParamList = {
  Home: undefined;
  Coaches: undefined;
  Wisdom: undefined;
  Profile: undefined;
};

// Screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

