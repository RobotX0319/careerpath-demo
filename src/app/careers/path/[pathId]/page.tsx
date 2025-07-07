'use client';

/**
 * Career Path Detail Page
 * 
 * Shows detailed career path information
 */

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import CareerPathMap from '@/components/career/CareerPathMap';
import PersonalityComparison from '@/components/PersonalityComparison';
// import type { ComparisonData } from '@/components/PersonalityComparison';

interface CareerPathDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  salary: {
    entry: number;
    mid: number;
    senior: number;
  };
  steps: {
    id: string;
    title: string;
    description: string;
    duration: string;
    skills: string[];
    completed: boolean;
  }[];
  requiredSkills: string[];
  personalityMatch: {
    label: string;
    value: number;
    color: string;
  }[];
  jobMarket: {
    demand: number;
    growth: number;
    competition: number;
  };
}

// Mock data for different career paths
const mockCareerPaths: Record<string, CareerPathDetail> = {
  'software-development': {
    id: 'software-development',
    title: 'Dasturiy Ta\'minot Ishlab Chiqish',
    description: 'Zamonaviy web va mobile ilovalar yaratish bo\'yicha to\'liq yo\'l. Frontend va backend texnologiyalarni o\'rganib, full-stack developer bo\'ling.',
    duration: '12-18 oy',
    difficulty: 'Intermediate',
    salary: { entry: 800, mid: 2000, senior: 4000 },
    steps: [
      {
        id: '1',
        title: 'Dasturlash asoslari',
        description: 'HTML, CSS, JavaScript asoslarini o\'rganing',
        duration: '2-3 oy',
        skills: ['HTML', 'CSS', 'JavaScript'],
        completed: true
      },
      {
        id: '2',
        title: 'Frontend Framework',
        description: 'React yoki Vue.js o\'rganing',
        duration: '3-4 oy',
        skills: ['React', 'State Management', 'API Integration'],
        completed: false
      },
      {
        id: '3',
        title: 'Backend Development',
        description: 'Server-side dasturlash va ma\'lumotlar bazasi',
        duration: '4-5 oy',
        skills: ['Node.js', 'Express', 'Database', 'API Design'],
        completed: false
      },
      {
        id: '4',
        title: 'DevOps va Deployment',
        description: 'Cloud platforms va CI/CD',
        duration: '2-3 oy',
        skills: ['AWS', 'Docker', 'CI/CD', 'Git'],
        completed: false
      }
    ],
    requiredSkills: ['Analytical Thinking', 'Problem Solving', 'Patience', 'Creativity'],
    personalityMatch: [
      { label: 'Mantiqiy fikrlash', value: 85, color: '#3b82f6' },
      { label: 'Ijodkorlik', value: 75, color: '#10b981' },
      { label: 'Sabr-toqat', value: 80, color: '#f59e0b' },
      { label: 'O\'rganishga ishtiyoq', value: 90, color: '#8b5cf6' }
    ],
    jobMarket: { demand: 95, growth: 88, competition: 70 }
  },
  'data-science': {
    id: 'data-science',
    title: 'Ma\'lumotlar Ilmi',
    description: 'Big Data va Machine Learning orqali ma\'lumotlardan qimmatli insights olish. Python, statistika va ML algoritmlarini o\'rganing.',
    duration: '15-20 oy',
    difficulty: 'Advanced',
    salary: { entry: 1200, mid: 2800, senior: 5000 },
    steps: [
      {
        id: '1',
        title: 'Matematik asos',
        description: 'Statistika, algebra va ehtimollik nazariyasi',
        duration: '3-4 oy',
        skills: ['Statistics', 'Linear Algebra', 'Probability'],
        completed: false
      },
      {
        id: '2',
        title: 'Python va Data Analysis',
        description: 'Pandas, NumPy va data manipulation',
        duration: '4-5 oy',
        skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization'],
        completed: false
      },
      {
        id: '3',
        title: 'Machine Learning',
        description: 'ML algoritmlar va model training',
        duration: '5-6 oy',
        skills: ['Scikit-learn', 'TensorFlow', 'Deep Learning'],
        completed: false
      },
      {
        id: '4',
        title: 'Big Data va Production',
        description: 'Spark, cloud platforms va MLOps',
        duration: '3-4 oy',
        skills: ['Apache Spark', 'AWS', 'MLOps', 'Docker'],
        completed: false
      }
    ],
    requiredSkills: ['Mathematical Thinking', 'Research Skills', 'Curiosity', 'Attention to Detail'],
    personalityMatch: [
      { label: 'Matematik fikrlash', value: 95, color: '#3b82f6' },
      { label: 'Tadqiqot qobiliyati', value: 90, color: '#10b981' },
      { label: 'Qiziquvchanlik', value: 85, color: '#f59e0b' },
      { label: 'Aniqlik', value: 88, color: '#8b5cf6' }
    ],
    jobMarket: { demand: 92, growth: 95, competition: 85 }
  },
  'ui-ux-design': {
    id: 'ui-ux-design',
    title: 'UI/UX Dizayn',
    description: 'Foydalanuvchi tajribasi va interfeys dizayni bo\'yicha mutaxassis bo\'ling. User research, wireframing va prototyping o\'rganing.',
    duration: '8-12 oy',
    difficulty: 'Beginner',
    salary: { entry: 600, mid: 1500, senior: 3000 },
    steps: [
      {
        id: '1',
        title: 'Dizayn asoslari',
        description: 'Rang, tipografiya va kompozitsiya',
        duration: '2-3 oy',
        skills: ['Color Theory', 'Typography', 'Layout'],
        completed: false
      },
      {
        id: '2',
        title: 'UX Research',
        description: 'User research va usability testing',
        duration: '2-3 oy',
        skills: ['User Research', 'Personas', 'User Journey'],
        completed: false
      },
      {
        id: '3',
        title: 'Dizayn vositalari',
        description: 'Figma, Sketch va prototyping',
        duration: '2-3 oy',
        skills: ['Figma', 'Prototyping', 'Wireframing'],
        completed: false
      },
      {
        id: '4',
        title: 'Portfolio yaratish',
        description: 'Real loyihalar va case studies',
        duration: '2-3 oy',
        skills: ['Portfolio', 'Case Studies', 'Presentation'],
        completed: false
      }
    ],
    requiredSkills: ['Creativity', 'Empathy', 'Visual Thinking', 'Communication'],
    personalityMatch: [
      { label: 'Ijodkorlik', value: 95, color: '#3b82f6' },
      { label: 'Empatiya', value: 90, color: '#10b981' },
      { label: 'Vizual fikrlash', value: 88, color: '#f59e0b' },
      { label: 'Muloqot', value: 85, color: '#8b5cf6' }
    ],
    jobMarket: { demand: 85, growth: 75, competition: 80 }
  }
};

export default function CareerPathDetailPage() {
  const params = useParams();
  const pathId = params?.pathId as string;
  
  const [careerPath] = useState<CareerPathDetail | null>(
    pathId ? mockCareerPaths[pathId] || null : null
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  
  if (!careerPath) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Karyera yo'li topilmadi</h2>
            <p className="text-gray-600 mb-6">
              Siz qidirayotgan karyera yo'li mavjud emas yoki o'chirilgan.
            </p>
            <a
              href="/careers"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Barcha yo'llarni ko'rish
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <li className="text-gray-900 font-medium">{careerPath.title}</li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{careerPath.title}</h1>
              <p className="text-gray-600 max-w-3xl">{careerPath.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(careerPath.difficulty)}`}>
              {careerPath.difficulty}
            </span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{careerPath.duration}</div>
              <div className="text-gray-600">Davomiyligi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${careerPath.salary.entry}-{careerPath.salary.senior}</div>
              <div className="text-gray-600">Maosh oralig'i</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{careerPath.jobMarket.demand}%</div>
              <div className="text-gray-600">Bozor talabi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{careerPath.steps.length}</div>
              <div className="text-gray-600">Bosqichlar</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Path Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">O'rganish yo'li</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Karyera yo'li xaritasi</h3>
              <div className="space-y-4">
                {careerPath.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                      index === currentStep 
                        ? 'border-blue-500 bg-blue-50' 
                        : index < currentStep 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                      index === currentStep 
                        ? 'bg-blue-500' 
                        : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Muddat: {step.duration}</p>
                    </div>
                    {index < currentStep && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
              
              {/* Step Details */}
              <div className="mt-8 space-y-4">
                {careerPath.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      index === currentStep ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{step.duration}</span>
                        {step.completed && (
                          <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Market Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Bozor tahlili</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Talab</span>
                    <span className="text-sm font-medium">{careerPath.jobMarket.demand}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${careerPath.jobMarket.demand}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">O'sish</span>
                    <span className="text-sm font-medium">{careerPath.jobMarket.growth}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${careerPath.jobMarket.growth}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Raqobat</span>
                    <span className="text-sm font-medium">{careerPath.jobMarket.competition}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${careerPath.jobMarket.competition}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Personality Match */}
            <PersonalityComparison 
              data={careerPath.personalityMatch}
              title="Shaxsiyat mosligi"
              height={250}
              width={300}
            />
            
            {/* Required Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Zarur ko'nikmalar</h3>
              <div className="space-y-2">
                {careerPath.requiredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Harakat</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                  Yo'lni boshlash
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                  Maslahat olish
                </button>
                <button className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                  Saqlab qo'yish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}