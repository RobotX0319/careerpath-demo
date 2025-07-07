"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { calculateScores } from '@/lib/personality';
import type { PersonalityAnswer, PersonalityResult } from '@/lib/personality';

// Interface definitions
interface UserData {
  name: string;
  email: string;
  testDate: Date;
}

interface Career {
  id: string;
  title: string;
  description: string;
  compatibility: number;
  salaryRange: string;
  growthRate: string;
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personalityResults, setPersonalityResults] = useState<PersonalityResult[]>([]);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = async () => {
    try {
      setLoading(true);
      
      // Load test data from localStorage
      const savedAnswers = localStorage.getItem('personalityAnswers');
      const savedUserData = localStorage.getItem('userData');
      
      if (!savedAnswers) {
        setError('Test natijasi topilmadi. Testni qaytadan o\'ting.');
        return;
      }
      
      const answers: PersonalityAnswer[] = JSON.parse(savedAnswers);
      const user: UserData = savedUserData ? 
        JSON.parse(savedUserData) : 
        { name: 'User', email: 'user@example.com', testDate: new Date() };
      
      // Calculate personality scores
      const scores = calculateScores(answers);
      setPersonalityResults(scores);
      setUserData(user);
      
      // Generate career recommendations
      const careers = generateCareerRecommendations(scores);
      setRecommendedCareers(careers);
      
      // Simulate AI processing
      await processWithAI(scores);
      
    } catch (error) {
      console.error('Error loading test results:', error);
      setError('Natijalarni yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const generateCareerRecommendations = (scores: PersonalityResult[]): Career[] => {
    // Mock career recommendations based on personality scores
    const careerDatabase: Career[] = [
      {
        id: 'software-dev',
        title: 'Dasturiy Ta\'minot Ishlab Chiqaruvchi',
        description: 'Web va mobile ilovalar yaratish, kodlash va texnik masalalarni hal qilish.',
        compatibility: 0,
        salaryRange: '$800-$3000',
        growthRate: '+15% yiliga'
      },
      {
        id: 'data-scientist',
        title: 'Ma\'lumotlar Olimi',
        description: 'Big Data tahlili, machine learning modellari yaratish.',
        compatibility: 0,
        salaryRange: '$1200-$4000',
        growthRate: '+22% yiliga'
      },
      {
        id: 'ui-designer',
        title: 'UI/UX Dizayner',
        description: 'Foydalanuvchi interfeyslari va tajribalarini loyihalash.',
        compatibility: 0,
        salaryRange: '$600-$2500',
        growthRate: '+13% yiliga'
      },
      {
        id: 'project-manager',
        title: 'Loyiha Menejeri',
        description: 'Loyihalarni boshqarish, jamoa bilan ishlash va natijalar.',
        compatibility: 0,
        salaryRange: '$1000-$3500',
        growthRate: '+8% yiliga'
      },
      {
        id: 'marketing-specialist',
        title: 'Marketing Mutaxassisi',
        description: 'Brend promociyasi, reklama kampaniyalari va ijtimoiy tarmoqlar.',
        compatibility: 0,
        salaryRange: '$500-$2000',
        growthRate: '+10% yiliga'
      }
    ];

    // Calculate compatibility based on personality scores
    return careerDatabase.map(career => {
      let compatibility = 70; // Base compatibility
      
      scores.forEach(result => {
        switch (career.id) {
          case 'software-dev':
            if (result.dimension === 'conscientiousness') compatibility += result.score * 0.3;
            if (result.dimension === 'openness') compatibility += result.score * 0.2;
            break;
          case 'data-scientist':
            if (result.dimension === 'openness') compatibility += result.score * 0.4;
            if (result.dimension === 'conscientiousness') compatibility += result.score * 0.2;
            break;
          case 'ui-designer':
            if (result.dimension === 'openness') compatibility += result.score * 0.4;
            if (result.dimension === 'agreeableness') compatibility += result.score * 0.2;
            break;
          case 'project-manager':
            if (result.dimension === 'extraversion') compatibility += result.score * 0.3;
            if (result.dimension === 'conscientiousness') compatibility += result.score * 0.2;
            break;
          case 'marketing-specialist':
            if (result.dimension === 'extraversion') compatibility += result.score * 0.4;
            if (result.dimension === 'agreeableness') compatibility += result.score * 0.2;
            break;
        }
      });
      
      return {
        ...career,
        compatibility: Math.min(Math.round(compatibility), 100)
      };
    }).sort((a, b) => b.compatibility - a.compatibility);
  };

  const processWithAI = async (scores: PersonalityResult[]) => {
    try {
      setAiProcessing(true);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate AI insights
      const insights = generateAIInsights(scores);
      setAiInsights(insights);
      
    } catch (error) {
      console.error('AI processing error:', error);
    } finally {
      setAiProcessing(false);
    }
  };

  const generateAIInsights = (scores: PersonalityResult[]): string => {
    const strengths = scores.filter(s => s.score >= 70).map(s => s.label);
    const improvements = scores.filter(s => s.score <= 40).map(s => s.label);
    
    let insights = "🤖 AI Tahlili:\n\n";
    
    if (strengths.length > 0) {
      insights += `💪 Sizning kuchli tomonlaringiz: ${strengths.join(', ')}.\n\n`;
    }
    
    if (improvements.length > 0) {
      insights += `📈 Rivojlantirish kerak bo'lgan sohalar: ${improvements.join(', ')}.\n\n`;
    }
    
    insights += "🎯 Tavsiya: Kuchli tomonlaringizni ishlatadigan karyera yo'nalishini tanlash eng yaxshi natija beradi.";
    
    return insights;
  };

  const handleViewCareerDetails = (career: Career) => {
    // Navigate to career details page
    window.location.href = `/careers/position/${career.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4">Natijalar tayyorlanmoqda...</h2>
          <p className="text-gray-600 mt-2">Shaxsiyat tahlili va karyera tavsiyalari yaratilmoqda</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold mb-4 text-red-700">Xatolik yuz berdi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-4">
              <Link
                href="/test"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Testni qaytadan o'tish
              </Link>
              <div>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Dashboard ga qaytish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sizning Natijalaringiz</h1>
          <p className="text-xl text-gray-600">
            Shaxsiyat tahlili va karyera yo'nalishlari tavsiyasi
          </p>
          {userData && (
            <p className="text-sm text-gray-500 mt-2">
              Test sanasi: {new Date(userData.testDate).toLocaleDateString('uz-UZ')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personality Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personality Scores */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Shaxsiyat Tahlili</h2>
              <div className="space-y-4">
                {personalityResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{result.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Karyera Tavsiyalari</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedCareers.slice(0, 4).map((career) => (
                  <div key={career.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{career.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        career.compatibility >= 80 ? 'bg-green-100 text-green-800' :
                        career.compatibility >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {career.compatibility}% mos
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{career.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm">
                        <div className="text-gray-500">Maosh:</div>
                        <div className="font-medium">{career.salaryRange}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-500">O'sish:</div>
                        <div className="font-medium text-green-600">{career.growthRate}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewCareerDetails(career)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Batafsil ko'rish
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">AI Tahlili</h3>
              {aiProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">AI tahlil qilmoqda...</p>
                </div>
              ) : aiInsights ? (
                <div className="prose prose-sm">
                  <pre className="whitespace-pre-wrap text-sm">{aiInsights}</pre>
                </div>
              ) : (
                <p className="text-gray-500">AI tahlili mavjud emas</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Keyingi qadamlar</h3>
              <div className="space-y-3">
                <Link
                  href="/careers"
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
                >
                  Barcha karyeralarni ko'rish
                </Link>
                <Link
                  href="/file-analysis"
                  className="block w-full px-4 py-2 border border-gray-300 text-center rounded hover:bg-gray-50 transition-colors"
                >
                  Resume tahlil qilish
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Natijalarni chop etish
                </button>
              </div>
            </div>

            {/* Share Results */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Natijalarni ulashing</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  LinkedIn da ulashing
                </button>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  WhatsApp orqali ulashing
                </button>
                <button className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                  Havolani nusxalash
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}