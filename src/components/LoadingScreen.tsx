import React, { useEffect, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  "Javoblaringiz tahlil qilinmoqda...",
  "Shaxsiyat xususiyatlari aniqlanmoqda...",
  "Mos kasblar qidirilyapti...",
  "Natijalar tayyor!"
];

const funFacts = [
  "Maslahat: O'zingizga mos kasb tanlash hayotingizni o'zgartiradi!",
  "Fakt: O'zbekistonda IT sohasiga talab oshmoqda.",
  "Maslahat: O'qish va o'rganish hech qachon kech emas.",
  "Fakt: Har bir inson noyob shaxsiyatga ega!"
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [fact, setFact] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(() => {
        setProgress(p => Math.min(100, p + 2));
        if (progress > 20 && step === 0) setStep(1);
        if (progress > 50 && step === 1) setStep(2);
        if (progress > 85 && step === 2) setStep(3);
        if (progress % 25 === 0) setFact(f => (f + 1) % funFacts.length);
      }, 70);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete, 600);
    }
  }, [progress, step, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 animate-fade-in">
      {/* Spinning Brain Icon */}
      <div className="mb-6">
        <span className="inline-block animate-spin-slow">
          <span className="text-5xl md:text-6xl select-none" role="img" aria-label="brain">🧠</span>
        </span>
      </div>
      {/* Progress Bar */}
      <div className="w-full max-w-md h-4 rounded-full bg-gradient-to-r from-blue-200 to-green-200 mb-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500 animate-pulse"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-lg font-semibold text-blue-800 mt-4 min-h-[2.5rem]">
        {steps[step]}
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 animate-fade-in">
        <SparklesIcon className="w-5 h-5 text-blue-400 animate-pulse" />
        <span>{funFacts[fact]}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;

// Tailwind animatsiyalari uchun styles.css yoki globals.css ga quyidagilarni qo'shing:
// .animate-spin-slow { animation: spin 2s linear infinite; }
// @keyframes spin { 100% { transform: rotate(360deg); } }
