/**
 * FeedbackButtons component
 * 
 * Adds feedback buttons to AI responses allowing users to
 * provide feedback on the quality of responses
 */

import React, { useState } from 'react';
import { recordFeedback } from '@/lib/feedbackService';

interface FeedbackButtonsProps {
  responseId?: string;
  responseType: 'personality' | 'career' | 'chat';
  onFeedback?: (feedback: 'helpful' | 'unhelpful', responseId?: string) => void;
}

export default function FeedbackButtons({ 
  responseId, 
  responseType, 
  onFeedback 
}: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);
  
  // Handle feedback submission
  function handleFeedback(type: 'helpful' | 'unhelpful') {
    if (feedback) return; // Prevent multiple submissions
    
    setFeedback(type);
    
    // For unhelpful feedback, show improvement form
    if (type === 'unhelpful') {
      setShowImprovement(true);
      return;
    }
    
    // For helpful feedback, show thank you message
    setShowThankYou(true);
    
    // Store feedback in localStorage
    try {
      const feedbackKey = 'careerpath_response_feedback';
      const existingFeedbackJSON = localStorage.getItem(feedbackKey) || '[]';
      const existingFeedback = JSON.parse(existingFeedbackJSON);
      
      // Add new feedback
      existingFeedback.push({
        responseId: responseId || `${responseType}_${Date.now()}`,
        responseType,
        feedback: type,
        timestamp: Date.now()
      });
      
      // Keep only recent feedback (maximum 50 entries)
      const trimmedFeedback = existingFeedback.slice(-50);
      localStorage.setItem(feedbackKey, JSON.stringify(trimmedFeedback));
      
      // Call callback if provided
      if (onFeedback) {
        onFeedback(type, responseId);
      }
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
    
    // Hide thank you message after a few seconds
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  }
  
  // Handle detailed feedback submission
  function handleDetailedFeedback(details: {
    reason: string;
    comments: string;
    expectation: string;
  }) {
    try {
      // Store detailed feedback
      const detailedKey = 'careerpath_detailed_feedback';
      const existingDataJSON = localStorage.getItem(detailedKey) || '[]';
      const existingData = JSON.parse(existingDataJSON);
      
      // Add new detailed feedback
      existingData.push({
        responseId: responseId || `${responseType}_${Date.now()}`,
        responseType,
        ...details,
        timestamp: Date.now()
      });
      
      // Keep only recent entries
      const trimmedData = existingData.slice(-50);
      localStorage.setItem(detailedKey, JSON.stringify(trimmedData));
      
      // Close improvement dialog
      setShowImprovement(false);
      
      // Show thank you message
      setShowThankYou(true);
      
      // Hide thank you message after a few seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
      
    } catch (e) {
      console.error('Failed to save detailed feedback:', e);
    }
  }
  
  // Close improvement dialog
  function handleCloseImprovement() {
    setShowImprovement(false);
    setFeedback(null);
  }
  
  // Import ResponseImprovement component
  const ResponseImprovement = require('./ResponseImprovement').default;
  
  if (showThankYou) {
    return (
      <div className="text-center py-2 text-sm text-gray-600">
        Fikr-mulohazangiz uchun rahmat!
      </div>
    );
  }
  
  if (showImprovement) {
    return (
      <ResponseImprovement
        responseId={responseId || `${responseType}_${Date.now()}`}
        responseType={responseType}
        onSubmit={handleDetailedFeedback}
        onCancel={handleCloseImprovement}
      />
    );
  }
  
  if (feedback && !showImprovement) {
    return null; // Hide buttons after feedback is given
  }
  
  return (
    <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-gray-100">
      <span className="text-sm text-gray-500">Javob foydali bo'ldimi?</span>
      <button
        onClick={() => handleFeedback('helpful')}
        className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-sm rounded"
      >
        👍 Ha
      </button>
      <button
        onClick={() => handleFeedback('unhelpful')}
        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded"
      >
        👎 Yo'q
      </button>
    </div>
  );
}