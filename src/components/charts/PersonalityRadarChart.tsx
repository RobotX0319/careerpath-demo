'use client';

/**
 * PersonalityRadarChart Component
 * 
 * Simple radar chart implementation without external dependencies
 */

import React from 'react';

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface PersonalityRadarChartProps {
  personalityScores: PersonalityScores;
  height?: number;
  width?: number;
}

export default function PersonalityRadarChart({
  personalityScores,
  height = 300,
  width = 300
}: PersonalityRadarChartProps) {
  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) / 2 - 40;
  
  // Personality traits with labels
  const traits = [
    { key: 'openness', label: 'Ochiqlik', value: personalityScores.openness },
    { key: 'conscientiousness', label: 'Vijdonlilik', value: personalityScores.conscientiousness },
    { key: 'extraversion', label: 'Ekstroversiya', value: personalityScores.extraversion },
    { key: 'agreeableness', label: 'Kelishuvlik', value: personalityScores.agreeableness },
    { key: 'neuroticism', label: 'Nevrotizm', value: personalityScores.neuroticism }
  ];
  
  // Calculate points for the polygon
  const getPoint = (angle: number, value: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    const r = (value / 10) * radius;
    return {
      x: center.x + r * Math.cos(radian),
      y: center.y + r * Math.sin(radian)
    };
  };
  
  // Generate points for the data polygon
  const dataPoints = traits.map((trait, index) => {
    const angle = (360 / traits.length) * index;
    return getPoint(angle, trait.value);
  });
  
  // Generate grid circles
  const gridCircles = [2, 4, 6, 8, 10].map(value => (
    <circle
      key={value}
      cx={center.x}
      cy={center.y}
      r={(value / 10) * radius}
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
    />
  ));
  
  // Generate axis lines and labels
  const axisLines = traits.map((trait, index) => {
    const angle = (360 / traits.length) * index;
    const endPoint = getPoint(angle, 10);
    const labelPoint = getPoint(angle, 11);
    
    return (
      <g key={trait.key}>
        <line
          x1={center.x}
          y1={center.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke="#d1d5db"
          strokeWidth="1"
        />
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium"
          fill="#374151"
        >
          {trait.label}
        </text>
        <text
          x={labelPoint.x}
          y={labelPoint.y + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
          fill="#6b7280"
        >
          {trait.value}/10
        </text>
      </g>
    );
  });
  
  // Create polygon path
  const polygonPath = dataPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z';
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid circles */}
        {gridCircles}
        
        {/* Axis lines and labels */}
        {axisLines}
        
        {/* Data polygon */}
        <path
          d={polygonPath}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {dataPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Shaxsiyat xususiyatlari (1-10 shkala)
        </p>
      </div>
    </div>
  );
}