/**
 * Text Component
 * Typography component with preset styles based on Apple HIG
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { TypographyKey } from '../../theme';

interface TextProps extends RNTextProps {
  variant?: TypographyKey;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const theme = useAppTheme();
  
  const textColor = color || theme.colors.textPrimary;
  const typographyStyle = theme.typography[variant];
  
  return (
    <RNText
      style={[
        typographyStyle,
        { color: textColor },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Convenience components for common text types
export const LargeTitle: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="largeTitle" {...props} />
);

export const Title1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title1" {...props} />
);

export const Title2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title2" {...props} />
);

export const Title3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title3" {...props} />
);

export const Headline: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="headline" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const BodyLarge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyLarge" {...props} />
);

export const Callout: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="callout" {...props} />
);

export const Subheadline: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="subheadline" {...props} />
);

export const Footnote: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="footnote" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption1" {...props} />
);

export const Quote: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="quote" {...props} />
);

export const QuoteLarge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="quoteLarge" {...props} />
);

