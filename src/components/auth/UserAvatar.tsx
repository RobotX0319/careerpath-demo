'use client';

/**
 * UserAvatar Component
 * 
 * Displays user avatar with optional dropdown menu
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface UserAvatarProps {
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ 
  showName = false, 
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Avatar dimensions based on size
  const dimensions = {
    sm: 32,
    md: 40,
    lg: 56
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };
  
  // If not authenticated, show login/signup buttons
  if (!isAuthenticated) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link 
          href="/auth/login"
          className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Kirish
        </Link>
        <Link 
          href="/auth/register"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          Ro'yxatdan o'tish
        </Link>
      </div>
    );
  }
  
  // Generate avatar text from name (first letter of first and last name)
  const getInitials = () => {
    if (!user?.displayName) return '?';
    
    const nameParts = user.displayName.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div 
          className="rounded-full overflow-hidden flex items-center justify-center text-white font-medium bg-blue-600"
          style={{ 
            width: dimensions[size], 
            height: dimensions[size],
            fontSize: size === 'lg' ? '1.25rem' : size === 'md' ? '1rem' : '0.875rem'
          }}
        >
          {getInitials()}
        </div>
        
        {showName && (
          <span className="font-medium">
            {user?.displayName || 'Foydalanuvchi'}
          </span>
        )}
        
        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            dropdownOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      
      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            
            <div onClick={() => setDropdownOpen(false)}>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mening profilim
              </Link>
            </div>
            
            <div onClick={() => setDropdownOpen(false)}>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sozlamalar
              </Link>
            </div>
            
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Chiqish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}