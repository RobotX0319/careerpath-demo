'use client';

/**
 * Progress Chart Component
 */

import React from 'react';

interface ProgressChartProps {
  goals: any[];
  progressItems: any[];
  type: 'bar' | 'pie' | 'line';
  height: number;
}

export default function ProgressChart({ goals, progressItems, type, height }: ProgressChartProps) {
  return (
    <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-500">Progress Chart</p>
        <p className="text-sm text-gray-400">Chart yuklanmoqda...</p>
      </div>
    </div>
  );
}