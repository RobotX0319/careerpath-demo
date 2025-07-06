/**
 * ChatMessage component
 * 
 * Displays a single message in the chat with optional feedback buttons
 */

import React from 'react';
import FeedbackButtons from './FeedbackButtons';
import { recordFeedback } from '@/lib/feedbackService';

interface ChatMessageProps {
  message: {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
  };
  showFeedback?: boolean;
}

export default function ChatMessage({ message, showFeedback = true }: ChatMessageProps) {
  // Generate message ID if none exists
  const messageId = message.id || `chat_${message.timestamp || Date.now()}`;
  
  // Handle feedback
  const handleFeedback = (feedback: 'helpful' | 'unhelpful') => {
    if (message.role === 'assistant') {
      recordFeedback(messageId, 'chat', feedback);
    }
  };
  
  return (
    <div className={`p-4 rounded-lg my-2 ${
      message.role === 'user' 
        ? 'bg-blue-50 ml-8' 
        : 'bg-white border mr-8'
    }`}>
      {/* Message header */}
      <div className="flex items-center mb-2">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {message.role === 'user' ? 'S' : 'AI'}
        </div>
        <span className="ml-2 font-medium">
          {message.role === 'user' ? 'Siz' : 'CareerPath AI'}
        </span>
        {message.timestamp && (
          <span className="ml-auto text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {/* Message content */}
      <div className="whitespace-pre-wrap pl-10">
        {message.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? <p key={index} className="mb-2">{paragraph}</p> : null
        ))}
      </div>
      
      {/* Show feedback buttons only for assistant messages */}
      {showFeedback && message.role === 'assistant' && (
        <div className="pl-10 mt-2">
          <FeedbackButtons 
            responseType="chat"
            responseId={messageId}
            onFeedback={handleFeedback}
          />
        </div>
      )}
    </div>
  );
}