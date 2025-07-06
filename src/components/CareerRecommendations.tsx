/**
 * CareerRecommendations component
 * 
 * Displays career recommendations with feedback buttons
 */

import React from 'react';
import UserResponseView from './UserResponseView';
import { geminiService } from '@/lib/geminiService';
import { recordFeedback } from '@/lib/feedbackService';
import { PersonalityScores } from '@/types';

interface CareerRecommendationsProps {
  personalityScores: PersonalityScores;
  skills: string[];
  interests: string[];
  recommendationsResult: string;
}

export default function CareerRecommendations({
  personalityScores,
  skills,
  interests,
  recommendationsResult
}: CareerRecommendationsProps) {
  // Generate a stable ID for this response for feedback tracking
  const responseId = React.useMemo(() => {
    return `career_${Object.values(personalityScores).join('_')}_${Date.now()}`;
  }, [personalityScores]);
  
  // Handle user feedback
  function handleFeedback(feedback: 'helpful' | 'unhelpful') {
    recordFeedback(responseId, 'career', feedback);
    
    // If feedback is negative, we might want to provide additional info
    if (feedback === 'unhelpful') {
      console.log('User found career recommendations unhelpful');
    }
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Karyera tavsiyalari</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2">Siz ko'rsatgan ma'lumotlar</h3>
        
        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">Ko'nikmalar:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Interests */}
        {interests.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700">Qiziqishlar:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* AI recommendations with feedback buttons */}
      <UserResponseView 
        responseType="career"
        responseText={recommendationsResult}
        responseId={responseId}
        onFeedback={handleFeedback}
      />
    </div>
  );
}