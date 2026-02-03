/**
 * Avatar Component
 * Coach avatar with emoji or image support
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme, useCoachColors } from '../../theme/ThemeContext';
import { CoachColorKey } from '../../theme';
import { Text } from './Text';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  emoji: string;
  colorKey: CoachColorKey;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  emoji,
  colorKey,
  size = 'medium',
  style,
}) => {
  const theme = useAppTheme();
  const coachColors = useCoachColors(colorKey);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: 20 };
      case 'medium':
        return { width: 56, height: 56, fontSize: 28 };
      case 'large':
        return { width: 72, height: 72, fontSize: 36 };
      case 'xlarge':
        return { width: 96, height: 96, fontSize: 48 };
    }
  };
  
  const sizeStyles = getSizeStyles();
  
  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
          backgroundColor: coachColors.background,
          borderRadius: sizeStyles.width / 2,
        },
        style,
      ]}
    >
      <Text 
        style={{ 
          fontSize: sizeStyles.fontSize,
          lineHeight: sizeStyles.fontSize * 1.2,
          textAlign: 'center',
        }}
      >
        {emoji}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});

