/**
 * Admin page for monitoring response quality
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import QualityMonitor from '@/components/QualityMonitor';
import { withAuthProtection } from '@/lib/simpleAuth';

function QualityPage() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Response Quality - CareerPath Admin</title>
      </Head>
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Response Quality Monitoring</h1>
          <button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Back to Admin
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            This dashboard monitors the quality of AI responses from the Gemini API.
            It tracks formatting issues, response length, and other quality metrics
            to ensure users receive clean, professional responses.
          </p>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            <strong>Note:</strong> Quality metrics are collected from actual user interactions.
            Low scores may indicate issues with prompt engineering or API configuration.
          </div>
        </div>
        
        <QualityMonitor />
      </div>
    </>
  );
}

// Wrap with auth protection
export default withAuthProtection(QualityPage);