/**
 * Admin dashboard main page
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withAuthProtection, logout } from '@/lib/simpleAuth';

function AdminDashboard() {
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const adminFeatures = [
    {
      title: 'AI Response Testing',
      description: 'Test and validate Gemini AI responses for quality and formatting',
      href: '/admin/tests',
      icon: '🧪',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Response Quality Monitoring',
      description: 'Monitor AI response quality metrics and identify issues',
      href: '/admin/quality',
      icon: '📊',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'User Feedback Analytics',
      description: 'Analyze user feedback on AI responses to improve quality',
      href: '/admin/feedback',
      icon: '💬',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];
  
  return (
    <>
      <Head>
        <title>Admin Dashboard - CareerPath</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">CareerPath Admin</h1>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Dashboard
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Admin Dashboard
            </h2>
            <p className="text-gray-600">
              Manage and monitor your CareerPath AI systems, analyze response quality, 
              and review user feedback to continuously improve the platform.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">AI Status</h3>
                  <p className="text-green-600 font-semibold">Active & Healthy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Response Quality</h3>
                  <p className="text-blue-600 font-semibold">Monitoring Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">User Feedback</h3>
                  <p className="text-purple-600 font-semibold">Collection Active</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <Link 
                key={index} 
                href={feature.href}
                className={`block p-6 rounded-lg border-2 transition-colors ${feature.color}`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{feature.icon}</span>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-700">{feature.description}</p>
                <div className="mt-4">
                  <span className="text-blue-600 font-medium">
                    Access Feature →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Admin session active</li>
                  <li>• Login method: localStorage</li>
                  <li>• Session persistent across page reloads</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Services</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Gemini API: Connected</li>
                  <li>• Response monitoring: Active</li>
                  <li>• Feedback collection: Enabled</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/admin/tests"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Run AI Tests
              </Link>
              <Link 
                href="/admin/quality"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Check Quality
              </Link>
              <Link 
                href="/admin/feedback"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                View Feedback
              </Link>
              <Link 
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuthProtection(AdminDashboard);