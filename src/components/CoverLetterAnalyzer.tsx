'use client';

/**
 * CoverLetterAnalyzer Component
 * 
 * Analyzes and provides feedback on cover letters
 */

import React, { useState } from 'react';
import type { FileAnalysisResponse } from '@/app/file-analysis/page';

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  wordCount: number;
  readabilityScore: number;
}

interface CoverLetterAnalyzerProps {
  onAnalysisComplete?: (result: FileAnalysisResponse) => void;
}

export default function CoverLetterAnalyzer({ onAnalysisComplete }: CoverLetterAnalyzerProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeCoverLetter = async () => {
    if (!coverLetter.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis (in real app, this would call an API)
    setTimeout(() => {
      const words = coverLetter.trim().split(/\s+/).length;
      const sentences = coverLetter.split(/[.!?]+/).filter(s => s.trim()).length;
      const avgWordsPerSentence = words / sentences || 0;
      
      // Mock analysis results
      const mockAnalysis: AnalysisResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        wordCount: words,
        readabilityScore: Math.floor(Math.random() * 20) + 80, // 80-100
        strengths: [
          'Shaxsiy tajribalar aniq bayon qilingan',
          'Kompaniya haqida ma\'lumot ko\'rsatilgan',
          'Professional til ishlatilgan',
          'Natijalar va yutuqlar ta\'kidlangan'
        ].slice(0, Math.floor(Math.random() * 2) + 2),
        improvements: [
          'Kirish qismi yanada jalb qiluvchi bo\'lishi mumkin',
          'Aniq misollar ko\'proq keltirilishi kerak',
          'Xulosa qismi kuchliroq yakunlanishi mumkin',
          'Kompaniya ehtiyojlariga ko\'proq e\'tibor berish'
        ].slice(0, Math.floor(Math.random() * 2) + 1),
        suggestions: [
          'Kompaniya nomini va lavozimni aniq ko\'rsating',
          'O\'zingizning unikal qiymatlaringizni ta\'kidlang',
          'Konkret natijalar va raqamlar keltiring',
          'Professional formatda yozing'
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      
      // Call callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete({
          score: mockAnalysis.score,
          suggestions: mockAnalysis.suggestions,
          keywords: mockAnalysis.strengths,
          improvements: mockAnalysis.improvements,
          type: 'cover-letter'
        });
      }
    }, 2000);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Ajoyib';
    if (score >= 80) return 'Yaxshi';
    if (score >= 70) return 'O\'rtacha';
    return 'Yaxshilanishi kerak';
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Cover Letter Tahlilchisi</h2>
        <p className="text-gray-600">
          Qo'ng'iroq xatingizni yuklang va professional tahlil oling
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
            Cover Letter matni
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Bu yerga cover letter matnini kiriting..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{coverLetter.length} belgi</span>
            <span>{coverLetter.trim().split(/\s+/).filter(w => w).length} so'z</span>
          </div>
          
          <button
            onClick={analyzeCoverLetter}
            disabled={!coverLetter.trim() || isAnalyzing}
            className={`w-full mt-4 px-4 py-2 rounded-lg font-medium ${
              coverLetter.trim() && !isAnalyzing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
          </button>
        </div>
        
        {/* Analysis Results */}
        <div>
          {isAnalyzing && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Tahlil qilinmoqda...</p>
              </div>
            </div>
          )}
          
          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}%
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {getScoreLabel(analysis.score)}
                </div>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                  <div className="text-sm text-gray-600">So'zlar soni</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysis.readabilityScore}%</div>
                  <div className="text-sm text-gray-600">O'qilish osonligi</div>
                </div>
              </div>
              
              {/* Strengths */}
              <div>
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kuchli tomonlar
                </h3>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Improvements */}
              <div>
                <h3 className="font-semibold text-yellow-700 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Yaxshilanishi kerak
                </h3>
                <ul className="space-y-1">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Suggestions */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tavsiyalar
                </h3>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {!analysis && !isAnalyzing && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p>Cover letter kiriting va tahlil qiling</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}