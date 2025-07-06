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
export function withAuthProtection<P>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      // Check authentication
      if (!checkAuthenticated()) {
        // Redirect to login if not authenticated
        router.replace('/admin/login');
      } else {
        setLoading(false);
      }
    }, [router]);
    
    if (loading) {
      // Show loading state while checking authentication
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    // Render protected component if authenticated
    return <Component {...props} />;
  };
}