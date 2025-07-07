/**
 * AIPromptSuggestions Component
 * 
 * Provides suggested prompts for users to ask the AI assistant
 * Features:
 * - Quick prompt suggestions by category
 * - Click-to-use functionality
 * - Attractive design
 */

import React from 'react';

interface PromptSuggestion {
  text: string;
  category: 'career' | 'education' | 'skills' | 'interview';
}

interface AIPromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export default function AIPromptSuggestions({ onSelectPrompt, className = '' }: AIPromptSuggestionsProps) {
  const suggestions: PromptSuggestion[] = [
    { text: "Menga karyeramni o'zgartirishda nimalarga e'tibor berishim kerak?", category: 'career' },
    { text: "IT sohasida ish topish uchun qanday ko'nikmalar kerak?", category: 'skills' },
    { text: "O'zbekistonda qaysi sohalarda ish o'rinlari ko'p?", category: 'career' },
    { text: "Intervyuga qanday tayyorgarlik ko'rishim kerak?", category: 'interview' },
    { text: "Mening shaxsiyatimga qanday kasblar mos keladi?", category: 'career' },
    { text: "Resume yaxshilash bo'yicha maslahatlar berolasizmi?", category: 'career' },
    { text: "Ingliz tilini o'rganish uchun eng yaxshi usullar qanday?", category: 'education' },
    { text: "Soft skillslarni qanday rivojlantirish mumkin?", category: 'skills' },
  ];

  // Category-specific styles
  const categoryStyles = {
    career: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    education: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    skills: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    interview: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  };

  return (
    <div className={`p-4 rounded-lg bg-white shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-gray-700 font-medium mb-3">Tavsiya etilgan savollar</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(suggestion.text)}
            className={`
              text-left p-2 rounded-md cursor-pointer transition-colors
              text-sm 
              ${categoryStyles[suggestion.category]}
            `}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        Tez yordam olish uchun tavsiya etilgan savollardan birini tanlang
      </p>
    </div>
  );
}