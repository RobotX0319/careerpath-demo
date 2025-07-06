/**
 * Simple authentication utilities
 * Uses localStorage for demo purposes
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
      localStorage.setItem(AUTH_KEY, 'true');
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
    localStorage.removeItem(AUTH_KEY);
  }
}

/**
 * Check authentication status
 */
export function checkAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEY) === 'true';
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
        const authStatus = checkAuthenticated();
        if (!authStatus) {
          router.replace('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      const loadingStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      };

      return React.createElement('div', { style: loadingStyles }, 'Loading...');
    }

    if (!isAuthenticated) {
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };
}