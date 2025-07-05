import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PersonalityScores } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Rate limiting store (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(userId: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Fallback responses for errors
const fallbackResponses = {
  personality: "Sizning shaxsiyat xususiyatlaringiz muvozanatli va noyobdir. Har bir inson o'ziga xos qobiliyatlarga ega va turli sohalarda muvaffaqiyat qozonishi mumkin.",
  career: "Sizga mos bo'lgan kasblar orasida IT, ta'lim, biznes va ijodiy sohalar mavjud. Qiziqishlaringiz va qobiliyatlaringizga asoslanib eng to'g'ri yo'nalishni tanlang.",
  chat: "Uzr, hozir AI xizmati mavjud emas. Keyinroq qayta urinib ko'ring yoki bizning maslahatchilarimiz bilan bog'laning."
};

export class GeminiService {
  private model;
  
  constructor() {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      console.log('API Key status:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey || apiKey.length < 30) {
        console.warn('Invalid API key detected');
        this.model = null;
        return;
      }
      
      // Yangi model nomi - gemini-1.5-flash
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini model initialized: gemini-1.5-flash');
    } catch (error) {
      console.error('Gemini AI initialization failed:', error);
      this.model = null;
    }
  }

  // 1. Analyze personality with detailed insights
  async analyzePersonality(personalityScores: PersonalityScores, userId = 'anonymous'): Promise<string> {
    if (!checkRateLimit(userId)) {
      throw new Error('Juda ko\'p so\'rov yuborildi. Biroz kutib turng.');
    }

    try {
      if (!this.model) {
        return fallbackResponses.personality;
      }

      const prompt = `
Siz professional psixolog va karyera maslahatchisisiz. Quyidagi shaxsiyat ballari asosida batafsil tahlil bering:

Ochiqlik (Openness): ${personalityScores.openness}%
Mas'uliyatlilik (Conscientiousness): ${personalityScores.conscientiousness}%
Ekstraversiya (Extraversion): ${personalityScores.extraversion}%
Do'stona munosabat (Agreeableness): ${personalityScores.agreeableness}%
Emotsional barqarorlik (Neuroticism): ${personalityScores.neuroticism}%

FAQAT O'ZBEK TILIDA javob bering. Tahlil quyidagilarni o'z ichiga olsin:

1. SHAXSIY XUSUSIYATLAR: Har bir xususiyat bo'yicha batafsil izoh
2. KUCHLI TOMONLAR: Nimalarda ustun ekanligini aytib bering
3. RIVOJLANISH ZONALARI: Qaysi jihatlarda o'sish mumkinligini ko'rsating
4. MULOQOT USLUBI: Boshqalar bilan qanday muloqot qilishini tavsiflang
5. ISHCHI MUHIT: Qanday ish muhitida yaxshi natija berishini ayting

Professional, ijobiy va motivatsion ohangda yozing. 300-400 so'z atrofida bo'lsin.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text() || fallbackResponses.personality;
      
    } catch (error) {
      console.error('Personality analysis error:', error);
      return fallbackResponses.personality;
    }
  }

  // 2. Generate enhanced career recommendations
  async generateCareerRecommendations(
    personalityScores: PersonalityScores, 
    skills: string[] = [], 
    interests: string[] = [],
    userId = 'anonymous'
  ): Promise<string> {
    if (!checkRateLimit(userId)) {
      throw new Error('Juda ko\'p so\'rov yuborildi. Biroz kutib turng.');
    }

    try {
      if (!this.model) {
        return fallbackResponses.career;
      }

      const prompt = `
Siz O'zbekistondagi professional karyera maslahatchi va mehnat bozori ekspertisiz. 

SHAXSIYAT BALLARI:
- Ochiqlik: ${personalityScores.openness}%
- Mas'uliyatlilik: ${personalityScores.conscientiousness}%  
- Ekstraversiya: ${personalityScores.extraversion}%
- Do'stona munosabat: ${personalityScores.agreeableness}%
- Emotsional barqarorlik: ${personalityScores.neuroticism}%

Ko'nikmalar: ${skills.length ? skills.join(', ') : 'Ko\'rsatilmagan'}
Qiziqishlar: ${interests.length ? interests.join(', ') : 'Ko\'rsatilmagan'}

FAQAT O'ZBEK TILIDA javob bering. Quyidagi formatda tavsiyalar bering:

🎯 ENG MOS KASBLAR (3-5 ta):
Har bir kasb uchun:
- Kasb nomi va qisqa tavsifi
- Nima uchun mos kelishi (% ko'rsatkichlari bilan)
- O'zbekistondagi imkoniyatlar
- Boshlang'ich maosh oralig'i (UZS)

💡 QISQA MUDDAT TAVSIYALARI:
- Qanday ko'nikmalarni rivojlantirish
- Qaysi kurslar yoki ta'lim olish

🚀 UZOQ MUDDAT REJALARI:
- Karyera o'sish yo'li
- Networking va tajriba to'plash

Professional va amaliy ma'lumot bering. O'zbekiston mehnat bozori va imkoniyatlariga qaratilgan bo'lsin.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text() || fallbackResponses.career;
      
    } catch (error) {
      console.error('Career recommendations error:', error);
      return fallbackResponses.career;
    }
  }

  // 3. Chat with AI for career counseling
  async chatWithAI(
    message: string, 
    context: { personality?: PersonalityScores; previousMessages?: string[] } = {},
    userId = 'anonymous'
  ): Promise<string> {
    if (!checkRateLimit(userId)) {
      throw new Error('Juda ko\'p so\'rov yuborildi. Biroz kutib turng.');
    }

    try {
      if (!this.model) {
        return fallbackResponses.chat;
      }

      const contextInfo = context.personality ? 
        `Foydalanuvchi shaxsiyat ballari: Ochiqlik ${context.personality.openness}%, Mas'uliyat ${context.personality.conscientiousness}%, Ekstraversiya ${context.personality.extraversion}%, Do'stona ${context.personality.agreeableness}%, Barqarorlik ${context.personality.neuroticism}%` : 
        '';

      const conversationHistory = context.previousMessages?.slice(-6).join('\n') || '';

      const prompt = `
Siz professional karyera maslahatchi va psixologsiz. O'zbekiston mehnat bozori va ta'lim tizimini yaxshi bilasiz.

${contextInfo}

SUHBAT TARIXI:
${conversationHistory}

FOYDALANUVCHI SAVOLI: "${message}"

FAQAT O'ZBEK TILIDA javob bering. Javobingiz:
- Do'stona va professional bo'lsin
- Aniq va amaliy maslahatlar bering
- O'zbekiston sharoitiga mos bo'lsin
- 150-250 so'z oralig'ida bo'lsin
- Agar savol karyera bilan bog'liq bo'lmasa, karyeraga yo'naltiring

Foydalanuvchini qo'llab-quvvatlang va motivatsiya bering.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text() || fallbackResponses.chat;
      
    } catch (error) {
      console.error('Chat AI error:', error);
      return fallbackResponses.chat;
    }
  }

  // 4. Streaming response for better UX
  async generateStreamingResponse(prompt: string, userId = 'anonymous'): Promise<ReadableStream> {
    if (!checkRateLimit(userId)) {
      throw new Error('Juda ko\'p so\'rov yuborildi. Biroz kutib turng.');
    }

    const model = this.model;
    
    return new ReadableStream({
      async start(controller) {
        try {
          if (!model) {
            controller.enqueue(new TextEncoder().encode(fallbackResponses.chat));
            controller.close();
            return;
          }

          const result = await model.generateContentStream(prompt);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(new TextEncoder().encode(fallbackResponses.chat));
          controller.close();
        }
      }
    });
  }

  // 5. Test AI connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.model) return false;
      
      const result = await this.model.generateContent("Test");
      const response = await result.response;
      console.log('AI test successful:', !!response.text());
      return !!response.text();
    } catch (error) {
      console.error('AI connection test failed:', error);
      // Agar gemini-1.5-flash ishlamasa, gemini-1.5-pro ga o'tish
      try {
        console.log('Trying alternative model: gemini-1.5-pro');
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await this.model.generateContent("Test");
        const response = await result.response;
        return !!response.text();
      } catch (fallbackError) {
        console.error('Both models failed:', fallbackError);
        return false;
      }
    }
  }

  // Get current rate limit status
  getRateLimitStatus(userId: string): { remaining: number; resetTime: number } {
    const userLimit = rateLimitStore.get(userId);
    if (!userLimit) {
      return { remaining: 10, resetTime: Date.now() + 60000 };
    }
    
    return {
      remaining: Math.max(0, 10 - userLimit.count),
      resetTime: userLimit.resetTime
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Helper function for error handling
export function handleGeminiError(error: any): string {
  if (error.message?.includes('rate limit')) {
    return 'Juda ko\'p so\'rov yuborildi. Iltimos, biroz kutib turing.';
  }
  
  if (error.message?.includes('API key')) {
    return 'AI xizmati vaqtinchalik mavjud emas. Keyinroq qayta urinib ko\'ring.';
  }
  
  return 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
}