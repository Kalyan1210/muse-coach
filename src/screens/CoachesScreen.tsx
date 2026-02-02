/**
 * Coaches Screen
 * Browse and discover AI coaches
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppTheme, useCoachColors } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Body, Subheadline, Card, Avatar, Button } from '../components/ui';
import { coaches } from '../data/coaches';
import { Coach } from '../types';

type Props = MainTabScreenProps<'Coaches'>;

const CoachCard: React.FC<{
  coach: Coach;
  onPress: () => void;
}> = ({ coach, onPress }) => {
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
          <Text variant="title3">{coach.name}</Text>
          <Text variant="subheadline" color={coachColors.primary}>
            {coach.title}
          </Text>
        </View>
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
  
  const handleCoachPress = (coachId: string) => {
    navigation.navigate('Chat', { coachId });
  };
  
  const handleCoachDetailPress = (coachId: string) => {
    navigation.navigate('CoachDetail', { coachId });
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
        
        {/* Coach List */}
        {coaches.map((coach) => (
          <CoachCard
            key={coach.id}
            coach={coach}
            onPress={() => handleCoachPress(coach.id)}
          />
        ))}
        
        {/* Pro Teaser */}
        <Card
          variant="flat"
          padding="large"
          style={[styles.proTeaser, { backgroundColor: theme.colors.surfaceSecondary }]}
          onPress={() => navigation.navigate('Paywall')}
        >
          <Text variant="headline" align="center">
            🌟 Unlock More Coaches
          </Text>
          <Text
            variant="callout"
            color={theme.colors.textSecondary}
            align="center"
            style={styles.proDescription}
          >
            Create custom coaches, share with the community, and get unlimited conversations.
          </Text>
          <Button
            title="See Pro Features"
            onPress={() => navigation.navigate('Paywall')}
            variant="primary"
            size="medium"
          />
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
    marginBottom: 24,
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

