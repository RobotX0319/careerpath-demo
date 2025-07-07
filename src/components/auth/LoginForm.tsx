'use client';

/**
 * LoginForm Component
 * 
 * Form for user login
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function LoginForm({ onSuccess, className = '' }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      errors.email = 'Email kiritilishi shart';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Yaroqli email kiriting';
    }
    
    if (!formData.password) {
      errors.password = 'Parol kiritilishi shart';
    } else if (formData.password.length < 6) {
      errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear auth error when typing
    // If you want to clear the error, implement a clearError method in AuthContext and use it here.
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Kirish xatosi');
      console.log('Login failed');
    }
  };
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Kirish</h2>
      
      <form onSubmit={handleSubmit}>
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Parol
            </label>
            <Link 
              href="/auth/reset-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Parolni unutdingizmi?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Kirish...
            </div>
          ) : (
            'Kirish'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Hali ro'yxatdan o'tmadingizmi?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </div>
    </div>
  );
}