'use client';

/**
 * Comparison Page
 * 
 * Demonstrates personality comparison between user and ideal career profiles
 */

import React, { useState, useEffect } from 'react';
import PersonalityComparison from '@/components/PersonalityComparison';
import { generateRandomPersonality } from '@/lib/dataVisualization';

// PersonalityScores type fallback (if not exported from lib)
type PersonalityScores = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export default function ComparisonPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userPersonality, setUserPersonality] = useState<PersonalityScores | null>(null);
  const [idealProfiles, setIdealProfiles] = useState<Array<{
    career: string;
    personalityScores: PersonalityScores;
  }>>([]);
  
  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate user personality
      const userProfile = generateRandomPersonality();
      setUserPersonality(userProfile);
      
      // Generate ideal career profiles
      // In a real app, these would come from a database of researched ideal profiles
      const careers = [
        'Software Developer',
        'Marketing Manager',
        'Data Scientist'
      ];
      
      const profiles = careers.map(career => {
        // Generate ideal profiles with some bias based on career
        let profile: PersonalityScores;
        
        if (career === 'Software Developer') {
          profile = {
            openness: 85,
            conscientiousness: 80,
            extraversion: 40,
            agreeableness: 60,
            neuroticism: 45
          };
        } else if (career === 'Marketing Manager') {
          profile = {
            openness: 75,
            conscientiousness: 70,
            extraversion: 85,
            agreeableness: 75,
            neuroticism: 40
          };
        } else if (career === 'Data Scientist') {
          profile = {
            openness: 80,
            conscientiousness: 85,
            extraversion: 45,
            agreeableness: 60,
            neuroticism: 40
          };
        } else {
          // Default profile with some randomness
          profile = {
            openness: Math.floor(Math.random() * 30) + 60,
            conscientiousness: Math.floor(Math.random() * 30) + 60,
            extraversion: Math.floor(Math.random() * 30) + 60,
            agreeableness: Math.floor(Math.random() * 30) + 60,
            neuroticism: Math.floor(Math.random() * 30) + 40
          };
        }
        
        return {
          career,
          personalityScores: profile
        };
      });
      
      setIdealProfiles(profiles);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Shaxsiyat solishtirmasi</h1>
        <p className="text-gray-600 mb-8">Sizning shaxsiyatingiz va kasbiy talablar</p>
        
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Shaxsiyat solishtirmasi</h1>
      <p className="text-gray-600 mb-8">Sizning shaxsiyatingiz va kasbiy talablar</p>
      {userPersonality && (
        <div className="mb-8">
          <PersonalityComparison
            data={[
              { label: 'Ochiqlik', value: userPersonality.openness, color: '#2563eb' },
              { label: 'Vijdonlilik', value: userPersonality.conscientiousness, color: '#059669' },
              { label: 'Ekstraversiya', value: userPersonality.extraversion, color: '#f59e42' },
              { label: 'Do\'stona', value: userPersonality.agreeableness, color: '#a21caf' },
              { label: 'Hissiy barqarorlik', value: 100 - userPersonality.neuroticism, color: '#e11d48' }
            ]}
            title="Sizning shaxsiyatingiz"
          />
        </div>
      )}
      {idealProfiles.map((profile, idx) => (
        <div className="mb-8" key={profile.career}>
          <PersonalityComparison
            data={[
              { label: 'Ochiqlik', value: profile.personalityScores.openness, color: '#2563eb' },
              { label: 'Vijdonlilik', value: profile.personalityScores.conscientiousness, color: '#059669' },
              { label: 'Ekstraversiya', value: profile.personalityScores.extraversion, color: '#f59e42' },
              { label: 'Do\'stona', value: profile.personalityScores.agreeableness, color: '#a21caf' },
              { label: 'Hissiy barqarorlik', value: 100 - profile.personalityScores.neuroticism, color: '#e11d48' }
            ]}
            title={`${profile.career} uchun ideal shaxsiyat`}
          />
        </div>
      ))}
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Shaxsiyat va kasb tanlash</h2>
        
        <div className="prose prose-blue max-w-none">
          <p>
            Shaxsiyat xususiyatlari karyera tanlovida muhim rol o'ynaydi. Ayrim kasblar ma'lum shaxsiyat xususiyatlariga ega odamlar uchun yaxshiroq mos keladi.
          </p>
          
          <h3>Kasblar va ularga mos shaxsiyat xususiyatlari:</h3>
          
          <h4>Software Developer</h4>
          <ul>
            <li><strong>Ochiqlik:</strong> Yangi texnologiyalarni o'rganish va innovatsiyaga intilish</li>
            <li><strong>Vijdonlilik:</strong> Murakkab muammolarni hal qilish va kodlash standartlarini saqlash uchun</li>
            <li><strong>Ekstraversiya (past-o'rta):</strong> Mustaqil ishlashni afzal ko'radi</li>
          </ul>
          
          <h4>Marketing Manager</h4>
          <ul>
            <li><strong>Ekstraversiya (yuqori):</strong> Mijozlar va hamkasblar bilan samarali muloqot</li>
            <li><strong>Ochiqlik:</strong> Ijodiy yondashuv va innovatsion marketing strategiyalari</li>
            <li><strong>Do'stonalik:</strong> Jamoa bilan yaxshi ishlash va hamkorlikni rivojlantirish</li>
          </ul>
          
          <h4>Data Scientist</h4>
          <ul>
            <li><strong>Vijdonlilik (yuqori):</strong> Ma'lumotlar bilan aniq va puxta ishlash</li>
            <li><strong>Ochiqlik:</strong> Muammolarni hal qilishda ijodiy yondashuv</li>
            <li><strong>Hissiy barqarorlik:</strong> Murakkab va stressli vaziyatlarda samarali ishlash</li>
          </ul>
        </div>
      </div>
    </div>
  );
}