/**
 * Coach Types
 * Data models for AI coaches
 */

import { CoachColorKey } from '../theme';

export type CoachCategory = 
  | 'stoic'
  | 'productivity'
  | 'creative'
  | 'wellness'
  | 'career';

export interface Coach {
  id: string;
  name: string;
  title: string;
  category: CoachCategory;
  colorKey: CoachColorKey;
  emoji: string;
  tagline: string;
  description: string;
  expertise: string[];
  personality: {
    tone: string;
    style: string;
    approach: string;
  };
  systemPrompt: string;
  sampleQuestions: string[];
  isPremium: boolean;
}

export interface Message {
  id: string;
  coachId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  saved?: boolean; // User saved this as wisdom
}

export interface Conversation {
  id: string;
  coachId: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
  summary?: string; // AI-generated conversation summary
}

export interface UserContext {
  name: string;
  values: string[];
  goals: string[];
  challenges: string[];
  // Premium features
  lifeAreas?: {
    area: string;
    notes: string;
  }[];
}

export interface SavedWisdom {
  id: string;
  coachId: string;
  content: string;
  savedAt: Date;
  messageId: string;
}

