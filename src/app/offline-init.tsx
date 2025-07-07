'use client';

/**
 * Offline Database Initialization
 * 
 * This component initializes the offline database when app first loads
 */

import { useEffect } from 'react';
import { register } from '@/utils/serviceWorkerRegistration';
import { saveCareerPathData } from '@/lib/offlineStorage';

export default function OfflineInit() {
  useEffect(() => {
    // Register service worker for PWA
    register({
      onSuccess: (registration) => {
        console.log('Service Worker registered successfully:', registration);
      },
      onUpdate: (registration) => {
        console.log('Service Worker update available:', registration);
      }
    });
    
    // Initialize offline data storage - store essential data for offline use
    const initOfflineData = async () => {
      try {
        // Mock data for demo - replace with actual data fetching
        const mockCareerPaths = [
          { id: 'frontend', name: 'Frontend Development', description: 'Web interface development' },
          { id: 'backend', name: 'Backend Development', description: 'Server-side development' }
        ];
        
        const mockSkills = [
          { id: 'js', name: 'JavaScript', category: 'Programming' },
          { id: 'react', name: 'React', category: 'Framework' }
        ];
        
        // Save mock data
        await saveCareerPathData('careerPaths', mockCareerPaths);
        await saveCareerPathData('skills', mockSkills);
        
        console.log('Essential data cached for offline use');
      } catch (error) {
        console.error('Failed to cache essential data:', error);
      }
    };
    
    initOfflineData();
  }, []);
  
  // This component doesn't render anything visually
  return null;
}