'use client';

/**
 * Authentication Context
 * 
 * Manages authentication state across the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Firebase types
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  personalityScores?: PersonalityScores;
  skills?: string[];
  createdAt?: string;
  completedTests?: string[];
  careerMatches?: Array<{
    career: string;
    score: number;
  }>;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {}
});

/**
 * AuthProvider component for wrapping the app with authentication context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Mock auth state - replace with real Firebase auth
        const mockUser: User = {
          uid: 'mock-user-id',
          email: 'user@example.com',
          displayName: 'Test User'
        };
        
        const mockProfile: UserProfile = {
          uid: mockUser.uid,
          email: mockUser.email!,
          displayName: mockUser.displayName || undefined,
          personalityScores: {
            openness: 7,
            conscientiousness: 8,
            extraversion: 6,
            agreeableness: 9,
            neuroticism: 4
          },
          skills: ['JavaScript', 'React', 'TypeScript'],
          createdAt: new Date().toISOString(),
          completedTests: ['personality-test'],
          careerMatches: [
            { career: 'Frontend Developer', score: 92 },
            { career: 'UI/UX Designer', score: 85 },
            { career: 'Product Manager', score: 78 }
          ]
        };

        setTimeout(() => {
          setUser(mockUser);
          setProfile(mockProfile);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  /**
   * Login handler
   */
  const login = async (email: string, password: string) => {
    // Mock login implementation
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      uid: 'user-123',
      email,
      displayName: 'User'
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };

  /**
   * Register handler
   */
  const register = async (email: string, password: string, displayName: string) => {
    // Mock register implementation
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      uid: 'new-user-123',
      email,
      displayName
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    setUser(null);
    setProfile(null);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...data });
    }
  };

  const isAuthenticated = !!user;

  // Prepare context value
  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for using auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}