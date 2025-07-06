/**
 * AI Response Monitoring and Configuration Management
 * 
 * This module provides utilities to monitor AI response quality,
 * track API usage, and optimize configuration based on results.
 */

// Track API request metrics
interface RequestMetrics {
  requestType: 'personality' | 'career' | 'chat';
  startTime: number;
  endTime?: number;
  successful?: boolean;
  responseLength?: number;
  retryCount?: number;
  error?: string;
  userId: string;
}

// Keep track of recent API calls
const recentRequests: RequestMetrics[] = [];
const MAX_TRACKED_REQUESTS = 100;

// Configuration performance tracking
interface ConfigPerformance {
  config: any;
  avgResponseTime: number;
  successRate: number;
  usageCount: number;
  lastUpdated: number;
}

// Store performance metrics for different configs
const configPerformance: Record<string, ConfigPerformance> = {};

/**
 * Start tracking a new API request
 */
export function trackRequestStart(
  requestType: 'personality' | 'career' | 'chat',
  userId: string = 'anonymous'
): string {
  const requestId = `${requestType}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const metrics: RequestMetrics = {
    requestType,
    startTime: Date.now(),
    userId
  };
  
  // Add to tracking array
  recentRequests.unshift(metrics);
  
  // Trim array if needed
  if (recentRequests.length > MAX_TRACKED_REQUESTS) {
    recentRequests.pop();
  }
  
  console.log(`[AI Monitoring] Starting ${requestType} request for user ${userId}`);
  return requestId;
}

/**
 * Complete tracking for an API request
 */
export function trackRequestEnd(
  requestId: string,
  success: boolean,
  responseLength?: number,
  error?: string,
  retryCount: number = 0
): void {
  const request = recentRequests.find(r => requestId.startsWith(r.requestType));
  
  if (request) {
    // Update metrics
    request.endTime = Date.now();
    request.successful = success;
    request.responseLength = responseLength;
    request.retryCount = retryCount;
    request.error = error;
    
    const duration = request.endTime - request.startTime;
    console.log(
      `[AI Monitoring] ${request.requestType} request ${success ? 'succeeded' : 'failed'} ` +
      `in ${duration}ms (${retryCount} retries) for user ${request.userId}`
    );
    
    // Update performance tracking
    updateConfigPerformance(request.requestType, success, duration);
  }
}

/**
 * Update configuration performance metrics
 */
function updateConfigPerformance(
  requestType: string,
  success: boolean,
  duration: number
): void {
  if (!configPerformance[requestType]) {
    configPerformance[requestType] = {
      config: null,
      avgResponseTime: duration,
      successRate: success ? 100 : 0,
      usageCount: 1,
      lastUpdated: Date.now()
    };
    return;
  }
  
  const perf = configPerformance[requestType];
  const newCount = perf.usageCount + 1;
  
  // Update rolling average
  perf.avgResponseTime = 
    (perf.avgResponseTime * perf.usageCount + duration) / newCount;
  
  // Update success rate
  const successCount = perf.successRate * perf.usageCount / 100;
  perf.successRate = (successCount + (success ? 1 : 0)) / newCount * 100;
  
  perf.usageCount = newCount;
  perf.lastUpdated = Date.now();
}

/**
 * Get request statistics for monitoring
 */
export function getRequestStats(): Record<string, any> {
  // Calculate stats from recent requests
  const total = recentRequests.length;
  const successful = recentRequests.filter(r => r.successful).length;
  const successRate = total > 0 ? (successful / total * 100).toFixed(1) : '0';
  
  // Average response times by type
  const avgTimes: Record<string, number> = {};
  const countByType: Record<string, number> = {};
  
  for (const request of recentRequests) {
    if (request.endTime && request.successful) {
      const duration = request.endTime - request.startTime;
      const type = request.requestType;
      
      if (!avgTimes[type]) {
        avgTimes[type] = duration;
        countByType[type] = 1;
      } else {
        avgTimes[type] = (avgTimes[type] * countByType[type] + duration) / (countByType[type] + 1);
        countByType[type]++;
      }
    }
  }
  
  return {
    totalRequests: total,
    successRate: `${successRate}%`,
    requestsByType: countByType,
    averageResponseTimes: avgTimes,
    recentErrors: recentRequests
      .filter(r => !r.successful)
      .slice(0, 5)
      .map(r => ({ 
        type: r.requestType, 
        time: new Date(r.startTime).toISOString(),
        error: r.error 
      }))
  };
}

/**
 * Determine if we should adjust temperature based on recent results
 */
export function shouldAdjustTemperature(requestType: string): number | null {
  const perf = configPerformance[requestType];
  if (!perf || perf.usageCount < 10) return null;
  
  // If success rate is low, reduce temperature
  if (perf.successRate < 85) {
    return Math.max(0.5, perf.config?.temperature - 0.05);
  }
  
  // If success rate is high but response time is slow, try higher temperature
  if (perf.successRate > 95 && perf.avgResponseTime > 3000) {
    return Math.min(0.9, perf.config?.temperature + 0.05);
  }
  
  return null;
}