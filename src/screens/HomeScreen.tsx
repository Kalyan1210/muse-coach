/**
 * Home Screen
 * "Today's Guidance" - personalized daily view
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Body, Subheadline, Card, Avatar, Quote } from '../components/ui';
import { coaches } from '../data/coaches';

type Props = MainTabScreenProps<'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Get a daily reflection prompt
  const getDailyPrompt = () => {
    const prompts = [
      "What's one thing you're grateful for today?",
      "What intention do you want to set for today?",
      "What's been weighing on your mind lately?",
      "What would make today feel successful?",
      "What's one small step you can take toward a goal?",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return prompts[dayOfYear % prompts.length];
  };
  
  const recentCoach = coaches[0]; // Marcus - Stoic
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Subheadline color={theme.colors.textSecondary}>
              {getGreeting()}
            </Subheadline>
            <Title1>Today's Guidance</Title1>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={[styles.settingsButton, { backgroundColor: theme.colors.surfaceSecondary }]}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* Daily Reflection Card */}
        <Card
          variant="elevated"
          padding="large"
          style={styles.reflectionCard}
          onPress={() => navigation.navigate('Chat', { coachId: 'sage-wellness' })}
        >
          <View style={styles.reflectionHeader}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.reflectionLabel}>
              DAILY REFLECTION
            </Text>
            <Ionicons name="sparkles" size={16} color={theme.coachColors.wellness.primary} />
          </View>
          <Quote color={theme.colors.textPrimary} style={styles.reflectionPrompt}>
            {getDailyPrompt()}
          </Quote>
          <View style={styles.reflectionFooter}>
            <Text variant="footnote" color={theme.colors.textTertiary}>
              Tap to reflect with Sage
            </Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.textTertiary} />
          </View>
        </Card>
        
        {/* Continue Conversation */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Continue
          </Text>
          <Card
            variant="elevated"
            padding="medium"
            onPress={() => navigation.navigate('Chat', { coachId: recentCoach.id })}
          >
            <View style={styles.continueCard}>
              <Avatar
                emoji={recentCoach.emoji}
                colorKey={recentCoach.colorKey}
                size="medium"
              />
              <View style={styles.continueContent}>
                <Text variant="headline">{recentCoach.name}</Text>
                <Text variant="subheadline" color={theme.colors.textSecondary} numberOfLines={1}>
                  "We spoke about finding clarity..."
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </View>
          </Card>
        </View>
        
        {/* Quick Access Coaches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="headline">Your Coaches</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Coaches')}>
              <Text variant="subheadline" color={theme.coachColors.productivity.primary}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coachesRow}
          >
            {coaches.slice(0, 4).map((coach) => (
              <TouchableOpacity
                key={coach.id}
                style={styles.coachItem}
                onPress={() => navigation.navigate('Chat', { coachId: coach.id })}
              >
                <Avatar
                  emoji={coach.emoji}
                  colorKey={coach.colorKey}
                  size="large"
                />
                <Text variant="footnote" style={styles.coachName}>
                  {coach.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Quote of the Day */}
        <Card
          variant="flat"
          padding="large"
          style={[styles.quoteCard, { backgroundColor: theme.coachColors.stoic.background }]}
        >
          <Quote color={theme.coachColors.stoic.primary}>
            "The happiness of your life depends upon the quality of your thoughts."
          </Quote>
          <Text variant="caption1" color={theme.colors.textSecondary} style={styles.quoteAttribution}>
            — Marcus Aurelius
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionCard: {
    marginBottom: 32,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reflectionLabel: {
    letterSpacing: 1,
  },
  reflectionPrompt: {
    marginBottom: 16,
  },
  reflectionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  coachesRow: {
    paddingRight: 20,
  },
  coachItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  coachName: {
    marginTop: 8,
  },
  quoteCard: {
    marginBottom: 16,
  },
  quoteAttribution: {
    marginTop: 12,
    textAlign: 'right',
  },
});

