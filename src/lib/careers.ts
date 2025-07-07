import careersData from '../data/careers.json';

// Type definitions
export type Career = {
  id: string;
  title: string;
  description: string;
  averageSalary?: string;
  salary?: string;
  demandLevel?: 'low' | 'medium' | 'high';
  requiredSkills?: string[];
  skills?: string[];
  growthRate?: string;
  growth?: string;
  category?: string;
  matchScore?: number;
  companies?: string[];
  personality_match?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
};

export type PersonalityScores = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

const careers: Career[] = careersData.careers;

// Helper: 0-100% ga aylantirish
type Trait = keyof PersonalityScores;
const traitList: Trait[] = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
];

// 0-100% PersonalityScores ni 0-1 oraliqqa o'tkazish
function normalizeScores(scores: PersonalityScores): Record<Trait, number> {
  return {
    openness: scores.openness / 100,
    conscientiousness: scores.conscientiousness / 100,
    extraversion: scores.extraversion / 100,
    agreeableness: scores.agreeableness / 100,
    neuroticism: scores.neuroticism / 100,
  };
}

// Cosine similarity (yoki weighted difference) asosida match score hisoblash
function calculateMatchScore(user: PersonalityScores, career: Career): number {
  const userNorm = normalizeScores(user);
  const careerNorm = career.personality_match;
  
  if (!careerNorm) {
    // If no personality match data, return default score
    return 50;
  }
  // Trait og'irliklari
  const weights: Record<Trait, number> = {
    openness: 1.2,
    conscientiousness: 1.4,
    extraversion: 1.0,
    agreeableness: 1.0,
    neuroticism: 0.8,
  };
  let weightedSum = 0;
  let totalWeight = 0;
  traitList.forEach(trait => {
    const similarity = 1 - Math.abs(userNorm[trait] - careerNorm[trait]);
    const weightedScore = similarity * careerNorm[trait] * weights[trait];
    weightedSum += weightedScore;
    totalWeight += careerNorm[trait] * weights[trait];
  });
  const avg = totalWeight > 0 ? weightedSum / totalWeight : 0;
  // Realistik diapazon: 65-95% oraliqqa moslashtirish
  const score = Math.round(65 + (avg * 30));
  return Math.min(100, Math.max(0, score));
}

export function matchCareers(userScores: PersonalityScores): Career[] {
  const matched = careers.map(career => ({
    ...career,
    matchScore: calculateMatchScore(userScores, career),
  }));
  return matched.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)).slice(0, 5);
}

export function getCareerById(id: string): Career | undefined {
  return careers.find(c => c.id === id);
}
