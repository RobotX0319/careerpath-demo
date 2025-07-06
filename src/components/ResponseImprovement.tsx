/**
 * ResponseImprovement component
 * 
 * Provides interface for detailed feedback when a user marks a response as unhelpful
 * to better understand what can be improved
 */

import React, { useState } from 'react';

interface ResponseImprovementProps {
  responseId: string;
  responseType: 'personality' | 'career' | 'chat';
  onSubmit: (details: {
    reason: string;
    comments: string;
    expectation: string;
  }) => void;
  onCancel: () => void;
}

export default function ResponseImprovement({
  responseId,
  responseType,
  onSubmit,
  onCancel
}: ResponseImprovementProps) {
  const [reason, setReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [expectation, setExpectation] = useState<string>('');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      reason,
      comments,
      expectation
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Javobni yaxshilashga yordam bering</h3>
        <p className="text-gray-600 mb-4">
          Javob nima uchun foydali bo'lmaganini tushuntirib bersangiz, 
          kelajakda javoblarni yaxshilashga yordam beradi.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Reason selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Javob nima uchun foydali bo'lmadi?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sababni tanlang</option>
              <option value="incomplete">To'liq emas</option>
              <option value="irrelevant">Mening vaziyatimga mos kelmaydi</option>
              <option value="unclear">Tushunarsiz yoki chalkash</option>
              <option value="technical">Texnik xato bor</option>
              <option value="formatting">Formatlashtirish muammolari bor</option>
              <option value="other">Boshqa sabab</option>
            </select>
          </div>
          
          {/* Detailed comments */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Qo'shimcha izohlar
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Muammoni batafsilroq tushuntiring..."
            />
          </div>
          
          {/* Expectation */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">
              Siz qanday javob kutgan edingiz?
            </label>
            <textarea
              value={expectation}
              onChange={(e) => setExpectation(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Qanday javob ko'rishni xohlardingiz..."
            />
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}