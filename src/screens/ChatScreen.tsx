/**
 * Chat Screen
 * Conversation with an AI coach
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { useAppTheme, useCoachColors } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Avatar } from '../components/ui';
import { getCoachById } from '../data/coaches';
import { Message } from '../types';

type Props = RootStackScreenProps<'Chat'>;

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Message bubble component
const MessageBubble: React.FC<{
  message: Message;
  isUser: boolean;
  coachEmoji?: string;
  coachColorKey?: string;
}> = ({ message, isUser, coachEmoji, coachColorKey }) => {
  const theme = useAppTheme();
  
  if (isUser) {
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[styles.messageBubble, styles.userBubble, { backgroundColor: theme.colors.buttonPrimary }]}
      >
        <Text variant="bodyLarge" color={theme.colors.textInverse}>
          {message.content}
        </Text>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={styles.coachMessageRow}
    >
      <View style={styles.coachBubbleContainer}>
        <View
          style={[
            styles.messageBubble,
            styles.coachBubble,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="bodyLarge" color={theme.colors.textPrimary}>
            {message.content}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Typing indicator
const TypingIndicator: React.FC = () => {
  const theme = useAppTheme();
  
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[styles.typingIndicator, { backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
      <View style={[styles.typingDot, styles.typingDotMiddle, { backgroundColor: theme.colors.textTertiary }]} />
      <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
    </Animated.View>
  );
};

export const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { coachId } = route.params;
  const coach = getCoachById(coachId);
  const theme = useAppTheme();
  const coachColors = coach ? useCoachColors(coach.colorKey) : null;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Initialize with greeting
  useEffect(() => {
    if (coach && messages.length === 0) {
      const greeting: Message = {
        id: generateId(),
        coachId: coach.id,
        role: 'assistant',
        content: `Hello! I'm ${coach.name}, your ${coach.title.toLowerCase()}. ${coach.sampleQuestions[0]}`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [coach]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);
  
  const handleSend = async () => {
    if (!inputText.trim() || !coach) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    
    const userMessage: Message = {
      id: generateId(),
      coachId: coach.id,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "That's a thoughtful question. Let me reflect on that with you...",
        "I appreciate you sharing that. Here's what I'm noticing...",
        "This is an important topic. Let's explore it together...",
        "Thank you for your honesty. What do you think is at the root of this?",
        "I hear you. Sometimes the first step is simply acknowledging where we are.",
      ];
      
      const aiMessage: Message = {
        id: generateId(),
        coachId: coach.id,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };
  
  if (!coach) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Coach not found</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() => navigation.navigate('CoachDetail', { coachId })}
          >
            <Avatar
              emoji={coach.emoji}
              colorKey={coach.colorKey}
              size="small"
            />
            <View style={styles.headerInfo}>
              <Text variant="headline">{coach.name}</Text>
              <Text variant="caption1" color={coachColors?.primary}>
                {coach.title}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
              coachEmoji={coach.emoji}
              coachColorKey={coach.colorKey}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
        </ScrollView>
        
        {/* Input */}
        <View style={[styles.inputContainer, { borderTopColor: theme.colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.textPrimary }]}
              placeholder={`Message ${coach.name}...`}
              placeholderTextColor={theme.colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim()
                    ? coachColors?.primary
                    : theme.colors.textTertiary,
                },
              ]}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerInfo: {
    marginLeft: 12,
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  coachMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  coachBubbleContainer: {
    maxWidth: '80%',
  },
  coachBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  typingDotMiddle: {
    marginHorizontal: 4,
    opacity: 0.7,
  },
  inputContainer: {
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

