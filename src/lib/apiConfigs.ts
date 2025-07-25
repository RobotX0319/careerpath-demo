/**
 * Optimized API configurations for different request types
 */

// Simple configuration interfaces for demo
interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  candidateCount: number;
}

interface SafetySetting {
  category: string;
  threshold: string;
}

// Base generation config
const baseConfig: GenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.8,
  maxOutputTokens: 1000,
  candidateCount: 1,
};

// Safety settings
const baseSafetySettings: SafetySetting[] = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
  }
];

// Optimized configurations for different request types
export function getOptimizedConfig(requestType: 'personality' | 'career' | 'chat') {
  switch (requestType) {
    case 'personality':
      return {
        generationConfig: {
          ...baseConfig,
          temperature: 0.6, // More consistent for analysis
          maxOutputTokens: 800,
        },
        safetySettings: baseSafetySettings
      };
    
    case 'career':
      return {
        generationConfig: {
          ...baseConfig,
          temperature: 0.7, // Balanced for recommendations
          maxOutputTokens: 1200,
        },
        safetySettings: baseSafetySettings
      };
    
    case 'chat':
      return {
        generationConfig: {
          ...baseConfig,
          temperature: 0.8, // More conversational
          maxOutputTokens: 600,
        },
        safetySettings: baseSafetySettings
      };
    
    default:
      return {
        generationConfig: baseConfig,
        safetySettings: baseSafetySettings
      };
  }
}