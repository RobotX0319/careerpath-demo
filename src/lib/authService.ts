/**
 * Authentication Service
 * 
 * User authentication and session management
 */

import { UserProfile } from '@/types/index';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
  isVerified?: boolean;
  createdAt: number;
}

export interface SessionData {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Mock users database for demo purposes
const USERS_DB_KEY = 'career_path_users';
const CURRENT_SESSION_KEY = 'career_path_session';

// Simple token generation
const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Date.now().toString(36);
};

/**
 * Initialize auth service and check if there's a stored session
 */
export function initAuth(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionData) return null;
    
    const session: SessionData = JSON.parse(sessionData);
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    return null;
  }
}

/**
 * Get all registered users (for demo only)
 */
function getAllUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const usersData = localStorage.getItem(USERS_DB_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

/**
 * Save users to localStorage (for demo only)
 */
function saveUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

/**
 * Find user by email
 */
function findUserByEmail(email: string): AuthUser | undefined {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by ID
 */
function findUserById(id: string): AuthUser | undefined {
  const users = getAllUsers();
  return users.find(user => user.id === id);
}

/**
 * Save current session
 */
function saveSession(session: SessionData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<SessionData> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { email, password } = credentials;
  
  if (!email || !password) {
    throw new Error('Email va parol kiritilishi shart');
  }
  
  // Find user
  const user = findUserByEmail(email);
  
  // In a real app, you'd use bcrypt to compare passwords
  // For demo, we're using a simple comparison
  if (!user || `hashed_${password}` !== user.id.split('_')[1]) {
    throw new Error('Noto\'g\'ri email yoki parol');
  }
  
  // Create session with token that expires in 7 days
  const session: SessionData = {
    user,
    token: generateToken(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  // Save session
  saveSession(session);
  
  return session;
}

/**
 * Sign up new user
 */
export async function signup(data: SignupData): Promise<SessionData> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { name, email, password } = data;
  
  if (!name || !email || !password) {
    throw new Error('Barcha maydonlar to\'ldirilishi shart');
  }
  
  if (password.length < 6) {
    throw new Error('Parol kamida 6 belgidan iborat bo\'lishi kerak');
  }
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
  }
  
  // Create new user
  // In a real app, password would be hashed with bcrypt
  const newUser: AuthUser = {
    id: `user_hashed_${password}_${Date.now()}`,
    email,
    name,
    isVerified: false,
    createdAt: Date.now()
  };
  
  // Save user to "database"
  const users = getAllUsers();
  users.push(newUser);
  saveUsers(users);
  
  // Create session
  const session: SessionData = {
    user: newUser,
    token: generateToken(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  // Save session
  saveSession(session);
  
  return session;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove session
  localStorage.removeItem(CURRENT_SESSION_KEY);
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Foydalanuvchi topilmadi');
  }
  
  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    // Prevent overriding critical fields
    id: users[userIndex].id,
    email: updates.email || users[userIndex].email,
  };
  
  // Save updated users
  saveUsers(users);
  
  // Update current session if it exists
  const currentSession = initAuth();
  if (currentSession && currentSession.user.id === userId) {
    currentSession.user = users[userIndex];
    saveSession(currentSession);
  }
  
  return users[userIndex];
}

/**
 * Get current user profile (including non-auth data)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would fetch the full profile from a database
  // For demo purposes, we'll just use localStorage
  
  if (typeof window === 'undefined') return null;
  
  try {
    // Get basic user info
    const user = findUserById(userId);
    if (!user) return null;
    
    // Get extended profile data
    const profileDataKey = `user_profile_${userId}`;
    const profileData = localStorage.getItem(profileDataKey);
    const extendedData: Partial<UserProfile> = profileData ? JSON.parse(profileData) : {};
    
    return {
      id: userId,
      name: user.name,
      email: user.email,
      ...extendedData
    } as UserProfile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

/**
 * Save user profile data
 */
export async function saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (typeof window === 'undefined') throw new Error('Only available in browser');
  
  try {
    // Get existing profile
    const profileDataKey = `user_profile_${userId}`;
    const existingDataStr = localStorage.getItem(profileDataKey);
    const existingData: Partial<UserProfile> = existingDataStr ? JSON.parse(existingDataStr) : {};
    
    // Get basic user info for email
    const user = findUserById(userId);
    if (!user) throw new Error('User not found');
    
    // Merge with new data
    const updatedProfile: UserProfile = {
      ...existingData,
      ...profileData,
      id: userId,
      email: user.email // Ensure email is always present
    };
    
    // Save updated profile
    localStorage.setItem(profileDataKey, JSON.stringify(updatedProfile));
    
    return updatedProfile;
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw new Error('Profil ma\'lumotlarini saqlashda xatolik yuz berdi');
  }
}