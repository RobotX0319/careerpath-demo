/**
 * TypingIndicator Component
 * 
 * Animated indicator showing that the AI is typing
 */

import React from 'react';
import Avatar from './Avatar';

interface TypingIndicatorProps {
  className?: string;
}

export default function TypingIndicator({ className = '' }: TypingIndicatorProps) {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="flex items-end space-x-2">
        <div className="flex-shrink-0 mr-2">
          <Avatar type="ai" />
        </div>
        <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-bl-none">
          <div className="typing-animation flex space-x-1">
            <div className="dot bg-gray-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="dot bg-gray-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="dot bg-gray-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}