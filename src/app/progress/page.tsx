'use client';

/**
 * Progress Page
 * 
 * User learning progress and achievements
 */

import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { generateSkillProgress, generateLearningProgress } from '@/lib/dataVisualization';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'skills' | 'activity' | 'achievements'>('skills');
  
  const skillProgress = generateSkillProgress();
  const learningProgress = generateLearningProgress();
  
  // Calculate achievements
  const totalHours = learningProgress.reduce((sum, day) => sum + day.hoursStudied, 0);
  const totalSkills = skillProgress.length;
  const averageProgress = skillProgress.reduce((sum, skill) => sum + skill.current, 0) / totalSkills;
  
  const achievements = [
    { id: 1, title: 'Birinchi qadam', description: 'Birinchi testni yakunladingiz', completed: true, icon: '🎯' },
    { id: 2, title: 'O\'rganuvchi', description: '10 soat o\'qidingiz', completed: totalHours >= 10, icon: '📚' },
    { id: 3, title: 'Ko\'nikma ustasi', description: '5 ta ko\'nikma o\'rgandingiz', completed: totalSkills >= 5, icon: '🏆' },
    { id: 4, title: 'Barqaror o\'sish', description: '7 kun ketma-ket o\'qidingiz', completed: false, icon: '🔥' },
    { id: 5, title: 'Mukammallik', description: '90% progress ga erishdingiz', completed: averageProgress >= 90, icon: '⭐' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">O'quv progressi</h1>
          <p className="text-gray-600">
            O'zingizning o'rganish jarayoningizni kuzatib boring
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round(averageProgress)}%</div>
              <div className="text-gray-600">O'rtacha progress</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalHours}</div>
              <div className="text-gray-600">Jami soatlar</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalSkills}</div>
              <div className="text-gray-600">Ko'nikmalar soni</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'skills'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ko'nikmalar
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Faoliyat
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'achievements'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yutuqlar
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Ko'nikmalar progressi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillProgress.map((skill, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <span className="text-sm text-gray-500">{skill.category}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-2">
                        <span>Hozirgi: {skill.current}%</span>
                        <span>Maqsad: {skill.target}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.current}%` }}
                        ></div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-green-400 h-1 rounded-full"
                          style={{ width: `${skill.target}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Oxirgi faoliyat</h3>
                <div className="space-y-4">
                  {learningProgress.slice(-10).reverse().map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">
                          {day.hoursStudied} soat o'rganish, {day.skillsLearned} ko'nikma, {day.testsCompleted} test
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{day.hoursStudied}</div>
                          <div className="text-xs text-gray-500">soat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{day.skillsLearned}</div>
                          <div className="text-xs text-gray-500">ko'nikma</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{day.testsCompleted}</div>
                          <div className="text-xs text-gray-500">test</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Yutuqlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-lg border-2 ${
                        achievement.completed
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <h4 className={`font-semibold mb-2 ${
                          achievement.completed ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.completed ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {achievement.completed && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Bajarildi
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}