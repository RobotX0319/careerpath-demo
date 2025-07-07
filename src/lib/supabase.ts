/**
 * Supabase Client Configuration
 * Mock implementation for demo purposes
 */

import type { PersonalityScores } from '@/types';

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    insert: (data: any) => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    select: (columns?: string) => ({ 
      eq: (column: string, value: any) => ({ 
        single: () => ({ data: null, error: null }),
        order: (column: string, options?: any) => ({ data: [], error: null }),
        limit: (count: number) => ({ single: () => ({ data: null, error: null }) })
      })
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => ({ 
        select: () => ({ single: () => ({ data: null, error: null }) })
      })
    })
  }),
  channel: (name: string) => ({
    on: (event: string, config: any, callback: Function) => ({ subscribe: () => {} })
  })
};

export const supabase = mockSupabase;

// Types for database operations
export interface User {
  id: string;
  email?: string;
  name: string;
  age: number;
  education: string;
  city: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_type: string;
  answers: number[];
  personality_scores: PersonalityScores;
  ai_analysis?: string;
  recommended_careers?: any[];
  match_scores?: Record<string, number>;
  completion_time?: number;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  session_title: string;
  messages: ChatMessage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CareerFeedback {
  id: string;
  user_id: string;
  career_id: string;
  career_title: string;
  rating: number;
  feedback_text?: string;
  is_interested: boolean;
  created_at: string;
}

// Database service class
export class SupabaseService {
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    console.log('Mock: Creating user', userData);
    return null;
  }

  async getUserById(userId: string): Promise<User | null> {
    console.log('Mock: Getting user by id', userId);
    return null;
  }

  async saveTestResult(testData: Omit<TestResult, 'id' | 'created_at'>): Promise<TestResult | null> {
    console.log('Mock: Saving test result', testData);
    return null;
  }

  async getUserResults(userId: string): Promise<TestResult[]> {
    console.log('Mock: Getting user results', userId);
    return [];
  }

  async createChatSession(userId: string, title = 'Karyera maslahat'): Promise<ChatSession | null> {
    console.log('Mock: Creating chat session', userId, title);
    return null;
  }

  async testConnection(): Promise<boolean> {
    return true;
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();

// Helper functions for common operations
export async function saveTestResultToDatabase(
  userData: any,
  answers: number[],
  personalityScores: PersonalityScores,
  aiAnalysis?: string,
  recommendedCareers?: any[]
) {
  console.log('Mock: Saving test result to database');
  return { user: null, testResult: null };
}

export async function getUserTestHistory(userId: string) {
  console.log('Mock: Getting user test history', userId);
  return [];
}

export async function startChatSession(userId: string) {
  console.log('Mock: Starting chat session', userId);
  return null;
}

export async function sendChatMessage(sessionId: string, message: string, role: 'user' | 'assistant' = 'user') {
  console.log('Mock: Sending chat message', sessionId, message, role);
  return false;
}