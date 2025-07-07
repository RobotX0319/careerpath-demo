/**
 * Type definitions for CareerPath application
 */

// User related types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  completedTests?: string[];
  skills?: string[];
  personalityScores?: PersonalityScores;
  careerMatches?: Array<{
    career: string;
    score: number;
  }>;
}

// Personality test types
export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Question {
  id: string;
  text: string;
  category: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  weight: 1 | -1;
}

// File analysis types
export interface FileAnalysisRequest {
  text: string;
  type: AnalysisRequestType;
  fileName: string;
  additionalContext?: string;
}

export interface FileAnalysisResponse {
  analysis: string;
  suggestions: string[];
  keywords?: string[];
  metadata?: {
    analysisTime: number;
    confidence: number;
  };
}

export type AnalysisRequestType = 'resume' | 'coverLetter' | 'jobDescription' | 'text';

// Career related types
export interface Career {
  id: string;
  title: string;
  description: string;
  personality_match: Record<keyof PersonalityScores, number>;
  matchScore?: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}
