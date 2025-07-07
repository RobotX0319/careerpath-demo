/**
 * Document Parser
 * 
 * Advanced utilities for parsing and structuring AI-generated content
 * - Extracts sections and headers from text
 * - Creates structured document models
 * - Handles different document types (personality, career)
 */

import { cleanGeminiResponse } from './textFormatter';

interface DocumentSection {
  title: string;
  content: string;
}

interface ParsedDocument {
  title?: string;
  introduction?: string;
  sections: DocumentSection[];
}

/**
 * Extract sections from formatted AI text
 */
export function extractSections(text: string): DocumentSection[] {
  if (!text) return [];
  
  // Clean the text first
  const cleanedText = cleanGeminiResponse(text);
  
  // Split by double newlines to get paragraphs
  const paragraphs = cleanedText.split('\n\n').filter(p => p.trim());
  const sections: DocumentSection[] = [];
  
  // Common section headers in Uzbek
  const sectionHeaderPatterns = [
    /^(Ochiqlik)(\s*:?\s*$)/i,
    /^(Vijdonlilik)(\s*:?\s*$)/i,
    /^(Ekstraversiya)(\s*:?\s*$)/i,
    /^(Kelishuvchi xususiyat)(\s*:?\s*$)/i,
    /^(Hissiy barqarorlik)(\s*:?\s*$)/i,
    /^(Kuchli tomonlar)(\s*:?\s*$)/i,
    /^(Rivojlantirishga)(\s*:?\s*$)/i,
    /^(Ish muhitida)(\s*:?\s*$)/i,
    /^(Jamoada)(\s*:?\s*$)/i,
    /^(Shaxsiy xususiyatlar)(\s*:?\s*$)/i,
    /^(Muloqot uslubi)(\s*:?\s*$)/i,
    /^(Ishchi muhit)(\s*:?\s*$)/i,
    /^(Kasb nomi)(\s*:?\s*$)/i,
    /^(Nima uchun mos)(\s*:?\s*$)/i,
    /^(O'zbekistondagi imkoniyatlar)(\s*:?\s*$)/i,
    /^(Boshlash yo'llari)(\s*:?\s*$)/i,
    /^(Rivojlanish istiqbollari)(\s*:?\s*$)/i,
  ];
  
  let currentSection: DocumentSection | null = null;
  
  // Process each paragraph
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    let isHeader = false;
    
    // Check if this paragraph is a section header
    for (const pattern of sectionHeaderPatterns) {
      if (pattern.test(paragraph)) {
        // If we were building a section, save it
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start a new section
        currentSection = {
          title: paragraph,
          content: ''
        };
        
        isHeader = true;
        break;
      }
    }
    
    // If not a header and we have a current section, append to it
    if (!isHeader && currentSection) {
      currentSection.content += (currentSection.content ? '\n\n' : '') + paragraph;
    } 
    // If not a header and no current section, it might be introduction text
    else if (!isHeader && !currentSection && paragraph.length > 10) {
      // Create an "Introduction" section
      sections.push({
        title: 'Kirish',
        content: paragraph
      });
    }
  }
  
  // Don't forget to add the last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Parse a personality analysis document
 */
export function parsePersonalityDocument(text: string): ParsedDocument {
  const sections = extractSections(text);
  
  // Find introduction (usually first section without a trait name)
  const introduction = sections.find(s => 
    !/(Ochiqlik|Vijdonlilik|Ekstraversiya|Kelishuvchi|Hissiy|Kuchli|Rivojlantirishga|Ish muhitida|Jamoada)/i.test(s.title)
  );
  
  // Create a structured document
  return {
    title: 'Shaxsiyat tahlili',
    introduction: introduction?.content || '',
    sections: sections.filter(s => s !== introduction)
  };
}

/**
 * Parse a career recommendations document
 */
export function parseCareerDocument(text: string): ParsedDocument {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const introduction = paragraphs[0]; // Usually first paragraph is introduction
  
  // Career documents are often structured differently
  // We need to identify individual careers rather than just sections
  const sections: DocumentSection[] = [];
  let currentCareer: DocumentSection | null = null;
  
  // Process paragraphs to identify careers and their sections
  for (let i = 1; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    
    // Check if this starts a new career
    if (paragraph.length < 100 && 
        !paragraph.includes(':') &&
        !/(Nima uchun|O'zbekistondagi|Boshlash|Rivojlanish)/i.test(paragraph)) {
      
      // If we were building a career, save it
      if (currentCareer) {
        sections.push(currentCareer);
      }
      
      // Start a new career
      currentCareer = {
        title: paragraph,
        content: ''
      };
      
    } 
    // If we have a current career, append to it
    else if (currentCareer) {
      currentCareer.content += (currentCareer.content ? '\n\n' : '') + paragraph;
    }
  }
  
  // Add the last career
  if (currentCareer) {
    sections.push(currentCareer);
  }
  
  return {
    title: 'Karyera tavsiyalari',
    introduction,
    sections
  };
}