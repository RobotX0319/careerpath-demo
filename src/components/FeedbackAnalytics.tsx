/**
 * FeedbackAnalytics component
 * 
 * Displays analytics for user feedback on AI responses
 */

import React, { useState, useEffect } from 'react';

interface FeedbackEntry {
  responseId: string;
  responseType: 'personality' | 'career' | 'chat';
  feedback: 'helpful' | 'unhelpful';
  timestamp: number;
}

export default function FeedbackAnalytics() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadFeedback();
  }, []);
  
  // Load feedback data from localStorage
  function loadFeedback() {
    setLoading(true);
    try {
      const feedbackKey = 'careerpath_response_feedback';
      const feedbackJSON = localStorage.getItem(feedbackKey) || '[]';
      const feedbackData = JSON.parse(feedbackJSON) as FeedbackEntry[];
      setFeedback(feedbackData);
    } catch (e) {
      console.error('Failed to load feedback:', e);
    } finally {
      setLoading(false);
    }
  }
  
  // Clear feedback data
  function clearFeedback() {
    if (confirm('Are you sure you want to clear all feedback data?')) {
      localStorage.removeItem('careerpath_response_feedback');
      setFeedback([]);
    }
  }
  
  // Calculate feedback statistics
  const stats = React.useMemo(() => {
    if (!feedback.length) return null;
    
    const total = feedback.length;
    const helpful = feedback.filter(f => f.feedback === 'helpful').length;
    const helpfulPercentage = (helpful / total) * 100;
    
    // Stats by type
    const byType = feedback.reduce((acc, entry) => {
      if (!acc[entry.responseType]) {
        acc[entry.responseType] = { total: 0, helpful: 0 };
      }
      
      acc[entry.responseType].total++;
      if (entry.feedback === 'helpful') {
        acc[entry.responseType].helpful++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; helpful: number }>);
    
    // Convert to percentages
    const typeStats = Object.entries(byType).map(([type, data]) => ({
      type,
      total: data.total,
      helpfulPercentage: (data.helpful / data.total) * 100
    }));
    
    return {
      total,
      helpful,
      unhelpful: total - helpful,
      helpfulPercentage,
      typeStats
    };
  }, [feedback]);
  
  // Load a blank slate if no data
  if (!stats) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Feedback Analytics</h2>
          <button 
            onClick={loadFeedback}
            disabled={loading}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
          No feedback data available yet.
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Feedback Analytics</h2>
        <div className="space-x-2">
          <button 
            onClick={loadFeedback}
            disabled={loading}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={clearFeedback}
            className="px-3 py-1 bg-red-100 text-red-700 rounded"
          >
            Clear Data
          </button>
        </div>
      </div>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium text-blue-800 mb-1">Total Feedback</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-2">
            Feedback from all response types
          </p>
        </div>
        
        <div className="p-4 border rounded-lg bg-green-50">
          <h3 className="text-lg font-medium text-green-800 mb-1">Helpful Responses</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold">{stats.helpful}</p>
            <p className="text-lg ml-2 mb-1 text-green-600">
              ({stats.helpfulPercentage.toFixed(1)}%)
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Responses rated as helpful by users
          </p>
        </div>
        
        <div className="p-4 border rounded-lg bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-1">Needs Improvement</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold">{stats.unhelpful}</p>
            <p className="text-lg ml-2 mb-1 text-red-600">
              ({(100 - stats.helpfulPercentage).toFixed(1)}%)
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Responses rated as unhelpful by users
          </p>
        </div>
      </div>
      
      {/* Feedback by Response Type */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Feedback by Response Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.typeStats.map(typeStat => (
            <div key={typeStat.type} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 capitalize">{typeStat.type}</h4>
              <div className="flex justify-between text-sm mb-1">
                <span>Helpful Rate:</span>
                <span className="font-medium">{typeStat.helpfulPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    typeStat.helpfulPercentage >= 80 ? 'bg-green-500' :
                    typeStat.helpfulPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${typeStat.helpfulPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Based on {typeStat.total} responses
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Feedback */}
      <div>
        <h3 className="font-bold mb-3">Recent Feedback</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedback.slice(-10).reverse().map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {entry.responseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.feedback === 'helpful' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        👍 Helpful
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        👎 Unhelpful
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}