/**
 * StatsPanelGrid Component
 * 
 * Displays a grid of statistics cards
 */

import React from 'react';
import StatsCard from './StatsCard';

interface StatItem {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface StatsPanelGridProps {
  stats: StatItem[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function StatsPanelGrid({
  stats,
  className = '',
  columns = 4
}: StatsPanelGridProps) {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  return (
    <div className={`grid ${gridColumns[columns]} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
}