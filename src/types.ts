/**
 * Global Type Definitions
 */

// Personality scores for Big Five personality traits
export interface PersonalityScores {
  openness: number;        // Openness to experience (0-100)
  conscientiousness: number; // Conscientiousness (0-100)
  extraversion: number;    // Extraversion (0-100)
  agreeableness: number;   // Agreeableness (0-100)
  neuroticism: number;     // Neuroticism (0-100)
}

// User profile information
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  personalityScores?: PersonalityScores;
  skills?: string[];
  interests?: string[];
  careerGoals?: string[];
  educationLevel?: string;
}

// File analysis types
export type AnalysisRequestType = 
  | 'resume' 
  | 'coverLetter' 
  | 'jobDescription'
  | 'text';

// File analysis request
export interface FileAnalysisRequest {
  text: string;
  type: AnalysisRequestType;
  fileName?: string;
  additionalContext?: string;
}

// File analysis response
export interface FileAnalysisResponse {
  analysis: string;
  suggestions: string[];
  keywords?: string[];
  metadata?: {
    score?: number;
    analysisTime?: number;
    confidence?: number;
  }
}