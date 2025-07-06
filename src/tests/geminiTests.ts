/**
 * Gemini API Tests
 * Simple test suite for validating AI responses
 */

import { geminiService } from '@/lib/geminiService';

interface TestResult {
  testCase: string;
  success: boolean;
  response: string;
}

interface TestCase {
  name: string;
  input: any;
  type: 'personality' | 'career' | 'chat';
}

// Test cases
const testCases: TestCase[] = [
  {
    name: 'Personality Analysis - Balanced Profile',
    type: 'personality',
    input: {
      openness: 75,
      conscientiousness: 80,
      extraversion: 60,
      agreeableness: 70,
      neuroticism: 40
    }
  },
  {
    name: 'Career Recommendations - Tech Profile',
    type: 'career',
    input: {
      personality: {
        openness: 85,
        conscientiousness: 75,
        extraversion: 55,
        agreeableness: 65,
        neuroticism: 35
      },
      skills: ['JavaScript', 'Python', 'React'],
      interests: ['Technology', 'Problem Solving']
    }
  },
  {
    name: 'Chat - Career Advice',
    type: 'chat',
    input: 'Dasturlash sohasida karyera boshlash uchun qanday maslahat berasiz?'
  }
];

// Validate response quality
function validateResponse(response: string): boolean {
  if (!response || response.length < 50) return false;
  
  // Check for unwanted formatting
  const hasMarkdown = response.includes('*') || response.includes('#') || response.includes('```');
  const tooLong = response.length > 2000;
  
  return !hasMarkdown && !tooLong;
}

// Run all tests
export async function runGeminiTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    try {
      let response: string;
      
      // Run appropriate test based on type
      switch (testCase.type) {
        case 'personality':
          response = await geminiService.analyzePersonality(testCase.input);
          break;
        case 'career':
          response = await geminiService.generateCareerRecommendations(
            testCase.input.personality,
            testCase.input.skills,
            testCase.input.interests
          );
          break;
        case 'chat':
          response = await geminiService.chatWithAI(testCase.input);
          break;
        default:
          response = 'Test type not supported';
      }
      
      const isValid = validateResponse(response);
      
      results.push({
        testCase: testCase.name,
        success: isValid,
        response: response.substring(0, 100) + '...'
      });
      
    } catch (error) {
      results.push({
        testCase: testCase.name,
        success: false,
        response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
  
  return results;
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const response = await geminiService.chatWithAI('Test');
    return response.length > 0;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}