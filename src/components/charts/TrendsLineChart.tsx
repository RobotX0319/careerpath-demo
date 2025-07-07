'use client';

/**
 * TrendsLineChart Component
 * 
 * Line chart for showing trends over time
 */

import React from 'react';

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

interface TrendsLineChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
  width?: number;
  color?: string;
}

export default function TrendsLineChart({
  data,
  title = "Trend tahlili",
  height = 250,
  width = 400,
  color = "#3b82f6"
}: TrendsLineChartProps) {
  if (data.length === 0) return null;
  
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Find min and max values
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;
  
  // Generate points for the line
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (item.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...item };
  });
  
  // Create path string for the line
  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');
  
  // Create area under the line
  const areaData = [
    `M ${points[0].x} ${height - padding}`,
    ...points.map(point => `L ${point.x} ${point.y}`),
    `L ${points[points.length - 1].x} ${height - padding}`,
    'Z'
  ].join(' ');
  
  return (
    <div className="w-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Title */}
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          className="text-lg font-semibold fill-gray-800"
        >
          {title}
        </text>
        
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect
          x={padding}
          y={padding}
          width={chartWidth}
          height={chartHeight}
          fill="url(#grid)"
        />
        
        {/* Area under line */}
        <path
          d={areaData}
          fill={color}
          fillOpacity="0.1"
        />
        
        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            />
            
            {/* Tooltip on hover */}
            <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <rect
                x={point.x - 30}
                y={point.y - 35}
                width="60"
                height="25"
                fill="black"
                fillOpacity="0.8"
                rx="4"
              />
              <text
                x={point.x}
                y={point.y - 20}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {point.value}
              </text>
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {new Date(point.date).toLocaleDateString()}
              </text>
            </g>
          </g>
        ))}
        
        {/* Y-axis labels */}
        <text
          x={padding - 10}
          y={padding + 5}
          textAnchor="end"
          className="text-xs fill-gray-600"
        >
          {maxValue}
        </text>
        <text
          x={padding - 10}
          y={height - padding + 5}
          textAnchor="end"
          className="text-xs fill-gray-600"
        >
          {minValue}
        </text>
        
        {/* X-axis labels */}
        <text
          x={padding}
          y={height - 10}
          textAnchor="start"
          className="text-xs fill-gray-600"
        >
          {new Date(data[0].date).toLocaleDateString()}
        </text>
        <text
          x={width - padding}
          y={height - 10}
          textAnchor="end"
          className="text-xs fill-gray-600"
        >
          {new Date(data[data.length - 1].date).toLocaleDateString()}
        </text>
        
        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="1"
        />
      </svg>
      
      {/* Summary stats */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>
          <span className="font-medium">Trend:</span>{' '}
          {values[values.length - 1] > values[0] ? (
            <span className="text-green-600">↗ O'sish</span>
          ) : (
            <span className="text-red-600">↘ Kamayish</span>
          )}
        </div>
        <div>
          <span className="font-medium">O'rtacha:</span>{' '}
          {Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)}
        </div>
        <div>
          <span className="font-medium">Eng yuqori:</span> {maxValue}
        </div>
      </div>
    </div>
  );
}