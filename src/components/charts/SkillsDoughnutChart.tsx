'use client';

/**
 * SkillsDoughnutChart Component
 * 
 * Doughnut chart for skills distribution
 */

import React from 'react';

export interface SkillData {
  name: string;
  level: number;
  category: string;
}

interface SkillsDoughnutChartProps {
  skills: SkillData[];
  size?: number;
  title?: string;
}

export default function SkillsDoughnutChart({
  skills,
  size = 200,
  title = "Ko'nikmalar taqsimoti"
}: SkillsDoughnutChartProps) {
  const center = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.6;
  
  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillData[]>);
  
  // Calculate category averages
  const categoryData = Object.entries(categories).map(([category, categorySkills]) => {
    const average = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
    return {
      category,
      average: Math.round(average),
      count: categorySkills.length
    };
  });
  
  // Colors for different categories
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#f97316', // orange
  ];
  
  // Calculate angles
  const total = categoryData.reduce((sum, item) => sum + item.average, 0);
  let currentAngle = -90; // Start from top
  
  const segments = categoryData.map((item, index) => {
    const angle = (item.average / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path for arc
    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = center + radius * Math.cos(startRadians);
    const y1 = center + radius * Math.sin(startRadians);
    const x2 = center + radius * Math.cos(endRadians);
    const y2 = center + radius * Math.sin(endRadians);
    
    const x3 = center + innerRadius * Math.cos(endRadians);
    const y3 = center + innerRadius * Math.sin(endRadians);
    const x4 = center + innerRadius * Math.cos(startRadians);
    const y4 = center + innerRadius * Math.sin(startRadians);
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    currentAngle = endAngle;
    
    return {
      ...item,
      path: pathData,
      color: colors[index % colors.length],
      percentage: Math.round((item.average / total) * 100)
    };
  });
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="flex items-center space-x-8">
        {/* Chart */}
        <div className="relative">
          <svg width={size} height={size}>
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              </g>
            ))}
            
            {/* Center text */}
            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold fill-gray-800"
            >
              {skills.length}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              Ko'nikmalar
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div>
                <div className="text-sm font-medium">{segment.category}</div>
                <div className="text-xs text-gray-600">
                  {segment.count} ta ko'nikma • {segment.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills list */}
      <div className="mt-6 w-full max-w-md">
        <h4 className="font-medium mb-3">Ko'nikmalar ro'yxati</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {skills.map((skill, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{skill.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 w-8">{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}