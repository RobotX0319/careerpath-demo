/**
 * Avatar Component
 * 
 * Reusable avatar component for chat interface
 * Used for both AI and user avatars
 */

import React from 'react';

interface AvatarProps {
  type: 'ai' | 'user';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ 
  type, 
  size = 'md',
  className = ''
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };
  
  const colorClasses = {
    ai: 'bg-blue-600 text-white',
    user: 'bg-gray-200 text-gray-700'
  };
  
  const avatarText = {
    ai: 'AI',
    user: 'Siz'
  };
  
  return (
    <div 
      className={`
        ${sizeClasses[size]}
        ${colorClasses[type]}
        rounded-full flex items-center justify-center font-semibold
        ${className}
      `}
    >
      {avatarText[type]}
    </div>
  );
}