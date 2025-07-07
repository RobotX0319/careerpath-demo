/**
 * Text Formatting Utilities
 * 
 * Advanced text processing functions for AI responses
 * - Improves readability and structure
 * - Adds proper paragraph breaks
 * - Identifies and formats sections
 * - Enhances overall text presentation
 */

import React from 'react';

/**
 * Clean and format AI responses for better readability
 * Adds proper paragraph breaks, section spacing, and improves text structure
 */
export function cleanGeminiResponse(text: string): string {
  if (!text) return '';
  
  // Step 1: Basic cleanup
  let cleaned = text
    .replace(/\*\*\*|\*\*|\*/g, '') // Remove all asterisks (triple, double, single)
    .replace(/#{1,6}\s?/g, '') // Remove markdown headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks with content
    .replace(/`/g, '') // Remove any remaining backticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to just text
    .replace(/_([^_]+)_/g, '$1') // Remove underscores for italic
    .replace(/~([^~]+)~/g, '$1') // Remove tildes for strikethrough
    .trim();
  
  // Step 2: Identify common section headers (personality traits, career fields)
  const sectionHeaders = [
    'Ochiqlik', 'Vijdonlilik', 'Ekstraversiya', 'Kelishuvchi xususiyat', 
    'Hissiy barqarorlik', 'Kuchli tomonlar', 'Rivojlantirishga', 
    'Ish muhitida', 'Jamoada', 'Tavsiya', 'Kasb', 'Mutaxassislik', 
    'Umumiy', 'Xulosa', 'Shaxsiy xususiyatlar', 'Muloqot uslubi',
    'Rivojlanish zonalari', 'Ishchi muhit'
  ];
  
  // Step 3: Process and format the text with proper spacing
  sectionHeaders.forEach(header => {
    // Regex looks for the header with optional punctuation, adds proper spacing before and after
    const regex = new RegExp(`(\\s|^)(${header}\\s*[:.]?)(\\s|$)`, 'gi');
    cleaned = cleaned.replace(regex, `\n\n${header}\n\n`);
  });
  
  // Step 4: Fix paragraph breaks
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n') // Convert multiple line breaks to double
    .replace(/\.\s+([A-Z])/g, '.\n\n$1') // Add paragraph breaks after sentences ending with period followed by capital letter
    .replace(/\n\s*\n/g, '\n\n') // Standardize paragraph spacing
    .trim();
  
  // Step 5: Improve list formatting
  cleaned = cleaned
    .replace(/(\d+)\.\s*/g, '') // Remove numbered list markers completely
    .replace(/•\s*/g, '') // Remove bullets
    .replace(/^\s*[-•]\s*/gm, '') // Remove dashes at line starts
    .replace(/-\s+/g, '') // Remove standalone dashes with space
    .trim();
  
  // Step 6: Final formatting
  cleaned = cleaned
    .replace(/\.\s+(Bu|Siz|Ushbu)/g, '.\n\n$1')
    .replace(/\.\s+(Sizning|O'zingizning)/g, '.\n\n$1')
    .replace(/:\s+/g, ':\n\n') // Add breaks after colons
    .replace(/\n+/g, '\n\n').replace(/\n{3,}/g, '\n\n') // Ensure consistent double line breaks
    .replace(/\s+/g, ' ') // Normalize spaces within paragraphs
    .trim();
  
  return cleaned;
}

/**
 * Add section spacing to text
 * Identifies and adds spacing around sections
 */
export function addSectionSpacing(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/(\n[A-Z][a-z]+\s*:)/g, '\n\n$1') // Add space before sections with colons
    .replace(/(\n[A-Z][a-z]+\s*\n)/g, '\n\n$1\n') // Add space around section headers
    .replace(/\n{3,}/g, '\n\n'); // Standardize to double line breaks
}

/**
 * Improve text readability
 * Makes text more scannable and adds structure
 */
export function improveReadability(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\.\s+([A-Z])/g, '.\n\n$1') // New paragraph after sentence ending with period followed by capital letter
    .replace(/\s*\n\s*/g, '\n') // Clean up line breaks
    .replace(/\n{3,}/g, '\n\n') // Standardize to double line breaks
    .replace(/([.:!?])\s*(\n+)/g, '$1\n\n') // Add consistent breaks after punctuation
    .trim();
}

/**
 * Format AI analysis into structured sections
 * Returns text with properly formatted sections
 */
export function formatAIResponse(text: string): string {
  if (!text) return '';
  
  // First clean the text thoroughly
  const cleaned = cleanGeminiResponse(text);
  
  // Then improve readability
  return improveReadability(cleaned);
}

/**
 * Parse AI analysis into structured sections with JSX
 * Returns an array of React elements for rendering
 */
export function parseAIAnalysis(text: string): React.ReactNode[] {
  if (!text) return [];
  
  // First clean and format the text
  const formattedText = formatAIResponse(text);
  
  // Split into paragraphs
  const paragraphs = formattedText.split('\n\n').filter(p => p.trim());
  
  // Detect section headers
  const isSectionHeader = (text: string): boolean => {
    const commonHeaders = [
      'ochiqlik', 'vijdonlilik', 'ekstraversiya', 'kelishuvchi', 
      'hissiy', 'kuchli', 'rivojlantirishga', 'ish muhitida', 
      'jamoada', 'kasb', 'umumiy', 'shaxsiy', 'muloqot', 'tavsiya'
    ];
    
    const lowercased = text.toLowerCase();
    return commonHeaders.some(header => lowercased.includes(header)) && text.length < 60;
  };
  
  // Convert to React elements
  return paragraphs.map((paragraph, index) => {
    if (isSectionHeader(paragraph)) {
      return React.createElement(
        'h3', 
        { 
          key: `section-${index}`,
          className: 'text-lg font-semibold text-blue-700 mt-6 mb-3'
        }, 
        paragraph
      );
    }
    
    return React.createElement(
      'p',
      {
        key: `para-${index}`,
        className: 'mb-4 leading-relaxed',
        style: { lineHeight: 1.8 }
      },
      paragraph
    );
  });
}

/**
 * Format career recommendations for better display
 * Specifically optimized for career recommendations format
 */
export function formatCareerRecommendations(text: string): string {
  if (!text) return '';
  
  // Clean the text first
  let cleaned = cleanGeminiResponse(text);
  
  // Career-specific formatting
  const careerSeparators = [
    'Kasb nomi', 'Nima uchun mos', 'O\'zbekistondagi imkoniyatlar', 
    'Boshlash yo\'llari', 'Rivojlanish istiqbollari'
  ];
  
  careerSeparators.forEach(separator => {
    const regex = new RegExp(`(${separator}[^:]*:)`, 'gi');
    cleaned = cleaned.replace(regex, '\n\n$1');
  });
  
  // Ensure each career section is clearly separated
  cleaned = cleaned
    .replace(/(\d+\.?\s*[A-Z][^.]+)\n/g, '\n\n$1\n\n') // Add spacing around career titles
    .replace(/\n{3,}/g, '\n\n'); // Standardize line breaks
  
  return cleaned;
}

/**
 * Format chat responses for better display
 * Makes AI chat responses more readable and professional
 */
export function formatChatResponse(text: string): string {
  if (!text) return '';
  
  // Basic cleaning
  let cleaned = text
    .replace(/\*\*\*|\*\*|\*/g, '') // Remove all asterisks
    .replace(/#{1,6}\s?/g, '') // Remove markdown headers
    .replace(/`/g, '') // Remove backticks
    .trim();
  
  // Chat responses should have paragraphs but not too many breaks
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n') // Standardize to double line breaks at most
    .replace(/\.\s+([A-Z])/g, '.\n\n$1') // Add paragraph breaks after sentences followed by capital letters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  return cleaned;
}