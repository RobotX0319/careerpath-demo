'use client';

/**
 * useNetworkStatus Hook
 * 
 * Monitors network connectivity status and connection quality
 */

import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  connectionQuality: 'slow' | 'good' | 'fast' | 'unknown';
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
}

export default function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionQuality: 'unknown'
  });
  
  useEffect(() => {
    // Update online status
    const updateOnlineStatus = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };
    
    // Update connection info
    const updateConnectionInfo = () => {
      // Check if browser supports Network Information API
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        let quality: 'slow' | 'good' | 'fast' = 'good';
        
        // Determine connection quality based on effective type
        switch (connection.effectiveType) {
          case 'slow-2g':
          case '2g':
            quality = 'slow';
            break;
          case '3g':
            quality = 'good';
            break;
          case '4g':
            quality = 'fast';
            break;
          default:
            quality = 'good';
        }
        
        setNetworkStatus(prev => ({
          ...prev,
          connectionQuality: quality,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          rtt: connection.rtt
        }));
      } else {
        // Fallback: estimate connection quality using RTT
        estimateConnectionQuality();
      }
    };
    
    // Estimate connection quality using ping-like approach
    const estimateConnectionQuality = async () => {
      try {
        const startTime = performance.now();
        
        // Try to fetch a small resource
        await fetch('/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        const endTime = performance.now();
        const rtt = endTime - startTime;
        
        let quality: 'slow' | 'good' | 'fast' = 'good';
        
        if (rtt > 1000) {
          quality = 'slow';
        } else if (rtt < 200) {
          quality = 'fast';
        }
        
        setNetworkStatus(prev => ({
          ...prev,
          connectionQuality: quality,
          rtt: Math.round(rtt)
        }));
      } catch (error) {
        console.warn('Failed to estimate connection quality:', error);
        setNetworkStatus(prev => ({
          ...prev,
          connectionQuality: 'unknown'
        }));
      }
    };
    
    // Set up event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Set up connection change listener if available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }
    
    // Initial updates
    updateOnlineStatus();
    updateConnectionInfo();
    
    // Periodic connection quality check
    const qualityCheckInterval = setInterval(() => {
      if (navigator.onLine) {
        updateConnectionInfo();
      }
    }, 30000); // Check every 30 seconds
    
    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
      
      clearInterval(qualityCheckInterval);
    };
  }, []);
  
  return networkStatus;
}