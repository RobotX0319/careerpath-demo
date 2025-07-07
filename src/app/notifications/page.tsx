'use client';

/**
 * Notifications Page
 * 
 * User notifications and alerts
 */

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';

// Dynamic import for the notifications content to avoid SSR issues
const NotificationsContent = dynamic(() => Promise.resolve(() => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      message: 'Yangi karyera imkoniyati mavjud!',
      type: 'info' as const,
      timestamp: Date.now() - 3600000, // 1 hour ago
      read: false
    },
    {
      id: '2', 
      message: 'Shaxsiyat testini yakunlang',
      type: 'warning' as const,
      timestamp: Date.now() - 7200000, // 2 hours ago
      read: false
    },
    {
      id: '3',
      message: 'Profil ma\'lumotlaringiz yangilandi',
      type: 'success' as const,
      timestamp: Date.now() - 86400000, // 1 day ago
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} daqiqa oldin`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} soat oldin`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days} kun oldin`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bildirishnomalar</h1>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              Barchasini o'chirish
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Hech qanday bildirishnoma yo'q
            </h2>
            <p className="text-gray-500">
              Yangi bildirishnomalar bu yerda ko'rinadi
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-2 ${getTypeColor(notification.type)} ${
                  notification.read ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">
                      {getTypeIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <p className={`text-gray-900 ${notification.read ? 'opacity-75' : 'font-semibold'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        O'qildi
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-sm text-red-600 hover:text-red-800 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Bildirishnomalar</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
});

export default function NotificationsPage() {
  return <NotificationsContent />;
}