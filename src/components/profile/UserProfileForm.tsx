'use client';

/**
 * UserProfileForm Component
 * 
 * Form for editing user profile information
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { isValidEmail, areRequiredFieldsFilled } from '@/utils/validation';

interface FormData {
  displayName: string;
  email: string;
  skills: string[];
  bio: string;
  location: string;
  experience: string;
}

export default function UserProfileForm() {
  const { user, profile, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    skills: [],
    bio: '',
    location: '',
    experience: 'junior'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load user data into form
  useEffect(() => {
    if (user && profile) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        skills: profile.skills || [],
        bio: (profile as any).bio || '',
        location: (profile as any).location || '',
        experience: (profile as any).experience || 'junior'
      });
    }
  }, [user, profile]);
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Ism kiritish majburiy';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email kiritish majburiy';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email format noto\'g\'ri';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        displayName: formData.displayName,
        skills: formData.skills,
        bio: formData.bio,
        location: formData.location,
        experience: formData.experience
      } as any);
      
      addNotification({
        title: 'Profil yangilandi',
        message: 'Profil ma\'lumotlaringiz muvaffaqiyatli yangilandi',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Xatolik',
        message: 'Profil yangilashda xatolik yuz berdi',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Profil ma'lumotlari</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
            To'liq ism *
          </label>
          <input
            type="text"
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.displayName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="To'liq ismingizni kiriting"
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email manzil *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
            disabled // Email should not be editable
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Qisqa ma'lumot
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="O'zingiz haqingizda qisqacha ma'lumot bering..."
          />
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Joylashuv
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Shahar, Mamlakat"
          />
        </div>
        
        {/* Experience Level */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium mb-2">
            Tajriba darajasi
          </label>
          <select
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Talaba</option>
            <option value="junior">Junior (0-2 yil)</option>
            <option value="mid">Middle (2-5 yil)</option>
            <option value="senior">Senior (5+ yil)</option>
            <option value="lead">Lead/Manager</option>
          </select>
        </div>
        
        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Ko'nikmalar
          </label>
          
          {/* Add new skill */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Yangi ko'nikma qo'shish"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Qo'shish
            </button>
          </div>
          
          {/* Skills list */}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-medium ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}