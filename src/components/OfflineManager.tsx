'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Make this component client-only to avoid SSR issues
const OfflineManagerClient = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      console.log('Internet connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Internet connection lost');
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything during SSR or until mounted
  if (!isMounted || typeof window === 'undefined') {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
        <span className="text-sm">
          🌐 Internet aloqasi yo'q. Offline rejimda ishlayapman.
        </span>
      </div>
    );
  }

  return null;
};

// Export with dynamic import to make it completely client-side
export default dynamic(() => Promise.resolve(OfflineManagerClient), {
  ssr: false
});