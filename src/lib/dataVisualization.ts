/**
 * Data Visualization Utilities
 * 
 * Functions for generating mock data for charts and visualizations
 */

import { PersonalityScores } from '@/components/charts/PersonalityRadarChart';
import { CareerMatch } from '@/components/charts/CareerMatchBarChart';

/**
 * Generate random personality scores for demo purposes
 */
export function generateRandomPersonality(): PersonalityScores {
  return {
    openness: Math.floor(Math.random() * 4) + 6, // 6-10
    conscientiousness: Math.floor(Math.random() * 4) + 6, // 6-10
    extraversion: Math.floor(Math.random() * 10) + 1, // 1-10
    agreeableness: Math.floor(Math.random() * 4) + 6, // 6-10
    neuroticism: Math.floor(Math.random() * 6) + 1, // 1-6
  };
}

/**
 * Generate mock career matches for demo purposes
 */
export function generateMockCareerMatches(): CareerMatch[] {
  const careers = [
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Full Stack Developer',
    'Software Architect',
    'QA Engineer',
    'Business Analyst',
    'Project Manager'
  ];
  
  return careers.map(career => ({
    career,
    score: Math.floor(Math.random() * 40) + 60 // 60-100
  }));
}

/**
 * Generate mock skill progress data
 */
export function generateSkillProgress(): Array<{
  skill: string;
  current: number;
  target: number;
  category: string;
}> {
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'React', category: 'Framework' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'CSS', category: 'Design' },
    { name: 'Git', category: 'Tools' },
    { name: 'SQL', category: 'Database' },
    { name: 'Python', category: 'Programming' }
  ];
  
  return skills.map(skill => ({
    skill: skill.name,
    current: Math.floor(Math.random() * 80) + 20, // 20-100
    target: Math.floor(Math.random() * 20) + 80, // 80-100
    category: skill.category
  }));
}

/**
 * Generate mock learning progress over time
 */
export function generateLearningProgress(): Array<{
  date: string;
  hoursStudied: number;
  skillsLearned: number;
  testsCompleted: number;
}> {
  const data: Array<{
    date: string;
    hoursStudied: number;
    skillsLearned: number;
    testsCompleted: number;
  }> = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Last 30 days
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      hoursStudied: Math.floor(Math.random() * 8) + 1, // 1-8 hours
      skillsLearned: Math.floor(Math.random() * 3), // 0-2 skills
      testsCompleted: Math.floor(Math.random() * 2) // 0-1 tests
    });
  }
  
  return data;
}

/**
 * Generate color palette for charts
 */
export function getChartColors(count: number): string[] {
  const baseColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#f97316', // orange
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#ec4899', // pink
    '#6b7280'  // gray
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}

/**
 * Format numbers for display in charts
 */
export function formatChartNumber(value: number, type: 'percentage' | 'decimal' | 'integer' = 'integer'): string {
  switch (type) {
    case 'percentage':
      return `${Math.round(value)}%`;
    case 'decimal':
      return value.toFixed(1);
    case 'integer':
    default:
      return Math.round(value).toString();
  }
}

/**
 * Calculate chart dimensions based on container size
 */
export function calculateChartDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number = 16/9
): { width: number; height: number } {
  let width = containerWidth;
  let height = width / aspectRatio;
  
  if (height > containerHeight) {
    height = containerHeight;
    width = height * aspectRatio;
  }
  
  return { width: Math.floor(width), height: Math.floor(height) };
}

/**
 * Generate trend data for performance metrics
 */
export function generatePerformanceTrend(): Array<{
  date: string;
  score: number;
  metric: string;
}> {
  const metrics = ['LCP', 'FID', 'CLS', 'FCP'];
  const data: Array<{
    date: string;
    score: number;
    metric: string;
  }> = [];
  
  for (let i = 0; i < 7; i++) { // Last 7 days
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    metrics.forEach(metric => {
      data.push({
        date: date.toISOString().split('T')[0],
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        metric
      });
    });
  }
  
  return data;
}