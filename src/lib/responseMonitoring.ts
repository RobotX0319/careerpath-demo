/**
 * Response monitoring utilities
 * Clean implementation for AI response quality tracking
 */

// Quality event logging
export function logQualityEvent(
  responseType: string, 
  response: string, 
  eventType: string = 'general'
): void {
  console.log(`Quality Event: ${responseType} - ${eventType}`, {
    responseLength: response.length,
    timestamp: Date.now(),
    hasMarkdown: response.includes('*') || response.includes('#'),
    isShort: response.length < 50
  });
  
  // Store in localStorage for basic tracking
  try {
    const events = JSON.parse(localStorage.getItem('quality_events') || '[]');
    events.push({
      responseType,
      eventType,
      responseLength: response.length,
      timestamp: Date.now(),
      hasIssues: response.includes('*') || response.includes('#') || response.length < 50
    });
    
    // Keep only recent events (last 100)
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('quality_events', JSON.stringify(events));
  } catch (e) {
    console.error('Failed to log quality event:', e);
  }
}

// Response validation
export function validateResponse(response: string): boolean {
  return Boolean(
    response && 
    response.length > 10 && 
    !response.includes('*') && 
    !response.includes('#') &&
    !response.includes('```')
  );
}

// Check if response needs improvement
export function needsImprovement(response: string): boolean {
  return (
    response.length < 50 || 
    response.includes('*') || 
    response.includes('#') || 
    response.includes('```') ||
    response.includes('ERROR') ||
    response.includes('undefined')
  );
}

// Get quality statistics
export function getQualityStats() {
  try {
    const events = JSON.parse(localStorage.getItem('quality_events') || '[]');
    if (events.length === 0) return null;
    
    const total = events.length;
    const withIssues = events.filter((e: any) => e.hasIssues).length;
    const qualityScore = Math.round(((total - withIssues) / total) * 100);
    
    return {
      total,
      withIssues,
      qualityScore,
      recentEvents: events.slice(-10)
    };
  } catch (e) {
    console.error('Failed to get quality stats:', e);
    return null;
  }
}

// Get quality analytics (alias for getQualityStats)
export function getQualityAnalytics() {
  return getQualityStats();
}

// Clear quality logs
export function clearQualityLogs(): void {
  try {
    localStorage.removeItem('quality_events');
    console.log('Quality logs cleared');
  } catch (e) {
    console.error('Failed to clear quality logs:', e);
  }
}