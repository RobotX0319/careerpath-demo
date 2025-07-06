/**
 * PersonalityResults component
 * 
 * Displays personality analysis results with feedback buttons
 */

import React from 'react';
import UserResponseView from './UserResponseView';
import { geminiService } from '@/lib/geminiService';
import { recordFeedback } from '@/lib/feedbackService';
import { PersonalityScores } from '@/types';

interface PersonalityResultsProps {
  scores: PersonalityScores;
  analysisResult: string;
}

export default function PersonalityResults({ scores, analysisResult }: PersonalityResultsProps) {
  // Generate a stable ID for this response for feedback tracking
  const responseId = React.useMemo(() => {
    return `personality_${Object.values(scores).join('_')}_${Date.now()}`;
  }, [scores]);
  
  // Handle user feedback
  function handleFeedback(feedback: 'helpful' | 'unhelpful') {
    recordFeedback(responseId, 'personality', feedback);
    
    // If feedback is negative, we might want to regenerate the analysis
    if (feedback === 'unhelpful') {
      console.log('User found personality analysis unhelpful. Consider regenerating.');
    }
  }
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Shaxsiyat tahlili</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Ochiqlik</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${scores.openness}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Yangi g'oyalarga qiziqish, ijodkorlik
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium mb-2">Mas'uliyatlilik</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${scores.conscientiousness}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Tartiblilik, maqsadga intiluvchanlik
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-medium mb-2">Ekstraversiya</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-yellow-600 h-4 rounded-full"
              style={{ width: `${scores.extraversion}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Ijtimoiylik, energiyalilik
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium mb-2">Do'stonallik</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-purple-600 h-4 rounded-full"
              style={{ width: `${scores.agreeableness}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Hamkorlik, hamdardlik
          </p>
        </div>
        
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-medium mb-2">Emotsionallik</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-red-600 h-4 rounded-full"
              style={{ width: `${scores.neuroticism}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Tashvishlanish, his-tuyg'ularga beriluvchanlik
          </p>
        </div>
      </div>
      
      {/* AI analysis with feedback buttons */}
      <UserResponseView 
        responseType="personality"
        responseText={analysisResult}
        responseId={responseId}
        onFeedback={handleFeedback}
      />
    </div>
  );
}