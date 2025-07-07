'use client';

/**
 * ComparisonBarChart Component
 * 
 * Chart for comparing different metrics
 */

import React from 'react';

export interface ComparisonData {
  label: string;
  current: number;
  target: number;
  category: string;
}

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title?: string;
  height?: number;
  width?: number;
}

export default function ComparisonBarChart({
  data,
  title = "Taqqoslash",
  height = 300,
  width = 500
}: ComparisonBarChartProps) {
  const maxValue = Math.max(...data.flatMap(item => [item.current, item.target]));
  const barHeight = 20;
  const spacing = 40;
  const chartHeight = data.length * spacing + 80;
  
  return (
    <div className="w-full">
      <svg width={width} height={Math.max(height, chartHeight)} className="overflow-visible">
        {/* Title */}
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          className="text-lg font-semibold fill-gray-800"
        >
          {title}
        </text>
        
        {/* Chart content */}
        {data.map((item, index) => {
          const y = 50 + index * spacing;
          const currentWidth = (item.current / maxValue) * (width - 120);
          const targetWidth = (item.target / maxValue) * (width - 120);
          
          return (
            <g key={index}>
              {/* Label */}
              <text
                x={10}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-700"
              >
                {item.label}
              </text>
              
              {/* Category */}
              <text
                x={10}
                y={y + barHeight / 2 + 12}
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {item.category}
              </text>
              
              {/* Target bar (background) */}
              <rect
                x={100}
                y={y}
                width={targetWidth}
                height={barHeight}
                fill="#e5e7eb"
                rx="3"
              />
              
              {/* Current bar */}
              <rect
                x={100}
                y={y}
                width={currentWidth}
                height={barHeight}
                fill="#3b82f6"
                rx="3"
              />
              
              {/* Current value */}
              <text
                x={100 + currentWidth + 5}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="text-sm font-medium fill-blue-600"
              >
                {item.current}%
              </text>
              
              {/* Target value */}
              <text
                x={100 + targetWidth + 5}
                y={y + barHeight / 2 - 12}
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                Maqsad: {item.target}%
              </text>
            </g>
          );
        })}
        
        {/* Legend */}
        <g transform={`translate(${width - 150}, 50)`}>
          <rect x={0} y={0} width={12} height={12} fill="#3b82f6" rx="2" />
          <text x={18} y={9} className="text-xs fill-gray-700">Hozirgi holat</text>
          
          <rect x={0} y={20} width={12} height={12} fill="#e5e7eb" rx="2" />
          <text x={18} y={29} className="text-xs fill-gray-700">Maqsad</text>
        </g>
      </svg>
    </div>
  );
}