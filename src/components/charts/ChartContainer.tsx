/**
 * ChartContainer Component
 * 
 * Provides consistent styling for chart components
 */

import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
  height?: number | string;
  footer?: ReactNode;
  isLoading?: boolean;
}

export default function ChartContainer({
  title,
  children,
  className = '',
  description,
  height = 'auto',
  footer,
  isLoading = false
}: ChartContainerProps) {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
    >
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      <div className="p-4 flex-1 h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-500">Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {children}
          </div>
        )}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}