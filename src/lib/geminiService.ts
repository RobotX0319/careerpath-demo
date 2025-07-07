/**
 * Gemini AI Service
 * 
 * Simple mock service for career guidance
 */

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// Mock Gemini Service
export class GeminiService {
  
  // Analyze personality with detailed insights
  async analyzePersonality(personalityScores: PersonalityScores, userId = 'anonymous'): Promise<string> {
    // Mock personality analysis
    return `Sizning shaxsiyat tahlili:

Ochiqlik: ${personalityScores.openness}%
Siz yangi g'oyalar va tajribalarga ochiq, ijodkor va o'zgarishlarga tayyorsiz.

Vijdonlilik: ${personalityScores.conscientiousness}%
Siz tartibli, mas'uliyatli va o'z oldingizga maqsad qo'yib ishlaysiz.

Ekstraversiya: ${personalityScores.extraversion}%
Siz odamlar bilan muloqotni yaxshi ko'rasiz, faol va tashabbuskorsiz.

Kelishuvchi xususiyat: ${personalityScores.agreeableness}%
Siz boshqalarga yordam berishga tayyor, hamkorlikka ochiq va do'stonasiz.

Hissiy barqarorlik: ${100 - personalityScores.neuroticism}%
Siz muammolar oldida xotirjam va barqarorsiz, stressga bardoshlisiz.`;
  }

  // Generate enhanced career recommendations
  async generateCareerRecommendations(
    personalityScores: PersonalityScores, 
    skills: string[] = [], 
    interests: string[] = [],
    userId = 'anonymous'
  ): Promise<string> {
    // Mock career recommendations
    return `Sizga mos karyera tavsiyalari:

1. Dasturiy ta'minot ishlab chiquvchisi
Sizning yuqori ochiqlik va vijdonlilik ko'rsatkichlaringiz bu sohada muvaffaqiyat qozonishingizga yordam beradi.

2. Dizayner
Ijodiy qobiliyatlaringiz va yangi g'oyalarga ochiqligingiz dizayn sohasida foydali bo'ladi.

3. Loyiha menejeri
Tashkilotchilik qobiliyatlaringiz va odamlar bilan ishlash ko'nikmalaringiz bu lavozimda muhimdir.

Rivojlanish uchun tavsiyalar:
- Qo'shimcha texnik ko'nikmalar o'rganing
- Jamoada ishlash tajribangizni oshiring
- Lidership qobiliyatlaringizni rivojlantiring`;
  }

  // Chat with AI for career counseling
  async chatWithAI(
    message: string, 
    context: { personality?: PersonalityScores; previousMessages?: string[] } = {},
    userId = 'anonymous'
  ): Promise<string> {
    // Mock chat response
    return `Savolingiz uchun rahmat! ${message}

Men sizga karyera masalalari bo'yicha yordam bera olaman. Sizning shaxsiyat xususiyatlaringizni hisobga olib, eng yaxshi yo'nalishni tanlashda ko'maklashaman.

Qo'shimcha savollaringiz bo'lsa, bemalol so'rang.`;
  }

  // Test AI connection
  async testConnection(): Promise<boolean> {
    return true;
  }

  // Send a custom prompt to the AI
  async customPrompt(prompt: string, userId = 'anonymous'): Promise<string> {
    return `Custom response for: ${prompt}`;
  }

  // Process response with enhanced formatting
  processResponse(response: string, type: 'personality' | 'career' | 'chat' = 'chat'): string {
    return response.trim();
  }
}

// Export singleton instance
export const geminiService = new GeminiService();