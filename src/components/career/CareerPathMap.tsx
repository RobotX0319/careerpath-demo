'use client';

/**
 * CareerPathMap Component
 * 
 * Visual representation of career progression path
 */

import React from 'react';

interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  completed: boolean;
}

interface CareerPathMapProps {
  steps: CareerStep[];
  currentStep?: number;
}

export default function CareerPathMap({ steps, currentStep = 0 }: CareerPathMapProps) {
  return (
    <div className="career-path-map">
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start mb-8 last:mb-0">
            {/* Step Number */}
            <div className="relative">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                step.completed ? 'bg-green-500' :
                index === currentStep ? 'bg-blue-500' :
                index < currentStep ? 'bg-gray-400' : 'bg-gray-300'
              }`}>
                {step.completed ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
            
            {/* Step Content */}
            <div className="ml-4 flex-1">
              <div className={`p-4 rounded-lg border ${
                index === currentStep ? 'border-blue-500 bg-blue-50' :
                step.completed ? 'border-green-500 bg-green-50' :
                'border-gray-200 bg-white'
              }`}>
                <h4 className={`font-semibold text-lg mb-2 ${
                  index === currentStep ? 'text-blue-700' :
                  step.completed ? 'text-green-700' :
                  'text-gray-900'
                }`}>
                  {step.title}
                </h4>
                
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {step.duration}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {step.completed && (
                      <span className="text-green-600 text-sm font-medium">Yakunlandi</span>
                    )}
                    {index === currentStep && (
                      <span className="text-blue-600 text-sm font-medium">Joriy bosqich</span>
                    )}
                  </div>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        step.completed ? 'bg-green-100 text-green-800' :
                        index === currentStep ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Umumiy progress:</span>
          <span className="text-sm font-bold text-gray-900">
            {steps.filter(step => step.completed).length} / {steps.length} bosqich
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ 
              width: `${(steps.filter(step => step.completed).length / steps.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}