'use client';

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';

interface PageProps {
  params: {
    pathId: string;
  };
}

export default function CareerPathPage({ params }: PageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const pathId = params.pathId;

  // Mock career path data
  const careerPaths: { [key: string]: any } = {
    'frontend-developer': {
      title: 'Frontend Developer',
      description: 'Web sahifalarning foydalanuvchi qismini yaratish',
      steps: [
        {
          title: 'HTML/CSS asoslari',
          duration: '2-3 oy',
          description: 'Web sahifalarning tuzilishi va dizayni',
          skills: ['HTML5', 'CSS3', 'Responsive Design'],
          resources: ['freeCodeCamp', 'MDN Docs', 'CSS-Tricks']
        },
        {
          title: 'JavaScript dasturlash',
          duration: '3-4 oy', 
          description: 'Interaktiv web sahifalar yaratish',
          skills: ['ES6+', 'DOM manipulation', 'Async/Await'],
          resources: ['JavaScript.info', 'Eloquent JavaScript', 'You Don\'t Know JS']
        },
        {
          title: 'React Framework',
          duration: '3-4 oy',
          description: 'Zamonaviy web ilovalar yaratish',
          skills: ['React', 'JSX', 'State Management', 'Hooks'],
          resources: ['React Docs', 'React Tutorial', 'Next.js']
        },
        {
          title: 'Professional Skills',
          duration: '2-3 oy',
          description: 'Amaliy loyihalar va portfolio',
          skills: ['Git/GitHub', 'Testing', 'Deployment', 'Performance'],
          resources: ['GitHub', 'Vercel', 'Jest', 'Lighthouse']
        }
      ],
      totalDuration: '10-14 oy',
      averageSalary: '$800-1500',
      demandLevel: 'Yuqori'
    },
    'backend-developer': {
      title: 'Backend Developer',
      description: 'Server va ma\'lumotlar bazasi bilan ishlash',
      steps: [
        {
          title: 'Dasturlash asoslari',
          duration: '2-3 oy',
          description: 'Dasturlash mantiq va algoritmlari',
          skills: ['Programming Logic', 'Data Structures', 'Algorithms'],
          resources: ['CS50', 'Algorithm Courses', 'LeetCode']
        },
        {
          title: 'Backend tilni o\'rganish',
          duration: '3-4 oy',
          description: 'Node.js, Python yoki Java',
          skills: ['Node.js/Python/Java', 'REST APIs', 'MVC Pattern'],
          resources: ['Node.js Docs', 'Express.js', 'Python Django']
        },
        {
          title: 'Ma\'lumotlar bazasi',
          duration: '2-3 oy',
          description: 'SQL va NoSQL bazalar bilan ishlash',
          skills: ['SQL', 'MongoDB', 'PostgreSQL', 'Database Design'],
          resources: ['SQL Tutorial', 'MongoDB Docs', 'Database Course']
        },
        {
          title: 'DevOps va Deployment',
          duration: '3-4 oy',
          description: 'Server sozlash va loyihani deploy qilish',
          skills: ['Docker', 'AWS/Azure', 'CI/CD', 'Linux'],
          resources: ['Docker Docs', 'AWS Tutorial', 'DevOps Course']
        }
      ],
      totalDuration: '10-14 oy',
      averageSalary: '$900-1600',
      demandLevel: 'Yuqori'
    }
  };

  const currentPath = careerPaths[pathId] || careerPaths['frontend-developer'];

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleNextStep = () => {
    if (currentStep < currentPath.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentPath.title} yo'li
              </h1>
              <p className="mt-2 text-gray-600">{currentPath.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Umumiy muddat</div>
              <div className="text-2xl font-bold text-blue-600">{currentPath.totalDuration}</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-900">O'rtacha maosh</div>
              <div className="text-xl font-bold text-blue-600">{currentPath.averageSalary}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-900">Talab darajasi</div>
              <div className="text-xl font-bold text-green-600">{currentPath.demandLevel}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-900">Qadamlar soni</div>
              <div className="text-xl font-bold text-purple-600">{currentPath.steps.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                O'quv bosqichlari
              </h3>
              <div className="space-y-3">
                {currentPath.steps.map((step: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentStep === index
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === index 
                          ? 'bg-blue-600 text-white'
                          : currentStep > index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {currentStep > index ? '✓' : index + 1}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {step.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPath.steps[currentStep].title}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {currentStep + 1}/{currentPath.steps.length}
                </span>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tavsif</h3>
                  <p className="text-gray-600">{currentPath.steps[currentStep].description}</p>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Muddat</h3>
                  <p className="text-gray-600">{currentPath.steps[currentStep].duration}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">O'rganiladadigan ko'nikmalar</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPath.steps[currentStep].skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Foydali manbalar</h3>
                  <div className="space-y-2">
                    {currentPath.steps[currentStep].resources.map((resource: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        <span className="text-gray-600">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Oldingi
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === currentPath.steps.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Keyingi →
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">O'quv jarayoni</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / currentPath.steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Boshlangan</span>
                <span>{Math.round(((currentStep + 1) / currentPath.steps.length) * 100)}% tugallangan</span>
                <span>Yakunlangan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}