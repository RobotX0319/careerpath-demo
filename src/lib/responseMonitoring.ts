/**
 * Response Quality Monitoring System
 * 
 * This module provides tools to validate, monitor and improve
 * the quality of AI responses automatically.
 */

// Type definitions for monitoring logs
interface QualityLogEntry {
  timestamp: number;
  requestType: 'personality' | 'career' | 'chat';
  userId: string;
  qualityScore: number;
  valid: boolean;
  issues: string[];
  responseLength: number;
}

interface TypeStats {
  count: number;
  validCount: number;
  totalScore: number;
}

// Log key for monitoring events
const MONITOR_LOG_KEY = 'careerpath_response_quality_log';
const MAX_LOGS = 100;

/**
 * Validate if a response meets quality standards
 */
export function validateResponse(response: string): {
  valid: boolean;
  issues: string[];
} {
  if (!response) {
    return { valid: false, issues: ['Empty response'] };
  }
  
  const issues: string[] = [];
  
  // Check for formatting issues
  if (response.includes('*')) issues.push('Contains asterisks');
  if (response.includes('#')) issues.push('Contains hash symbols');
  if (response.includes('```')) issues.push('Contains code blocks');
  if (response.includes('---')) issues.push('Contains horizontal rules');
  if (response.includes('- ')) issues.push('Contains bullet points');
  if (/^\d+\./.test(response)) issues.push('Contains numbered lists');
  
  // Check response length
  if (response.length < 50) issues.push('Response too short');
  if (response.length > 2000) issues.push('Response too long');
  
  // Check for common AI artifacts
  if (response.includes('AI model')) issues.push('Contains AI self-reference');
  if (response.includes('I don\'t have access')) issues.push('Contains limitation disclaimer');
  
  // Check for prompt leakage
  if (response.includes('MUHIM')) issues.push('Contains prompt instructions');
  if (response.includes('ESLATMA')) issues.push('Contains prompt notes');
  if (response.includes('JAVOB TALABLARI')) issues.push('Contains prompt requirements');
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Calculate quality score based on validation and other factors
 */
export function calculateQualityScore(response: string): number {
  const { valid, issues } = validateResponse(response);
  
  // Start with perfect score and subtract for issues
  let score = 100;
  
  // Each issue reduces score
  score -= issues.length * 10;
  
  // Length factors
  if (response.length < 100) score -= 10;
  if (response.length > 1500) score -= 5;
  
  // Check paragraph structure
  const paragraphs = response.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) score -= 10;
  
  // Check for very long paragraphs
  const hasLongParagraphs = paragraphs.some(p => p.length > 400);
  if (hasLongParagraphs) score -= 5;
  
  // Keep score in valid range
  return Math.max(0, Math.min(100, score));
}

/**
 * Log a quality event for monitoring
 */
export function logQualityEvent(
  requestType: 'personality' | 'career' | 'chat',
  response: string,
  userId: string = 'anonymous'
): void {
  // Get quality metrics
  const { valid, issues } = validateResponse(response);
  const qualityScore = calculateQualityScore(response);
  
  // Create log entry
  const logEntry = {
    timestamp: Date.now(),
    requestType,
    userId,
    qualityScore,
    valid,
    issues,
    responseLength: response.length
  };
  
  // Save to local storage for analytics
  try {
    // Get existing logs
    const existingLogsJSON = localStorage.getItem(MONITOR_LOG_KEY) || '[]';
    const existingLogs = JSON.parse(existingLogsJSON);
    
    // Add new log
    existingLogs.unshift(logEntry);
    
    // Keep only recent logs
    const trimmedLogs = existingLogs.slice(0, MAX_LOGS);
    
    // Save back to storage
    localStorage.setItem(MONITOR_LOG_KEY, JSON.stringify(trimmedLogs));
  } catch (e) {
    console.error('Failed to log quality event:', e);
  }
  
  // Log to console
  console.log(
    `[Quality Monitor] ${requestType} response: ` +
    `Score ${qualityScore}/100, Issues: ${issues.length}`
  );
  if (issues.length > 0) {
    console.log(`Issues detected: ${issues.join(', ')}`);
  }
}

/**
 * Get quality analytics for monitoring
 */
export function getQualityAnalytics(): Record<string, any> {
  try {
    const logsJSON = localStorage.getItem(MONITOR_LOG_KEY) || '[]';
    const logs = JSON.parse(logsJSON) as QualityLogEntry[];
    
    // Calculate stats
    const totalResponses = logs.length;
    if (totalResponses === 0) {
      return { totalResponses: 0 };
    }
    
    const validResponses = logs.filter((log: QualityLogEntry) => log.valid).length;
    const avgScore = logs.reduce((sum: number, log: QualityLogEntry) => sum + log.qualityScore, 0) / totalResponses;
    
    // Get stats by request type
    const byType: Record<string, TypeStats> = {};
    for (const log of logs) {
      if (!byType[log.requestType]) {
        byType[log.requestType] = { count: 0, validCount: 0, totalScore: 0 };
      }
      
      byType[log.requestType].count++;
      if (log.valid) byType[log.requestType].validCount++;
      byType[log.requestType].totalScore += log.qualityScore;
    }
    
    // Calculate averages by type
    const statsByType: Record<string, { count: number, validPercentage: number, avgScore: number }> = {};
    for (const [type, stats] of Object.entries(byType)) {
      statsByType[type] = {
        count: stats.count,
        validPercentage: (stats.validCount / stats.count) * 100,
        avgScore: stats.totalScore / stats.count
      };
    }
    
    // Most common issues
    const issueFrequency: Record<string, number> = {};
    for (const log of logs) {
      for (const issue of log.issues || []) {
        issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
      }
    }
    
    // Sort issues by frequency
    const sortedIssues = Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    return {
      totalResponses,
      validPercentage: (validResponses / totalResponses) * 100,
      avgScore,
      statsByType,
      topIssues: sortedIssues.map(([issue, count]) => ({ 
        issue, 
        count, 
        percentage: (count / totalResponses) * 100 
      })),
      recentLogs: logs.slice(0, 10)
    };
  } catch (e) {
    console.error('Failed to get quality analytics:', e);
    return { error: 'Failed to analyze logs' };
  }
}

/**
 * Clear quality monitoring logs
 */
export function clearQualityLogs(): void {
  localStorage.removeItem(MONITOR_LOG_KEY);
}

/**
 * Determine if response needs improvement based on quality
 */
export function needsImprovement(response: string): boolean {
  const score = calculateQualityScore(response);
  return score < 70;
}