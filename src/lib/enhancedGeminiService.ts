/**
 * Enhanced Gemini Service Wrapper
 * Applies formatting to responses from geminiService
 */

import { geminiService } from './geminiService';
import { formatAIResponse } from './textFormatter';
import type { PersonalityScores } from '@/types';

// Enhanced version of geminiService that applies formatting
export const enhancedGeminiService = {
  async analyzePersonality(scores: PersonalityScores): Promise<string> {
    const response = await geminiService.analyzePersonality(scores);
    return formatAIResponse(response);
  },
  
  async generateCareerRecommendations(
    personality: PersonalityScores, 
    skills: string[] = [], 
    interests: string[] = []
  ): Promise<string> {
    const response = await geminiService.generateCareerRecommendations(personality, skills, interests);
    return formatAIResponse(response);
  },
  
  async chatWithAI(
    message: string, 
    context: { personality?: PersonalityScores; previousMessages?: string[] } = {},
    userId: string = 'anonymous'
  ): Promise<string> {
    const response = await geminiService.chatWithAI(message, context, userId);
    return formatAIResponse(response);
  },
  
  async testConnection(): Promise<boolean> {
    return geminiService.testConnection();
  }
};