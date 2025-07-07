/**
 * Simple authentication utilities
 * Uses localStorage for demo purposes with SSR safety
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Authentication state
const AUTH_KEY = 'careerpath_admin_auth';

/**
 * Login function
 */
export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'careerpath123') {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch (e) {
        console.error('Failed to save auth state:', e);
      }
    }
    return true;
  }
  return false;
}

/**
 * Logout function
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error('Failed to remove auth state:', e);
    }
  }
}

/**
 * Check authentication status
 */
export function checkAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
      console.error('Failed to check auth state:', e);
      return false;
    }
  }
  return false;
}

/**
 * Higher-order component for authentication protection
 */
export function withAuthProtection(WrappedComponent: any) {
  return function AuthProtectedComponent(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        // Only check auth on client side
        if (typeof window !== 'undefined') {
          const authStatus = checkAuthenticated();
          if (!authStatus) {
            router.replace('/admin/login');
          } else {
            setIsAuthenticated(true);
          }
        }
        setIsLoading(false);
      };

      // Small delay to ensure client-side hydration
      const timer = setTimeout(checkAuth, 100);
      return () => clearTimeout(timer);
    }, [router]);

    // Show loading on server and during hydration
    if (isLoading) {
      const loadingStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif'
      };

      return React.createElement('div', { style: loadingStyles }, 'Loading...');
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };
}