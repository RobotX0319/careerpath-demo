'use client';

/**
 * CareerMatchBarChart Component
 * 
 * Simple bar chart implementation without external dependencies
 */

import React from 'react';

export interface CareerMatch {
  career: string;
  score: number;
}

interface CareerMatchBarChartProps {
  careerMatches: CareerMatch[];
  limit?: number;
  height?: number;
  width?: number;
}

export default function CareerMatchBarChart({
  careerMatches,
  limit = 5,
  height = 300,
  width = 400
}: CareerMatchBarChartProps) {
  // Sort and limit data
  const sortedMatches = careerMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  const maxScore = Math.max(...sortedMatches.map(match => match.score));
  const barHeight = (height - 80) / sortedMatches.length - 10;
  const chartWidth = width - 120;
  
  return (
    <div className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Chart title */}
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          className="text-sm font-semibold"
          fill="#1f2937"
        >
          Karyera Mos Keliş Darajasi
        </text>
        
        {/* Bars and labels */}
        {sortedMatches.map((match, index) => {
          const barWidth = (match.score / maxScore) * chartWidth;
          const y = 50 + index * (barHeight + 10);
          
          // Color based on score
          const getBarColor = (score: number) => {
            if (score >= 80) return '#10b981'; // green
            if (score >= 60) return '#f59e0b'; // yellow
            return '#ef4444'; // red
          };
          
          return (
            <g key={match.career}>
              {/* Background bar */}
              <rect
                x={100}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill="#f3f4f6"
                rx="4"
              />
              
              {/* Data bar */}
              <rect
                x={100}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(match.score)}
                rx="4"
              />
              
              {/* Career label */}
              <text
                x={95}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs font-medium"
                fill="#374151"
              >
                {match.career}
              </text>
              
              {/* Score label */}
              <text
                x={100 + barWidth + 5}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-xs font-semibold"
                fill="#1f2937"
              >
                {match.score}%
              </text>
            </g>
          );
        })}
        
        {/* Y-axis line */}
        <line
          x1={100}
          y1={40}
          x2={100}
          y2={height - 20}
          stroke="#d1d5db"
          strokeWidth="1"
        />
        
        {/* X-axis labels */}
        <text
          x={100}
          y={height - 5}
          className="text-xs"
          fill="#6b7280"
        >
          0%
        </text>
        <text
          x={100 + chartWidth}
          y={height - 5}
          textAnchor="end"
          className="text-xs"
          fill="#6b7280"
        >
          {maxScore}%
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
          <span>Juda mos (80%+)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
          <span>O'rtacha mos (60-79%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
          <span>Kam mos (60% dan kam)</span>
        </div>
      </div>
    </div>
  );
}