/**
 * Admin test page for validating Gemini API responses
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TestRunner from '@/components/TestRunner';
import { withAuthProtection } from '@/lib/simpleAuth';

function TestPage() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>AI Response Testing - CareerPath Admin</title>
      </Head>
      
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gemini AI Response Testing</h1>
          <button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Back to Admin
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            This page allows administrators to validate the quality of AI responses from the Gemini API. 
            The tests check for proper formatting, content relevance, and error handling.
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
            <strong>Note:</strong> These tests will use your API quota. Run them sparingly.
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Validation Criteria</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No markdown formatting symbols (asterisks, hashes)</li>
            <li>Professional Uzbek language</li>
            <li>Appropriate response length</li>
            <li>Proper handling of error cases</li>
            <li>Consistent formatting across different requests</li>
          </ul>
        </div>
        
        <div className="mb-10">
          <TestRunner />
        </div>
      </div>
    </>
  );
}

// Wrap the component with authentication protection
export default withAuthProtection(TestPage);