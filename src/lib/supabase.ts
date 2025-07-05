import { createClient } from '@supabase/supabase-js';
import type { PersonalityScores } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  
  // 1. User creation and authentication
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Create user error:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }

  // 2. Test results saving and retrieving
  async saveTestResult(testData: Omit<TestResult, 'id' | 'created_at'>): Promise<TestResult | null> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert([testData])
        .select()
        .single();

      if (error) {
        console.error('Error saving test result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Save test result error:', error);
      return null;
    }
  }

  async getUserResults(userId: string): Promise<TestResult[]> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user results error:', error);
      return [];
    }
  }

  async getLatestTestResult(userId: string): Promise<TestResult | null> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching latest test result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get latest test result error:', error);
      return null;
    }
  }

  // 3. Chat history storage
  async createChatSession(userId: string, title = 'Karyera maslahat'): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: userId,
          session_title: title,
          messages: [],
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating chat session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Create chat session error:', error);
      return null;
    }
  }

  async saveChatMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      // Get current session
      const { data: session, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('messages')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching chat session:', fetchError);
        return false;
      }

      // Add new message
      const newMessage: ChatMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...(session.messages || []), newMessage];

      // Update session
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ 
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Error updating chat session:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Save chat message error:', error);
      return false;
    }
  }

  async getChatHistory(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get chat history error:', error);
      return [];
    }
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching chat session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get chat session error:', error);
      return null;
    }
  }

  // 4. Real-time subscriptions for chat
  subscribeToChat(sessionId: string, callback: (session: ChatSession) => void) {
    return supabase
      .channel(`chat_session_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload: any) => {
          callback(payload.new as ChatSession);
        }
      )
      .subscribe();
  }

  // 5. Career feedback management
  async saveCareerFeedback(feedbackData: Omit<CareerFeedback, 'id' | 'created_at'>): Promise<CareerFeedback | null> {
    try {
      const { data, error } = await supabase
        .from('career_feedback')
        .insert([feedbackData])
        .select()
        .single();

      if (error) {
        console.error('Error saving career feedback:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Save career feedback error:', error);
      return null;
    }
  }

  async getUserFeedback(userId: string): Promise<CareerFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('career_feedback')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user feedback:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user feedback error:', error);
      return [];
    }
  }

  // Analytics and insights
  async getUserAnalytics(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user analytics error:', error);
      return null;
    }
  }

  // Helper: Create user from localStorage data
  async createUserFromLocalStorage(userData: any): Promise<User | null> {
    try {
      const newUser = await this.createUser({
        name: userData.name || 'Foydalanuvchi',
        age: parseInt(userData.age) || 25,
        education: userData.education || 'Ko\'rsatilmagan',
        city: userData.city || 'Toshkent',
        email: userData.email || undefined,
        phone: userData.phone || undefined
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user from localStorage:', error);
      return null;
    }
  }

  // Helper: Save complete test session
  async saveCompleteTestSession(
    userData: any,
    answers: number[],
    personalityScores: PersonalityScores,
    aiAnalysis?: string,
    recommendedCareers?: any[]
  ): Promise<{ user: User | null; testResult: TestResult | null }> {
    try {
      // Create or get user
      let user = await this.createUserFromLocalStorage(userData);
      
      if (!user) {
        return { user: null, testResult: null };
      }

      // Save test result
      const testResult = await this.saveTestResult({
        user_id: user.id,
        test_type: 'personality',
        answers,
        personality_scores: personalityScores,
        ai_analysis: aiAnalysis,
        recommended_careers: recommendedCareers,
        completion_time: undefined // You can track this if needed
      });

      return { user, testResult };
    } catch (error) {
      console.error('Error saving complete test session:', error);
      return { user: null, testResult: null };
    }
  }

  // Connection test
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact' })
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
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
  return supabaseService.saveCompleteTestSession(
    userData,
    answers,
    personalityScores,
    aiAnalysis,
    recommendedCareers
  );
}

export async function getUserTestHistory(userId: string) {
  return supabaseService.getUserResults(userId);
}

export async function startChatSession(userId: string) {
  return supabaseService.createChatSession(userId);
}

export async function sendChatMessage(sessionId: string, message: string, role: 'user' | 'assistant' = 'user') {
  return supabaseService.saveChatMessage(sessionId, { role, content: message });
}