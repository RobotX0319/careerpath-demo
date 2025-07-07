'use client';

/**
 * PersonalityComparison Component
 * 
 * Compares personality traits and career compatibility
 */

import React from 'react';

export interface ComparisonData {
  label: string;
  value: number;
  color: string;
}

interface PersonalityComparisonProps {
  data: ComparisonData[];
  title?: string;
  height?: number;
  width?: number;
}

export default function PersonalityComparison({
  data,
  title = "Shaxsiyat Taqqoslash",
  height = 300,
  width = 400
}: PersonalityComparisonProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const barHeight = 30;
  const spacing = 50;
  const chartHeight = data.length * spacing + 60;
  
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>
      
      <svg width={width} height={Math.max(height, chartHeight)} className="overflow-visible">
        {data.map((item, index) => {
          const y = 40 + index * spacing;
          const barWidth = (item.value / maxValue) * (width - 120);
          
          return (
            <g key={index}>
              {/* Label */}
              <text
                x={10}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-700"
                style={{ fontSize: '12px' }}
              >
                {item.label}
              </text>
              
              {/* Bar */}
              <rect
                x={110}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                rx="4"
                className="hover:opacity-80 transition-opacity"
              />
              
              {/* Value */}
              <text
                x={115 + barWidth}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-bold fill-gray-800"
                style={{ fontSize: '11px' }}
              >
                {item.value}%
              </text>
            </g>
          );
        })}
        
        {/* Legend */}
        <g transform={`translate(10, ${chartHeight - 20})`}>
          <text className="text-xs fill-gray-500" style={{ fontSize: '10px' }}>
            0%
          </text>
          <text 
            x={width - 120} 
            className="text-xs fill-gray-500" 
            style={{ fontSize: '10px' }}
          >
            100%
          </text>
        </g>
      </svg>
      
      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}%
          </div>
          <div className="text-sm text-gray-600">O'rtacha</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.max(...data.map(item => item.value))}%
          </div>
          <div className="text-sm text-gray-600">Eng yuqori</div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Tahlil natijasi:</h4>
        <div className="text-sm text-gray-700 space-y-1">
          {data.map((item, index) => {
            if (item.value >= 80) {
              return (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>{item.label} - Kuchli tomoni</span>
                </div>
              );
            } else if (item.value <= 40) {
              return (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span>{item.label} - Rivojlantirish kerak</span>
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
}