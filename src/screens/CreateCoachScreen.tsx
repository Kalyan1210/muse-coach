/**
 * Create Coach Screen
 * Pro feature: Create custom AI coaches
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
import { useStore, CustomCoach } from '../store/useStore';
import { CoachCategory } from '../types';
import { CoachColorKey } from '../theme';

type Props = RootStackScreenProps<'CreateCoach'>;

const EMOJI_OPTIONS = ['🧠', '💡', '🎯', '🌟', '🔥', '💪', '🌱', '🎨', '📚', '🧘', '🚀', '⚡', '🌈', '🎭', '🏔️', '🌊'];

const CATEGORY_OPTIONS: { value: CoachCategory; label: string; colorKey: CoachColorKey }[] = [
  { value: 'stoic', label: 'Wisdom', colorKey: 'stoic' },
  { value: 'productivity', label: 'Productivity', colorKey: 'productivity' },
  { value: 'creative', label: 'Creative', colorKey: 'creative' },
  { value: 'wellness', label: 'Wellness', colorKey: 'wellness' },
  { value: 'career', label: 'Career', colorKey: 'career' },
];

const TONE_PRESETS = [
  'Warm and encouraging',
  'Direct and practical',
  'Calm and thoughtful',
  'Energetic and upbeat',
  'Gentle and patient',
];

export const CreateCoachScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useAppTheme();
  const { isPro, addCustomCoach, updateCustomCoach, getCustomCoach, deleteCustomCoach } = useStore();
  
  const editingCoachId = route.params?.coachId;
  const isEditing = !!editingCoachId;
  
  // Form state
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🧠');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CoachCategory>('stoic');
  const [colorKey, setColorKey] = useState<CoachColorKey>('stoic');
  const [tone, setTone] = useState('');
  const [expertise, setExpertise] = useState('');
  const [approach, setApproach] = useState('');
  
  // Load existing coach if editing
  useEffect(() => {
    if (editingCoachId) {
      const existingCoach = getCustomCoach(editingCoachId);
      if (existingCoach) {
        setName(existingCoach.name);
        setEmoji(existingCoach.emoji);
        setTitle(existingCoach.title);
        setTagline(existingCoach.tagline);
        setDescription(existingCoach.description);
        setCategory(existingCoach.category);
        setColorKey(existingCoach.colorKey);
        setTone(existingCoach.personality.tone);
        setExpertise(existingCoach.expertise.join(', '));
        setApproach(existingCoach.personality.approach);
      }
    }
  }, [editingCoachId]);
  
  const handleCategorySelect = (cat: typeof CATEGORY_OPTIONS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCategory(cat.value);
    setColorKey(cat.colorKey);
  };
  
  const handleEmojiSelect = (e: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEmoji(e);
  };
  
  const handleTonePreset = (preset: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTone(preset);
  };
  
  const generateSystemPrompt = () => {
    return `You are ${name}, a ${title.toLowerCase()}. ${description}

How you talk:
- Your tone is ${tone.toLowerCase()}
- You focus on: ${expertise}
- Your approach: ${approach}
- Sound like a real person - use "hmm", "you know", "let me think"
- Be warm and genuine, not formal or clinical
- Keep responses conversational (2-3 paragraphs max)
- Ask thoughtful questions to understand their situation

Remember: You're a supportive friend with expertise, not a distant professional.`;
  };
  
  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Give your coach a name.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Add a title like "Life Coach" or "Creative Guide".');
      return;
    }
    if (!tone.trim()) {
      Alert.alert('Missing Tone', 'Describe how your coach should communicate.');
      return;
    }
    
    const coachData = {
      name: name.trim(),
      emoji,
      title: title.trim(),
      tagline: tagline.trim() || `Your personal ${title.toLowerCase()}`,
      description: description.trim() || `${name} is here to help you with ${expertise || 'your goals'}.`,
      category,
      colorKey,
      expertise: expertise.split(',').map(e => e.trim()).filter(Boolean),
      personality: {
        tone: tone.trim(),
        style: `Conversational and ${tone.toLowerCase()}`,
        approach: approach.trim() || 'Asks questions to understand before giving advice',
      },
      systemPrompt: generateSystemPrompt(),
      sampleQuestions: [
        'What brings you here today?',
        'How can I help you?',
        "What's on your mind?",
      ],
    };
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (isEditing && editingCoachId) {
      updateCustomCoach(editingCoachId, coachData);
      Alert.alert('Coach Updated', `${name} has been updated.`);
    } else {
      addCustomCoach(coachData);
      Alert.alert('Coach Created!', `${name} is ready to chat with you.`);
    }
    
    navigation.goBack();
  };
  
  const handleDelete = () => {
    if (!editingCoachId) return;
    
    Alert.alert(
      'Delete Coach',
      `Are you sure you want to delete ${name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCustomCoach(editingCoachId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          },
        },
      ]
    );
  };
  
  // Redirect non-Pro users
  if (!isPro) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.proGate}>
          <Text style={styles.proEmoji}>✨</Text>
          <Title2 align="center">Pro Feature</Title2>
          <Text variant="body" color={theme.colors.textSecondary} align="center" style={styles.proText}>
            Create unlimited custom coaches with Pro. Design coaches that match your exact needs.
          </Text>
          <Button
            title="Unlock Pro"
            onPress={() => navigation.navigate('Paywall')}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }
  
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
          <Title2>{isEditing ? 'Edit Coach' : 'Create Coach'}</Title2>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text variant="headline" color={theme.coachColors.wellness.primary}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Emoji Picker */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              PICK AN EMOJI
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.emojiRow}>
                {EMOJI_OPTIONS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[
                      styles.emojiOption,
                      { backgroundColor: theme.colors.surface },
                      emoji === e && { 
                        backgroundColor: theme.coachColors[colorKey].background,
                        borderColor: theme.coachColors[colorKey].primary,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => handleEmojiSelect(e)}
                  >
                    <Text style={styles.emojiText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Name */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              COACH NAME
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Max, Luna, Sage..."
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Title */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              TITLE / ROLE
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Life Coach, Fitness Guide, Writing Mentor..."
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Category */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              CATEGORY
            </Text>
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: theme.colors.surface },
                    category === cat.value && {
                      backgroundColor: theme.coachColors[cat.colorKey].background,
                      borderColor: theme.coachColors[cat.colorKey].primary,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text
                    variant="caption1"
                    color={category === cat.value ? theme.coachColors[cat.colorKey].primary : theme.colors.textSecondary}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Tagline */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              TAGLINE (optional)
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={tagline}
              onChangeText={setTagline}
              placeholder="e.g., Your calm in the storm"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Tone */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              COMMUNICATION STYLE
            </Text>
            <View style={styles.presetRow}>
              {TONE_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetChip,
                    { backgroundColor: theme.colors.surface },
                    tone === preset && { backgroundColor: theme.coachColors[colorKey].background },
                  ]}
                  onPress={() => handleTonePreset(preset)}
                >
                  <Text
                    variant="caption1"
                    color={tone === preset ? theme.coachColors[colorKey].primary : theme.colors.textSecondary}
                  >
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, marginTop: 8 }]}
              value={tone}
              onChangeText={setTone}
              placeholder="Or describe your own..."
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Expertise */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              EXPERTISE AREAS (comma-separated)
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={expertise}
              onChangeText={setExpertise}
              placeholder="e.g., Mindset, Goals, Habits"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
          
          {/* Approach */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              COACHING APPROACH (optional)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={approach}
              onChangeText={setApproach}
              placeholder="How should this coach help? e.g., Asks questions first, then gives practical advice..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            <Text variant="caption1" color={theme.colors.textSecondary} style={styles.label}>
              BIO / DESCRIPTION (optional)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
              value={description}
              onChangeText={setDescription}
              placeholder="A short bio for this coach..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Delete button for editing */}
          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text variant="body" color="#EF4444" style={{ marginLeft: 8 }}>Delete Coach</Text>
            </TouchableOpacity>
          )}
          
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
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  bottomSpacer: {
    height: 40,
  },
  proGate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  proEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  proText: {
    marginTop: 8,
    marginBottom: 24,
  },
});
