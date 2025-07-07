/**
 * AI Analysis Display Component
 * 
 * Renders AI-generated text with improved typography and spacing
 * Makes AI responses more readable and professional looking
 */

import React from 'react';
import styles from '@/styles/aitext.module.css';

interface AIAnalysisDisplayProps {
  text: string;
  title?: string;
  className?: string;
  type?: 'personality' | 'career' | 'chat';
}

export default function AIAnalysisDisplay({ 
  text, 
  title, 
  className = '',
  type = 'personality'
}: AIAnalysisDisplayProps) {
  if (!text) {
    return null;
  }
  
  // Process text for display - convert newlines to JSX breaks
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  // Detect section headers (common titles in career/personality analysis)
  const isSectionHeader = (text: string) => {
    const commonHeaders = [
      'ochiqlik', 'vijdonlilik', 'ekstraversiya', 'kelishuvchi', 
      'hissiy', 'kuchli', 'rivojlantirishga', 'ish muhitida', 
      'jamoada', 'kasb', 'umumiy', 'shaxsiy', 'muloqot', 'tavsiya',
      'mutaxassislik', 'shaxsiyat', 'xarakter'
    ];
    
    const lowercased = text.toLowerCase();
    return commonHeaders.some(header => lowercased.includes(header)) && text.length < 50;
  };
  
  // Detect career titles for special styling
  const isCareerTitle = (text: string) => {
    return type === 'career' && 
           text.length < 60 && 
           !isSectionHeader(text) &&
           (text.includes(':') || /^[A-Z]/.test(text));
  };
  
  return (
    <div className={`ai-analysis-display p-6 bg-white rounded-lg shadow-md ${className} ${styles.aiTextContainer}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      
      <div className="text-gray-700 space-y-4">
        {paragraphs.map((paragraph, index) => {
          // Check if this paragraph is a section header
          if (isSectionHeader(paragraph)) {
            return (
              <h4 key={index} className={`text-lg font-semibold mt-6 mb-3 ${styles.sectionHeader}`}>
                {paragraph}
              </h4>
            );
          }
          
          // Check if this is a career title (for career recommendations)
          if (isCareerTitle(paragraph)) {
            return (
              <div key={index} className={styles.aiTextSection}>
                <p className={styles.careerTitle}>
                  {paragraph}
                </p>
              </div>
            );
          }
          
          // Highlight personality traits
          if (type === 'personality' && 
              (paragraph.toLowerCase().includes('kuchli') || 
               paragraph.toLowerCase().includes('tomonlar'))) {
            return (
              <p 
                key={index}
                className={`leading-relaxed text-base mb-4 ${styles.personalityTrait}`}
              >
                {paragraph}
              </p>
            );
          }
          
          // Regular paragraph with improved line height and spacing
          return (
            <p key={index} className="leading-relaxed text-base mb-4">
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
}