'use client';

/**
 * Performance Monitor Component
 * 
 * Monitors and visualizes web performance metrics for development
 */

import React, { useEffect, useState } from 'react';
import { 
  initPerformanceMonitoring,
  getPerformanceMetrics,
  checkPerformanceStatus
} from '@/utils/performanceMonitoring';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
}

export default function PerformanceMonitor({ showInProduction = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<ReturnType<typeof getPerformanceMetrics>>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    TTI: null,
    INP: null,
  });
  
  const [status, setStatus] = useState<ReturnType<typeof checkPerformanceStatus>>({
    status: 'good',
    issues: [],
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Only show in development or if explicitly enabled in production
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldShow = !isProduction || showInProduction;
  
  useEffect(() => {
    if (!shouldShow) return;
    
    initPerformanceMonitoring();
    
    // Update metrics periodically
    const intervalId = setInterval(() => {
      const currentMetrics = getPerformanceMetrics();
      setMetrics(currentMetrics);
      
      const performanceStatus = checkPerformanceStatus();
      setStatus(performanceStatus);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [shouldShow]);
  
  if (!shouldShow) {
    return null;
  }
  
  // Format metric value for display
  const formatMetric = (value: number | null, isTime = true): string => {
    if (value === null) return 'N/A';
    if (isTime) {
      return `${Math.round(value)}ms`;
    }
    return value.toFixed(3);
  };
  
  // Get color based on metric and its value
  const getMetricColor = (metric: string, value: number | null): string => {
    if (value === null) return 'text-gray-400';
    
    switch (metric) {
      case 'LCP':
        return value > 4000 ? 'text-red-500' : value > 2500 ? 'text-yellow-500' : 'text-green-500';
      case 'FID':
        return value > 300 ? 'text-red-500' : value > 100 ? 'text-yellow-500' : 'text-green-500';
      case 'CLS':
        return value > 0.25 ? 'text-red-500' : value > 0.1 ? 'text-yellow-500' : 'text-green-500';
      case 'FCP':
        return value > 2000 ? 'text-red-500' : value > 1000 ? 'text-yellow-500' : 'text-green-500';
      case 'TTFB':
        return value > 800 ? 'text-red-500' : value > 400 ? 'text-yellow-500' : 'text-green-500';
      case 'INP':
        return value > 500 ? 'text-red-500' : value > 200 ? 'text-yellow-500' : 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`
        bg-white border border-gray-200 rounded-lg shadow-lg p-3
        transition-all duration-300
        ${isExpanded ? 'w-80' : 'w-auto'}
      `}>
        <div className="flex items-center justify-between mb-2">
          <button
            className="flex items-center text-sm font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className={`w-3 h-3 rounded-full mr-2 ${status.status === 'good' ? 'bg-green-500' : status.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            Performance {isExpanded ? 'Metrics' : ''}
          </button>
          
          {isExpanded && (
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsExpanded(false)}
              aria-label="Close performance monitor"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {isExpanded && (
          <>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">LCP:</span>
                  <span className={getMetricColor('LCP', metrics.LCP)}>
                    {formatMetric(metrics.LCP)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">FID:</span>
                  <span className={getMetricColor('FID', metrics.FID)}>
                    {formatMetric(metrics.FID)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">CLS:</span>
                  <span className={getMetricColor('CLS', metrics.CLS)}>
                    {formatMetric(metrics.CLS, false)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">FCP:</span>
                  <span className={getMetricColor('FCP', metrics.FCP)}>
                    {formatMetric(metrics.FCP)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">TTFB:</span>
                  <span className={getMetricColor('TTFB', metrics.TTFB)}>
                    {formatMetric(metrics.TTFB)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">INP:</span>
                  <span className={getMetricColor('INP', metrics.INP)}>
                    {formatMetric(metrics.INP)}
                  </span>
                </div>
              </div>
              
              {status.issues.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">Muammolar:</p>
                  <ul className="text-xs text-red-500 space-y-1 ml-2">
                    {status.issues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
              Dev mode only. Next.js {process.env.NEXT_PUBLIC_VERSION || ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
}