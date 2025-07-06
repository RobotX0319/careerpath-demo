/**
 * TestRunner component for validating Gemini AI responses
 * Used by developers and administrators to ensure response quality
 */

import React, { useState } from 'react';
import { 
  runAllTests, 
  testPersonalityAnalysis, 
  testCareerRecommendations,
  testChatResponses,
  testErrorHandling
} from '../tests/geminiTests';

export default function TestRunner() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState('all');
  
  async function handleRunTests() {
    setLoading(true);
    try {
      let testResults;
      
      switch(selectedTest) {
        case 'personality':
          testResults = await testPersonalityAnalysis();
          break;
        case 'career':
          testResults = await testCareerRecommendations();
          break;
        case 'chat':
          testResults = await testChatResponses();
          break;
        case 'error':
          testResults = await testErrorHandling();
          break;
        case 'all':
        default:
          testResults = await runAllTests();
          break;
      }
      
      setResults(testResults);
    } catch (e) {
      console.error('Test execution error:', e);
      setResults({ error: 'Test execution failed. See console for details.' });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Gemini AI Response Validator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select test suite to run:
        </label>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        >
          <option value="all">All Tests</option>
          <option value="personality">Personality Analysis</option>
          <option value="career">Career Recommendations</option>
          <option value="chat">Chat Responses</option>
          <option value="error">Error Handling</option>
        </select>
      </div>
      
      <button
        onClick={handleRunTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      {results && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold mb-2">Test Results</h3>
          
          {results.error ? (
            <div className="p-3 bg-red-100 text-red-800 rounded">
              {results.error}
            </div>
          ) : results.overall !== undefined ? (
            // All tests result
            <>
              <div className={`p-3 rounded mb-2 ${results.overall ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Overall: {results.overall ? 'PASS ✅' : 'FAIL ❌'}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TestResultCard 
                  title="Personality Analysis" 
                  success={results.personality?.success} 
                  count={results.personality?.results?.length || 0} 
                />
                <TestResultCard 
                  title="Career Recommendations" 
                  success={results.career?.success} 
                  count={results.career?.results?.length || 0} 
                />
                <TestResultCard 
                  title="Chat Responses" 
                  success={results.chat?.success} 
                  count={results.chat?.results?.length || 0} 
                />
                <TestResultCard 
                  title="Error Handling" 
                  success={results.errorHandling?.success} 
                  count={results.errorHandling?.results?.length || 0} 
                />
              </div>
            </>
          ) : (
            // Individual test result
            <div className={`p-3 rounded ${results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Test Result: {results.success ? 'PASS ✅' : 'FAIL ❌'}
              <div className="mt-2">
                {results.results && (
                  <div>
                    <p className="font-medium">Cases tested: {results.results.length}</p>
                    <p className="font-medium">Success rate: {(results.results.filter((r: any) => r.success).length / results.results.length * 100).toFixed(0)}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Detailed logs for developer use */}
          <div className="mt-4">
            <details>
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View Detailed Results
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}

function TestResultCard({ title, success, count }: { title: string; success?: boolean; count: number }) {
  return (
    <div className={`p-3 rounded border ${success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <h4 className="font-medium">{title}</h4>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm">{count} tests run</span>
        <span className={`font-bold ${success ? 'text-green-600' : 'text-red-600'}`}>
          {success ? 'PASS' : 'FAIL'}
        </span>
      </div>
    </div>
  );
}