'use client';

/**
 * JobPositionDetail Component
 * 
 * Detailed information about specific job positions
 */

import React, { useState } from 'react';

interface JobPosition {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  type: 'remote' | 'office' | 'hybrid';
  experience: 'junior' | 'mid' | 'senior';
  company?: string;
}

interface JobPositionDetailProps {
  position: JobPosition;
  onClose?: () => void;
}

export default function JobPositionDetail({ position, onClose }: JobPositionDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'responsibilities'>('overview');
  
  const formatSalary = (salary: JobPosition['salary']) => {
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
  };
  
  const getExperienceLabel = (exp: string) => {
    switch (exp) {
      case 'junior': return 'Junior (0-2 yil)';
      case 'mid': return 'Middle (2-5 yil)';
      case 'senior': return 'Senior (5+ yil)';
      default: return exp;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'remote': return 'Masofaviy';
      case 'office': return 'Ofisda';
      case 'hybrid': return 'Gibrid';
      default: return type;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h1>
            {position.company && (
              <p className="text-lg text-gray-600 mb-2">{position.company}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>📍 {position.location}</span>
              <span>💼 {getTypeLabel(position.type)}</span>
              <span>⭐ {getExperienceLabel(position.experience)}</span>
              <span>💰 {formatSalary(position.salary)}</span>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Umumiy ma'lumot
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'requirements'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Talablar
          </button>
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'responsibilities'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Majburiyatlar
          </button>
        </nav>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Lavozim haqida</h3>
              <p className="text-gray-700 leading-relaxed">{position.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Zarur ko'nikmalar</h3>
              <div className="flex flex-wrap gap-2">
                {position.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Ish turi</h4>
                <p className="text-gray-600">{getTypeLabel(position.type)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tajriba darajasi</h4>
                <p className="text-gray-600">{getExperienceLabel(position.experience)}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Joylashuv</h4>
                <p className="text-gray-600">{position.location}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Maosh</h4>
                <p className="text-gray-600">{formatSalary(position.salary)}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'requirements' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Talablar</h3>
            <ul className="space-y-2">
              {position.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'responsibilities' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Majburiyatlar</h3>
            <ul className="space-y-2">
              {position.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Bu lavozim sizning profilingizga mos kelishi: 
            <span className="font-semibold text-green-600 ml-1">85%</span>
          </div>
          
          <div className="space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Saqlash
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Ariza topshirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}