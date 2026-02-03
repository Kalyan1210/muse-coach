/**
 * Onboarding Screen
 * Welcome flow for new users
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Title1, Body, Button } from '../components/ui';
import { setOnboardingComplete } from '../services/storage';

type Props = RootStackScreenProps<'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingStep {
  emoji: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    emoji: '🌟',
    title: 'Welcome to Muse',
    description: 'Your personal AI coaching companion for growth, clarity, and wisdom.',
  },
  {
    emoji: '🧠',
    title: 'Meet Your Coaches',
    description: 'Choose from specialized AI coaches in Stoicism, productivity, creativity, wellness, and career.',
  },
  {
    emoji: '💬',
    title: 'Meaningful Conversations',
    description: 'Each coach has a unique personality and approach to help you with specific challenges.',
  },
  {
    emoji: '✨',
    title: 'Save Your Wisdom',
    description: 'Keep insights from your sessions and build your personal collection of wisdom.',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await setOnboardingComplete();
      navigation.replace('Main');
    }
  };
  
  const handleSkip = async () => {
    await setOnboardingComplete();
    navigation.replace('Main');
  };
  
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip button */}
      {!isLastStep && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text variant="subheadline" color={theme.colors.textSecondary}>
            Skip
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Content */}
      <View
        key={currentStep}
        style={styles.content}
      >
        <Text style={styles.emoji}>{step.emoji}</Text>
        <Title1 align="center" style={styles.title}>
          {step.title}
        </Title1>
        <Body
          color={theme.colors.textSecondary}
          align="center"
          style={styles.description}
        >
          {step.description}
        </Body>
      </View>
      
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentStep
                    ? theme.colors.textPrimary
                    : theme.colors.border,
              },
              index === currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
      
      {/* Action button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastStep ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});
