// Personality test question interface
export interface Question {
  id: string;
  text: string;
  category: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  weight: number;
}

// Personality scores interface
export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// Career interface
type PersonalityMatch = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export interface Career {
  id: string;
  title: string;
  description: string;
  salary: string;
  requirements: string[];
  companies: string[];
  skills: string[];
  growth: string;
  personality_match: PersonalityMatch;
  matchScore?: number;
}

// User data interface
export interface UserData {
  name?: string;
  age?: number;
  education?: string;
  city?: string;
  answers: { questionId: string; answer: number }[];
  personalityScores?: PersonalityScores;
  recommendedCareers?: Career[];
  testDate?: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
