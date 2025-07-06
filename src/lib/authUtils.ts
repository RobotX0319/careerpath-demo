/**
 * Authentication utility functions
 * 
 * Provides components and functions for authentication and
 * protecting admin-only routes in the application
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Simple in-memory authentication state
let isAuthenticated = false;

/**
 * Set authentication state
 */
export function setAuthenticated(value: boolean): void {
  isAuthenticated = value;
  
  // Store in localStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('careerpath_admin_auth', 'true');
    } else {
      localStorage.removeItem('careerpath_admin_auth');
    }
  }
}

/**
 * Check if user is authenticated
 */
export function checkAuthenticated(): boolean {
  // Check localStorage first (for persistence)
  if (typeof window !== 'undefined' && localStorage.getItem('careerpath_admin_auth') === 'true') {
    isAuthenticated = true;
  }
  
  return isAuthenticated;
}

/**
 * Login function
 */
export function login(username: string, password: string): boolean {
  // This is a simple demo authentication
  // In a real app, this would validate against a backend
  if (username === 'admin' && password === 'careerpath123') {
    setAuthenticated(true);
    return true;
  }
  return false;
}

/**
 * Logout function
 */
export function logout(): void {
  setAuthenticated(false);
}

/**
 * Higher-order component to protect admin routes
 */
export function withAuthProtection(WrappedComponent: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    
    useEffect(() => {
      // Check authentication
      const authenticated = checkAuthenticated();
      if (!authenticated) {
        // Redirect to login if not authenticated
        router.replace('/admin/login');
      } else {
        setIsAuth(true);
        setLoading(false);
      }
    }, [router]);
    
    if (loading) {
      // Show loading state while checking authentication
      return React.createElement('div', 
        { 
          className: "flex justify-center items-center h-screen",
          style: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }
        },
        React.createElement('div', 
          { 
            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500",
            style: {
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              animation: 'spin 1s linear infinite'
            }
          }
        )
      );
    }
    
    if (!isAuth) {
      return null;
    }
    
    // Render protected component if authenticated
    return React.createElement(WrappedComponent, props);
  };
}