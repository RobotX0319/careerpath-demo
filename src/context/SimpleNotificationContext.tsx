'use client';
/**
 * Simple NotificationContext for demo
 */
import React, { createContext, useContext } from 'react';
import { useNotifications as useNotificationsHook } from '@/hooks/useNotifications';

const NotificationContext = createContext<ReturnType<typeof useNotificationsHook> | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotificationsHook();
  
  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}