/**
 * UserResponseView component
 * 
 * Displays AI response with feedback buttons to collect user opinions
 * on response quality and helpfulness
 */

import React, { useState } from 'react';
import FeedbackButtons from './FeedbackButtons';

interface UserResponseViewProps {
  responseType: 'personality' | 'career' | 'chat';
  responseText: string;
  responseId?: string;
  className?: string;
  onFeedback?: (feedback: 'helpful' | 'unhelpful', responseId?: string) => void;
}

export default function UserResponseView({
  responseType,
  responseText,
  responseId,
  className = '',
  onFeedback
}: UserResponseViewProps) {
  const [showFullResponse, setShowFullResponse] = useState(true);
  
  // Check if response is long enough to truncate
  const isLongResponse = responseText.length > 500;
  
  // Generate paragraphs from response text
  const paragraphs = responseText
    .split('\n')
    .filter(paragraph => paragraph.trim().length > 0);
  
  // Get truncated content (first 2 paragraphs or ~300 chars)
  const truncatedContent = isLongResponse 
    ? paragraphs.slice(0, 2).join('\n')
    : responseText;
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="prose max-w-none">
        {showFullResponse || !isLongResponse ? (
          // Full response
          <div>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-3">{paragraph}</p>
            ))}
          </div>
        ) : (
          // Truncated response
          <div>
            {truncatedContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">{paragraph}</p>
            ))}
            <p className="text-gray-500">...</p>
          </div>
        )}
      </div>
      
      {/* Toggle button for long responses */}
      {isLongResponse && (
        <button
          onClick={() => setShowFullResponse(!showFullResponse)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-2 mb-4"
        >
          {showFullResponse ? "Qisqaroq ko'rinish" : "To'liq javobni ko'rish"}
        </button>
      )}
      
      {/* Feedback buttons */}
      <FeedbackButtons 
        responseType={responseType}
        responseId={responseId}
        onFeedback={onFeedback}
      />
    </div>
  );
}