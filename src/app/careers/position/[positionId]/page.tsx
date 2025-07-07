'use client';

/**
 * Career Position Detail Page
 * 
 * Detailed view for specific career positions
 */

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import JobPositionDetail from '@/components/career/JobPositionDetail';

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

// Mock data for different positions
const mockPositions: Record<string, JobPosition> = {
  'frontend-developer': {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Bizning jamoamizga qo\'shilishni istagan frontend dasturchi qidiryapmiz. Siz foydalanuvchi interfeyslari yaratish va veb-ilovalarning frontend qismini rivojlantirish bilan shug\'ullanasiz.',
    requirements: [
      '2+ yil tajriba JavaScript va React da',
      'HTML, CSS, va responsive design bilimi',
      'Git version control tizimini bilish',
      'RESTful API\'lar bilan ishlash tajribasi',
      'Browser compatibility va performance optimization',
      'Agile metodologiya bilan ishlash tajribasi'
    ],
    responsibilities: [
      'Foydalanuvchi interfeyslari yaratish va rivojlantirish',
      'Responsive va mobile-friendly dizaynlar yaratish',
      'Backend API\'lar bilan integratsiya qilish',
      'Kod review va quality assurance',
      'Performance optimization va debugging',
      'Dizayner va backend dasturchilar bilan hamkorlik'
    ],
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Git', 'Webpack', 'REST API'],
    salary: { min: 1000, max: 2500, currency: 'USD' },
    location: 'Toshkent, Uzbekiston',
    type: 'hybrid',
    experience: 'mid',
    company: 'TechCorp Uzbekistan'
  },
  'backend-developer': {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Server tomonidagi mantiq va ma\'lumotlar bazasini boshqaruvchi backend dasturchi izlaymiz. API\'lar yaratish va serverlarni boshqarish asosiy vazifalar.',
    requirements: [
      '3+ yil tajriba Node.js yoki Python da',
      'Database design va SQL bilimi',
      'Cloud platforms (AWS, Azure) tajribasi',
      'API development va documentation',
      'Security best practices bilimi',
      'Docker va containerization tajribasi'
    ],
    responsibilities: [
      'Server-side logic va API\'larni rivojlantirish',
      'Ma\'lumotlar bazasini loyihalash va boshqarish',
      'Security va performance optimizatsiya',
      'Cloud infrastructure bilan ishlash',
      'Microservices arxitekturasini joriy etish',
      'Frontend jamoasi bilan API integratsiyasi'
    ],
    skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'REST API', 'GraphQL', 'Redis'],
    salary: { min: 1500, max: 3000, currency: 'USD' },
    location: 'Toshkent, Uzbekiston',
    type: 'office',
    experience: 'senior',
    company: 'DataSoft Solutions'
  },
  'data-scientist': {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Ma\'lumotlarni tahlil qilish va machine learning modellari yaratish bo\'yicha mutaxassis izlaymiz. Big data bilan ishlash va insights olish asosiy vazifalar.',
    requirements: [
      'Python va R dasturlash tillari bilimi',
      'Machine Learning va Deep Learning tajribasi',
      'Statistics va Mathematics kuchli bilimi',
      'SQL va NoSQL ma\'lumotlar bazalari',
      'Data visualization tools (Tableau, Power BI)',
      'Big Data technologies (Spark, Hadoop) tajribasi'
    ],
    responsibilities: [
      'Ma\'lumotlarni yig\'ish, tozalash va tahlil qilish',
      'Machine Learning modellari yaratish va train qilish',
      'Business metrics va KPI\'larni rivojlantirish',
      'Data visualization va reporting',
      'A/B testing va statistical analysis',
      'Business stakeholders bilan ishlash'
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Tableau', 'Spark'],
    salary: { min: 2000, max: 4000, currency: 'USD' },
    location: 'Remote',
    type: 'remote',
    experience: 'senior',
    company: 'AI Innovations Ltd'
  }
};

export default function CareerPositionPage() {
  const params = useParams();
  const router = useRouter();
  const positionId = params?.positionId as string;
  
  const [position] = useState<JobPosition | null>(
    positionId ? mockPositions[positionId] || null : null
  );
  
  // If job position not found, redirect to careers page
  if (!position) {
    router.push('/careers');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/careers" className="hover:text-blue-600">Karyeralar</a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{position.title}</li>
          </ol>
        </nav>
        
        {/* Position Details */}
        <JobPositionDetail position={position} />
        
        {/* Related Positions */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">O'xshash lavozimlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(mockPositions)
              .filter(pos => pos.id !== position.id)
              .slice(0, 3)
              .map((relatedPosition) => (
                <a
                  key={relatedPosition.id}
                  href={`/careers/position/${relatedPosition.id}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-semibold mb-2">{relatedPosition.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {relatedPosition.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{relatedPosition.location}</span>
                    <span className="font-medium text-blue-600">
                      ${relatedPosition.salary.min}-{relatedPosition.salary.max}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}