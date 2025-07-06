/**
 * QualityMonitor component
 * 
 * Displays AI response quality analytics and monitoring data
 */

import React, { useState, useEffect } from 'react';
import {
  getQualityAnalytics,
  clearQualityLogs
} from '@/lib/responseMonitoring';

interface QualityData {
  total: number;
  withIssues: number;
  qualityScore: number;
  recentEvents: Array<{
    responseType: string;
    eventType: string;
    responseLength: number;
    timestamp: number;
    hasIssues: boolean;
  }>;
}

export default function QualityMonitor() {
  const [qualityData, setQualityData] = useState<QualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = () => {
    setLoading(true);
    try {
      const data = getQualityAnalytics();
      setQualityData(data);
    } catch (error) {
      console.error('Failed to load quality data:', error);
      setQualityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all quality logs?')) {
      clearQualityLogs();
      setQualityData(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!qualityData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Response Quality Monitor</h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quality Data Available</h3>
          <p className="text-gray-500 mb-4">
            Start using the AI features to generate quality monitoring data.
          </p>
          <button 
            onClick={loadQualityData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Response Quality Monitor</h2>
        <div className="space-x-2">
          <button 
            onClick={loadQualityData}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Refresh
          </button>
          <button 
            onClick={handleClearLogs}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Quality Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Overall Quality Score</h3>
          <div className={`text-3xl font-bold ${
            qualityData.qualityScore >= 80 ? 'text-green-600' :
            qualityData.qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {qualityData.qualityScore}%
          </div>
          <p className="text-sm text-gray-600">
            Based on {qualityData.total} responses
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Quality Responses</h3>
          <div className="text-3xl font-bold text-green-600">
            {qualityData.total - qualityData.withIssues}
          </div>
          <p className="text-sm text-gray-600">
            {Math.round(((qualityData.total - qualityData.withIssues) / qualityData.total) * 100)}% of total
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Issues Detected</h3>
          <div className="text-3xl font-bold text-red-600">
            {qualityData.withIssues}
          </div>
          <p className="text-sm text-gray-600">
            {Math.round((qualityData.withIssues / qualityData.total) * 100)}% of total
          </p>
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h3 className="text-lg font-medium mb-3">Recent Quality Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qualityData.recentEvents.map((event, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 capitalize">{event.responseType}</td>
                  <td className="px-4 py-3">{event.eventType || 'general'}</td>
                  <td className="px-4 py-3">{event.responseLength} chars</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.hasIssues 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.hasIssues ? 'Issues' : 'Clean'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {qualityData.recentEvents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No recent events to display
          </div>
        )}
      </div>
    </div>
  );
}