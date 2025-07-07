'use client';

/**
 * OfflineManager Component
 * 
 * Manages offline data synchronization and background processes
 */

import React, { useEffect, useState } from 'react';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { syncOfflineData, initOfflineSync } from '@/lib/offlineStorage';
import { useNotifications } from '@/context/NotificationContext';

export default function OfflineManager() {
  const { isOnline } = useNetworkStatus();
  const { addNotification } = useNotifications();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Initialize offline sync on component mount
  useEffect(() => {
    initOfflineSync();
  }, []);
  
  // Handle online/offline status changes
  useEffect(() => {
    const handleSync = async () => {
      if (isOnline && !isSyncing) {
        setIsSyncing(true);
        
        try {
          await syncOfflineData();
          setLastSyncTime(new Date());
          
          addNotification({
            title: 'Ma\'lumotlar sinxronlandi',
            message: 'Offlayn rejimda qilingan o\'zgarishlar server bilan sinxronlandi',
            type: 'success'
          });
        } catch (error) {
          console.error('Sync error:', error);
          
          addNotification({
            title: 'Sinxronlash xatosi',
            message: 'Ma\'lumotlarni sinxronlashda xatolik yuz berdi',
            type: 'error'
          });
        } finally {
          setIsSyncing(false);
        }
      }
    };
    
    // Only sync when coming back online
    if (isOnline) {
      // Small delay to ensure network is stable
      const syncTimeout = setTimeout(handleSync, 2000);
      return () => clearTimeout(syncTimeout);
    }
  }, [isOnline, isSyncing, addNotification]);
  
  // Periodic sync while online (every 5 minutes)
  useEffect(() => {
    if (!isOnline) return;
    
    const syncInterval = setInterval(async () => {
      if (!isSyncing) {
        setIsSyncing(true);
        
        try {
          await syncOfflineData();
          setLastSyncTime(new Date());
        } catch (error) {
          console.error('Background sync error:', error);
        } finally {
          setIsSyncing(false);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(syncInterval);
  }, [isOnline, isSyncing]);
  
  // Listen for page visibility changes to sync when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isOnline && !isSyncing) {
        // Sync when user returns to the tab
        setTimeout(async () => {
          if (isOnline && !isSyncing) {
            setIsSyncing(true);
            
            try {
              await syncOfflineData();
              setLastSyncTime(new Date());
            } catch (error) {
              console.error('Visibility sync error:', error);
            } finally {
              setIsSyncing(false);
            }
          }
        }, 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline, isSyncing]);
  
  // Format last sync time for display
  const formatSyncTime = (time: Date | null): string => {
    if (!time) return 'Hech qachon';
    
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Hozirgina';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} soat oldin`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} kun oldin`;
  };
  
  // This component doesn't render anything visible in production
  // Only shows sync status in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Offline Manager</span>
          <div className={`w-2 h-2 rounded-full ${
            isSyncing ? 'bg-yellow-500 animate-pulse' : 
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
          <div>Sinxronlash: {isSyncing ? 'Jarayonda...' : 'Kutmoqda'}</div>
          <div>Oxirgi sinxronlash: {formatSyncTime(lastSyncTime)}</div>
        </div>
        
        {!isOnline && (
          <div className="mt-2 text-xs text-amber-600">
            Offlayn rejimda ishlayapman. Ma'lumotlar qurilmangizda saqlanadi.
          </div>
        )}
      </div>
    </div>
  );
}