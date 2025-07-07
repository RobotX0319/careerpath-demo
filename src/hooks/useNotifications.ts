/**
 * Missing hook for notifications
 */

import { useState, useEffect } from 'react';

// Mock notification types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: number;
}

interface Goal {
  id: string;
  title: string;
  status: 'planned' | 'in-progress' | 'completed';
  progress: number;
}

interface ProgressItem {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          title: 'Xush kelibsiz!',
          message: 'CareerPath platformasiga xush kelibsiz',
          type: 'info',
          isRead: false,
          createdAt: Date.now()
        }
      ]);
      
      setGoals([
        {
          id: '1',
          title: 'JavaScript o\'rganish',
          status: 'in-progress',
          progress: 65
        }
      ]);
      
      setProgressItems([
        {
          id: '1',
          title: 'Resume yaratish',
          completed: false,
          progress: 30
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  return {
    notifications,
    goals,
    progressItems,
    isLoading,
    markAsRead,
    deleteNotification
  };
}