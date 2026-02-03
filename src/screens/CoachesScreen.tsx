/**
 * Coaches Screen
 * Browse and discover AI coaches (including custom ones)
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
import * as Haptics from 'expo-haptics';
import { useAppTheme, useCoachColors } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Subheadline, Card, Avatar, Button } from '../components/ui';
import { coaches } from '../data/coaches';
import { Coach } from '../types';
import { useStore, CustomCoach } from '../store/useStore';

type Props = MainTabScreenProps<'Coaches'>;

const CoachCard: React.FC<{
  coach: Coach | CustomCoach;
  onPress: () => void;
  onLongPress?: () => void;
  isCustom?: boolean;
}> = ({ coach, onPress, onLongPress, isCustom }) => {
  const theme = useAppTheme();
  const coachColors = useCoachColors(coach.colorKey);
  
  return (
    <Card
      variant="elevated"
      padding="large"
      style={styles.coachCard}
      onPress={onPress}
    >
      <View style={styles.coachHeader}>
        <Avatar
          emoji={coach.emoji}
          colorKey={coach.colorKey}
          size="large"
        />
        <View style={styles.coachInfo}>
          <View style={styles.nameRow}>
            <Text variant="title3">{coach.name}</Text>
            {isCustom && (
              <View style={[styles.customBadge, { backgroundColor: coachColors.background }]}>
                <Text variant="caption2" color={coachColors.primary}>Custom</Text>
              </View>
            )}
          </View>
          <Text variant="subheadline" color={coachColors.primary}>
            {coach.title}
          </Text>
        </View>
        {isCustom && onLongPress && (
          <TouchableOpacity onPress={onLongPress} style={styles.editButton}>
            <Ionicons name="pencil" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text
        variant="quote"
        color={theme.colors.textSecondary}
        style={styles.tagline}
      >
        "{coach.tagline}"
      </Text>
      
      <Text
        variant="callout"
        color={theme.colors.textSecondary}
        numberOfLines={2}
        style={styles.description}
      >
        {coach.description}
      </Text>
      
      <View style={styles.expertiseTags}>
        {coach.expertise.slice(0, 3).map((tag, index) => (
          <View
            key={index}
            style={[
              styles.tag,
              { backgroundColor: coachColors.background }
            ]}
          >
            <Text variant="caption1" color={coachColors.primary}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
      
      <Button
        title="Start Conversation"
        onPress={onPress}
        variant="accent"
        accentColor={coachColors.primary}
        fullWidth
        style={styles.startButton}
      />
    </Card>
  );
};

export const CoachesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const { isPro, customCoaches } = useStore();
  
  const handleCoachPress = (coachId: string) => {
    navigation.navigate('Chat', { coachId });
  };
  
  const handleEditCoach = (coachId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCoach', { coachId });
  };
  
  const handleCreateCoach = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCoach', {});
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title1>Coaches</Title1>
          <Subheadline color={theme.colors.textSecondary}>
            Choose a coach to guide your journey
          </Subheadline>
        </View>
        
        {/* Create Coach Button (Pro users) */}
        {isPro && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.coachColors.creative.background }]}
            onPress={handleCreateCoach}
            activeOpacity={0.8}
          >
            <View style={[styles.createIcon, { backgroundColor: theme.coachColors.creative.primary }]}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.createText}>
              <Text variant="headline">Create Your Coach</Text>
              <Text variant="footnote" color={theme.colors.textSecondary}>
                Design a custom AI coach for your needs
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.coachColors.creative.primary} />
          </TouchableOpacity>
        )}
        
        {/* Custom Coaches Section */}
        {customCoaches.length > 0 && (
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
              YOUR COACHES
            </Text>
            {customCoaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                onPress={() => handleCoachPress(coach.id)}
                onLongPress={() => handleEditCoach(coach.id)}
                isCustom
              />
            ))}
          </View>
        )}
        
        {/* Built-in Coaches */}
        <View style={styles.section}>
          {customCoaches.length > 0 && (
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.sectionTitle}>
              BUILT-IN COACHES
            </Text>
          )}
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onPress={() => handleCoachPress(coach.id)}
            />
          ))}
        </View>
        
        {/* Pro Teaser (for non-Pro users) */}
        {!isPro && (
          <Card
            variant="flat"
            padding="large"
            style={[styles.proTeaser, { backgroundColor: theme.colors.surfaceSecondary }]}
            onPress={() => navigation.navigate('Paywall')}
          >
            <Text variant="headline" align="center">
              ✨ Create Custom Coaches
            </Text>
            <Text
              variant="callout"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.proDescription}
            >
              Design coaches that match your exact needs. Set their personality, expertise, and approach.
            </Text>
            <Button
              title="Unlock Pro"
              onPress={() => navigation.navigate('Paywall')}
              variant="primary"
              size="medium"
            />
          </Card>
        )}
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
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  createIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createText: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  coachCard: {
    marginBottom: 16,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coachInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  expertiseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  startButton: {
    marginTop: 4,
  },
  proTeaser: {
    marginTop: 16,
    alignItems: 'center',
  },
  proDescription: {
    marginTop: 8,
    marginBottom: 16,
  },
});
