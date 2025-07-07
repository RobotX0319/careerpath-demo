'use client';

/**
 * Login Page
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);
  
  const handleLoginSuccess = () => {
    router.push('/profile');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">CareerPath</h1>
        <p className="text-gray-600 text-center mb-8">
          Karyera yo'lboshchisi bilan hisobingizga kiring
        </p>
        
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}