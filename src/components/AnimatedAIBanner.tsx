/**
 * AnimatedAIBanner Component
 * 
 * Eye-catching banner with animated AI elements
 * Features:
 * - Animated gradient background
 * - Interactive elements
 * - Strong call to action
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AnimatedAIBannerProps {
  className?: string;
  onActionClick?: () => void;
}

export default function AnimatedAIBanner({ className = '', onActionClick }: AnimatedAIBannerProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      router.push('/personality');
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl py-10 px-6 md:py-16 md:px-12 ${className}`}
      style={{ background: 'linear-gradient(135deg, #4338ca, #3b82f6, #06b6d4)' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-white opacity-10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="text-white text-center md:text-left md:max-w-md mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Sun'iy intellekt sizning karyerangizni tanlashda yordam beradi
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Shaxsiyatingizni o'rganing, kuchli tomonlaringizni aniqlang va sizga mos kasblarni toping
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>Hoziroq boshlash</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Decorative AI elements */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-4 border-white border-opacity-20 animate-[spin_8s_linear_infinite]"></div>
          </div>
          <div className="absolute inset-3 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-4 border-white border-opacity-30 animate-[spin_12s_linear_infinite_reverse]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
            <div className="absolute w-16 h-16 bg-gradient-to-br from-blue-200 to-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}