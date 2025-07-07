'use client';

/**
 * JobDescriptionAnalyzer Component
 * 
 * Analyzes job descriptions and provides insights
 */

import React, { useState } from 'react';

interface JobAnalysis {
  keySkills: string[];
  requiredExperience: string;
  jobLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  salary: {
    estimated: string;
    confidence: number;
  };
  matchScore: number;
  recommendations: string[];
  companyInfo: {
    size: string;
    industry: string;
    culture: string[];
  };
}

export default function JobDescriptionAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: JobAnalysis = {
        keySkills: [
          'JavaScript', 'React', 'Node.js', 'TypeScript', 'Git',
          'REST API', 'Database', 'Agile', 'Team Collaboration'
        ].slice(0, Math.floor(Math.random() * 4) + 5),
        requiredExperience: `${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 3) + 3} yil`,
        jobLevel: ['Junior', 'Mid', 'Senior', 'Lead'][Math.floor(Math.random() * 4)] as any,
        salary: {
          estimated: `$${(Math.floor(Math.random() * 50) + 50) * 100}-${(Math.floor(Math.random() * 50) + 100) * 100}`,
          confidence: Math.floor(Math.random() * 30) + 70
        },
        matchScore: Math.floor(Math.random() * 30) + 70,
        recommendations: [
          'Portfolio yarating va GitHub\'da loyihalar joylashtiring',
          'Texnik ko\'nikmalarni mustahkamlang',
          'Soft skills\'larni rivojlantiring',
          'Sohada networking qiling',
          'Tegishli sertifikatlar oling'
        ].slice(0, Math.floor(Math.random() * 2) + 3),
        companyInfo: {
          size: ['Startup', 'Kichik', 'O\'rta', 'Katta'][Math.floor(Math.random() * 4)],
          industry: ['IT Services', 'E-commerce', 'Fintech', 'Healthcare Tech'][Math.floor(Math.random() * 4)],
          culture: ['Agile', 'Innovation', 'Remote-friendly', 'Learning culture'].slice(0, 2)
        }
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Junior': return 'text-green-600 bg-green-100';
      case 'Mid': return 'text-blue-600 bg-blue-100';
      case 'Senior': return 'text-purple-600 bg-purple-100';
      case 'Lead': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Ish E'loni Tahlilchisi</h2>
        <p className="text-gray-600">
          Ish e'lonini tahlil qilib, asosiy ko'nikmalar va talablarni aniqlang
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
            Ish e'loni matni
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Bu yerga ish e'loni matnini kiriting..."
            className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          
          <div className="mt-2 text-sm text-gray-500">
            {jobDescription.length} belgi
          </div>
          
          <button
            onClick={analyzeJobDescription}
            disabled={!jobDescription.trim() || isAnalyzing}
            className={`w-full mt-4 px-4 py-2 rounded-lg font-medium ${
              jobDescription.trim() && !isAnalyzing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
          </button>
        </div>
        
        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {isAnalyzing && (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Ish e'loni tahlil qilinmoqda...</p>
              </div>
            </div>
          )}
          
          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className={`text-2xl font-bold ${analysis.matchScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {analysis.matchScore}%
                  </div>
                  <div className="text-sm text-gray-600">Sizga mos kelishi</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(analysis.jobLevel)}`}>
                    {analysis.jobLevel}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Lavozim darajasi</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{analysis.salary.estimated}</div>
                  <div className="text-sm text-gray-600">Taxminiy maosh</div>
                  <div className="text-xs text-gray-500">{analysis.salary.confidence}% ishonch</div>
                </div>
              </div>
              
              {/* Key Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Asosiy ko'nikmalar</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Kompaniya ma'lumotlari</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Hajmi:</span>
                    <div className="font-medium">{analysis.companyInfo.size}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Soha:</span>
                    <div className="font-medium">{analysis.companyInfo.industry}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tajriba:</span>
                    <div className="font-medium">{analysis.requiredExperience}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Kompaniya madaniyati:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.companyInfo.culture.map((trait, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tavsiyalar</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Portfolio tayyorlash
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Ko'nikmalarni o'rganish
                </button>
              </div>
            </div>
          )}
          
          {!analysis && !isAnalyzing && (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p>Ish e'lonini kiriting va tahlil qiling</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}