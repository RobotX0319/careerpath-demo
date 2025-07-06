/**
 * Specialized API configurations for different types of AI requests
 * 
 * This file contains optimized configurations for different use cases
 * to get the best results from the Gemini API based on the type of content.
 */

import { 
  GenerationConfig, 
  SafetySetting, 
  HarmCategory, 
  HarmBlockThreshold 
} from '@google/generative-ai';

// Base safety settings used across all configs
export const baseSafetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];

/**
 * Configuration optimized for personality analysis
 * - Lower temperature for more consistent and reliable analysis
 * - Higher max tokens to allow for detailed explanations
 */
export const personalityAnalysisConfig: GenerationConfig = {
  temperature: 0.6,       // More consistent and factual
  topK: 40,               // Reasonable diversity
  topP: 0.8,              // Focus on more likely tokens
  maxOutputTokens: 1200,  // Allow for detailed personality insights
  candidateCount: 1       // Single best response
};

/**
 * Configuration optimized for career recommendations
 * - Slightly higher temperature for more creative suggestions
 * - High token limit for comprehensive career advice
 */
export const careerRecommendationsConfig: GenerationConfig = {
  temperature: 0.7,       // Balance between creativity and consistency
  topK: 40,               // Diverse but reasonable suggestions
  topP: 0.9,              // Slightly more explorative
  maxOutputTokens: 1500,  // Allow for 5 detailed career descriptions
  candidateCount: 1       // Single best response
};

/**
 * Configuration optimized for chat interactions
 * - Higher temperature for conversational feel
 * - Lower token limit for concise answers
 */
export const chatConfig: GenerationConfig = {
  temperature: 0.75,      // More conversational and natural
  topK: 40,               // Good diversity in responses
  topP: 0.85,             // Balance exploration and quality
  maxOutputTokens: 800,   // Shorter, more concise responses
  candidateCount: 1       // Single best response
};

/**
 * Get the appropriate configuration based on request type
 */
export function getOptimizedConfig(requestType: 'personality' | 'career' | 'chat'): {
  generationConfig: GenerationConfig;
  safetySettings: SafetySetting[];
} {
  let config;
  
  switch (requestType) {
    case 'personality':
      config = personalityAnalysisConfig;
      break;
    case 'career':
      config = careerRecommendationsConfig;
      break;
    case 'chat':
      config = chatConfig;
      break;
    default:
      config = personalityAnalysisConfig;
  }
  
  return {
    generationConfig: config,
    safetySettings: baseSafetySettings
  };
}