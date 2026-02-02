/**
 * Coach Detail Screen
 * Full coach profile view (modal)
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
import { useAppTheme, useCoachColors } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Avatar, Button, Card } from '../components/ui';
import { getCoachById } from '../data/coaches';

type Props = RootStackScreenProps<'CoachDetail'>;

export const CoachDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { coachId } = route.params;
  const coach = getCoachById(coachId);
  const theme = useAppTheme();
  const coachColors = coach ? useCoachColors(coach.colorKey) : null;
  
  if (!coach || !coachColors) {
    return null;
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={styles.handle} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            emoji={coach.emoji}
            colorKey={coach.colorKey}
            size="xlarge"
          />
          <Text variant="title1" style={styles.name}>
            {coach.name}
          </Text>
          <Text variant="title3" color={coachColors.primary}>
            {coach.title}
          </Text>
          <Text variant="quoteLarge" align="center" style={styles.tagline}>
            "{coach.tagline}"
          </Text>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            About
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {coach.description}
          </Text>
        </View>
        
        {/* Expertise */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Expertise
          </Text>
          <View style={styles.tags}>
            {coach.expertise.map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: coachColors.background }]}
              >
                <Text variant="callout" color={coachColors.primary}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Coaching Style */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            Coaching Style
          </Text>
          <Card variant="flat" padding="medium">
            <View style={styles.styleItem}>
              <Text variant="subheadline" color={theme.colors.textSecondary}>
                Tone
              </Text>
              <Text variant="body">{coach.personality.tone}</Text>
            </View>
            <View style={[styles.styleItem, styles.styleItemMiddle]}>
              <Text variant="subheadline" color={theme.colors.textSecondary}>
                Style
              </Text>
              <Text variant="body">{coach.personality.style}</Text>
            </View>
            <View style={styles.styleItem}>
              <Text variant="subheadline" color={theme.colors.textSecondary}>
                Approach
              </Text>
              <Text variant="body">{coach.personality.approach}</Text>
            </View>
          </Card>
        </View>
        
        {/* Sample Questions */}
        <View style={styles.section}>
          <Text variant="headline" style={styles.sectionTitle}>
            {coach.name} might ask...
          </Text>
          {coach.sampleQuestions.map((question, index) => (
            <Card
              key={index}
              variant="outlined"
              padding="medium"
              style={styles.questionCard}
            >
              <Text variant="quote" color={theme.colors.textSecondary}>
                "{question}"
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Action */}
      <View style={[styles.bottomAction, { borderTopColor: theme.colors.border }]}>
        <Button
          title={`Start Conversation with ${coach.name}`}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('Chat', { coachId: coach.id });
          }}
          variant="accent"
          accentColor={coachColors.primary}
          fullWidth
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 40,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DEDEDE',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    marginTop: 16,
  },
  tagline: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 8,
  },
  styleItem: {
    paddingVertical: 8,
  },
  styleItemMiddle: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E5E5E5',
    marginVertical: 8,
  },
  questionCard: {
    marginBottom: 8,
  },
  bottomAction: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 0.5,
  },
});

