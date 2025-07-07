/**
 * AIFeatureCard Component
 * 
 * Displays AI features in an attractive card format
 * Features:
 * - Visual icon
 * - Feature title and description
 * - Optional badge (new/beta)
 * - Call-to-action button
 */

import React from 'react';
import Link from 'next/link';

interface AIFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  badge?: string;
  color?: 'blue' | 'violet' | 'emerald' | 'amber';
  className?: string;
  onClick?: () => void;
}

export default function AIFeatureCard({
  title,
  description,
  icon,
  buttonText = "Ko'rish",
  buttonLink,
  badge,
  color = 'blue',
  className = '',
  onClick
}: AIFeatureCardProps) {
  const colorClasses = {
    blue: {
      badge: 'bg-blue-100 text-blue-800',
      iconBg: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    violet: {
      badge: 'bg-violet-100 text-violet-800',
      iconBg: 'bg-violet-100 text-violet-600',
      button: 'bg-violet-600 hover:bg-violet-700'
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700'
    },
    amber: {
      badge: 'bg-amber-100 text-amber-800',
      iconBg: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700'
    }
  };
  
  const colors = colorClasses[color];
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className={`${colors.iconBg} p-3 rounded-lg mr-4`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              
              {badge && (
                <span className={`ml-2 py-1 px-2 text-xs font-medium rounded ${colors.badge}`}>
                  {badge}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          {buttonLink ? (
            <Link 
              href={buttonLink}
              className={`${colors.button} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {buttonText}
            </Link>
          ) : (
            <button
              onClick={handleClick}
              className={`${colors.button} text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}