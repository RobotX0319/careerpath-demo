/**
 * JobCard component
 * 
 * Displays a job recommendation with feedback buttons
 */

import React from 'react';
import { recordFeedback } from '@/lib/feedbackService';
import FeedbackButtons from './FeedbackButtons';

interface JobCardProps {
  jobId: string;
  title: string;
  company: string;
  description: string;
  match: number; // percentage match based on personality
  requirements?: string[];
  location?: string;
}

export default function JobCard({
  jobId,
  title,
  company,
  description,
  match,
  requirements = [],
  location
}: JobCardProps) {
  // Handle user feedback on job recommendation
  function handleFeedback(feedback: 'helpful' | 'unhelpful') {
    recordFeedback(jobId, 'career', feedback);
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-600">{company}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
        </div>
        
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
          {match}% mos
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{description}</p>
      
      {/* Requirements */}
      {requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Talablar:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {requirements.map((requirement, index) => (
              <li key={index} className="text-sm text-gray-700">{requirement}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Apply button */}
      <div className="mt-4 flex justify-between items-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Ariza topshirish
        </button>
        
        {/* Feedback buttons */}
        <FeedbackButtons 
          responseType="career"
          responseId={jobId}
          onFeedback={handleFeedback}
        />
      </div>
    </div>
  );
}