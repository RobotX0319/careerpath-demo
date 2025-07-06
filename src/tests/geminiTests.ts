/**
 * Gemini AI Response Testing Framework
 * 
 * This module provides test cases and validation utilities
 * to ensure high-quality AI responses across different scenarios.
 */

import { geminiService } from '../lib/geminiService';
import type { PersonalityScores } from '@/types';

// Test case scenarios for different personality types
const personalityTestCases = [
  {
    name: 'Creative Extrovert',
    scores: {
      openness: 85,
      conscientiousness: 60,
      extraversion: 90,
      agreeableness: 70,
      neuroticism: 30
    }
  },
  {
    name: 'Analytical Introvert',
    scores: {
      openness: 75,
      conscientiousness: 90,
      extraversion: 20,
      agreeableness: 50,
      neuroticism: 40
    }
  },
  {
    name: 'Balanced Profile',
    scores: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    }
  },
  {
    name: 'Sensitive Helper',
    scores: {
      openness: 65,
      conscientiousness: 70,
      extraversion: 40,
      agreeableness: 95,
      neuroticism: 60
    }
  },
  {
    name: 'Resilient Leader',
    scores: {
      openness: 70,
      conscientiousness: 85,
      extraversion: 75,
      agreeableness: 60,
      neuroticism: 15
    }
  }
];

// Common career-related questions for chat testing
const chatTestQuestions = [
  "Mening shaxsiyatim IT sohasiga mos keladimi?",
  "Qanday qilib resumeni yaxshiroq tayyorlash mumkin?",
  "O'zbekistonda qaysi kasblar eng ko'p talab qilinadi?",
  "Agar men ish o'zgartirishni istasam nima qilishim kerak?",
  "Xorijiy tillarni bilish qaysi kasblarda muhim?",
  "Ta'lim sohasida qanday imkoniyatlar mavjud?"
];

/**
 * Run personality analysis tests for different profile types
 */
export async function testPersonalityAnalysis(): Promise<{success: boolean, results: any[]}> {
  console.log("🧪 Running personality analysis tests...");
  const results = [];
  let allValid = true;
  
  for (const testCase of personalityTestCases) {
    try {
      console.log(`Testing personality type: ${testCase.name}`);
      const response = await geminiService.analyzePersonality(testCase.scores as PersonalityScores);
      
      // Validate response
      const isValid = validateAIResponse(response);
      if (!isValid) {
        console.error(`❌ Invalid response for ${testCase.name}`);
        allValid = false;
      }
      
      results.push({
        testCase: testCase.name,
        success: isValid,
        response: response.substring(0, 100) + '...' // Truncate for logging
      });
      
      console.log(`✅ Test completed for ${testCase.name}`);
    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
      results.push({
        testCase: testCase.name,
        success: false,
        error: error.message
      });
      allValid = false;
    }
  }
  
  return {success: allValid, results};
}

/**
 * Run career recommendation tests for different profile types
 */
export async function testCareerRecommendations(): Promise<{success: boolean, results: any[]}> {
  console.log("🧪 Running career recommendation tests...");
  const results = [];
  let allValid = true;
  
  for (const testCase of personalityTestCases) {
    try {
      console.log(`Testing career recommendations for: ${testCase.name}`);
      const response = await geminiService.generateCareerRecommendations(
        testCase.scores as PersonalityScores,
        ['programming', 'communication'],
        ['technology', 'helping others']
      );
      
      // Validate response
      const isValid = validateAIResponse(response);
      if (!isValid) {
        console.error(`❌ Invalid career recommendations for ${testCase.name}`);
        allValid = false;
      }
      
      results.push({
        testCase: testCase.name,
        success: isValid,
        response: response.substring(0, 100) + '...' // Truncate for logging
      });
      
      console.log(`✅ Test completed for ${testCase.name}`);
    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
      results.push({
        testCase: testCase.name,
        success: false,
        error: error.message
      });
      allValid = false;
    }
  }
  
  return {success: allValid, results};
}

/**
 * Test chat responses with various common questions
 */
export async function testChatResponses(): Promise<{success: boolean, results: any[]}> {
  console.log("🧪 Running chat response tests...");
  const results = [];
  let allValid = true;
  
  for (const question of chatTestQuestions) {
    try {
      console.log(`Testing chat response for question: "${question}"`);
      const response = await geminiService.chatWithAI(question);
      
      // Validate response
      const isValid = validateAIResponse(response);
      if (!isValid) {
        console.error(`❌ Invalid chat response for question: "${question}"`);
        allValid = false;
      }
      
      results.push({
        question,
        success: isValid,
        response: response.substring(0, 100) + '...' // Truncate for logging
      });
      
      console.log(`✅ Test completed for question: "${question}"`);
    } catch (error) {
      console.error(`❌ Test failed for question: "${question}":`, error);
      results.push({
        question,
        success: false,
        error: error.message
      });
      allValid = false;
    }
  }
  
  return {success: allValid, results};
}

/**
 * Validate AI response against quality criteria
 */
/**
 * Validate AI response against quality criteria
 */
function validateAIResponse(response: string): boolean {
  if (!response) return false;
  
  // Check for problematic formatting
  const formattingIssues = [
    response.includes('*'),
    response.includes('#'),
    response.includes('```'),
    response.includes('---'),
    response.includes('['),
    response.includes('(http')
  ];
  
  // Check for content issues
  const contentIssues = [
    response.length < 50,
    response.length > 3000,
    response.includes('AI language model'),
    response.includes('OpenAI'),
    response.includes('I don\'t have access'),
    response.includes('FAQAT'),
    response.includes('Professional')
  ];
  
  // Log any issues found
  const allIssues = [...formattingIssues, ...contentIssues];
  const hasIssues = allIssues.some(issue => issue);
  
  if (hasIssues) {
    console.log('Response validation issues detected:');
    
    if (formattingIssues.some(issue => issue)) {
      console.log('- Formatting issues found');
      if (response.includes('*')) console.log('  * Contains asterisks');
      if (response.includes('#')) console.log('  * Contains hash symbols');
      if (response.includes('```')) console.log('  * Contains code blocks');
    }
    
    if (contentIssues.some(issue => issue)) {
      console.log('- Content issues found');
      if (response.length < 50) console.log('  * Response too short');
      if (response.length > 3000) console.log('  * Response too long');
    }
  }
  
  return !hasIssues;
}

/**
 * Run error handling tests by simulating API failures
 */
export async function testErrorHandling(): Promise<{success: boolean, results: any[]}> {
  console.log("🧪 Testing error handling...");
  const results = [];
  
  // Test case 1: Invalid API key
  try {
    // Temporarily save original API key
    const originalApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'invalid_key';
    
    // Create new service instance with invalid key
    const invalidService = new (geminiService.constructor as any)();
    const response = await invalidService.analyzePersonality(personalityTestCases[0].scores as PersonalityScores);
    
    // Check if we got a proper fallback response
    const isValid = response && response.length > 20;
    results.push({
      test: 'Invalid API key',
      success: isValid,
      response: response?.substring(0, 50) + '...'
    });
    
    // Restore original key
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = originalApiKey;
  } catch (error: any) {
    results.push({
      test: 'Invalid API key',
      success: false,
      error: error?.message || 'Unknown error'
    });
  }
  
  // Test case 2: Network error simulation
  // This would typically be tested with a mock, but we'll simulate error handling
  
  return {
    success: results.every(r => r.success),
    results
  };
}

/**
 * Run all tests and compile results
 */
export async function runAllTests(): Promise<{
  overall: boolean,
  personality: any,
  career: any,
  chat: any,
  errorHandling: any
}> {
  const personalityResults = await testPersonalityAnalysis();
  const careerResults = await testCareerRecommendations();
  const chatResults = await testChatResponses();
  const errorHandlingResults = await testErrorHandling();
  
  const overall = 
    personalityResults.success && 
    careerResults.success && 
    chatResults.success &&
    errorHandlingResults.success;
  
  return {
    overall,
    personality: personalityResults,
    career: careerResults,
    chat: chatResults,
    errorHandling: errorHandlingResults
  };
}