/**
 * Date Utilities
 * 
 * Helper functions for date formatting and manipulation
 */

/**
 * Format a timestamp to display how long ago it happened
 * E.g., "2 minutes ago", "3 hours ago", "yesterday", etc.
 */
export function formatDistanceToNow(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return years === 1 ? '1 yil oldin' : `${years} yil oldin`;
  }
  
  if (months > 0) {
    return months === 1 ? '1 oy oldin' : `${months} oy oldin`;
  }
  
  if (days > 0) {
    if (days === 1) return 'kecha';
    if (days < 7) return `${days} kun oldin`;
    
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 hafta oldin' : `${weeks} hafta oldin`;
  }
  
  if (hours > 0) {
    return hours === 1 ? '1 soat oldin' : `${hours} soat oldin`;
  }
  
  if (minutes > 0) {
    return minutes === 1 ? '1 daqiqa oldin' : `${minutes} daqiqa oldin`;
  }
  
  return seconds <= 10 ? 'hozirgina' : `${seconds} sekund oldin`;
}

/**
 * Format a date to a readable string in Uzbek
 * E.g., "12 May, 2023"
 */
export function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  // Uzbek month names
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${month}, ${year}`;
}

/**
 * Format a date to a short date string
 * E.g., "12/05/2023"
 */
export function formatShortDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format a date to include time
 * E.g., "12 May, 2023 15:30"
 */
export function formatDateTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  const formattedDate = formatDate(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${formattedDate} ${hours}:${minutes}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  
  return d.getTime() < now.getTime();
}

/**
 * Calculate days remaining until a date
 */
export function daysUntil(date: Date | number): number {
  const d = typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  
  // Reset hours to compare just dates
  const targetDate = new Date(d);
  targetDate.setHours(0, 0, 0, 0);
  
  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}