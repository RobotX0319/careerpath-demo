/**
 * DetailedFeedbackView component
 * 
 * Displays detailed feedback from users on AI responses
 * for analysis by administrators
 */

import React, { useState, useEffect } from 'react';

interface DetailedFeedback {
  responseId: string;
  responseType: 'personality' | 'career' | 'chat';
  reason: string;
  comments: string;
  expectation: string;
  timestamp: number;
}

export default function DetailedFeedbackView() {
  const [feedback, setFeedback] = useState<DetailedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDetailedFeedback();
  }, []);
  
  // Load detailed feedback from localStorage
  function loadDetailedFeedback() {
    setLoading(true);
    try {
      const feedbackKey = 'careerpath_detailed_feedback';
      const data = localStorage.getItem(feedbackKey);
      
      if (data) {
        setFeedback(JSON.parse(data));
      } else {
        setFeedback([]);
      }
    } catch (e) {
      console.error('Failed to load detailed feedback:', e);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }
  
  // Clear feedback
  function clearFeedback() {
    if (confirm('Are you sure you want to clear all detailed feedback data?')) {
      localStorage.removeItem('careerpath_detailed_feedback');
      setFeedback([]);
    }
  }
  
  // Get reason display name
  function getReasonLabel(reason: string): string {
    switch (reason) {
      case 'incomplete': return 'To\'liq emas';
      case 'irrelevant': return 'Mos kelmaydi';
      case 'unclear': return 'Tushunarsiz';
      case 'technical': return 'Texnik xato';
      case 'formatting': return 'Formatlash xatosi';
      case 'other': return 'Boshqa';
      default: return reason;
    }
  }
  
  // Group feedback by reason
  const feedbackByReason = React.useMemo(() => {
    const result: Record<string, number> = {};
    
    feedback.forEach(item => {
      if (!result[item.reason]) {
        result[item.reason] = 0;
      }
      result[item.reason]++;
    });
    
    return Object.entries(result)
      .sort(([, a], [, b]) => b - a)
      .map(([reason, count]) => ({ 
        reason, 
        count, 
        percentage: Math.round((count / feedback.length) * 100) 
      }));
  }, [feedback]);
  
  // Group feedback by response type
  const feedbackByType = React.useMemo(() => {
    const result: Record<string, number> = {};
    
    feedback.forEach(item => {
      if (!result[item.responseType]) {
        result[item.responseType] = 0;
      }
      result[item.responseType]++;
    });
    
    return Object.entries(result)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ 
        type, 
        count, 
        percentage: Math.round((count / feedback.length) * 100) 
      }));
  }, [feedback]);
  
  // No data state
  if (!loading && feedback.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Detailed Feedback Analysis</h2>
        <p className="text-gray-500 text-center py-10">
          No detailed feedback data available yet
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Detailed Feedback Analysis</h2>
        <div className="space-x-2">
          <button 
            onClick={loadDetailedFeedback}
            disabled={loading}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={clearFeedback}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear Data
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Feedback by reason */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Feedback by Reason</h3>
          {feedbackByReason.length > 0 ? (
            <div className="space-y-3">
              {feedbackByReason.map(item => (
                <div key={item.reason}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{getReasonLabel(item.reason)}</span>
                    <span>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
        
        {/* Feedback by response type */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Feedback by Response Type</h3>
          {feedbackByType.length > 0 ? (
            <div className="space-y-3">
              {feedbackByType.map(item => (
                <div key={item.type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize">{item.type}</span>
                    <span>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.type === 'personality' ? 'bg-green-600' : 
                        item.type === 'career' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
      </div>
      
      {/* Recent detailed feedback */}
      <div>
        <h3 className="font-medium mb-3">Recent Detailed Feedback</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expectation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedback.slice(0, 10).map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 capitalize">{item.responseType}</td>
                  <td className="px-4 py-3">{getReasonLabel(item.reason)}</td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate">{item.comments}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate">{item.expectation}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
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