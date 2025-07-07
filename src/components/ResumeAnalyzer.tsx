'use client';

/**
 * ResumeAnalyzer Component
 * 
 * Analyzes resumes and provides improvement suggestions
 */

import React, { useState } from 'react';
import type { FileAnalysisResponse } from '@/app/file-analysis/page';

interface ResumeAnalysisResult {
  score: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  keywords: {
    found: string[];
    missing: string[];
  };
  formatting: {
    score: number;
    issues: string[];
  };
  atsCompatibility: number;
  overallFeedback: string;
}

interface ResumeAnalyzerProps {
  onAnalysisComplete?: (result: FileAnalysisResponse) => void;
}

export default function ResumeAnalyzer({ onAnalysisComplete }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // In a real app, you would extract text from PDF/DOC
      setResumeText(`Fayl yuklandi: ${uploadedFile.name}\n\nBu yerda resume matni ko'rsatiladi...`);
    }
  };
  
  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: ResumeAnalysisResult = {
        score: Math.floor(Math.random() * 20) + 75, // 75-95
        sections: [
          {
            name: 'Shaxsiy ma\'lumotlar',
            score: Math.floor(Math.random() * 20) + 80,
            feedback: 'Asosiy ma\'lumotlar to\'liq ko\'rsatilgan',
            suggestions: ['Professional email manzili ishlating', 'LinkedIn profilini qo\'shing']
          },
          {
            name: 'Tajriba',
            score: Math.floor(Math.random() * 30) + 70,
            feedback: 'Ish tajribasi yaxshi tashkil etilgan',
            suggestions: ['Konkret natijalar va raqamlar qo\'shing', 'Action verb\'larni ishlating']
          },
          {
            name: 'Ta\'lim',
            score: Math.floor(Math.random() * 20) + 80,
            feedback: 'Ta\'lim ma\'lumotlari aniq',
            suggestions: ['Relevant kurslar va sertifikatlarni qo\'shing']
          },
          {
            name: 'Ko\'nikmalar',
            score: Math.floor(Math.random() * 25) + 70,
            feedback: 'Ko\'nikmalar ro\'yxati mavjud',
            suggestions: ['Texnik va soft skills\'larni ajrating', 'Darajalarni ko\'rsating']
          }
        ],
        keywords: {
          found: ['JavaScript', 'React', 'Team work', 'Communication'],
          missing: ['Node.js', 'TypeScript', 'Agile', 'Git', 'Problem solving']
        },
        formatting: {
          score: Math.floor(Math.random() * 15) + 85,
          issues: ['Shrift o\'lchami bir xil emas', 'Bo\'sh joylarni to\'g\'rilash kerak']
        },
        atsCompatibility: Math.floor(Math.random() * 20) + 80,
        overallFeedback: 'Resume umumiy holda yaxshi tuzilgan, ammo ba\'zi qismlarni yaxshilash mumkin. Asosan texnik ko\'nikmalar va konkret natijalarni ko\'rsatishga e\'tibor bering.'
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      
      // Call callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete({
          score: mockAnalysis.score,
          suggestions: mockAnalysis.sections.flatMap(s => s.suggestions),
          keywords: mockAnalysis.keywords.found,
          improvements: mockAnalysis.keywords.missing,
          type: 'resume'
        });
      }
    }, 2500);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Resume Tahlilchisi</h2>
        <p className="text-gray-600">
          Resume'nizni yuklang yoki matn kiriting va professional tahlil oling
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Fayl yuklash (PDF, DOC, DOCX)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600">Resume faylini bu yerga yuklang</p>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX formatlarini qo'llab-quvvatlaymiz</p>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-green-600">✓ {file.name} yuklandi</p>
            )}
          </div>
          
          {/* Text Input */}
          <div>
            <label htmlFor="resumeText" className="block text-sm font-medium mb-2">
              Yoki resume matnini kiriting
            </label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Resume matnini bu yerga kiriting..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <button
            onClick={analyzeResume}
            disabled={!resumeText.trim() || isAnalyzing}
            className={`w-full mt-4 px-4 py-2 rounded-lg font-medium ${
              resumeText.trim() && !isAnalyzing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Resume tahlil qilish'}
          </button>
        </div>
        
        {/* Analysis Results */}
        <div>
          {isAnalyzing && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Resume tahlil qilinmoqda...</p>
                <p className="text-sm text-gray-500 mt-1">Bu bir necha daqiqa davom etishi mumkin</p>
              </div>
            </div>
          )}
          
          {analysis && !isAnalyzing && (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Overall Score */}
              <div className={`text-center p-4 rounded-lg ${getScoreBackground(analysis.score)}`}>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}%
                </div>
                <div className="text-lg font-medium text-gray-700">Umumiy ball</div>
                <div className={`text-sm mt-1 ${getScoreColor(analysis.atsCompatibility)}`}>
                  ATS uygunlik: {analysis.atsCompatibility}%
                </div>
              </div>
              
              {/* Section Scores */}
              <div>
                <h3 className="font-semibold mb-3">Bo'limlar tahlili</h3>
                <div className="space-y-3">
                  {analysis.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{section.name}</span>
                        <span className={`font-bold ${getScoreColor(section.score)}`}>
                          {section.score}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{section.feedback}</p>
                      <ul className="text-xs text-gray-500">
                        {section.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Keywords */}
              <div>
                <h3 className="font-semibold mb-3">Kalit so'zlar</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-1">Topilgan:</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.found.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-1">Etishmayotgan:</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formatting Issues */}
              {analysis.formatting.issues.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Formatlash muammolari</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {analysis.formatting.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2">⚠</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Overall Feedback */}
              <div>
                <h3 className="font-semibold mb-2">Umumiy fikr</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {analysis.overallFeedback}
                </p>
              </div>
            </div>
          )}
          
          {!analysis && !isAnalyzing && (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <p>Resume yuklang yoki matn kiriting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}