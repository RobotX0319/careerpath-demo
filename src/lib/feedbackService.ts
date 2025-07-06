/**
 * Feedback Service
 * 
 * Provides functionality to collect and process user feedback on AI responses
 */

import { logQualityEvent } from './responseMonitoring';

// Store for feedback received from users
const feedbackStore = new Map<string, {
  responseId: string;
  responseType: 'personality' | 'career' | 'chat';
  feedback: 'helpful' | 'unhelpful';
  timestamp: number;
  userId: string;
}>();

/**
 * Record user feedback for a response
 * 
 * @param responseId Unique identifier for the response
 * @param responseType Type of response (personality, career, chat)
 * @param feedback Whether the response was helpful or not
 * @param userId User identifier
 */
export function recordFeedback(
  responseId: string,
  responseType: 'personality' | 'career' | 'chat',
  feedback: 'helpful' | 'unhelpful',
  userId: string = 'anonymous'
): void {
  // Store feedback
  feedbackStore.set(responseId, {
    responseId,
    responseType,
    feedback,
    timestamp: Date.now(),
    userId
  });
  
  // Log to console for debugging
  console.log(`User feedback recorded: ${feedback} for ${responseType} response`);
  
  // Store in localStorage for persistence
  try {
    const key = 'careerpath_feedback_store';
    const existingData = localStorage.getItem(key);
    let feedbackData = existingData ? JSON.parse(existingData) : [];
    
    // Add new feedback
    feedbackData.push({
      responseId,
      responseType,
      feedback,
      timestamp: Date.now(),
      userId
    });
    
    // Keep only recent feedback (last 100 entries)
    if (feedbackData.length > 100) {
      feedbackData = feedbackData.slice(-100);
    }
    
    localStorage.setItem(key, JSON.stringify(feedbackData));
  } catch (e) {
    console.error('Failed to persist feedback:', e);
  }
  
  // Use feedback to improve future responses
  processFeedback(responseId, responseType, feedback);
}

/**
 * Process user feedback to improve future responses
 */
function processFeedback(
  responseId: string,
  responseType: 'personality' | 'career' | 'chat',
  feedback: 'helpful' | 'unhelpful'
): void {
  // If response was unhelpful, we may want to adjust our prompt
  if (feedback === 'unhelpful') {
    // Get cached response if available
    const cacheKey = `${responseType}_${responseId}`;
    const cachedResponse = localStorage.getItem(cacheKey);
    
    if (cachedResponse) {
      try {
        // Mark this response as problematic so we don't use similar patterns
        const { response } = JSON.parse(cachedResponse);
        logQualityEvent(responseType, response, 'feedback-negative');
        
        // Clear this specific cache entry to force regeneration next time
        localStorage.removeItem(cacheKey);
      } catch (e) {
        console.error('Failed to process negative feedback:', e);
      }
    }
  }
}

/**
 * Get all feedback data for analysis
 * @returns Array of feedback entries
 */
export function getFeedbackData(): any[] {
  try {
    const key = 'careerpath_feedback_store';
    const existingData = localStorage.getItem(key);
    return existingData ? JSON.parse(existingData) : [];
  } catch (e) {
    console.error('Failed to get feedback data:', e);
    return [];
  }
}

/**
 * Get feedback statistics
 * @returns Statistics about feedback
 */
export function getFeedbackStats() {
  const feedback = getFeedbackData();
  if (!feedback.length) return null;
  
  const total = feedback.length;
  const helpfulCount = feedback.filter((item: any) => item.feedback === 'helpful').length;
  const unhelpfulCount = total - helpfulCount;
  
  // Stats by type
  const typeStats = feedback.reduce((acc: any, item: any) => {
    if (!acc[item.responseType]) {
      acc[item.responseType] = { total: 0, helpful: 0 };
    }
    acc[item.responseType].total++;
    if (item.feedback === 'helpful') {
      acc[item.responseType].helpful++;
    }
    return acc;
  }, {});
  
  // Format type stats
  const formattedTypeStats = Object.entries(typeStats).map(([type, data]: [string, any]) => ({
    type,
    total: data.total,
    helpful: data.helpful,
    helpfulPercentage: (data.helpful / data.total) * 100
  }));
  
  return {
    total,
    helpful: helpfulCount,
    unhelpful: unhelpfulCount,
    helpfulPercentage: (helpfulCount / total) * 100,
    byType: formattedTypeStats
  };
}

/**
 * Clear all feedback data
 */
export function clearFeedbackData(): void {
  localStorage.removeItem('careerpath_feedback_store');
  feedbackStore.clear();
}