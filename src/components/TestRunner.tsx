/**
 * TestRunner component for validating AI responses
 */

import React, { useState } from 'react';
import { geminiService } from '@/lib/geminiService';

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'running';
  message: string;
  duration?: number;
}

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    const tests: TestResult[] = [
      { testName: 'AI Connection Test', status: 'running', message: 'Testing connection...' },
      { testName: 'Personality Analysis Test', status: 'running', message: 'Testing personality analysis...' },
      { testName: 'Career Recommendations Test', status: 'running', message: 'Testing career recommendations...' },
      { testName: 'Chat Response Test', status: 'running', message: 'Testing chat responses...' }
    ];
    
    setResults([...tests]);
    
    try {
      // Test 1: AI Connection
      const startTime = Date.now();
      const connectionTest = await geminiService.testConnection();
      const duration1 = Date.now() - startTime;
      
      tests[0] = {
        testName: 'AI Connection Test',
        status: connectionTest ? 'pass' : 'fail',
        message: connectionTest ? 'AI connection successful' : 'AI connection failed',
        duration: duration1
      };
      setResults([...tests]);

      // Test 2: Personality Analysis
      if (connectionTest) {
        const startTime2 = Date.now();
        const personalityTest = await geminiService.analyzePersonality({
          openness: 75,
          conscientiousness: 80,
          extraversion: 60,
          agreeableness: 70,
          neuroticism: 40
        });
        const duration2 = Date.now() - startTime2;
        
        tests[1] = {
          testName: 'Personality Analysis Test',
          status: personalityTest.length > 50 ? 'pass' : 'fail',
          message: personalityTest.length > 50 ? 'Personality analysis working' : 'Personality analysis failed',
          duration: duration2
        };
        setResults([...tests]);

        // Test 3: Career Recommendations
        const startTime3 = Date.now();
        const careerTest = await geminiService.generateCareerRecommendations({
          openness: 75,
          conscientiousness: 80,
          extraversion: 60,
          agreeableness: 70,
          neuroticism: 40
        }, ['JavaScript', 'Python'], ['Technology', 'Education']);
        const duration3 = Date.now() - startTime3;
        
        tests[2] = {
          testName: 'Career Recommendations Test',
          status: careerTest.length > 50 ? 'pass' : 'fail',
          message: careerTest.length > 50 ? 'Career recommendations working' : 'Career recommendations failed',
          duration: duration3
        };
        setResults([...tests]);

        // Test 4: Chat Response
        const startTime4 = Date.now();
        const chatTest = await geminiService.chatWithAI('Dasturlash haqida maslahat bering');
        const duration4 = Date.now() - startTime4;
        
        tests[3] = {
          testName: 'Chat Response Test',
          status: chatTest.length > 20 ? 'pass' : 'fail',
          message: chatTest.length > 20 ? 'Chat responses working' : 'Chat responses failed',
          duration: duration4
        };
        setResults([...tests]);
      } else {
        // If connection failed, mark other tests as failed
        tests[1].status = 'fail';
        tests[1].message = 'Skipped due to connection failure';
        tests[2].status = 'fail';
        tests[2].message = 'Skipped due to connection failure';
        tests[3].status = 'fail';
        tests[3].message = 'Skipped due to connection failure';
        setResults([...tests]);
      }
    } catch (error) {
      console.error('Test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Mark all running tests as failed
      const failedTests = tests.map(test => ({
        ...test,
        status: test.status === 'running' ? 'fail' as const : test.status,
        message: test.status === 'running' ? `Failed: ${errorMessage}` : test.message
      }));
      setResults(failedTests);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">AI Response Testing</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{result.testName}</h3>
                <div className="flex items-center space-x-2">
                  {result.duration && (
                    <span className="text-sm text-gray-500">{result.duration}ms</span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'pass' ? 'bg-green-100 text-green-800' :
                    result.status === 'fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status === 'pass' ? '✅ PASS' :
                     result.status === 'fail' ? '❌ FAIL' : '⏳ RUNNING'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{result.message}</p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Run Tests" to validate AI response quality and functionality.
        </div>
      )}
    </div>
  );
}