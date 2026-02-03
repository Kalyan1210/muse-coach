/**
 * Button Component
 * Apple-style buttons with haptic feedback and glass-smooth animations
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../theme/ThemeContext';
import { Text } from './Text';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
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
    <Animated.View 
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && styles.fullWidth,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button,
          sizeStyles,
          { backgroundColor: colors.background },
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          variant === 'ghost' && styles.ghost,
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
      </TouchableOpacity>
    </Animated.View>
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
