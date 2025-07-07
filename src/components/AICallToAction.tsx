/**
 * AICallToAction Component
 * 
 * Attractive component to encourage users to interact with AI features
 * Features:
 * - Eye-catching design
 * - Clear call-to-action
 * - Customizable for different AI features
 * - Responsive layout
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';

interface AICallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  type?: 'chat' | 'personality' | 'career';
  className?: string;
  onClick?: () => void;
}

export default function AICallToAction({
  title = 'AI karyera maslahatchisi bilan suhbatlashing',
  description = "Karyera bo'yicha savollaringiz bormi? Bizning AI assistentimiz sizga yordam berishga tayyor!",
  buttonText = 'Savol bering',
  buttonLink,
  type = 'chat',
  className = '',
  onClick
}: AICallToActionProps) {
  const router = useRouter();
  
  // Different content based on AI feature type
  const contentByType = {
    chat: {
      icon: (
        <div className="relative">
          <Avatar type="ai" size="lg" />
          <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3"></div>
        </div>
      ),
      gradient: 'from-blue-500 to-blue-700',
    },
    personality: {
      icon: (
        <div className="bg-violet-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      ),
      gradient: 'from-violet-500 to-violet-700',
    },
    career: {
      icon: (
        <div className="bg-emerald-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      gradient: 'from-emerald-500 to-emerald-700',
    }
  };
  
  const { icon, gradient } = contentByType[type];
  
  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (buttonLink) {
      router.push(buttonLink);
    }
  };
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border border-gray-200 ${className}`}>
      <div className={`bg-gradient-to-r ${gradient} text-white p-6`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white/90">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Tez va aniq javoblar
        </div>
        
        {buttonLink ? (
          <Link 
            href={buttonLink}
            className={`px-4 py-2 rounded-md bg-gradient-to-r ${gradient} text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-md bg-gradient-to-r ${gradient} text-white font-medium hover:opacity-90 transition-opacity`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}