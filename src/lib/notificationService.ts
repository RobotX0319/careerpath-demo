/**
 * Notification Service
 * 
 * Manages user notifications, progress tracking, and recommendations
 */

import { getUserProfile } from '@/lib/authService';
import { UserProfile } from '@/types/index';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'progress' | 'recommendation';
  isRead: boolean;
  createdAt: number;
  expiresAt?: number;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
}

export interface ProgressItem {
  id: string;
  userId: string;
  category: string;
  title: string;
  description?: string;
  completed: boolean;
  progress: number; // 0-100
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  dependencies?: string[]; // IDs of other progress items this depends on
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  deadline?: number;
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
  createdAt: number;
  updatedAt: number;
  steps?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  category: 'career' | 'education' | 'skills' | 'personal';
  priority: 'low' | 'medium' | 'high';
}

// Storage keys
const NOTIFICATIONS_KEY = 'career_path_notifications';
const PROGRESS_ITEMS_KEY = 'career_path_progress';
const GOALS_KEY = 'career_path_goals';

// Helper to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Notifications
 */

// Get all notifications for a user
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = notificationsData 
      ? JSON.parse(notificationsData) 
      : [];
    
    // Filter notifications for this user
    return allNotifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt); // Most recent first
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
}

// Add a new notification
export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
  if (typeof window === 'undefined') {
    throw new Error('Only available in browser environment');
  }
  
  try {
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = notificationsData 
      ? JSON.parse(notificationsData) 
      : [];
    
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: Date.now(),
      isRead: false
    };
    
    allNotifications.push(newNotification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
    
    // Send browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/logo.png'
      });
    }
    
    return newNotification;
  } catch (error) {
    console.error('Failed to add notification:', error);
    throw new Error('Failed to add notification');
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = notificationsData 
      ? JSON.parse(notificationsData) 
      : [];
    
    const updatedNotifications = allNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
}

// Delete notification
export async function deleteNotification(notificationId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Notification[] = notificationsData 
      ? JSON.parse(notificationsData) 
      : [];
    
    const updatedNotifications = allNotifications.filter(
      notification => notification.id !== notificationId
    );
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
}

// Generate recommendation notifications based on user profile
export async function generateRecommendations(userId: string): Promise<Notification[]> {
  // Get user profile
  const userProfile = await getUserProfile(userId);
  if (!userProfile) return [];
  
  const recommendations: Omit<Notification, 'id' | 'createdAt' | 'isRead'>[] = [];
  
  // Check if user has personality scores
  if (!userProfile.personalityScores) {
    recommendations.push({
      userId,
      title: 'Shaxsiyat testini topshiring',
      message: 'Sizga mos kasblarni aniqlash uchun shaxsiyat testini topshiring.',
      type: 'recommendation',
      actionUrl: '/test',
      actionText: 'Testni boshlash',
      icon: 'test'
    });
  }
  
  // Check if user has added skills
  if (!userProfile.skills || userProfile.skills.length < 3) {
    recommendations.push({
      userId,
      title: 'Ko\'nikmalaringizni qo\'shing',
      message: 'Profilingizni to\'ldirish va yaxshiroq tavsiyalar olish uchun ko\'nikmalaringizni qo\'shing.',
      type: 'recommendation',
      actionUrl: '/profile',
      actionText: 'Ko\'nikmalar qo\'shish',
      icon: 'skills'
    });
  }
  
  // Add educational resources based on profile
  if (userProfile.personalityScores?.openness && userProfile.personalityScores.openness > 70) {
    recommendations.push({
      userId,
      title: 'Ijodiy kurslar',
      message: 'Yuqori ochiqlik ko\'rsatkichingizga asoslanib, ijodiy kurslarga qiziqishingiz mumkin.',
      type: 'recommendation',
      actionUrl: '/resources',
      actionText: 'Kurslarni ko\'rish',
      icon: 'education'
    });
  }
  
  // Add recommendations for each item
  for (const recommendation of recommendations) {
    await addNotification(recommendation);
  }
  
  return await getUserNotifications(userId);
}

/**
 * Progress Tracking
 */

// Get progress items for a user
export async function getUserProgressItems(userId: string): Promise<ProgressItem[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const progressData = localStorage.getItem(PROGRESS_ITEMS_KEY);
    const allProgressItems: ProgressItem[] = progressData 
      ? JSON.parse(progressData) 
      : [];
    
    // Filter progress items for this user
    return allProgressItems
      .filter(item => item.userId === userId)
      .sort((a, b) => a.createdAt - b.createdAt);
  } catch (error) {
    console.error('Failed to get progress items:', error);
    return [];
  }
}

// Add a new progress item
export async function addProgressItem(item: Omit<ProgressItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProgressItem> {
  if (typeof window === 'undefined') {
    throw new Error('Only available in browser environment');
  }
  
  try {
    const progressData = localStorage.getItem(PROGRESS_ITEMS_KEY);
    const allProgressItems: ProgressItem[] = progressData 
      ? JSON.parse(progressData) 
      : [];
    
    const now = Date.now();
    const newItem: ProgressItem = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    allProgressItems.push(newItem);
    localStorage.setItem(PROGRESS_ITEMS_KEY, JSON.stringify(allProgressItems));
    
    return newItem;
  } catch (error) {
    console.error('Failed to add progress item:', error);
    throw new Error('Failed to add progress item');
  }
}

// Update a progress item
export async function updateProgressItem(itemId: string, updates: Partial<ProgressItem>): Promise<ProgressItem> {
  if (typeof window === 'undefined') {
    throw new Error('Only available in browser environment');
  }
  
  try {
    const progressData = localStorage.getItem(PROGRESS_ITEMS_KEY);
    const allProgressItems: ProgressItem[] = progressData 
      ? JSON.parse(progressData) 
      : [];
    
    const itemIndex = allProgressItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Progress item not found');
    }
    
    // Update item with new data
    const updatedItem: ProgressItem = {
      ...allProgressItems[itemIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    allProgressItems[itemIndex] = updatedItem;
    localStorage.setItem(PROGRESS_ITEMS_KEY, JSON.stringify(allProgressItems));
    
    // Create notification for completed items
    if (updates.completed && !allProgressItems[itemIndex].completed) {
      await addNotification({
        userId: updatedItem.userId,
        title: 'Progress yangilandi',
        message: `Tabriklaymiz! "${updatedItem.title}" ni muvaffaqiyatli yakunladingiz.`,
        type: 'success'
      });
    }
    
    return updatedItem;
  } catch (error) {
    console.error('Failed to update progress item:', error);
    throw new Error('Failed to update progress item');
  }
}

// Delete a progress item
export async function deleteProgressItem(itemId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const progressData = localStorage.getItem(PROGRESS_ITEMS_KEY);
    const allProgressItems: ProgressItem[] = progressData 
      ? JSON.parse(progressData) 
      : [];
    
    const updatedItems = allProgressItems.filter(item => item.id !== itemId);
    localStorage.setItem(PROGRESS_ITEMS_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to delete progress item:', error);
  }
}

/**
 * Goals Management
 */

// Get goals for a user
export async function getUserGoals(userId: string): Promise<Goal[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const goalsData = localStorage.getItem(GOALS_KEY);
    const allGoals: Goal[] = goalsData ? JSON.parse(goalsData) : [];
    
    // Filter goals for this user
    return allGoals
      .filter(goal => goal.userId === userId)
      .sort((a, b) => {
        // Sort by status priority
        const statusOrder: Record<string, number> = {
          'in-progress': 1,
          'planned': 2,
          'paused': 3,
          'completed': 4
        };
        
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        
        // Then by deadline if available
        if (a.deadline && b.deadline) {
          return a.deadline - b.deadline;
        }
        
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        
        // Finally by creation date
        return a.createdAt - b.createdAt;
      });
  } catch (error) {
    console.error('Failed to get goals:', error);
    return [];
  }
}

// Add a new goal
export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
  if (typeof window === 'undefined') {
    throw new Error('Only available in browser environment');
  }
  
  try {
    const goalsData = localStorage.getItem(GOALS_KEY);
    const allGoals: Goal[] = goalsData ? JSON.parse(goalsData) : [];
    
    const now = Date.now();
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    allGoals.push(newGoal);
    localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
    
    // Create notification for new goal
    await addNotification({
      userId: goal.userId,
      title: 'Yangi maqsad qo\'shildi',
      message: `"${goal.title}" maqsadingiz muvaffaqiyatli qo'shildi.`,
      type: 'info',
      actionUrl: '/goals',
      actionText: 'Maqsadlarni ko\'rish',
      icon: 'goal'
    });
    
    return newGoal;
  } catch (error) {
    console.error('Failed to add goal:', error);
    throw new Error('Failed to add goal');
  }
}

// Update a goal
export async function updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
  if (typeof window === 'undefined') {
    throw new Error('Only available in browser environment');
  }
  
  try {
    const goalsData = localStorage.getItem(GOALS_KEY);
    const allGoals: Goal[] = goalsData ? JSON.parse(goalsData) : [];
    
    const goalIndex = allGoals.findIndex(goal => goal.id === goalId);
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    // Get current state for comparison
    const currentGoal = allGoals[goalIndex];
    
    // Update goal with new data
    const updatedGoal: Goal = {
      ...currentGoal,
      ...updates,
      updatedAt: Date.now()
    };
    
    allGoals[goalIndex] = updatedGoal;
    localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
    
    // Check if status changed to completed
    if (updates.status === 'completed' && currentGoal.status !== 'completed') {
      await addNotification({
        userId: updatedGoal.userId,
        title: 'Maqsadga erishildi',
        message: `Tabriklaymiz! "${updatedGoal.title}" maqsadiga erishdingiz.`,
        type: 'success',
        icon: 'goal-complete'
      });
    }
    
    // Check if progress significantly improved
    if (updates.progress && updates.progress > currentGoal.progress + 25) {
      await addNotification({
        userId: updatedGoal.userId,
        title: 'Progress yangilandi',
        message: `"${updatedGoal.title}" bo'yicha sezilarli progress yaratdingiz!`,
        type: 'progress',
        actionUrl: '/goals',
        actionText: 'Ko\'rish'
      });
    }
    
    return updatedGoal;
  } catch (error) {
    console.error('Failed to update goal:', error);
    throw new Error('Failed to update goal');
  }
}

// Delete a goal
export async function deleteGoal(goalId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const goalsData = localStorage.getItem(GOALS_KEY);
    const allGoals: Goal[] = goalsData ? JSON.parse(goalsData) : [];
    
    const updatedGoals = allGoals.filter(goal => goal.id !== goalId);
    localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
  } catch (error) {
    console.error('Failed to delete goal:', error);
  }
}

// Generate default progress items for a new user
export async function generateDefaultProgressItems(userId: string): Promise<void> {
  const defaultItems = [
    {
      userId,
      category: 'onboarding',
      title: 'Profilni to\'ldirish',
      description: 'Shaxsiy ma\'lumotlaringizni kiriting va profilingizni to\'ldiring.',
      completed: false,
      progress: 0,
    },
    {
      userId,
      category: 'assessment',
      title: 'Shaxsiyat testini topshirish',
      description: 'O\'zingizning shaxsiy xususiyatlaringizni aniqlash uchun testni topshiring.',
      completed: false,
      progress: 0,
    },
    {
      userId,
      category: 'skills',
      title: 'Ko\'nikmalarni kiritish',
      description: 'Mavjud ko\'nikmalaringizni profilga kiriting.',
      completed: false,
      progress: 0,
    },
    {
      userId,
      category: 'goals',
      title: 'Karyera maqsadini belgilash',
      description: 'Kelajakdagi karyera maqsadlaringizni aniqlab, belgilab oling.',
      completed: false,
      progress: 0,
    }
  ];
  
  for (const item of defaultItems) {
    await addProgressItem(item);
  }
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}