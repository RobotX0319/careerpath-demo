/**
 * StatsCard Component
 * 
 * Displays a key metric or statistic in an attractive card format
 */

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
  color = 'blue'
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: 'text-blue-500',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: 'text-green-500',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: 'text-purple-500',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      icon: 'text-orange-500',
      border: 'border-orange-200'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-500',
      border: 'border-red-200'
    }
  };
  
  const colors = colorClasses[color];
  
  return (
    <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        
        {icon && (
          <div className={`p-2 rounded-full ${colors.bg} ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        {trend && (
          <div className={`
            flex items-center text-sm
            ${trend.isPositive ? 'text-green-600' : 'text-red-600'}
          `}>
            <span className="mr-1">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}