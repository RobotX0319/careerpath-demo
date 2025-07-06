import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PersonalityScores } from '@/types';
import { logQualityEvent, validateResponse, needsImprovement } from './responseMonitoring_simple';

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

/**
 * Clean and format AI responses for perfect display
 * This function removes all markdown formatting, special characters, and ensures
 * proper text formatting for Uzbek language responses. It's designed to make Gemini AI
 * responses clean, consistent, and free of any unwanted formatting symbols.
 */
function cleanAIResponse(text: string): string {
  if (!text) return text;
  
  // First clean pass - structural formatting
  let cleaned = text
    // Remove all markdown formatting
    .replace(/\*\*\*|\*\*|\*/g, '') // Remove all asterisks (triple, double, single)
    .replace(/#{1,6}\s?/g, '') // Remove markdown headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks with content
    .replace(/`/g, '') // Remove any remaining backticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to just text
    .replace(/_([^_]+)_/g, '$1') // Remove underscores for italic
    .replace(/~([^~]+)~/g, '$1') // Remove tildes for strikethrough
    
    // Clean up spacing and formatting
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
    .replace(/^\s+|\s+$/g, '') // Trim whitespace from start/end
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single
    
    // Format numbered lists (convert to plain text)
    .replace(/(\d+)\.\s*/g, '') // Remove numbered list markers completely
    
    // Remove bullet points and dashes
    .replace(/•\s*/g, '') // Remove bullets
    .replace(/^\s*[-•]\s*/gm, '') // Remove dashes at line starts
    .replace(/-\s+/g, '') // Remove standalone dashes with space
    
    // Fix emoji spacing
    .replace(/([🎯💡🚀✅👍])\s*/g, '$1 ') // Ensure space after emoji
    
    // Clean up common AI artifacts and prompt instructions
    .replace(/FAQAT O[''']ZBEK TILIDA javob bering\.?/gi, '')
    .replace(/Professional.*?yozing\.?/gi, '')
    .replace(/\d+\s*-\s*\d+\s*so[''']z.*?bo[''']lsin\.?/gi, '')
    .replace(/Quyidagi formatda.*?:/gi, '')
    .replace(/Javobingiz:.*?bering\.?/gi, '')
    .replace(/MUHIM:.+?formatlash/gi, '')
    
    // Ensure proper sentence spacing and punctuation
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
    .replace(/,\s*/g, ', ') // Ensure proper comma spacing;
  
  // Second clean pass - language-specific formatting
  cleaned = cleaned
    // Fix specific Uzbek language apostrophes and quotation
    .replace(/o[''']zbek/gi, "o'zbek")
    .replace(/bo[''']l/gi, "bo'l")
    .replace(/o[''']rganish/gi, "o'rganish")
    .replace(/o[''']z/gi, "o'z")
    .replace(/g[''']oya/gi, "g'oya")
    .replace(/[''']q/gi, "'q")
    .replace(/[''']g/gi, "'g")
    
    // Fix structural formatting issues
    .replace(/\n\s+/g, '\n') // Remove leading whitespace in paragraphs
    .replace(/\s+\n/g, '\n') // Remove trailing whitespace in paragraphs
    .replace(/\n{3,}/g, '\n\n'); // Replace excessive newlines again
  
  // Final validation
  const problemPatterns = [
    /\*/g,           // Check for any remaining asterisks
    /#/g,            // Check for any remaining hashes
    /```/g,          // Check for any remaining code blocks
    /\d+\.\s+[A-Z]/g // Check for any remaining numbered lists
  ];
  
  // If any problem patterns still exist, do additional cleaning
  for (const pattern of problemPatterns) {
    if (pattern.test(cleaned)) {
      console.warn('Found problem pattern in cleaned text:', pattern);
      cleaned = cleaned.replace(pattern, '');
    }
  }
  
  return cleaned.trim();
}

// Fallback responses for errors
const fallbackResponses = {
  personality: "Sizning shaxsiyat xususiyatlaringiz muvozanatli va noyobdir. Har bir inson o'ziga xos qobiliyatlarga ega va turli sohalarda muvaffaqiyat qozonishi mumkin.",
  career: "Sizga mos bo'lgan kasblar orasida IT, ta'lim, biznes va ijodiy sohalar mavjud. Qiziqishlaringiz va qobiliyatlaringizga asoslanib eng to'g'ri yo'nalishni tanlang.",
  chat: "Uzr, hozir AI xizmati mavjud emas. Keyinroq qayta urinib ko'ring yoki bizning maslahatchilarimiz bilan bog'laning."
};

import { 
  HarmCategory, 
  HarmBlockThreshold, 
  GenerationConfig, 
  SafetySetting 
} from '@google/generative-ai';

/**
 * Optimized API Configuration for Gemini
 * 
 * These settings are carefully chosen for optimal results in career guidance context:
 * - Temperature balances creativity with reliability
 * - Top-K and Top-P help produce high quality responses
 * - Safety settings prevent harmful content
 * - Response format is optimized for clean text
 */

// Generation configuration for optimal text responses
export const generationConfig: GenerationConfig = {
  temperature: 0.7,      // Balanced creativity and consistency
  topK: 40,              // Consider top 40 tokens for better quality
  topP: 0.8,             // Sample from 80% of probability mass
  maxOutputTokens: 1000, // Reasonable response length
  stopSequences: [],     // No specific stop sequences needed
  candidateCount: 1,     // Single best response
};

// Safety settings to prevent harmful content
export const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];

// Complete configuration object for Gemini API
const geminiConfig = {
  generationConfig,
  safetySettings
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
      
      // Configure the model with optimized settings
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig,
        safetySettings
      });
      console.log('Gemini model initialized: gemini-1.5-flash with optimized settings');
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
        return enhancedFallbacks.personality.generic;
      }

      // Try to get result from cache
      const cacheKey = `personality_${JSON.stringify(personalityScores)}`;
      const cachedResult = localStorage.getItem(cacheKey);
      if (cachedResult) {
        try {
          const { response, timestamp } = JSON.parse(cachedResult);
          // Check if cache is still valid (7 days)
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            return response;
          }
        } catch (e) {
          // Cache error, continue with API call
          console.warn('Cache parsing error:', e);
        }
      }
      
      // Import optimized config for personality analysis
      const { getOptimizedConfig } = require('./apiConfigs');
      const optimizedConfig = getOptimizedConfig('personality');

      const prompt = `
Siz professional psixolog va karyera maslahatchisisiz. Quyidagi shaxsiyat ballari asosida batafsil tahlil bering.

SHAXSIYAT BALLARI:
- Ochiqlik (Openness): ${personalityScores.openness}%
- Mas'uliyatlilik (Conscientiousness): ${personalityScores.conscientiousness}%
- Ekstraversiya (Extraversion): ${personalityScores.extraversion}%
- Do'stona munosabat (Agreeableness): ${personalityScores.agreeableness}%
- Emotsional barqarorlik (Neuroticism): ${personalityScores.neuroticism}%

O'zbek tilida javob bering. Tahlil quyidagi bo'limlarni o'z ichiga olsin:

1. SHAXSIY XUSUSIYATLAR
Har bir xususiyat bo'yicha aniq va tushunarli izoh bering. Asterisk (*) va markdown belgilarini ishlatmang.

2. KUCHLI TOMONLAR
Ushbu shaxs qaysi jihatlarda kuchli ekanligini tavsiflang. Rasmiy formatlashsiz, oddiy matn shaklida yozing.

3. RIVOJLANISH ZONALARI
Qaysi jihatlarda o'sish mumkinligini ko'rsating. Belgilarsiz, tushunarli tarzda yozing.

4. MULOQOT USLUBI
Ushbu shaxs boshqalar bilan qanday muloqot qilishini tavsiflang. Matn belgilarisiz.

5. ISHCHI MUHIT
Qanday ish muhitida yaxshi natija berishini aniq yozing. Formatlashsiz.

Quyidagi talablarga rioya qiling:
- Barcha javoblar formatlash belgilarisiz bo'lsin (*,**,# kabi belgilarsiz)
- Professional va ijobiy ohangda yozing
- Shaxsga to'g'ridan-to'g'ri murojaat qiling ("Siz...")
- Har bir bo'lim aniq va tushunarli bo'lishi kerak
- Oddiy o'zbek tilida gaplashing, murakkab psixologik terminlardan qoching
`;

      // Use retry logic for API calls with optimized config
      return await withRetry(async () => {
        if (!this.model) {
          return enhancedFallbacks.personality.generic;
        }
        
        // Create specialized model instance for this request
        const specializedModel = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          ...optimizedConfig
        });
        
        const result = await specializedModel.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text() || enhancedFallbacks.personality.generic;
        
        // Clean and format the AI response
        const cleanedResponse = cleanAIResponse(rawText);
        
        // Cache successful response
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            response: cleanedResponse,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Failed to cache response:', e);
        }
        
        return cleanedResponse;
      });
      
    } catch (error: any) {
      console.error('Personality analysis error:', error);
      
      // Return appropriate fallback based on error type
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return enhancedFallbacks.personality.networkError;
      } else if (error.message?.includes('server') || error.message?.includes('500')) {
        return enhancedFallbacks.personality.serverError;
      }
      
      return enhancedFallbacks.personality.generic;
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
        return enhancedFallbacks.career.generic;
      }

      // Try to get result from cache
      const cacheKey = `career_${JSON.stringify(personalityScores)}_${skills.join(',')}_${interests.join(',')}`;
      const cachedResult = localStorage.getItem(cacheKey);
      if (cachedResult) {
        try {
          const { response, timestamp } = JSON.parse(cachedResult);
          // Check if cache is still valid (7 days)
          if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
            return response;
          }
        } catch (e) {
          // Cache error, continue with API call
          console.warn('Cache parsing error:', e);
        }
      }

      // Use Optimized Career Prompt as specified in requirements
      const prompt = `
Siz O'zbekiston ish bozori bo'yicha ekspert va karyera maslahatchi sifatida ishlaysiz. Quyidagi shaxsiyat natijalariga asoslanib, eng mos keladigan kasblar haqida tavsiyalar bering.

FOYDALANUVCHI MA'LUMOTLARI:
Ochiqlik: ${personalityScores.openness}%
Vijdonlilik: ${personalityScores.conscientiousness}%
Ekstraversiya: ${personalityScores.extraversion}%
Kelishuvchi xususiyat: ${personalityScores.agreeableness}%
Hissiy barqarorlik: ${100 - personalityScores.neuroticism}%
${skills.length > 0 ? `Ko'nikmalar: ${skills.join(', ')}` : ''}
${interests.length > 0 ? `Qiziqishlar: ${interests.join(', ')}` : ''}

JAVOB FORMATI:
Avval qisqa muqaddima yozing, keyin eng mos 5 ta kasbni taqdim eting. Har bir kasb uchun quyidagi formatdan foydalaning:

Kasb nomi va qisqacha tavsif: Ushbu kasb haqida umumiy ma'lumot bering.

Nima uchun mos kelishi: Shaxsiyat xususiyatlari bilan qanday mos kelishini tushuntiring.

O'zbekistondagi imkoniyatlar: Mamlakatimizdagi vaziyat va ish imkoniyatlari haqida ma'lumot bering.

Boshlash yo'llari: Ushbu kasbga qanday kirishish mumkinligi haqida amaliy maslahatlar bering.

Rivojlanish istiqbollari: Kelajakda qanday o'sish imkoniyatlari borligini ko'rsating.

MUHIM: Javobingizda hech qanday yulduzcha, tire, raqam yoki boshqa format belgilarini ishlatmang. Faqat oddiy matn va paragraflardan foydalaning. Har bir bo'lim yangi paragrafdan boshlansin.
`;

      // Use retry logic for API calls
      return await withRetry(async () => {
        if (!this.model) {
          return enhancedFallbacks.career.generic;
        }
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text() || enhancedFallbacks.career.generic;
        
        // Clean and format the AI response
        const cleanedResponse = cleanAIResponse(rawText);
        
        // Cache successful response
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            response: cleanedResponse,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Failed to cache response:', e);
        }
        
        return cleanedResponse;
      });
      
    } catch (error: any) {
      console.error('Career recommendations error:', error);
      
      // Return appropriate fallback based on error type
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return enhancedFallbacks.career.networkError;
      } else if (error.message?.includes('server') || error.message?.includes('500')) {
        return enhancedFallbacks.career.serverError;
      }
      
      return enhancedFallbacks.career.generic;
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
        return enhancedFallbacks.chat.generic;
      }

      // Try to get result from cache
      const cacheKey = `chat_${message}_${JSON.stringify(context.personality || {})}`;
      const cachedResult = localStorage.getItem(cacheKey);
      if (cachedResult) {
        try {
          const { response, timestamp } = JSON.parse(cachedResult);
          // Check if cache is still valid (1 hour)
          if (Date.now() - timestamp < 60 * 60 * 1000) {
            return response;
          }
        } catch (e) {
          // Cache error, continue with API call
          console.warn('Cache parsing error:', e);
        }
      }

      const contextInfo = context.personality ? 
        `Foydalanuvchi shaxsiyat ma'lumotlari: 
        Ochiqlik: ${context.personality.openness}%, 
        Mas'uliyatlilik: ${context.personality.conscientiousness}%, 
        Ekstraversiya: ${context.personality.extraversion}%, 
        Do'stonalik: ${context.personality.agreeableness}%, 
        Emotsional barqarorlik: ${100 - context.personality.neuroticism}%` : 
        '';

      const conversationHistory = context.previousMessages?.slice(-6).join('\n') || '';

      // Use Optimized Chat Prompt as specified in requirements
      const prompt = `
Siz CareerPath platformasining AI karyera maslahatchi assistentisiz. O'zbek tilida professional, do'stona va foydali javoblar bering.

SIZNING ROLINGIZ:
- Karyera maslahatchi
- Shaxsiyat tahlil mutaxassisi  
- O'zbekiston ish bozori eksperti
- Ta'lim va rivojlanish bo'yicha maslahatchi

${contextInfo}

SUHBAT TARIXI:
${conversationHistory}

FOYDALANUVCHI XABARI: "${message}"

JAVOB TALABLARI:
1. O'zbek tilida professional tarzda javob bering
2. Hech qanday format belgilari ishlatmang (yulduzcha, tire, nuqta)
3. Oddiy, tushunarli gaplar bilan yozing
4. Amaliy va foydali maslahatlar bering
5. Qisqa va aniq javob bering (maksimum 200 so'z)
6. Do'stona va yordam beruvchi ohangda bo'ling

ESLATMA: Javobingizda markdown format, yulduzcha yoki boshqa maxsus belgilar ishlatmang. Faqat oddiy matn.
`;

      // Use retry logic for API calls
      return await withRetry(async () => {
        if (!this.model) {
          return enhancedFallbacks.chat.generic;
        }
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text() || enhancedFallbacks.chat.generic;
        
        // Clean and format the AI response
        const cleanedResponse = cleanAIResponse(rawText);
        
        // Cache successful response
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            response: cleanedResponse,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Failed to cache response:', e);
        }
        
        return cleanedResponse;
      });
      
    } catch (error: any) {
      console.error('Chat AI error:', error);
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        return enhancedFallbacks.chat.networkError;
      } else if (error.message?.includes('server') || error.message?.includes('500')) {
        return enhancedFallbacks.chat.serverError;
      } else if (error.message?.includes('content')) {
        return enhancedFallbacks.chat.contentFilter;
      }
      return enhancedFallbacks.chat.generic;
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
            // Clean the fallback response before returning
            const cleanedResponse = cleanAIResponse(fallbackResponses.chat);
            controller.enqueue(new TextEncoder().encode(cleanedResponse));
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

  // 6. Stream chat responses
  streamChatWithAI(userMessage: string, history: { role: string, content: string }[]): ReadableStream {
    // Create a TransformStream to process and return the AI responses
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Process in an async function
    (async () => {
      try {
        // Check if AI model is available
        const model = this.model;
        if (!model) {
          // Clean the fallback response before returning
          const cleanedResponse = cleanAIResponse(fallbackResponses.chat);
          writer.write(encoder.encode(cleanedResponse));
          writer.close();
          return;
        }

        // Prepare chat history for the AI
        const chatHistory = history.map(msg => {
          return {
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          };
        });
        
        // Import chat-specific optimized config
      const { getOptimizedConfig } = require('./apiConfigs');
      const chatConfig = getOptimizedConfig('chat');
      
      // Create specialized model for chat
      const chatModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        ...chatConfig
      });
      
      // Create system prompt for the AI (optimized according to 4-qadam)
        const systemPrompt = `
Siz CareerPath platformasining AI karyera maslahatchi assistentisiz. O'zbek tilida professional, do'stona va foydali javoblar bering.

SIZNING ROLINGIZ:
- Karyera maslahatchi
- Shaxsiyat tahlil mutaxassisi  
- O'zbekiston ish bozori eksperti
- Ta'lim va rivojlanish bo'yicha maslahatchi

JAVOB TALABLARI:
1. O'zbek tilida professional tarzda javob bering
2. Hech qanday format belgilari ishlatmang (yulduzcha, tire, nuqta)
3. Oddiy, tushunarli gaplar bilan yozing
4. Amaliy va foydali maslahatlar bering
5. Qisqa va aniq javob bering (maksimum 200 so'z)
6. Do'stona va yordam beruvchi ohangda bo'ling

ESLATMA: Javobingizda markdown format, yulduzcha yoki boshqa maxsus belgilar ishlatmang. Faqat oddiy matn.
`;
        
        // Create a chat session with optimized config
        const chat = chatModel.startChat({
          history: chatHistory,
          generationConfig: chatConfig.generationConfig,
          safetySettings: chatConfig.safetySettings
        });
        
        // Add system prompt for the first message in a conversation
        if (history.length === 0) {
          await chat.sendMessage(systemPrompt);
        }
        
        // Stream the chat response
        let completeResponse = '';
        
        try {
          const result = await chat.sendMessageStream(userMessage);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            completeResponse += chunkText;
            // Clean each chunk before sending it
            const cleanedChunk = cleanAIResponse(chunkText);
            writer.write(encoder.encode(cleanedChunk));
          }
          
          writer.close();
        } catch (error) {
          console.error('Chat streaming error:', error);
          writer.write(encoder.encode(cleanAIResponse(fallbackResponses.chat)));
          writer.close();
        }
      } catch (error) {
        console.error('Stream setup error:', error);
        writer.write(encoder.encode(cleanAIResponse(fallbackResponses.chat)));
        writer.close();
      }
    })();
    
    return stream.readable;
  }

  // Store for feedback received from users
  private feedbackStore = new Map<string, {
    responseId: string;
    responseType: 'personality' | 'career' | 'chat';
    feedback: 'helpful' | 'unhelpful';
    timestamp: number;
    userId: string;
  }>();

  /**
   * Record user feedback for a response
   * 
   * @param responseId Unique identifier for the response
   * @param responseType Type of response (personality, career, chat)
   * @param feedback Whether the response was helpful or not
   * @param userId User identifier
   */
  recordFeedback(
    responseId: string,
    responseType: 'personality' | 'career' | 'chat',
    feedback: 'helpful' | 'unhelpful',
    userId: string = 'anonymous'
  ): void {
    // Store feedback
    this.feedbackStore.set(responseId, {
      responseId,
      responseType,
      feedback,
      timestamp: Date.now(),
      userId
    });
    
    // Log to console for debugging
    console.log(`User feedback recorded: ${feedback} for ${responseType} response`);
    
    // Store in localStorage for persistence
    try {
      const key = 'careerpath_feedback_store';
      const existingData = localStorage.getItem(key);
      let feedbackData = existingData ? JSON.parse(existingData) : [];
      
      // Add new feedback
      feedbackData.push({
        responseId,
        responseType,
        feedback,
        timestamp: Date.now(),
        userId
      });
      
      // Keep only recent feedback (last 100 entries)
      if (feedbackData.length > 100) {
        feedbackData = feedbackData.slice(-100);
      }
      
      localStorage.setItem(key, JSON.stringify(feedbackData));
    } catch (e) {
      console.error('Failed to persist feedback:', e);
    }
    
    // Use feedback to improve future responses
    this.processFeedback(responseId, responseType, feedback);
  }

  /**
   * Process user feedback to improve future responses
   */
  private processFeedback(
    responseId: string,
    responseType: 'personality' | 'career' | 'chat',
    feedback: 'helpful' | 'unhelpful'
  ): void {
    // If response was unhelpful, we may want to adjust our prompt
    if (feedback === 'unhelpful') {
      // Get cached response if available
      const cacheKey = `${responseType}_${responseId}`;
      const cachedResponse = localStorage.getItem(cacheKey);

      // Dynamically require logQualityEvent if not already imported
      let logQualityEvent: any;
      try {
        ({ logQualityEvent } = require('./responseMonitoring'));
      } catch (e) {
        console.warn('logQualityEvent could not be loaded:', e);
      }
      
      if (cachedResponse) {
        try {
          // Mark this response as problematic so we don't use similar patterns
          const { response } = JSON.parse(cachedResponse);
          if (typeof logQualityEvent === 'function') {
            logQualityEvent(responseType, response, 'feedback-negative');
          }
          
          // Clear this specific cache entry to force regeneration next time
          localStorage.removeItem(cacheKey);
        } catch (e) {
          console.error('Failed to process negative feedback:', e);
        }
      }
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

/**
 * Enhanced error handling system for Gemini API
 * Provides detailed error messages, retry logic, and fallbacks
 */

// Maximum number of retries for API calls
const MAX_RETRIES = 2;

// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000;

/**
 * Comprehensive error handler with specific error codes and messages
 */
export function handleGeminiError(error: any): string {
  // Network related errors
  if (error.message?.includes('network') || error.message?.includes('timeout') || error.message?.includes('connection')) {
    return 'Tarmoq muammosi yuzaga keldi. Internetga ulanishingizni tekshiring va qayta urinib ko\'ring.';
  }
  
  // Rate limiting errors
  if (error.message?.includes('rate limit') || error.message?.includes('quota') || error.message?.includes('too many requests')) {
    return 'Juda ko\'p so\'rov yuborildi. Iltimos, bir necha daqiqa kutib turing va qayta urinib ko\'ring.';
  }
  
  // API key related errors
  if (error.message?.includes('API key') || error.message?.includes('authentication') || error.message?.includes('auth')) {
    return 'AI xizmatiga kirish muammosi yuzaga keldi. Iltimos, keyinroq qayta urinib ko\'ring.';
  }
  
  // Content moderation errors
  if (error.message?.includes('content') || error.message?.includes('harmful') || error.message?.includes('unsafe')) {
    return 'So\'rovingiz AI xavfsizlik filtrlarini ishga tushirdi. Iltimos, so\'rovingizni boshqacha so\'zlar bilan qayta yozing.';
  }
  
  // Server-side errors
  if (error.message?.includes('500') || error.message?.includes('server')) {
    return 'AI serverlari hozir band. Iltimos, bir necha daqiqadan so\'ng qayta urinib ko\'ring.';
  }
  
  // Log unknown errors for debugging
  console.error('Unhandled Gemini error:', error);
  
  // Generic fallback message
  return 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring yoki yordam uchun biz bilan bog\'laning.';
}

/**
 * Retry a function multiple times if it fails
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) throw error;
    
    const errorMessage = error.message || 'Unknown error';
    console.log(`Retrying after error: ${errorMessage}. Attempts remaining: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return withRetry(fn, retries - 1);
  }
}

/**
 * Enhanced fallback responses with more specific context
 */
export const enhancedFallbacks = {
  personality: {
    generic: "Shaxsiyatingiz haqidagi ma'lumotlar tahlil qilindi. Siz o'ziga xos kuchli tomonlarga va rivojlanish imkoniyatlariga ega ekaningiz aniqlandi. O'z xususiyatlaringizdan foydalanib, har qanday sohada muvaffaqiyat qozonishingiz mumkin.",
    networkError: "Afsuski, tarmoq muammosi tufayli shaxsiyatingiz to'liq tahlil qilinmadi. Iltimos, internetga ulanishingizni tekshiring va qayta urinib ko'ring.",
    serverError: "Hozir serverlarimiz band. Shaxsiyat tahlilini keyinroq qayta so'rang. Har bir inson o'ziga xos va takrorlanmas ekanini unutmang."
  },
  career: {
    generic: "Tahlil natijalariga ko'ra, sizga IT, ta'lim, biznes va ijodiy sohalar mos kelishi mumkin. Qiziqishlaringiz va qobiliyatlaringizga asoslanib, karyera yo'nalishingizni tanlang va o'sha sohada o'z mahoratingizni rivojlantiring.",
    networkError: "Tarmoq muammosi tufayli karyera tavsiyalarini olib bo'lmadi. Internet aloqangizni tekshirib, qayta urinib ko'ring.",
    serverError: "Serverlarimiz hozir band bo'lgani uchun karyera tavsiyalarini keyinroq so'rashingizni tavsiya qilamiz."
  },
  chat: {
    generic: "Savolingizga javob berishda muammo yuzaga keldi. Iltimos, savolingizni qayta yozing yoki keyinroq urinib ko'ring.",
    networkError: "Internet aloqasi uzildi. Tarmoq ulanishingizni tekshiring va suhbatni davom ettiring.",
    serverError: "AI serverlari hozir juda band. Iltimos, bir necha daqiqadan so'ng qayta urinib ko'ring.",
    contentFilter: "Savolingiz tarkibi tufayli javob berilmadi. Iltimos, savolingizni boshqacha shaklda yozing."
  }
};