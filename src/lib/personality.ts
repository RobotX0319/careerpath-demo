import questionsData from '../data/personality-questions.json';
import type { Question, PersonalityScores } from '../types';

const questions: Question[] = questionsData.questions.map(q => ({
  ...q,
  category: q.category as Question['category'],
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
