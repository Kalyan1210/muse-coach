/**
 * Personal Context Screen
 * Let users add their values, goals, and challenges
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Title2, Button } from '../components/ui';
import { useStore } from '../store/useStore';

type Props = RootStackScreenProps<'PersonalContext'>;

const SUGGESTED_VALUES = [
  'Growth', 'Balance', 'Creativity', 'Family', 'Health', 
  'Freedom', 'Impact', 'Learning', 'Connection', 'Authenticity'
];

const SUGGESTED_GOALS = [
  'Build better habits', 'Reduce stress', 'Be more productive',
  'Improve relationships', 'Find clarity', 'Start a project'
];

export const PersonalContextScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useAppTheme();
  const { user, setUser, updateUser } = useStore();
  
  const [name, setName] = useState(user?.name || '');
  const [values, setValues] = useState<string[]>(user?.values || []);
  const [goals, setGoals] = useState<string[]>(user?.goals || []);
  const [challenges, setChallenges] = useState<string[]>(user?.challenges || []);
  const [newValue, setNewValue] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  
  const toggleValue = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (values.includes(value)) {
      setValues(values.filter(v => v !== value));
    } else {
      setValues([...values, value]);
    }
  };
  
  const toggleGoal = (goal: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };
  
  const addCustomValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const addCustomGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const addChallenge = () => {
    if (newChallenge.trim() && !challenges.includes(newChallenge.trim())) {
      setChallenges([...challenges, newChallenge.trim()]);
      setNewChallenge('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const removeChallenge = (challenge: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChallenges(challenges.filter(c => c !== challenge));
  };
  
  const handleSave = () => {
    const userData = {
      name: name.trim() || 'Friend',
      values,
      goals,
      challenges,
    };
    
    if (user) {
      updateUser(userData);
    } else {
      setUser(userData);
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved!', 'Your coaches will now understand you better.');
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Title2>About You</Title2>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text variant="headline" color={theme.coachColors.wellness.primary}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="body" color={theme.colors.textSecondary} style={styles.intro}>
            Help your coaches understand you better. This context makes conversations more personal and relevant.
          </Text>
          
          {/* Name */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              WHAT SHOULD WE CALL YOU?
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name or nickname"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Values */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              WHAT DO YOU VALUE MOST?
            </Text>
            <View style={styles.chipContainer}>
              {SUGGESTED_VALUES.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.colors.surface },
                    values.includes(value) && { 
                      backgroundColor: theme.coachColors.stoic.background,
                      borderColor: theme.coachColors.stoic.primary,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => toggleValue(value)}
                >
                  <Text
                    variant="callout"
                    color={values.includes(value) ? theme.coachColors.stoic.primary : theme.colors.textSecondary}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.addInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Add your own..."
                placeholderTextColor={theme.colors.textTertiary}
                onSubmitEditing={addCustomValue}
              />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.coachColors.stoic.primary }]}
                onPress={addCustomValue}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Goals */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              WHAT ARE YOU WORKING TOWARD?
            </Text>
            <View style={styles.chipContainer}>
              {SUGGESTED_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.colors.surface },
                    goals.includes(goal) && { 
                      backgroundColor: theme.coachColors.productivity.background,
                      borderColor: theme.coachColors.productivity.primary,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text
                    variant="callout"
                    color={goals.includes(goal) ? theme.coachColors.productivity.primary : theme.colors.textSecondary}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.addInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
                value={newGoal}
                onChangeText={setNewGoal}
                placeholder="Add your own goal..."
                placeholderTextColor={theme.colors.textTertiary}
                onSubmitEditing={addCustomGoal}
              />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.coachColors.productivity.primary }]}
                onPress={addCustomGoal}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Challenges */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              CURRENT CHALLENGES (optional)
            </Text>
            <Text variant="footnote" color={theme.colors.textTertiary} style={styles.hint}>
              What's hard right now? This helps coaches be more relevant.
            </Text>
            {challenges.map((challenge) => (
              <View 
                key={challenge} 
                style={[styles.challengeItem, { backgroundColor: theme.colors.surface }]}
              >
                <Text variant="body" style={styles.challengeText}>{challenge}</Text>
                <TouchableOpacity onPress={() => removeChallenge(challenge)}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput
                style={[styles.addInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
                value={newChallenge}
                onChangeText={setNewChallenge}
                placeholder="e.g., Struggling with focus..."
                placeholderTextColor={theme.colors.textTertiary}
                onSubmitEditing={addChallenge}
              />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.coachColors.wellness.primary }]}
                onPress={addChallenge}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Save Button */}
          <Button
            title="Save My Context"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            style={styles.saveMainButton}
          />
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  intro: {
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  hint: {
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addInput: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  challengeText: {
    flex: 1,
    marginRight: 8,
  },
  saveMainButton: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
