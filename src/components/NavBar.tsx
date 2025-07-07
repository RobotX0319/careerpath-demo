'use client';

/**
 * NavBar Component
 * 
 * Main navigation component
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import UserAvatar from '@/components/auth/UserAvatar';

export default function NavBar() {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', authRequired: true },
    { href: '/careers', label: 'Karyeralar', authRequired: false },
    { href: '/test', label: 'Test', authRequired: false },
    { href: '/progress', label: 'Progress', authRequired: true },
    { href: '/results', label: 'Natijalar', authRequired: true },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    !item.authRequired || (item.authRequired && isAuthenticated)
  );
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">CareerPath</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Notifications */}
            {isAuthenticated && (
              <Link href="/notifications" className="relative">
                <svg className="w-6 h-6 text-gray-600 hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Avatar */}
            <UserAvatar showName={false} size="md" />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {filteredNavItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                  >
                    <span onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
              
              {isAuthenticated && (
                <div>
                  <Link
                    href="/notifications"
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium flex items-center"
                  >
                    <span onClick={() => setMobileMenuOpen(false)} className="flex items-center w-full">
                      Bildirishnomalar
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </div>
              )}
              
              <div className="px-4 py-2">
                <UserAvatar showName={true} size="md" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}