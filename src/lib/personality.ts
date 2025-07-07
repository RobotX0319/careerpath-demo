/**
 * Personality Assessment Utilities
 * 
 * Handles personality test logic and analysis
 */

import questionsData from '../data/personality-questions.json';

// Type definitions
export type Question = {
  id: string;
  text: string;
  category: string;
  trait: string;
  weight?: number;
  options?: {
    text: string;
    value: number;
  }[];
};

export type PersonalityScores = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

const questions: Question[] = questionsData.questions.map((q: any) => ({
  category: q.category,
  trait: q.trait || q.category, // Use trait if available, otherwise use category
  weight: q.weight || 1,
  id: q.id,
  text: q.text,
  options: q.options || [
    { text: 'Mutlaqo rozi emasman', value: 1 },
    { text: 'Rozi emasman', value: 2 },
    { text: 'Neytral', value: 3 },
    { text: 'Roziman', value: 4 },
    { text: 'Mutlaqo roziman', value: 5 }
  ]
}));

// Javoblarni (1-5) va weight (-1) ni hisobga olib, har bir trait uchun 0-100% ball hisoblash
type Answer = number;

export function calculatePersonalityScores(answers: Answer[]): PersonalityScores {
  const traitSums: Record<string, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  const traitCounts: Record<string, number> = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  questions.forEach((q, i) => {
    let score = answers[i];
    if (q.weight === -1) {
      // Reverse scoring: 1->5, 2->4, 3->3, 4->2, 5->1
      score = 6 - score;
    }
    traitSums[q.category] += score;
    traitCounts[q.category]++;
  });

  // Har bir trait uchun o'rtacha ballni 0-100% ga aylantirish
  const result: PersonalityScores = {
    openness: Math.round((traitSums.openness / (traitCounts.openness * 5)) * 100),
    conscientiousness: Math.round((traitSums.conscientiousness / (traitCounts.conscientiousness * 5)) * 100),
    extraversion: Math.round((traitSums.extraversion / (traitCounts.extraversion * 5)) * 100),
    agreeableness: Math.round((traitSums.agreeableness / (traitCounts.agreeableness * 5)) * 100),
    neuroticism: Math.round((traitSums.neuroticism / (traitCounts.neuroticism * 5)) * 100),
  };
  return result;
}

// PersonalityScores ni O'zbek tilida tavsifga aylantirish
type TraitDesc = { trait: keyof PersonalityScores; name: string; high: string; low: string };

const traitDescriptions: TraitDesc[] = [
  {
    trait: 'openness',
    name: 'Ochiklik (Openness)',
    high: "Siz yangi g'oyalar va tajribalarga ochiq, ijodkor va o'zgarishlarga tayyorsiz.",
    low: "Siz an'anaviylikni va barqarorlikni afzal ko'rasiz, yangi narsalarga ehtiyotkorlik bilan yondashasiz.",
  },
  {
    trait: 'conscientiousness',
    name: 'Mas’uliyatlilik (Conscientiousness)',
    high: "Siz tartibli, mas’uliyatli va o'z oldingizga maqsad qo'yib ishlaysiz.",
    low: "Siz ko'proq erkin va moslashuvchan ishlashni yoqtirasiz, ba’zan rejalashtirishga kam e’tibor berasiz.",
  },
  {
    trait: 'extraversion',
    name: 'Ekstraversiya (Extraversion)',
    high: "Siz odamlar bilan muloqotni yaxshi ko'rasiz, faol va tashabbuskorsiz.",
    low: "Siz tinch, xotirjam va yolg'iz ishlashni afzal ko'rasiz.",
  },
  {
    trait: 'agreeableness',
    name: 'Do‘stona munosabat (Agreeableness)',
    high: "Siz boshqalarga yordam berishga tayyor, hamkorlikka ochiq va do‘stonasiz.",
    low: "Siz mustaqil va tanqidiy fikrlovchisiz, ba’zan raqobatni afzal ko'rasiz.",
  },
  {
    trait: 'neuroticism',
    name: 'Emotsional barqarorlik (Neuroticism)',
    high: "Siz stress va xavotirga moyil bo'lishingiz mumkin, emotsional jihatdan sezgir ekansiz.",
    low: "Siz muammolar oldida xotirjam va barqarorsiz, stressga bardoshlisiz.",
  },
];

export function generatePersonalityAnalysis(scores: PersonalityScores): string {
  return traitDescriptions
    .map(({ trait, name, high, low }) => {
      const value = scores[trait];
      const desc = value >= 60 ? high : low;
      return `${name}: ${value}%\n${desc}`;
    })
    .join('\n\n');
}

/**
 * Personality Assessment Utilities
 * 
 * Handles personality test logic and analysis
 */

// Personality dimensions based on Big Five model
export const PERSONALITY_DIMENSIONS = {
  OPENNESS: 'openness',
  CONSCIENTIOUSNESS: 'conscientiousness', 
  EXTRAVERSION: 'extraversion',
  AGREEABLENESS: 'agreeableness',
  NEUROTICISM: 'neuroticism'
} as const;

export type PersonalityDimension = typeof PERSONALITY_DIMENSIONS[keyof typeof PERSONALITY_DIMENSIONS];

export interface PersonalityQuestion {
  id: string;
  text: string;
  dimension: PersonalityDimension;
  reverse?: boolean; // If true, scoring is reversed
}

export interface PersonalityAnswer {
  questionId: string;
  value: number; // 1-5 scale
}

export interface PersonalityResult {
  dimension: PersonalityDimension;
  score: number; // 0-100 scale
  label: string;
  description: string;
}

export interface PersonalityAssessment {
  overallScore: number;
  results: PersonalityResult[];
  careerRecommendations: string[];
  strengths: string[];
  developmentAreas: string[];
}

// Personality test questions
export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  // Openness to Experience
  {
    id: 'q1',
    text: 'Men yangi g\'oyalar va tajribalarni qidirishni yaxshi ko\'raman',
    dimension: PERSONALITY_DIMENSIONS.OPENNESS
  },
  {
    id: 'q2', 
    text: 'Ijodiy va tasavvuriy ishlar meni qiziqtiradi',
    dimension: PERSONALITY_DIMENSIONS.OPENNESS
  },
  {
    id: 'q3',
    text: 'An\'anaviy usullarni afzal ko\'raman',
    dimension: PERSONALITY_DIMENSIONS.OPENNESS,
    reverse: true
  },
  
  // Conscientiousness
  {
    id: 'q4',
    text: 'Men tartibli va tashkil etilgan odamman',
    dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS
  },
  {
    id: 'q5',
    text: 'Vazifalarni vaqtida bajarishga harakat qilaman',
    dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS
  },
  {
    id: 'q6',
    text: 'Ba\'zan ishlarni keyinga qoldiraman',
    dimension: PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS,
    reverse: true
  },
  
  // Extraversion
  {
    id: 'q7',
    text: 'Odamlar bilan muloqot qilishni yaxshi ko\'raman',
    dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION
  },
  {
    id: 'q8',
    text: 'Ijtimoiy tadbirlarda faol ishtirok etaman',
    dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION
  },
  {
    id: 'q9',
    text: 'Yolg\'izlikda bo\'lishni afzal ko\'raman',
    dimension: PERSONALITY_DIMENSIONS.EXTRAVERSION,
    reverse: true
  },
  
  // Agreeableness
  {
    id: 'q10',
    text: 'Boshqalarga yordam berishni yaxshi ko\'raman',
    dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS
  },
  {
    id: 'q11',
    text: 'Odamlarning his-tuyg\'ularini hisobga olaman',
    dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS
  },
  {
    id: 'q12',
    text: 'O\'z fikrimni ochiq aytishdan tortinmayman',
    dimension: PERSONALITY_DIMENSIONS.AGREEABLENESS,
    reverse: true
  },
  
  // Neuroticism (Emotional Stability)
  {
    id: 'q13',
    text: 'Stress holatlarida osongina bezovtalanaman',
    dimension: PERSONALITY_DIMENSIONS.NEUROTICISM
  },
  {
    id: 'q14',
    text: 'Kayfiyatim tez-tez o\'zgaradi',
    dimension: PERSONALITY_DIMENSIONS.NEUROTICISM
  },
  {
    id: 'q15',
    text: 'Odatda xotirjam va muvozanatli bo\'laman',
    dimension: PERSONALITY_DIMENSIONS.NEUROTICISM,
    reverse: true
  }
];

/**
 * Calculates personality scores from answers
 */
export function calculateScores(answers: PersonalityAnswer[]): PersonalityResult[] {
  const dimensionScores: Record<PersonalityDimension, number[]> = {
    [PERSONALITY_DIMENSIONS.OPENNESS]: [],
    [PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS]: [],
    [PERSONALITY_DIMENSIONS.EXTRAVERSION]: [],
    [PERSONALITY_DIMENSIONS.AGREEABLENESS]: [],
    [PERSONALITY_DIMENSIONS.NEUROTICISM]: []
  };
  
  // Group scores by dimension
  answers.forEach(answer => {
    const question = PERSONALITY_QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      const score = question.reverse ? (6 - answer.value) : answer.value;
      dimensionScores[question.dimension].push(score);
    }
  });
  
  // Calculate average scores and convert to 0-100 scale
  const results: PersonalityResult[] = Object.entries(dimensionScores).map(([dimension, scores]) => {
    const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const normalizedScore = Math.round(((average - 1) / 4) * 100); // Convert 1-5 scale to 0-100
    
    return {
      dimension: dimension as PersonalityDimension,
      score: normalizedScore,
      label: getDimensionLabel(dimension as PersonalityDimension),
      description: getDimensionDescription(dimension as PersonalityDimension, normalizedScore)
    };
  });
  
  return results;
}

/**
 * Generates personality assessment with career recommendations
 */
export function generateAssessment(answers: PersonalityAnswer[]): PersonalityAssessment {
  const results = calculateScores(answers);
  const overallScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  
  const careerRecommendations = generateCareerRecommendations(results);
  const strengths = identifyStrengths(results);
  const developmentAreas = identifyDevelopmentAreas(results);
  
  return {
    overallScore,
    results,
    careerRecommendations,
    strengths,
    developmentAreas
  };
}

/**
 * Gets dimension label in Uzbek
 */
function getDimensionLabel(dimension: PersonalityDimension): string {
  const labels: Record<PersonalityDimension, string> = {
    [PERSONALITY_DIMENSIONS.OPENNESS]: 'Ochiqlik',
    [PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS]: 'Vijdonlilik',
    [PERSONALITY_DIMENSIONS.EXTRAVERSION]: 'Ekstroversiya',
    [PERSONALITY_DIMENSIONS.AGREEABLENESS]: 'Hamjihatlik',
    [PERSONALITY_DIMENSIONS.NEUROTICISM]: 'Hissiylik'
  };
  
  return labels[dimension];
}

/**
 * Gets dimension description based on score
 */
function getDimensionDescription(dimension: PersonalityDimension, score: number): string {
  const isHigh = score >= 70;
  const isMedium = score >= 40 && score < 70;
  
  const descriptions: Record<PersonalityDimension, { high: string; medium: string; low: string }> = {
    [PERSONALITY_DIMENSIONS.OPENNESS]: {
      high: 'Yangi g\'oyalar va tajribalarni qidiradi, ijodiy fikrlash qobiliyati yuqori',
      medium: 'Ba\'zi yangi narsalarni sinab ko\'rishga ochiq, muvozanatli yondashuv',
      low: 'An\'anaviy usullarni afzal ko\'radi, barqaror va ishonchli'
    },
    [PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS]: {
      high: 'Juda tartibli, mas\'uliyatli va maqsadga yo\'naltirilgan',
      medium: 'Asosan tashkil etilgan, vazifalarni vaqtida bajaradi',
      low: 'Ehtiyotsiz bo\'lishi mumkin, spontan harakat qilishni yaxshi ko\'radi'
    },
    [PERSONALITY_DIMENSIONS.EXTRAVERSION]: {
      high: 'Ijtimoiy, energik va odamlar bilan muloqotni yaxshi ko\'radi',
      medium: 'Muvozanatli, ba\'zan ijtimoiy, ba\'zan yolg\'iz bo\'lishni afzal ko\'radi',
      low: 'Yolg\'izlikni afzal ko\'radi, chuqur fikrlash qobiliyati'
    },
    [PERSONALITY_DIMENSIONS.AGREEABLENESS]: {
      high: 'Mehribon, yordam berishga tayyor va hamjihat',
      medium: 'Odamlar bilan yaxshi munosabatda, muvozanatli',
      low: 'To\'g\'ridan-to\'g\'ri, o\'z fikrini ochiq bildirishdan tortinmaydi'
    },
    [PERSONALITY_DIMENSIONS.NEUROTICISM]: {
      high: 'Stress holatlarida bezovtalanishi mumkin, hissiy',
      medium: 'Asosan barqaror, ba\'zan his-tuyg\'ularga berilib ketadi',
      low: 'Xotirjam, stress holatlarida ham muvozanatni saqlaydi'
    }
  };
  
  if (isHigh) return descriptions[dimension].high;
  if (isMedium) return descriptions[dimension].medium;
  return descriptions[dimension].low;
}

/**
 * Generates career recommendations based on personality profile
 */
function generateCareerRecommendations(results: PersonalityResult[]): string[] {
  const scores = results.reduce((acc, result) => {
    acc[result.dimension] = result.score;
    return acc;
  }, {} as Record<PersonalityDimension, number>);
  
  const recommendations: string[] = [];
  
  // High Openness + High Conscientiousness = Research/Innovation roles
  if (scores.openness >= 70 && scores.conscientiousness >= 70) {
    recommendations.push('Tadqiqot va ishlanmalar (R&D)');
    recommendations.push('Product Manager');
    recommendations.push('UX/UI Dizayner');
  }
  
  // High Extraversion + High Agreeableness = People-focused roles
  if (scores.extraversion >= 70 && scores.agreeableness >= 70) {
    recommendations.push('HR Manager');
    recommendations.push('Marketing Manager');
    recommendations.push('Sales Representative');
    recommendations.push('Project Manager');
  }
  
  // High Conscientiousness + Low Neuroticism = Management roles
  if (scores.conscientiousness >= 70 && scores.neuroticism <= 40) {
    recommendations.push('Operations Manager');
    recommendations.push('Financial Analyst');
    recommendations.push('Quality Assurance');
  }
  
  // High Openness + High Extraversion = Creative/Communication roles
  if (scores.openness >= 70 && scores.extraversion >= 70) {
    recommendations.push('Content Creator');
    recommendations.push('Marketing Creative');
    recommendations.push('Event Manager');
  }
  
  // High Conscientiousness + Low Extraversion = Technical roles
  if (scores.conscientiousness >= 70 && scores.extraversion <= 40) {
    recommendations.push('Software Developer');
    recommendations.push('Data Analyst');
    recommendations.push('Accountant');
    recommendations.push('Engineer');
  }
  
  // Default recommendations if no specific patterns match
  if (recommendations.length === 0) {
    recommendations.push('Business Analyst');
    recommendations.push('Administrative Assistant');
    recommendations.push('Customer Service');
  }
  
  // Remove duplicates manually
  const unique = recommendations.filter((item, index) => recommendations.indexOf(item) === index);
  return unique;
}

/**
 * Identifies personality strengths
 */
function identifyStrengths(results: PersonalityResult[]): string[] {
  const strengths: string[] = [];
  
  results.forEach(result => {
    if (result.score >= 70) {
      switch (result.dimension) {
        case PERSONALITY_DIMENSIONS.OPENNESS:
          strengths.push('Ijodiy fikrlash', 'Yangilikka ochiqlik');
          break;
        case PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS:
          strengths.push('Tartiblilik', 'Mas\'uliyatlilik', 'Maqsadga yo\'nalganlik');
          break;
        case PERSONALITY_DIMENSIONS.EXTRAVERSION:
          strengths.push('Ijtimoiy ko\'nikmalar', 'Yetakchilik', 'Energiklik');
          break;
        case PERSONALITY_DIMENSIONS.AGREEABLENESS:
          strengths.push('Hamjihatlik', 'Yordam berishga tayyorlik', 'Diplomatiya');
          break;
        case PERSONALITY_DIMENSIONS.NEUROTICISM:
          // High neuroticism is generally not a strength, but can indicate sensitivity
          if (result.score >= 70) {
            strengths.push('Hissiylik', 'Tafsilotlarga e\'tibor');
          }
          break;
      }
    } else if (result.dimension === PERSONALITY_DIMENSIONS.NEUROTICISM && result.score <= 30) {
      // Low neuroticism is a strength (emotional stability)
      strengths.push('Hissiy barqarorlik', 'Stressga chidamlilik');
    }
  });
  
  // Remove duplicates manually
  const unique = strengths.filter((item, index) => strengths.indexOf(item) === index);
  return unique;
}

/**
 * Identifies areas for development
 */
function identifyDevelopmentAreas(results: PersonalityResult[]): string[] {
  const developmentAreas: string[] = [];
  
  results.forEach(result => {
    if (result.score <= 40) {
      switch (result.dimension) {
        case PERSONALITY_DIMENSIONS.OPENNESS:
          developmentAreas.push('Yangi tajribalarni sinab ko\'rish', 'Ijodiy yondashuvni rivojlantirish');
          break;
        case PERSONALITY_DIMENSIONS.CONSCIENTIOUSNESS:
          developmentAreas.push('Vaqtni boshqarish', 'Tartib-intizomni rivojlantirish');
          break;
        case PERSONALITY_DIMENSIONS.EXTRAVERSION:
          developmentAreas.push('Ijtimoiy ko\'nikmalarni rivojlantirish', 'Networking');
          break;
        case PERSONALITY_DIMENSIONS.AGREEABLENESS:
          developmentAreas.push('Hamkorlik ko\'nikmalarini rivojlantirish', 'Empatiya');
          break;
        case PERSONALITY_DIMENSIONS.NEUROTICISM:
          // Low neuroticism is good, no development needed
          break;
      }
    } else if (result.dimension === PERSONALITY_DIMENSIONS.NEUROTICISM && result.score >= 70) {
      // High neuroticism needs development (stress management)
      developmentAreas.push('Stress bilan kurashish', 'Hissiy boshqaruv');
    }
  });
  
  // Remove duplicates manually
  const unique = developmentAreas.filter((item, index) => developmentAreas.indexOf(item) === index);
  return unique;
}

/**
 * Validates personality test answers
 */
export function validateAnswers(answers: PersonalityAnswer[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if all questions are answered
  const answeredQuestionIds = answers.map(a => a.questionId);
  const requiredQuestionIds = PERSONALITY_QUESTIONS.map(q => q.id);
  
  const missingQuestions = requiredQuestionIds.filter(id => !answeredQuestionIds.includes(id));
  if (missingQuestions.length > 0) {
    errors.push(`${missingQuestions.length} ta savolga javob berilmagan`);
  }
  
  // Check answer values are in valid range
  const invalidAnswers = answers.filter(a => a.value < 1 || a.value > 5);
  if (invalidAnswers.length > 0) {
    errors.push('Ba\'zi javoblar noto\'g\'ri qiymatga ega (1-5 oralig\'ida bo\'lishi kerak)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  PERSONALITY_QUESTIONS,
  PERSONALITY_DIMENSIONS,
  calculateScores,
  generateAssessment,
  validateAnswers
};
