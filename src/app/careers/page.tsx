'use client';

/**
 * Careers Page
 * 
 * Displays available career paths and information
 */

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
// import CareerPathMap from '@/components/career/CareerPathMap';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  growth: string;
  difficulty: 'Oson' | 'O\'rta' | 'Qiyin';
}

const careerPaths: CareerPath[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Veb-sayt va ilovalarning foydalanuvchi interfeysini yaratish',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
    salary: '$50,000 - $120,000',
    growth: 'Yuqori',
    difficulty: 'O\'rta'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Server tomonidagi mantiq va ma\'lumotlar bazasini boshqarish',
    skills: ['Node.js', 'Python', 'Java', 'SQL', 'API'],
    salary: '$60,000 - $140,000',
    growth: 'Yuqori',
    difficulty: 'O\'rta'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Frontend va backend texnologiyalarida ishlash',
    skills: ['JavaScript', 'React', 'Node.js', 'Database', 'DevOps'],
    salary: '$70,000 - $150,000',
    growth: 'Juda yuqori',
    difficulty: 'Qiyin'
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    description: 'Mobil ilovalar yaratish (iOS va Android)',
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
    salary: '$65,000 - $130,000',
    growth: 'Yuqori',
    difficulty: 'O\'rta'
  },
  {
    id: 'data-science',
    title: 'Data Scientist',
    description: 'Ma\'lumotlarni tahlil qilish va machine learning modellari yaratish',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
    salary: '$80,000 - $160,000',
    growth: 'Juda yuqori',
    difficulty: 'Qiyin'
  }
];

export default function CareersPage() {
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCareers = careerPaths.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Karyera yo'nalishlari</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            IT sohasidagi turli karyera yo'nalishlarini o'rganing va o'zingizga mos yo'nalishni tanlang
          </p>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Karyera yo'nalishini qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Career Path Map */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Karyera yo'nalishlari xaritasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredCareers.map((career) => (
                <button
                  key={career.id}
                  onClick={() => setSelectedCareer(career)}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium">{career.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCareer(career)}
            >
              <h3 className="text-xl font-semibold mb-2">{career.title}</h3>
              <p className="text-gray-600 mb-4">{career.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Maosh:</span>
                  <span className="text-sm font-medium">{career.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">O'sish:</span>
                  <span className="text-sm font-medium">{career.growth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Qiyinchilik:</span>
                  <span className={`text-sm font-medium ${
                    career.difficulty === 'Oson' ? 'text-green-600' :
                    career.difficulty === 'O\'rta' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {career.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {career.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
                {career.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{career.skills.length - 3} boshqa
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Career Detail Modal */}
        {selectedCareer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedCareer.title}</h2>
                  <button
                    onClick={() => setSelectedCareer(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedCareer.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedCareer.salary}</div>
                    <div className="text-sm text-gray-500">Yillik maosh</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedCareer.growth}</div>
                    <div className="text-sm text-gray-500">O'sish sur'ati</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${
                      selectedCareer.difficulty === 'Oson' ? 'text-green-600' :
                      selectedCareer.difficulty === 'O\'rta' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedCareer.difficulty}
                    </div>
                    <div className="text-sm text-gray-500">Qiyinchilik darajasi</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Zarur ko'nikmalar</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}