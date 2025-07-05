"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import CareerCard from '@/components/CareerCard';
import AIChat from '@/components/AIChat';
import { calculatePersonalityScores } from '@/lib/personality';
import { matchCareers } from '@/lib/careers';
import { geminiService, handleGeminiError } from '@/lib/geminiService';
import { supabaseService, saveTestResultToDatabase } from '@/lib/supabase';
import type { Career, PersonalityScores, UserData } from '@/types';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personalityScores, setPersonalityScores] = useState<PersonalityScores | null>(null);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const [aiPersonalityAnalysis, setAiPersonalityAnalysis] = useState<string>('');
  const [aiCareerRecommendations, setAiCareerRecommendations] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = async () => {
    try {
      // localStorage'dan ma'lumotlarni yuklab olish
      const userDataString = localStorage.getItem('careerpath-user');
      const answersString = localStorage.getItem('careerpath-answers');

      if (!userDataString || !answersString) {
        window.location.href = '/test';
        return;
      }

      const user = JSON.parse(userDataString);
      const answers = JSON.parse(answersString);
      
      setUserData(user);

      // Shaxsiyat ballarini hisoblash
      const scores = calculatePersonalityScores(answers);
      setPersonalityScores(scores);
      
      // Tavsiya etilgan kasblarni topish
      const careers = matchCareers(scores);
      setRecommendedCareers(careers);

      setLoading(false);

      // AI tahlil va ma'lumotlarni saqlash
      await processWithAI(user, answers, scores, careers);

    } catch (error) {
      console.error('Error loading test results:', error);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
      setLoading(false);
    }
  };

  const processWithAI = async (user: any, answers: number[], scores: PersonalityScores, careers: Career[]) => {
    setAiProcessing(true);
    
    try {
      // 1. Gemini AI dan shaxsiyat tahlili olish
      const personalityAnalysis = await geminiService.analyzePersonality(scores, 'demo-user');
      setAiPersonalityAnalysis(personalityAnalysis);

      // 2. AI dan kengaytirilgan kasb tavsiyalari olish
      const careerRecommendations = await geminiService.generateCareerRecommendations(
        scores,
        [], // Skills - keyinroq qo'shish mumkin
        [], // Interests - keyinroq qo'shish mumkin
        'demo-user'
      );
      setAiCareerRecommendations(careerRecommendations);

      // 3. Natijalarni Supabase'ga saqlash
      const { user: savedUser, testResult } = await saveTestResultToDatabase(
        user,
        answers,
        scores,
        personalityAnalysis,
        careers
      );

      if (savedUser) {
        setUserId(savedUser.id);
      }

    } catch (error) {
      console.error('AI processing error:', error);
      setError(handleGeminiError(error));
    } finally {
      setAiProcessing(false);
    }
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleViewDetails = (career: Career) => {
    alert(`${career.title} haqida batafsil ma'lumot:\n\n${career.description}\n\nMaosh: ${career.salary}\nO'sish: ${career.growth}\nKompaniyalar: ${career.companies.join(', ')}`);
  };

  const handleRetakeTest = () => {
    localStorage.removeItem('careerpath-user');
    localStorage.removeItem('careerpath-answers');
    window.location.href = '/test';
  };

  const handleShareResults = async () => {
    const shareText = `🎯 CareerPath test natijalarim:\n\n${recommendedCareers.slice(0, 3).map((career, i) => `${i + 1}. ${career.title} (${career.matchScore}% mos)`).join('\n')}\n\nSiz ham o'z karyera yo'nalishingizni aniqlang: ${window.location.origin}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Natijalar clipboard\'ga nusxalandi! Endi ijtimoiy tarmoqlarda ulashing.');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Natijalar nusxalandi!');
    }
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
            Test natijalari
          </h1>
          <p className="text-gray-600">
            Sizning shaxsiyat xususiyatlaringiz va AI tavsiyalari
          </p>
          {aiProcessing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>AI tahlil qilyapti...</span>
            </div>
          )}
        </div>

        {/* Error handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* User Info */}
        {userData && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Foydalanuvchi ma'lumotlari</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="font-medium">Ism:</span> {userData.name}</div>
              <div><span className="font-medium">Yosh:</span> {userData.age}</div>
              <div><span className="font-medium">Ta'lim:</span> {userData.education}</div>
              <div><span className="font-medium">Shahar:</span> {userData.city}</div>
            </div>
          </div>
        )}

        {/* Personality Scores */}
        {personalityScores && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shaxsiyat ballari</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(personalityScores).map(([trait, score]) => {
                const traitNames: Record<string, string> = {
                  openness: 'Ochiqlik',
                  conscientiousness: 'Mas\'uliyatlilik',
                  extraversion: 'Ekstraversiya',
                  agreeableness: 'Do\'stona munosabat',
                  neuroticism: 'Emotsional barqarorlik'
                };
                
                return (
                  <div key={trait} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{traitNames[trait]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Personality Analysis */}
        {aiPersonalityAnalysis && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Shaxsiyat Tahlili
            </h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {aiPersonalityAnalysis}
              </div>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">🎯</span>
            <h3 className="text-lg font-semibold text-yellow-800">Bu demo versiya edi!</h3>
          </div>
          <p className="text-yellow-700 mb-4">
            Siz hozir TalentFinder platformasining demo versiyasini ko'rdingiz. To'liq versiyada 50+ savol, 100+ kasb, 
            batafsil tahlil, mentorlik va ish topish xizmatlari mavjud.
          </p>
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-gray-800 mb-2">To'liq versiya uchun bog'laning:</h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div>📧 Email: info@talentfinder.uz</div>
              <div>📱 Telefon: +998 90 123 45 67</div>
              <div>🌐 Website: www.talentfinder.uz</div>
              <div>📍 Manzil: Toshkent, IT Park</div>
            </div>
          </div>
        </div>

        {/* Recommended Careers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Sizga mos kasblar
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedCareers.map((career, index) => (
              <CareerCard
                key={career.id}
                career={career}
                rank={index + 1}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        {/* AI Career Recommendations */}
        {aiCareerRecommendations && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              AI Karyera Tavsiyalari
            </h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {aiCareerRecommendations}
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              AI Maslahatchi
            </h2>
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {showChat ? 'Yashirish' : 'Suhbat boshlash'}
            </button>
          </div>
          
          {showChat && (
            <div className="h-96">
              <AIChat 
                userId={userId || 'demo-user'} 
                personalityScores={personalityScores || undefined}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleRetakeTest}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              🔄 Testni qayta topshirish
            </button>
            <button
              onClick={handleShareResults}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              📤 Natijalarni ulashish
            </button>
            <Link href="/">
              <button className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition">
                🏠 Bosh sahifa
              </button>
            </Link>
          </div>
        </div>

        {/* Contact & Upgrade Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">To'liq versiyaga o'ting!</h3>
            <p className="text-gray-600 mb-4">
              Professional karyera maslahat, mentorlik va ish topish xizmatlari uchun bizga murojaat qiling.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:info@talentfinder.uz"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                📧 Email yuborish
              </a>
              <a 
                href="tel:+998901234567"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                📞 Qo'ng'iroq qilish
              </a>
              <a 
                href="https://t.me/talentfinder_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
              >
                💬 Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-blue-700 mb-2">TalentFinder</h4>
            <p className="text-gray-600 text-sm mb-4">
              O'zbekiston va dunyo uchun zamonaviy karyera rivojlanish tizimi
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition">Facebook</a>
            <a href="#" className="text-blue-400 hover:text-blue-600 transition">Twitter</a>
            <a href="#" className="text-blue-700 hover:text-blue-900 transition">LinkedIn</a>
            <a href="#" className="text-red-500 hover:text-red-700 transition">YouTube</a>
            <a href="#" className="text-blue-400 hover:text-blue-600 transition">Telegram</a>
          </div>
          
          <div className="border-t pt-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} TalentFinder. Barcha huquqlar himoyalangan.</p>
            <p className="mt-1">Demo versiya - To'liq platformada ko'proq imkoniyatlar mavjud</p>
          </div>
        </footer>
      </div>
    </div>
  );
}