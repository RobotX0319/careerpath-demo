/**
 * Analysis Card Component
 * 
 * Displays AI analysis results with improved styling
 * Used for personality analysis, career recommendations, and other AI responses
 */

import React from 'react';
import AIAnalysisDisplay from './AIAnalysisDisplay';
import TextBlock from './TextBlock';

interface AnalysisCardProps {
  title: string;
  loading: boolean;
  analysisText?: string;
  emptyMessage?: string;
  className?: string;
}

export default function AnalysisCard({
  title,
  loading,
  analysisText,
  emptyMessage = 'Ma\'lumot mavjud emas',
  className = ''
}: AnalysisCardProps) {
  return (
    <div className={`analysis-card mb-8 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {title}
      </h3>
      
      {loading ? (
        // Animated loading skeleton
        <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      ) : analysisText ? (
        // Analysis content with improved formatting
        <TextBlock text={analysisText} type={title.toLowerCase().includes('karyera') ? 'career' : 'personality'} />
      ) : (
        // Empty state
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}