/**
 * QualityMonitor component for administrators
 * Shows statistics about AI response quality
 */

import React, { useState, useEffect } from 'react';
import { 
  getQualityAnalytics, 
  clearQualityLogs 
} from '@/lib/responseMonitoring';

export default function QualityMonitor() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  // Refresh analytics data
  function loadAnalytics() {
    setLoading(true);
    try {
      const data = getQualityAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error('Error loading analytics:', e);
    } finally {
      setLoading(false);
    }
  }
  
  // Clear logs and reload
  function handleClearLogs() {
    if (confirm('Are you sure you want to clear all quality logs?')) {
      clearQualityLogs();
      loadAnalytics();
    }
  }
  
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading analytics data...</p>
      </div>
    );
  }
  
  // Handle case with no data
  if (!analytics || analytics.totalResponses === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Response Quality Analytics</h2>
        <div className="p-4 bg-gray-100 rounded text-gray-700 text-center">
          No response quality data available yet.
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Response Quality Analytics</h2>
        <div className="space-x-2">
          <button 
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Refresh
          </button>
          <button 
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear Logs
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Overall Stats */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Overall Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Responses:</span>
              <span className="font-bold">{analytics.totalResponses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valid Responses:</span>
              <span className="font-bold">{analytics.validPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score:</span>
              <span className="font-bold">{analytics.avgScore.toFixed(1)}/100</span>
            </div>
          </div>
        </div>
        
        {/* Quality Score */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800 mb-2">Quality Score</h3>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
                  analytics.avgScore > 80 ? 'bg-green-500' : 
                  analytics.avgScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analytics.avgScore}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-center font-medium">
              {analytics.avgScore.toFixed(1)}%
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {analytics.avgScore > 80 ? 'Great quality responses!' : 
             analytics.avgScore > 60 ? 'Good responses with some issues' : 'Responses need improvement'}
          </div>
        </div>
        
        {/* Response Types */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800 mb-2">Response Types</h3>
          {analytics.statsByType && Object.keys(analytics.statsByType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(analytics.statsByType).map(([type, stats]: [string, any]) => (
                <div key={type} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">{type}:</span>
                    <span>{stats.count} responses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${stats.validPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {stats.validPercentage.toFixed(1)}% valid, score: {stats.avgScore.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No type data available</p>
          )}
        </div>
      </div>
      
      {/* Common Issues */}
      {analytics.topIssues && analytics.topIssues.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-3">Most Common Issues</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Responses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topIssues.map((issue: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{issue.issue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Recent Logs */}
      {analytics.recentLogs && analytics.recentLogs.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Recent Responses</h3>
          <div className="bg-gray-50 p-3 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Score</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Issues</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentLogs.map((log: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-sm capitalize">{log.requestType}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        log.qualityScore > 80 ? 'bg-green-100 text-green-800' :
                        log.qualityScore > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.qualityScore}/100
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {log.issues.length > 0 ? (
                        <span className="text-red-600">
                          {log.issues.slice(0, 2).join(', ')}
                          {log.issues.length > 2 && '...'}
                        </span>
                      ) : (
                        <span className="text-green-600">None</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}