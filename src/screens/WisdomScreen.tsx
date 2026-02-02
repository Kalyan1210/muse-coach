/**
 * Wisdom Screen
 * Saved insights and quotes from conversations
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { MainTabScreenProps } from '../navigation/types';
import { Text, Title1, Card, Avatar, Quote } from '../components/ui';
import { coaches } from '../data/coaches';

type Props = MainTabScreenProps<'Wisdom'>;

// Mock saved wisdom data
const mockWisdom = [
  {
    id: '1',
    coachId: 'marcus-stoic',
    content: 'The obstacle in your path becomes the path. Focus not on what stands in your way, but on how to move through it.',
    savedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    coachId: 'aria-productivity',
    content: 'You don\'t need more time—you need more clarity. When you know exactly what matters, everything else falls away.',
    savedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    coachId: 'luna-creative',
    content: 'Your inner critic is just trying to protect you from failure. Thank it, then create anyway.',
    savedAt: new Date('2024-01-12'),
  },
];

export const WisdomScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  
  const getCoach = (coachId: string) => coaches.find(c => c.id === coachId);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title1>Wisdom</Title1>
          <Text variant="subheadline" color={theme.colors.textSecondary}>
            Insights saved from your conversations
          </Text>
        </View>
        
        {mockWisdom.length > 0 ? (
          // Wisdom Cards
          mockWisdom.map((item) => {
            const coach = getCoach(item.coachId);
            if (!coach) return null;
            
            return (
              <Card
                key={item.id}
                variant="elevated"
                padding="large"
                style={styles.wisdomCard}
              >
                <View style={styles.wisdomHeader}>
                  <Avatar
                    emoji={coach.emoji}
                    colorKey={coach.colorKey}
                    size="small"
                  />
                  <View style={styles.wisdomMeta}>
                    <Text variant="subheadline">{coach.name}</Text>
                    <Text variant="caption1" color={theme.colors.textTertiary}>
                      {item.savedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Ionicons
                    name="bookmark"
                    size={20}
                    color={theme.coachColors[coach.colorKey].primary}
                  />
                </View>
                
                <Quote color={theme.colors.textPrimary} style={styles.wisdomContent}>
                  {item.content}
                </Quote>
              </Card>
            );
          })
        ) : (
          // Empty State
          <View style={styles.emptyState}>
            <Ionicons
              name="bookmark-outline"
              size={64}
              color={theme.colors.textTertiary}
            />
            <Text variant="title3" align="center" style={styles.emptyTitle}>
              No wisdom saved yet
            </Text>
            <Text
              variant="body"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.emptyDescription}
            >
              Long-press on any coach message to save it as wisdom for later reflection.
            </Text>
          </View>
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
  wisdomCard: {
    marginBottom: 16,
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  wisdomMeta: {
    flex: 1,
    marginLeft: 12,
  },
  wisdomContent: {
    lineHeight: 28,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
  },
  emptyDescription: {
    marginTop: 8,
  },
});

