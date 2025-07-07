/**
 * Simple validation script to test AI response quality
 * 
 * This script can be run manually to test the response quality
 * and formatting of Gemini AI responses
 */

import { geminiService } from './geminiService';

/**
 * Response validation utilities
 */

import { cleanGeminiResponse, formatResponse as formatAIResponse } from './textFormatter';

// Export text formatting functions
export { cleanGeminiResponse };
export { formatAIResponse as formatResponse };

// Validate response quality
export function isQualityResponse(response: string): boolean {
  if (!response) return false;
  
  const issues = [
    response.includes('*'), // Check for asterisks
    response.includes('#'), // Check for hashes  
    response.includes('```'), // Check for code blocks
    response.length < 50, // Too short
    response.length > 2000, // Too long
    response.includes('ERROR'),
    response.includes('undefined'),
    response.includes('null')
  ];
  
  return !issues.some(issue => issue);
}

// Format response for better readability
export function formatResponse(response: string): string {
  const cleaned = cleanGeminiResponse(response);
  
  // Split into paragraphs and clean them
  const paragraphs = cleaned
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  return paragraphs.join('\n\n');
}

// Generate fallback responses
export function getFallbackResponse(type: 'personality' | 'career' | 'chat'): string {
  switch (type) {
    case 'personality':
      return 'Sizning shaxsiyat tahlili hozirda tayyorlanmoqda. Iltimos, keyinroq urinib ko\'ring.';
    
    case 'career':
      return 'Karyera tavsiyalari hozirda yuklanmoqda. Iltimos, biroz kuting va qayta urinib ko\'ring.';
    
    case 'chat':
      return 'Kechirasiz, hozirda javob bera olmayman. Iltimos, savolingizni qayta yuboring.';
    
    default:
      return 'Xizmat vaqtincha mavjud emas. Iltimos, keyinroq urinib ko\'ring.';
  }
}

// Example personality scores for testing
const testPersonality = {
  openness: 75,
  conscientiousness: 65,
  extraversion: 45,
  agreeableness: 80,
  neuroticism: 30
};

// Validate if a response has formatting issues
function checkForFormattingIssues(response: string): string[] {
  const issues: string[] = [];
  
  // Check for common markdown elements
  if (response.includes('*')) issues.push('Contains asterisks (*)');
  if (response.includes('#')) issues.push('Contains hash symbols (#)');
  if (response.includes('```')) issues.push('Contains code blocks (```)');
  if (response.includes('---')) issues.push('Contains horizontal rules (---)');
  if (response.includes('- ')) issues.push('Contains bullet points (- )');
  if (/^\d+\./.test(response)) issues.push('Contains numbered lists (1. 2. etc)');
  
  // Check for response length issues
  if (response.length < 100) issues.push('Response too short');
  if (response.length > 3000) issues.push('Response too long');
  
  // Check for structural issues
  if (response.split('\n\n').length < 3) issues.push('Too few paragraphs');
  
  // Check for common AI artifacts
  if (response.includes('AI language model')) issues.push('Contains AI self-reference');
  if (response.includes('I don\'t have access')) issues.push('Contains limitation disclaimer');
  if (response.includes('MUHIM') || response.includes('ESLATMA')) 
    issues.push('Contains prompt instructions in output');
  
  return issues;
}

// Run validation tests and print results
export async function validateGeminiResponses() {
  console.log('========================================');
  console.log('🧪 GEMINI AI RESPONSE VALIDATION');
  console.log('========================================');
  
  try {
    // Test 1: Personality Analysis
    console.log('\n📊 Testing Personality Analysis...');
    const personalityResponse = await geminiService.analyzePersonality(testPersonality);
    
    console.log(`Response length: ${personalityResponse.length} characters`);
    const personalityIssues = checkForFormattingIssues(personalityResponse);
    
    if (personalityIssues.length === 0) {
      console.log('✅ Personality Analysis: No issues found');
    } else {
      console.log('❌ Personality Analysis: Issues found');
      personalityIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    // Test 2: Career Recommendations
    console.log('\n💼 Testing Career Recommendations...');
    const careerResponse = await geminiService.generateCareerRecommendations(
      testPersonality, 
      ['programming', 'design'],
      ['technology', 'creativity']
    );
    
    console.log(`Response length: ${careerResponse.length} characters`);
    const careerIssues = checkForFormattingIssues(careerResponse);
    
    if (careerIssues.length === 0) {
      console.log('✅ Career Recommendations: No issues found');
    } else {
      console.log('❌ Career Recommendations: Issues found');
      careerIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    // Test 3: Chat Response
    console.log('\n💬 Testing Chat Response...');
    const chatResponse = await geminiService.chatWithAI(
      "Men marketolog bo'lmoqchiman. Qanday o'qishim va rivojlanishim kerak?",
      { personality: testPersonality }
    );
    
    console.log(`Response length: ${chatResponse.length} characters`);
    const chatIssues = checkForFormattingIssues(chatResponse);
    
    if (chatIssues.length === 0) {
      console.log('✅ Chat Response: No issues found');
    } else {
      console.log('❌ Chat Response: Issues found');
      chatIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log('\n========================================');
    console.log('🏁 VALIDATION COMPLETE');
    console.log('========================================');
    
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
  }
}

// Export validation function
export default validateGeminiResponses;