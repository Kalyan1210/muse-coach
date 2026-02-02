/**
 * Global Store
 * Zustand store for app state management
 */

import { create } from 'zustand';
import { Message, Conversation, UserContext, SavedWisdom } from '../types';

interface AppState {
  // User
  user: UserContext | null;
  isPro: boolean;
  
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  
  // Wisdom
  savedWisdom: SavedWisdom[];
  
  // Message limits (for free tier)
  dailyMessageCount: number;
  lastMessageDate: string | null;
  
  // Actions
  setUser: (user: UserContext) => void;
  setIsPro: (isPro: boolean) => void;
  
  addMessage: (conversationId: string, message: Message) => void;
  startConversation: (coachId: string) => string;
  setActiveConversation: (id: string | null) => void;
  
  saveWisdom: (wisdom: Omit<SavedWisdom, 'id' | 'savedAt'>) => void;
  removeWisdom: (id: string) => void;
  
  incrementMessageCount: () => void;
  resetDailyCount: () => void;
  canSendMessage: () => boolean;
}

const FREE_DAILY_LIMIT = 15;

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isPro: false,
  conversations: [],
  activeConversationId: null,
  savedWisdom: [],
  dailyMessageCount: 0,
  lastMessageDate: null,
  
  // User actions
  setUser: (user) => set({ user }),
  setIsPro: (isPro) => set({ isPro }),
  
  // Conversation actions
  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessageAt: new Date(),
            }
          : conv
      ),
    }));
  },
  
  startConversation: (coachId) => {
    const id = generateId();
    const newConversation: Conversation = {
      id,
      coachId,
      messages: [],
      startedAt: new Date(),
      lastMessageAt: new Date(),
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: id,
    }));
    
    return id;
  },
  
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  // Wisdom actions
  saveWisdom: (wisdomData) => {
    const wisdom: SavedWisdom = {
      ...wisdomData,
      id: generateId(),
      savedAt: new Date(),
    };
    
    set((state) => ({
      savedWisdom: [wisdom, ...state.savedWisdom],
    }));
  },
  
  removeWisdom: (id) => {
    set((state) => ({
      savedWisdom: state.savedWisdom.filter((w) => w.id !== id),
    }));
  },
  
  // Message limit actions
  incrementMessageCount: () => {
    const today = new Date().toDateString();
    const { lastMessageDate, dailyMessageCount } = get();
    
    if (lastMessageDate !== today) {
      // New day, reset count
      set({ dailyMessageCount: 1, lastMessageDate: today });
    } else {
      set({ dailyMessageCount: dailyMessageCount + 1 });
    }
  },
  
  resetDailyCount: () => {
    set({ dailyMessageCount: 0, lastMessageDate: new Date().toDateString() });
  },
  
  canSendMessage: () => {
    const { isPro, dailyMessageCount, lastMessageDate } = get();
    
    // Pro users have unlimited messages
    if (isPro) return true;
    
    // Check if it's a new day
    const today = new Date().toDateString();
    if (lastMessageDate !== today) return true;
    
    // Check against limit
    return dailyMessageCount < FREE_DAILY_LIMIT;
  },
}));

