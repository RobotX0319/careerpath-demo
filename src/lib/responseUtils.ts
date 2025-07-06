/**
 * Response quality utilities for CareerPath AI
 * 
 * This module provides functions to check response quality from Gemini AI,
 * detect formatting issues, and provide additional cleaning if needed.
 */

/**
 * Validates if AI response meets quality standards
 * @param response - The AI response text to validate
 * @returns Boolean indicating if response passes quality checks
 */
export function validateResponseQuality(response: string): boolean {
  if (!response || response.length < 20) {
    return false;
  }
  
  // Check for common formatting issues
  const issues = [
    response.includes('*'),        // Contains asterisks
    response.includes('#'),        // Contains hash symbols
    response.includes('```'),      // Contains code blocks
    response.includes('---'),      // Contains horizontal rules
    response.includes('['),        // May contain markdown links
    response.length < 50,          // Too short (likely error)
    response.length > 3000,        // Too long (excessive)
    /^\s*-\s+/.test(response),     // Starts with bullet point
    /^\d+\.\s+/.test(response),    // Starts with numbered list
  ];
  
  return !issues.some(issue => issue === true);
}

/**
 * Verifies if a response has expected structural sections
 * For personality analysis and career recommendations
 * 
 * @param response - The AI response to check
 * @param type - Type of response ('personality' or 'career')
 * @returns Boolean indicating if response has proper structure
 */
export function verifyResponseStructure(response: string, type: 'personality' | 'career'): boolean {
  if (type === 'personality') {
    // Check for personality sections (not case-sensitive, flexible matching)
    const expectedSections = [
      /shaxsiyat|tavsif/i,       // Personality overview section
      /kuchli tomon|ustunlik/i,  // Strengths section
      /rivojlanish|yaxshilash/i, // Areas for improvement section
      /ish muhit|karyera/i       // Work environment section
    ];
    
    return expectedSections.every(pattern => pattern.test(response));
  }
  
  if (type === 'career') {
    // Check for career recommendation sections
    const hasCareerMentions = /kasb|mutaxassis|soha/i.test(response);
    const hasRecommendations = /tavsiya|mos|to['']g['']ri keladi/i.test(response);
    const hasInstructions = /boshlash|o['']rganish|ta['']lim/i.test(response);
    
    return hasCareerMentions && hasRecommendations && hasInstructions;
  }
  
  return true;
}

/**
 * Enhance text formatting for better readability
 * This doesn't add any special characters, just improves natural paragraph structure
 * 
 * @param text - The text to format
 * @returns Formatted text with improved paragraph structure
 */
export function enhanceReadability(text: string): string {
  return text
    // Ensure paragraphs are properly separated
    .replace(/\.(\s*)([A-Z])/g, '.\n\n$2')
    
    // Ensure consistent spacing after punctuation
    .replace(/([.!?]),/g, '$1')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    
    // Fix multiple spaces
    .replace(/\s{2,}/g, ' ')
    
    // Fix inconsistent newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Count words in text
 * @param text - Text to count words in
 * @returns Number of words
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Determine if response is too short or too long
 * @param text - Response text
 * @param type - Type of response 
 * @returns Issue message or null if length is acceptable
 */
export function checkResponseLength(text: string, type: 'personality' | 'career' | 'chat'): string | null {
  const wordCount = countWords(text);
  
  const minWords = {
    personality: 150,
    career: 200,
    chat: 30
  };
  
  const maxWords = {
    personality: 500,
    career: 800,
    chat: 300
  };
  
  if (wordCount < minWords[type]) {
    return `Response too short (${wordCount} words)`;
  }
  
  if (wordCount > maxWords[type]) {
    return `Response too long (${wordCount} words)`;
  }
  
  return null;
}