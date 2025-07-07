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
    // Return safe default implementation for SSR
    console.warn('useNotifications used outside of NotificationProvider, returning defaults');
    return {
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearNotifications: () => {},
      markAsRead: async () => {},
      deleteNotification: async () => {},
      goals: [],
      progressItems: [],
      isLoading: false
    };
  }
  return context;
}