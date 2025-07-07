/**
 * ChatMessage Component
 * 
 * Displays individual message bubbles in the chat interface
 * Features:
 * - Different styling for user and assistant messages
 * - Avatar display
 * - Timestamps
 * - Optimized layout and styling
 */

import React from 'react';
import Avatar from './Avatar';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  // Format timestamp (e.g., "14:32")
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[85%] space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <Avatar type={isUser ? 'user' : 'ai'} />
        </div>
        
        {/* Message bubble */}
        <div 
          className={`
            px-4 py-3 rounded-lg shadow-sm
            ${isUser 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}
          `}
        >
          <div className="whitespace-pre-wrap">{content}</div>
          <div 
            className={`
              text-xs mt-1 
              ${isUser ? 'text-blue-100' : 'text-gray-400'}
            `}
          >
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}