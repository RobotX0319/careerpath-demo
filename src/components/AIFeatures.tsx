/**
 * AIFeatures Component
 * 
 * Showcase AI features in a visually appealing grid
 * Features:
 * - Attractive feature cards
 * - Clear descriptions
 * - Direct links to AI features
 * - Visual appeal with icons and colors
 */

import React from 'react';
import AIFeatureCard from './AIFeatureCard';

interface AIFeaturesProps {
  className?: string;
}

export default function AIFeatures({ className = '' }: AIFeaturesProps) {
  const features = [
    {
      title: 'Shaxsiyat tahlili',
      description: "AI texnologiyalari yordamida shaxsiy xususiyatlaringizni tahlil qiling va o'zingiz haqingizda ko'proq bilib oling.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'violet',
      buttonText: 'Tahlil qilish',
      buttonLink: '/personality'
    },
    {
      title: 'Karyera tavsiyalari',
      description: 'Shaxsiyat testingiz natijalariga asoslangan holda sizga eng mos kasblarni va karyera yo\'llarini aniqlang.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'emerald',
      buttonText: 'Kasblarni ko\'rish',
      buttonLink: '/careers'
    },
    {
      title: 'AI Maslahatchi',
      description: 'Karyera va shaxsiy rivojlanish bo\'yicha savollaringizga AI maslahatchi bilan suhbatlashing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'blue',
      badge: 'Yangi',
      buttonText: 'Suhbatlashish',
      buttonLink: '/chat'
    },
    {
      title: 'Resume Tahlili',
      description: 'CV yoki rezyumeningizni AI yordamida tahlil qilib, yaxshilash bo\'yicha tavsiyalar oling.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'amber',
      badge: 'Tez kunda',
      buttonText: 'Kuzatib boring',
    }
  ];

  return (
    <section className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">AI-Powered Karyera Yechimlarimiz</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Sun'iy intellekt texnologiyalari yordamida o'zingiz uchun eng mos karyera yo'nalishini toping
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <AIFeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            buttonText={feature.buttonText}
            buttonLink={feature.buttonLink}
            badge={feature.badge}
            color={feature.color as 'blue' | 'violet' | 'emerald' | 'amber'}
          />
        ))}
      </div>
    </section>
  );
}