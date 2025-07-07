'use client';

/**
 * OfflineNotification Component
 * 
 * Shows user-friendly offline/online status notifications
 */

import React, { useState, useEffect } from 'react';
import useNetworkStatus from '@/hooks/useNetworkStatus';

export default function OfflineNotification() {
  const { isOnline, connectionQuality } = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  
  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      // Show "back online" notification briefly
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        setWasOffline(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);
  
  if (!showNotification) {
    return null;
  }
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`
        px-4 py-3 rounded-lg shadow-lg border max-w-sm mx-auto
        transition-all duration-300 ease-in-out
        ${!isOnline 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-green-50 border-green-200 text-green-800'
        }
      `}>
        <div className="flex items-center">
          <div className={`
            w-2 h-2 rounded-full mr-3
            ${!isOnline ? 'bg-red-500' : 'bg-green-500'}
          `}></div>
          
          <div className="flex-1">
            {!isOnline ? (
              <div>
                <p className="font-medium">Internetga ulanish yo'q</p>
                <p className="text-sm">Ma'lumotlar qurilmada saqlanadi</p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Aloqa tiklandi</p>
                <p className="text-sm">
                  {connectionQuality === 'slow' && 'Sekin ulanish'}
                  {connectionQuality === 'good' && 'Yaxshi ulanish'}
                  {connectionQuality === 'fast' && 'Tez ulanish'}
                  {connectionQuality === 'unknown' && 'Ulanish tiklandi'}
                </p>
              </div>
            )}
          </div>
          
          {isOnline && (
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}