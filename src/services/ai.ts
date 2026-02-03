/**
 * AI Service
 * OpenAI integration for chat completions
 */

import { Message, UserContext } from '../types';
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

/**
 * Build enhanced system prompt with user context
 */
const buildEnhancedSystemPrompt = (
  basePrompt: string, 
  userContext?: UserContext | null
): string => {
  if (!userContext) return basePrompt;
  
  let contextAddition = '\n\n--- About the person you\'re coaching ---\n';
  
  if (userContext.name) {
    contextAddition += `Their name is ${userContext.name}.\n`;
  }
  
  if (userContext.values && userContext.values.length > 0) {
    contextAddition += `They value: ${userContext.values.join(', ')}.\n`;
  }
  
  if (userContext.goals && userContext.goals.length > 0) {
    contextAddition += `They're working on: ${userContext.goals.join(', ')}.\n`;
  }
  
  if (userContext.challenges && userContext.challenges.length > 0) {
    contextAddition += `Current challenges: ${userContext.challenges.join(', ')}.\n`;
  }
  
  contextAddition += '\nUse this context to make your coaching more relevant and personal. Reference their values or goals when appropriate, but don\'t force it.';
  
  return basePrompt + contextAddition;
};

/**
 * Send a message to the AI and get a response
 */
export const sendMessageToAI = async (
  systemPrompt: string,
  conversationHistory: Message[],
  userMessage: string,
  userContext?: UserContext | null
): Promise<{ success: boolean; content?: string; error?: string }> => {
  try {
    // Build enhanced system prompt with user context
    const enhancedPrompt = buildEnhancedSystemPrompt(systemPrompt, userContext);
    
    // Build messages array for OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: enhancedPrompt },
    ];
    
    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
    
    // Add the new user message
    messages.push({ role: 'user', content: userMessage });
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective and fast
        messages,
        max_tokens: 500,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });
    
    const data: OpenAIResponse = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error.message);
      return { success: false, error: data.error.message };
    }
    
    if (data.choices && data.choices.length > 0) {
      return {
        success: true,
        content: data.choices[0].message.content.trim(),
      };
    }
    
    return { success: false, error: 'No response from AI' };
  } catch (error: any) {
    console.error('AI service error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
};

/**
 * Check if the API key is configured
 */
export const isAIConfigured = (): boolean => {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.length > 0 && !OPENAI_API_KEY.includes('your');
};

/**
 * Generate a conversation summary (for future use)
 */
export const generateConversationSummary = async (
  messages: Message[]
): Promise<string | null> => {
  if (messages.length < 4) return null;
  
  try {
    const conversationText = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Summarize this coaching conversation in one sentence. Focus on the main topic discussed.',
          },
          {
            role: 'user',
            content: conversationText,
          },
        ],
        max_tokens: 100,
        temperature: 0.5,
      }),
    });
    
    const data: OpenAIResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }
    
    return null;
  } catch (error) {
    console.error('Failed to generate summary:', error);
    return null;
  }
};
