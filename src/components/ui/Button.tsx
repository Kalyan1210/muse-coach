/**
 * Button Component
 * Apple-style buttons with haptic feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme/ThemeContext';
import { Text } from './Text';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  accentColor,
  style,
}) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, theme.animation.spring.snappy);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, theme.animation.spring.snappy);
  };
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.buttonPrimary,
          text: theme.colors.textInverse,
        };
      case 'secondary':
        return {
          background: theme.colors.buttonSecondary,
          text: theme.colors.textPrimary,
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: theme.colors.textPrimary,
        };
      case 'accent':
        return {
          background: accentColor || theme.coachColors.productivity.primary,
          text: '#FFFFFF',
        };
      default:
        return {
          background: theme.colors.buttonPrimary,
          text: theme.colors.textInverse,
        };
    }
  };
  
  // Get size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.borderRadius.sm,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.borderRadius.button,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.borderRadius.button,
        };
    }
  };
  
  const colors = getColors();
  const sizeStyles = getSizeStyles();
  
  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        styles.button,
        sizeStyles,
        { backgroundColor: colors.background },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant === 'ghost' && styles.ghost,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            variant={size === 'small' ? 'buttonSmall' : 'button'}
            color={colors.text}
            style={icon ? { marginLeft: theme.spacing.xs } : undefined}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

