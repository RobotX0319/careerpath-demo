'use client';

/**
 * File Analysis Page
 * 
 * Page for analyzing uploaded files (resume, cover letter, etc.)
 */

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import CoverLetterAnalyzer from '@/components/CoverLetterAnalyzer';

export interface FileAnalysisResponse {
  score: number;
  suggestions: string[];
  keywords: string[];
  improvements: string[];
  type: 'resume' | 'cover-letter' | 'portfolio';
}

export default function FileAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResponse | null>(null);
  
  const handleAnalysisComplete = (result: FileAnalysisResponse) => {
    setAnalysisResults(result);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fayl Tahlili</h1>
          <p className="text-gray-600">
            Resume, cover letter va boshqa hujjatlaringizni professional tahlil qiling
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('resume')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resume'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resume Tahlili
              </button>
              <button
                onClick={() => setActiveTab('cover-letter')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cover-letter'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cover Letter Tahlili
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'resume' && (
            <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          )}
          
          {activeTab === 'cover-letter' && (
            <CoverLetterAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          )}
        </div>
        
        {/* Analysis Summary */}
        {analysisResults && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tahlil natijasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  analysisResults.score >= 80 ? 'text-green-600' :
                  analysisResults.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analysisResults.score}%
                </div>
                <div className="text-gray-600">Umumiy ball</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResults.keywords.length}
                </div>
                <div className="text-gray-600">Kalit so'zlar</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analysisResults.suggestions.length}
                </div>
                <div className="text-gray-600">Tavsiyalar</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}