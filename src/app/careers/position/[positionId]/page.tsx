'use client';

/**
 * Career Position Detail Page
 * 
 * Detailed view for specific career positions
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';

// Dynamic import for the career position content to avoid SSR issues
const CareerPositionContent = dynamic(() => Promise.resolve(({ params }: { params: { positionId: string } }) => {
  const router = useRouter();
  const [position, setPosition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Mock career position data
    const mockPosition = {
      id: params.positionId,
      title: `Karyera Pozitsiyasi ${params.positionId}`,
      company: 'Tech Company',
      location: 'Toshkent, O\'zbekiston',
      salary: '$50,000 - $70,000',
      type: 'To\'liq vaqt',
      level: 'O\'rta darajali',
      description: 'Bu ajoyib karyera imkoniyati bo\'lib, sizning ko\'nikmalaringizni rivojlantirishga yordam beradi.',
      requirements: [
        '3+ yil tajriba',
        'TypeScript/JavaScript bilimi',
        'React/Next.js tajribasi',
        'Jamoa bilan ishlash ko\'nikmasi'
      ],
      benefits: [
        'Raqobatbardosh maosh',
        'Sog\'liqni saqlash sug\'urtasi',
        'Flexible ish vaqti',
        'Professional rivojlanish imkoniyatlari'
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setPosition(mockPosition);
      setIsLoading(false);
    }, 1000);
  }, [params.positionId]);

  const handleApply = () => {
    if (typeof window !== 'undefined') {
      // Safe to use window/location here
      alert('Ariza yuborish funksiyasi tez orada qo\'shiladi!');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: position?.title,
        text: position?.description,
        url: window.location.href
      });
    } else if (typeof window !== 'undefined') {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link nusxa olindi!');
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-3/4 mb-4 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 mb-8 rounded"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pozitsiya topilmadi
          </h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {position.title}
              </h1>
              <p className="text-xl text-gray-700 mb-1">{position.company}</p>
              <p className="text-gray-600">{position.location}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ulashish
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ariza berish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Maosh</h3>
              <p className="text-gray-700">{position.salary}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Ish turi</h3>
              <p className="text-gray-700">{position.type}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Daraja</h3>
              <p className="text-gray-700">{position.level}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Ish haqida
            </h2>
            <p className="text-gray-700 mb-6">{position.description}</p>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Talablar
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {position.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Imtiyozlar
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {position.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 w-3/4 mb-4 rounded"></div>
          <div className="bg-gray-300 h-4 w-1/2 mb-8 rounded"></div>
          <div className="space-y-4">
            <div className="bg-gray-300 h-4 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default function CareerPositionPage({ params }: { params: { positionId: string } }) {
  return <CareerPositionContent params={params} />;
}