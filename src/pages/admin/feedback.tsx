/**
 * Admin feedback analytics page
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FeedbackAnalytics from '@/components/FeedbackAnalytics';
import DetailedFeedbackView from '@/components/DetailedFeedbackView';
import { withAuthProtection } from '@/lib/authUtils';

function FeedbackPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed'>('basic');
  
  return (
    <>
      <Head>
        <title>User Feedback - CareerPath Admin</title>
      </Head>
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Feedback Analytics</h1>
          <button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Back to Admin
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            This dashboard shows feedback collected from users about the quality of AI responses.
            User feedback helps improve prompt engineering and identify patterns of issues.
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
            <strong>Tip:</strong> Focus on improving response types with lower helpful ratings,
            and pay attention to common patterns in unhelpful responses.
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="border-b mb-6">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 border-b-2 ${
                  activeTab === 'basic' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Feedback
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-2 px-4 border-b-2 ${
                  activeTab === 'detailed' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('detailed')}
              >
                Detailed Feedback
              </button>
            </li>
          </ul>
        </div>
        
        {/* Active tab content */}
        {activeTab === 'basic' ? (
          <FeedbackAnalytics />
        ) : (
          <DetailedFeedbackView />
        )}
      </div>
    </>
  );
}

// Wrap with auth protection
export default withAuthProtection(FeedbackPage);