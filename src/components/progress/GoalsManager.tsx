'use client';

/**
 * Goals Manager Component
 */

import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  progress: number;
  category: 'career' | 'education' | 'skills' | 'personal';
  priority: 'high' | 'medium' | 'low';
  deadline?: number;
  steps?: Array<{ id: string; title: string; completed: boolean }>;
  createdAt: number;
  updatedAt: number;
}

interface GoalsManagerProps {
  className?: string;
  limit?: number;
  showAddNew?: boolean;
}

export default function GoalsManager({ 
  className = '', 
  limit,
  showAddNew = true
}: GoalsManagerProps) {
  const { notifications } = useNotifications();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>>({
    title: '',
    description: '',
    status: 'planned',
    progress: 0,
    category: 'career',
    priority: 'medium',
    steps: []
  });
  const [newStep, setNewStep] = useState('');
  
  // Filter and limit goals if needed
  const displayGoals = limit ? goals.slice(0, limit) : goals;
  
  // Get category name in Uzbek
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'career': return 'Karyera';
      case 'education': return "Ta'lim";
      case 'skills': return "Ko'nikmalar";
      case 'personal': return 'Shaxsiy';
      default: return category;
    }
  };
  
  // Get status name in Uzbek
  const getStatusName = (status: string) => {
    switch (status) {
      case 'planned': return 'Rejalashtirilgan';
      case 'in-progress': return 'Jarayonda';
      case 'completed': return 'Tugallangan';
      case 'paused': return "To'xtatilgan";
      default: return status;
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority name and color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { name: 'Yuqori', color: 'bg-red-100 text-red-800' };
      case 'medium':
        return { name: "O'rta", color: 'bg-yellow-100 text-yellow-800' };
      case 'low':
        return { name: 'Past', color: 'bg-green-100 text-green-800' };
      default:
        return { name: priority, color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('uz-UZ');
  };
  
  // Days until deadline
  const daysUntil = (deadline: number) => {
    return Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
  };
  
  // Check if date is past
  const isPast = (timestamp: number) => {
    return timestamp < Date.now();
  };
  
  // Format deadline with warning for close dates
  const formatDeadline = (deadline?: number) => {
    if (!deadline) return null;
    
    const days = daysUntil(deadline);
    let className = 'text-gray-600';
    
    if (isPast(deadline)) {
      className = 'text-red-600 font-medium';
    } else if (days <= 3) {
      className = 'text-yellow-600 font-medium';
    } else if (days <= 7) {
      className = 'text-orange-500';
    }
    
    return {
      text: formatDate(deadline),
      timeLeft: days > 0 ? `${days} kun qoldi` : 'Muddat o\'tgan',
      className
    };
  };
  
  // Handle adding new step to goal
  const handleAddStep = () => {
    if (!newStep.trim()) return;
    
    setNewGoal({
      ...newGoal,
      steps: [
        ...(newGoal.steps || []),
        { id: `step-${Date.now()}`, title: newStep.trim(), completed: false }
      ]
    });
    
    setNewStep('');
  };
  
  // Handle removing step from goal
  const handleRemoveStep = (stepId: string) => {
    setNewGoal({
      ...newGoal,
      steps: newGoal.steps?.filter(step => step.id !== stepId)
    });
  };
  
  // Handle adding new goal
  const handleAddGoal = async () => {
    if (!newGoal.title) return;
    
    try {
      const goalData: Goal = {
        id: `goal-${Date.now()}`,
        title: newGoal.title,
        description: newGoal.description || '',
        status: newGoal.status || 'planned',
        progress: newGoal.progress || 0,
        category: newGoal.category || 'career',
        priority: newGoal.priority || 'medium',
        deadline: newGoal.deadline,
        steps: newGoal.steps || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      setGoals(prev => [goalData, ...prev]);
      
      // Reset form
      setNewGoal({
        title: '',
        description: '',
        status: 'planned',
        progress: 0,
        category: 'career',
        priority: 'medium',
        steps: []
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };
  
  // Handle updating goal status
  const handleStatusChange = (goalId: string, newStatus: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            status: newStatus as Goal['status'],
            progress: newStatus === 'completed' ? 100 : goal.progress,
            updatedAt: Date.now()
          }
        : goal
    ));
  };
  
  // Handle updating goal progress
  const handleProgressChange = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        let status = goal.status;
        
        if (progress === 100) {
          status = 'completed';
        } else if (progress > 0 && progress < 100 && status === 'planned') {
          status = 'in-progress';
        }
        
        return {
          ...goal,
          progress,
          status,
          updatedAt: Date.now()
        };
      }
      return goal;
    }));
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Maqsadlar</h2>
          {showAddNew && (
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Yangi maqsad
            </button>
          )}
        </div>
      </div>
      
      {/* Add new goal form */}
      {isAddingNew && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Yangi maqsad qo'shish</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maqsad nomi
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maqsad nomini kiriting"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tavsif
              </label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maqsad haqida batafsil ma'lumot"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toifa
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="career">Karyera</option>
                  <option value="education">Ta'lim</option>
                  <option value="skills">Ko'nikmalar</option>
                  <option value="personal">Shaxsiy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Muhimlik darajasi
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">Yuqori</option>
                  <option value="medium">O'rta</option>
                  <option value="low">Past</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Muddat
                </label>
                <input
                  type="date"
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    deadline: e.target.value ? new Date(e.target.value).getTime() : undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Goals list */}
      <div className="p-6">
        {displayGoals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Hali maqsadlar yo'q</p>
            {showAddNew && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Birinchi maqsadni qo'shing
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-800">{goal.title}</h4>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {getStatusName(goal.status)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityInfo(goal.priority).color}`}>
                      {getPriorityInfo(goal.priority).name}
                    </span>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                )}
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{getCategoryName(goal.category)}</span>
                  {goal.deadline && (
                    <span className={formatDeadline(goal.deadline)?.className}>
                      {formatDeadline(goal.deadline)?.timeLeft}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {limit && goals.length > limit && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Barcha maqsadlarni ko'rish ({goals.length})
          </button>
        </div>
      )}
    </div>
  );
}