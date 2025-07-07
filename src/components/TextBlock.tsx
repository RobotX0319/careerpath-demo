/**
 * TextBlock Component
 * 
 * Renders AI-generated text with advanced formatting and styling
 * - Supports multiple text types (personality, career, chat)
 * - Detects and formats sections and paragraphs
 * - Applies proper styling based on content type
 * - Adds visual enhancements for better readability
 */

import React from 'react';
import { parseAIAnalysis } from '@/lib/textFormatter';
import styles from '@/styles/aitext.module.css';

type TextBlockType = 'personality' | 'career' | 'chat' | 'generic';

interface TextBlockProps {
  text: string;
  type?: TextBlockType;
  title?: string;
  className?: string;
}

export default function TextBlock({
  text,
  type = 'generic',
  title,
  className = ''
}: TextBlockProps) {
  if (!text) {
    return null;
  }

  // For direct rendering as React nodes
  const parsedContent = parseAIAnalysis(text);
  
  // Special handling for career text
  const isCareerRecommendation = (paragraph: string): boolean => {
    if (type !== 'career') return false;
    
    return (
      (paragraph.includes('Kasb nomi') || 
       paragraph.includes('Mutaxassislik:') ||
       paragraph.includes('Nima uchun mos kelishi:'))
    );
  };

  // Detect feature lists in paragraphs
  const formatFeatureList = (text: string): React.ReactNode => {
    // Split at sentences to identify potential features
    const sentences = text.split(/\.(?=\s[A-Z])/g);
    
    if (sentences.length <= 2) {
      return <p className="mb-4 leading-relaxed">{text}</p>;
    }
    
    // Format as a list if it seems to be a feature list (short sentences with similar structure)
    return (
      <div className="mb-6">
        <ul className="list-disc pl-6 space-y-2">
          {sentences.map((sentence, idx) => {
            const trimmed = sentence.trim();
            if (!trimmed) return null;
            
            return (
              <li key={idx} className="leading-relaxed">
                {trimmed}{!trimmed.endsWith('.') && idx < sentences.length - 1 ? '.' : ''}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={`text-block ${styles.aiTextContainer} ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
          {title}
        </h2>
      )}
      
      <div className="content">
        {parsedContent.map((node, idx) => {
          // TypeScript doesn't know the exact structure, so we need to cast
          const element = node as React.ReactElement;
          
          if (element.type === 'h3') {
            return (
              <h3 
                key={idx}
                className={`${styles.sectionHeader} mt-6 mb-3`}
              >
                {element.props.children}
              </h3>
            );
          } else if (element.type === 'p') {
            const paragraph = element.props.children as string;
            
            // For career recommendations
            if (isCareerRecommendation(paragraph)) {
              return (
                <div key={idx} className={styles.aiTextSection}>
                  <p className={styles.careerTitle}>
                    {paragraph}
                  </p>
                </div>
              );
            }
            
            // For feature lists (especially in personality analysis)
            if (type === 'personality' && 
                (paragraph.toLowerCase().includes('kuchli') || 
                 paragraph.toLowerCase().includes('tomonlar'))) {
              return (
                <div key={idx} className={`${styles.aiTextSection} mt-4`}>
                  {formatFeatureList(paragraph)}
                </div>
              );
            }
            
            // Regular paragraph
            return (
              <p 
                key={idx} 
                className="mb-4 leading-relaxed"
                style={{ lineHeight: 1.8 }}
              >
                {paragraph}
              </p>
            );
          }
          
          return element;
        })}
      </div>
    </div>
  );
}