"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestQuestion from '@/components/TestQuestion';
import questionsData from '@/data/personality-questions.json';

const questions = questionsData.questions;

const educationOptions = [
  'O‘rta',
  'O‘rta maxsus',
  'Oliy',
  'Magistr',
  'PhD',
];
const cityOptions = [
  'Toshkent', 'Andijon', 'Farg‘ona', 'Namangan', 'Buxoro', 'Samarqand', 'Qarshi', 'Nukus', 'Xorazm', 'Jizzax', 'Sirdaryo', 'Surxondaryo', 'Qashqadaryo', 'Navoiy', 'Boshqa'
];

export default function TestPage() {
  const router = useRouter();
  const [showUserForm, setShowUserForm] = useState(true);
  const [userData, setUserData] = useState({ name: '', age: '', education: '', city: '' });
  const [formError, setFormError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));

  // Form validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name.trim() || !userData.age || !userData.education || !userData.city) {
      setFormError('Barcha maydonlarni to‘ldiring.');
      return;
    }
    setFormError('');
    setShowUserForm(false);
  };

  // Test navigation
  const handleAnswer = (value: number) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentQuestion] = value;
      return updated;
    });
  };

  const handlePrev = () => setCurrentQuestion(q => Math.max(0, q - 1));
  const handleNext = () => setCurrentQuestion(q => Math.min(questions.length - 1, q + 1));

  const handleFinish = () => {
    // Save to localStorage
    localStorage.setItem('careerpath-user', JSON.stringify(userData));
    localStorage.setItem('careerpath-answers', JSON.stringify(answers));
    router.push('/results');
  };

  // Form rendering
  if (showUserForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-50 p-4">
        <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">Ro‘yxatdan o‘tish</h2>
          <input
            type="text"
            placeholder="Ismingiz"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userData.name}
            onChange={e => setUserData({ ...userData, name: e.target.value })}
            required
          />
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userData.age}
            onChange={e => setUserData({ ...userData, age: e.target.value })}
            required
          >
            <option value="">Yosh (16-65)</option>
            {Array.from({ length: 50 }, (_, i) => 16 + i).map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userData.education}
            onChange={e => setUserData({ ...userData, education: e.target.value })}
            required
          >
            <option value="">Ta’lim darajasi</option>
            {educationOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={userData.city}
            onChange={e => setUserData({ ...userData, city: e.target.value })}
            required
          >
            <option value="">Shahar</option>
            {cityOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Testni boshlash
          </button>
        </form>
      </div>
    );
  }

  // Test rendering
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-50 p-4">
      <div className="w-full max-w-xl mx-auto">
        <TestQuestion
          question={questions[currentQuestion].text}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={answers[currentQuestion]}
        />
        <div className="flex justify-between mt-8 gap-2">
          <button
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50"
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Oldingi
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              onClick={handleNext}
              disabled={answers[currentQuestion] === 0}
            >
              Keyingi
            </button>
          ) : (
            <button
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              onClick={handleFinish}
              disabled={answers[currentQuestion] === 0}
            >
              Tugatish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
