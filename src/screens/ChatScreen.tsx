/**
 * Chat Screen
 * Conversation with an AI coach - with persistence and smooth typing
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useAppTheme, useCoachColors } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../navigation/types';
import { Text, Avatar } from '../components/ui';
import { getCoachById } from '../data/coaches';
import { Message, Coach } from '../types';
import { sendMessageToAI, isAIConfigured } from '../services/ai';
import { useStore, CustomCoach } from '../store/useStore';

type Props = RootStackScreenProps<'Chat'>;

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Typing message component with typewriter effect
const TypingMessage: React.FC<{
  content: string;
  onComplete: () => void;
}> = ({ content, onComplete }) => {
  const theme = useAppTheme();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (isComplete) return;
    
    let index = 0;
    const words = content.split(' ');
    
    const typeWord = () => {
      if (index < words.length) {
        setDisplayedText(words.slice(0, index + 1).join(' '));
        index++;
        // Vary the speed slightly for natural feel
        const delay = 30 + Math.random() * 20;
        setTimeout(typeWord, delay);
      } else {
        setIsComplete(true);
        onComplete();
      }
    };
    
    typeWord();
  }, [content, isComplete, onComplete]);
  
  return (
    <View style={styles.coachMessageRow}>
      <View style={styles.coachBubbleContainer}>
        <View
          style={[
            styles.messageBubble,
            styles.coachBubble,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="bodyLarge" color={theme.colors.textPrimary}>
            {displayedText}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Message bubble component
const MessageBubble: React.FC<{
  message: Message;
  isUser: boolean;
}> = ({ message, isUser }) => {
  const theme = useAppTheme();
  
  if (isUser) {
    return (
      <View
        style={[styles.messageBubble, styles.userBubble, { backgroundColor: theme.colors.buttonPrimary }]}
      >
        <Text variant="bodyLarge" color={theme.colors.textInverse}>
          {message.content}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.coachMessageRow}>
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
    </View>
  );
};

// Typing indicator
const TypingIndicator: React.FC = () => {
  const theme = useAppTheme();
  
  return (
    <View
      style={[styles.typingIndicator, { backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
      <View style={[styles.typingDot, styles.typingDotMiddle, { backgroundColor: theme.colors.textTertiary }]} />
      <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
    </View>
  );
};

export const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { coachId } = route.params;
  const theme = useAppTheme();
  
  const { 
    canSendMessage, 
    incrementMessageCount, 
    isPro,
    conversations,
    startConversation,
    addMessage,
    activeConversationId,
    setActiveConversation,
    customCoaches,
    user,
  } = useStore();
  
  // Look up coach from built-in or custom coaches
  const builtInCoach = getCoachById(coachId);
  const customCoach = customCoaches.find(c => c.id === coachId);
  const coach: Coach | CustomCoach | undefined = builtInCoach || customCoach;
  
  const coachColors = coach ? useCoachColors(coach.colorKey) : null;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Load existing conversation or start new one
  useEffect(() => {
    if (!coach) return;
    
    // Check for existing conversation with this coach
    const existingConversation = conversations.find(c => c.coachId === coachId);
    
    if (existingConversation && existingConversation.messages.length > 0) {
      // Load existing conversation
      setConversationId(existingConversation.id);
      setMessages(existingConversation.messages);
      setActiveConversation(existingConversation.id);
    } else {
      // Start new conversation with greeting
      const newId = startConversation(coachId);
      setConversationId(newId);
      
      const greeting: Message = {
        id: generateId(),
        coachId: coach.id,
        role: 'assistant',
        content: `Hello! I'm ${coach.name}, your ${coach.title.toLowerCase()}. ${coach.sampleQuestions[0]}`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
      addMessage(newId, greeting);
    }
  }, [coach, coachId]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping, typingMessage]);
  
  const handleTypingComplete = useCallback(() => {
    if (typingMessage && conversationId && coach) {
      const aiMessage: Message = {
        id: generateId(),
        coachId: coach.id,
        role: 'assistant',
        content: typingMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      addMessage(conversationId, aiMessage);
      setTypingMessage(null);
    }
  }, [typingMessage, conversationId, coach, addMessage]);
  
  const handleSend = async () => {
    if (!inputText.trim() || !coach || !conversationId) return;
    
    // Check message limits for free users
    if (!canSendMessage()) {
      setError('Daily message limit reached. Upgrade to Pro for unlimited messages!');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setError(null);
    
    const userMessage: Message = {
      id: generateId(),
      coachId: coach.id,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };
    
    // Add to local state and store
    setMessages(prev => [...prev, userMessage]);
    addMessage(conversationId, userMessage);
    setInputText('');
    setIsTyping(true);
    
    // Increment message count for free users
    if (!isPro) {
      incrementMessageCount();
    }
    
    // Check if AI is configured
    if (!isAIConfigured()) {
      // Fall back to mock responses if API key not set
      setTimeout(() => {
        const responses = [
          "Hmm, that's really interesting. You know, I think there might be something deeper going on here. Like, sometimes what bothers us on the surface is pointing to something we actually care about underneath. What do you think?",
          "Oh I totally get that. Let me think... so basically, it sounds like you're dealing with a lot right now. The thing is, these situations usually have more than one side to them. What would help you feel a bit better about this?",
          "Yeah, that makes sense. Here's what I'm noticing - and tell me if I'm off base - but it seems like this is really weighing on you. Sometimes just talking through it helps. What's the part that bugs you most?",
          "I hear you. Honestly, that sounds tough. So here's a thought - maybe we don't need to figure it all out right now? Like, what's one tiny thing that might help, even just a little bit?",
          "Okay so... let me think about this. You know what I'm curious about? What would it look like if things actually worked out? Sometimes it helps to imagine that first.",
        ];
        
        setIsTyping(false);
        setTypingMessage(responses[Math.floor(Math.random() * responses.length)]);
      }, 1000);
      return;
    }
    
    // Call AI API
    const result = await sendMessageToAI(
      coach.systemPrompt,
      messages,
      userMessage.content,
      user
    );
    
    setIsTyping(false);
    
    if (result.success && result.content) {
      setTypingMessage(result.content);
    } else {
      setError(result.error || 'Failed to get response. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
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
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() => navigation.navigate('CoachDetail', { coachId })}
            activeOpacity={0.7}
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
          
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
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
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {typingMessage && (
            <TypingMessage
              content={typingMessage}
              onComplete={handleTypingComplete}
            />
          )}
          
          {error && (
            <View
              style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}
            >
              <Text variant="footnote" color={theme.colors.error}>
                {error}
              </Text>
            </View>
          )}
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
              disabled={!inputText.trim() || isTyping || !!typingMessage}
              activeOpacity={0.7}
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() && !isTyping && !typingMessage
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
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
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
