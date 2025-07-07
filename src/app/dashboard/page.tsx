"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

interface UserStats {
  testsCompleted: number;
  averageScore: number;
  topCareerMatch: string;
  lastTestDate: string | null;
}

interface RecentActivity {
  id: string;
  type: 'test' | 'career_view' | 'file_analysis';
  title: string;
  date: string;
  score?: number;
}

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats>({
    testsCompleted: 0,
    averageScore: 0,
    topCareerMatch: 'Belgilanmagan',
    lastTestDate: null
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user data from localStorage
      const testCompleted = localStorage.getItem('testCompleted');
      const userData = localStorage.getItem('userData');
      const personalityAnswers = localStorage.getItem('personalityAnswers');
      
      // Calculate stats
      let stats: UserStats = {
        testsCompleted: 0,
        averageScore: 0,
        topCareerMatch: 'Test o\'tmagan',
        lastTestDate: null
      };
      
      if (testCompleted === 'true') {
        stats.testsCompleted = 1;
        stats.averageScore = 85; // Mock score
        stats.topCareerMatch = 'Dasturiy Ta\'minot Ishlab Chiqaruvchi';
        
        if (userData) {
          const user = JSON.parse(userData);
          stats.lastTestDate = user.testDate || new Date().toISOString();
        }
      }
      
      setUserStats(stats);
      
      // Generate recent activity
      const activities: RecentActivity[] = [];
      
      if (testCompleted === 'true') {
        activities.push({
          id: '1',
          type: 'test',
          title: 'Shaxsiyat testini yakunladingiz',
          date: stats.lastTestDate || new Date().toISOString(),
          score: 85
        });
      }
      
      // Add some mock activities
      activities.push(
        {
          id: '2',
          type: 'career_view',
          title: 'Software Developer karyerasini ko\'rdingiz',
          date: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
          id: '3',
          type: 'file_analysis',
          title: 'Resume tahlil qildingiz',
          date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      );
      
      setRecentActivity(activities);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test':
        return '📝';
      case 'career_view':
        return '👔';
      case 'file_analysis':
        return '📄';
      default:
        return '📌';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Bugun';
    if (diffDays === 2) return 'Kecha';
    if (diffDays <= 7) return `${diffDays - 1} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Karyera rivojlanishingiz bo'yicha umumiy ma'lumot</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Tugallangan Testlar</h3>
                <p className="text-2xl font-semibold text-gray-900">{userStats.testsCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">O'rtacha Ball</h3>
                <p className="text-2xl font-semibold text-gray-900">{userStats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Top Karyera</h3>
                <p className="text-sm font-semibold text-gray-900">{userStats.topCareerMatch}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Oxirgi Test</h3>
                <p className="text-sm font-semibold text-gray-900">
                  {userStats.lastTestDate ? formatDate(userStats.lastTestDate) : 'Hali yo\'q'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Tezkor harakatlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/test"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Shaxsiyat Testi</h3>
                    <p className="text-sm text-gray-600">Yangi test boshlash yoki davom etish</p>
                  </div>
                </Link>

                <Link
                  href="/careers"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Karyera Tadqiqi</h3>
                    <p className="text-sm text-gray-600">Turli kasblarni o'rganing</p>
                  </div>
                </Link>

                <Link
                  href="/file-analysis"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Fayl Tahlili</h3>
                    <p className="text-sm text-gray-600">Resume yoki CV tahlil qiling</p>
                  </div>
                </Link>

                <Link
                  href="/results"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Natijalarni Ko'rish</h3>
                    <p className="text-sm text-gray-600">Test natijalaringizni ko'ring</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">So'nggi faoliyat</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mr-4">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                      </div>
                      {activity.score && (
                        <div className="text-sm font-semibold text-blue-600">
                          {activity.score}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Hali faoliyat yo'q</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sizning Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Profil to'ldirish</span>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Test bajarish</span>
                    <span className="text-sm font-medium">{userStats.testsCompleted > 0 ? '100%' : '0%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: userStats.testsCompleted > 0 ? '100%' : '0%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Karyera tadqiqi</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tavsiyalar</h3>
              <div className="space-y-3">
                {userStats.testsCompleted === 0 ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Shaxsiyat testini oling</h4>
                    <p className="text-sm text-blue-600">Karyera yo'nalishingizni aniqlash uchun testni tugallang</p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">Resume tahlil qiling</h4>
                      <p className="text-sm text-green-600">CVingizni AI bilan tahlil qilib, takomillashtiring</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800">Karyera yo'lini o'rganing</h4>
                      <p className="text-sm text-purple-600">Tanlaganingiz sohada qanday ko'nikmalarga ega bo'lish kerak</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tezkor hisobotlar</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Umumiy ballar:</span>
                  <span className="font-medium">{userStats.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Eng yaxshi natija:</span>
                  <span className="font-medium">{userStats.testsCompleted > 0 ? userStats.averageScore : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tavsiya etilgan karyera:</span>
                  <span className="font-medium text-sm">{userStats.topCareerMatch}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}