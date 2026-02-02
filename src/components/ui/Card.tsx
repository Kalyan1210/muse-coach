/**
 * Card Component
 * Apple-style card with subtle shadows and smooth interactions
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'medium',
  style,
}) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, theme.animation.spring.snappy);
    }
  };
  
  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, theme.animation.spring.snappy);
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return theme.spacing.sm;
      case 'medium': return theme.spacing.md;
      case 'large': return theme.spacing.lg;
    }
  };
  
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.surfaceSecondary,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
    }
  };
  
  const cardStyles: ViewStyle = {
    borderRadius: theme.borderRadius.card,
    padding: getPadding(),
    ...getVariantStyles(),
  };
  
  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[cardStyles, animatedStyle, style]}
      >
        {children}
      </AnimatedTouchable>
    );
  }
  
  return (
    <View style={[cardStyles, style]}>
      {children}
    </View>
  );
};

