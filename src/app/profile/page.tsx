'use client';

/**
 * User Profile Page
 * Using dynamic imports for performance optimization
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import { generateRandomPersonality, generateMockCareerMatches } from '@/lib/dataVisualization';

// Lazy load heavy components
const UserProfileForm = lazy(() => import('@/components/profile/UserProfileForm'));
const PersonalityRadarChart = lazy(() => import('@/components/charts/PersonalityRadarChart'));
const CareerMatchBarChart = lazy(() => import('@/components/charts/CareerMatchBarChart'));

// Loading fallback components
const ChartLoading = () => (
  <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-md animate-pulse">
    <p className="text-gray-400">Graf yuklanmoqda...</p>
  </div>
);

const FormLoading = () => (
  <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, profile } = useAuth();
  
  // Generate sample data for demo
  const personalityScores = profile?.personalityScores || generateRandomPersonality();
  const careerMatches = profile?.careerMatches || generateMockCareerMatches();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Mening profilim</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2">
            <Suspense fallback={<FormLoading />}>
              <UserProfileForm />
            </Suspense>
          </div>
          
          {/* Profile summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Profil statistikasi</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ro'yxatdan o'tgan sana:</span>
                  <span className="font-medium">
                    {profile?.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString() 
                      : 'Ma\'lumot yo\'q'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bajarilgan testlar:</span>
                  <span className="font-medium">
                    {profile?.completedTests?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ko'nikmalar:</span>
                  <span className="font-medium">
                    {profile?.skills?.length || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Personality chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shaxsiyat profili</h2>
              
              <Suspense fallback={<ChartLoading />}>
                <PersonalityRadarChart
                  personalityScores={personalityScores}
                  height={250}
                />
              </Suspense>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/test"
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Testni qaytadan topshirish
                </Link>
              </div>
            </div>
            
            {/* Career matches */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tavsiya etilgan kasblar</h2>
              
              <Suspense fallback={<ChartLoading />}>
                <CareerMatchBarChart
                  careerMatches={careerMatches}
                  limit={5}
                  height={250}
                />
              </Suspense>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/results"
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Batafsil natijalarni ko'rish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}