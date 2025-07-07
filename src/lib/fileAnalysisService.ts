/**
 * File Analysis Service
 * 
 * Analyze text documents with AI
 * - Resume analysis
 * - Cover letter review
 * - Job description analysis
 */

import { geminiService } from './geminiService';
import type { FileAnalysisRequest, FileAnalysisResponse } from '@/types';

export class FileAnalysisService {
  /**
   * Analyze a document based on its type
   */
  static async analyzeDocument(request: FileAnalysisRequest): Promise<FileAnalysisResponse> {
    const { text, type, fileName, additionalContext } = request;
    
    // Validate input
    if (!text || text.trim().length < 50) {
      throw new Error('Matn juda qisqa. Kamida 50 ta belgi kerak.');
    }
    
    try {
      let analysis = '';
      let suggestions: string[] = [];
      let keywords: string[] = [];
      
      // Different analysis based on document type
      switch (type) {
        case 'resume':
          const resumeResult = await this.analyzeResume(text, additionalContext);
          analysis = resumeResult.analysis;
          suggestions = resumeResult.suggestions;
          keywords = resumeResult.keywords || [];
          break;
          
        case 'coverLetter':
          const letterResult = await this.analyzeCoverLetter(text, additionalContext);
          analysis = letterResult.analysis;
          suggestions = letterResult.suggestions;
          break;
          
        case 'jobDescription':
          const jobResult = await this.analyzeJobDescription(text);
          analysis = jobResult.analysis;
          suggestions = jobResult.suggestions;
          keywords = jobResult.keywords || [];
          break;
          
        case 'text':
        default:
          const generalResult = await this.analyzeGeneralText(text);
          analysis = generalResult.analysis;
          suggestions = generalResult.suggestions;
      }
      
      return {
        analysis,
        suggestions,
        keywords,
        metadata: {
          analysisTime: Date.now(),
          confidence: 0.85,
        }
      };
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    }
  }
  
  /**
   * Analyze a resume/CV
   */
  private static async analyzeResume(
    text: string, 
    additionalContext?: string
  ): Promise<FileAnalysisResponse> {
    const prompt = `
RESUME TAHLILI VAZIFASI:

Quyidagi resumeni tahlil qilib, professional va konstruktiv fikr-mulohaza bering. O'zbek tilida javob bering.

RESUME MATNI:
${text}

${additionalContext ? `QO'SHIMCHA KONTEKST: ${additionalContext}` : ''}

Tahlil quyidagilarni o'z ichiga olsin:
1. Umumiy baholash - Resumening kuchli va zaif tomonlari
2. Tajriba tahlili - Eng muhim ko'nikmalar va yutuqlar
3. Ta'lim va malakalar tahlili
4. Taqdimot va formatlash - Resume tuzilishi bo'yicha tavsiyalar
5. Yaxshilash bo'yicha aniq tavsiyalar (kamida 5 ta)
6. Resume uchun muhim kalit so'zlar ro'yxati

Tahlil quyidagi formatda bo'lsin:
UMUMIY BAHOLASH: [umumiy tahlil]
TAJRIBA TAHLILI: [tajriba tahlili]
MALAKALAR VA TA'LIM: [ta'lim va malakalar tahlili]
TAQDIMOT VA FORMAT: [taqdimot tahlili]
TAVSIYALAR: [tavsiyalar ro'yxati]
KALIT SO'ZLAR: [kalit so'zlar ro'yxati]

Professional, aniq va konstruktiv bo'ling. Sizning vazifangiz foydalanuvchiga resumesini yaxshilash uchun aniq va foydali maslahatlar berishdir.
`;

    try {
      const response = await geminiService.customPrompt(prompt);
      
      // Extract suggestions and keywords
      const suggestions = extractSuggestions(response);
      const keywords = extractKeywords(response);
      
      return {
        analysis: response,
        suggestions,
        keywords
      };
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw new Error('Resume tahlil qilishda xatolik yuz berdi');
    }
  }
  
  /**
   * Analyze a cover letter
   */
  private static async analyzeCoverLetter(
    text: string, 
    additionalContext?: string
  ): Promise<FileAnalysisResponse> {
    const prompt = `
COVER LETTER TAHLILI VAZIFASI:

Quyidagi cover letterni tahlil qilib, professional va konstruktiv fikr-mulohaza bering. O'zbek tilida javob bering.

COVER LETTER MATNI:
${text}

${additionalContext ? `QO'SHIMCHA KONTEKST (Ish haqida): ${additionalContext}` : ''}

Tahlil quyidagilarni o'z ichiga olsin:
1. Umumiy taassurot - Cover letterning kuchli va zaif tomonlari
2. Maqsad va motivatsiya aniqligi
3. Strukturasi va tuzilishi
4. Professionallik va til sifati
5. Yaxshilash bo'yicha aniq tavsiyalar (kamida 5 ta)

Tahlil quyidagi formatda bo'lsin:
UMUMIY TAASSUROT: [umumiy tahlil]
MAQSAD VA MOTIVATSIYA: [maqsad tahlili]
STRUKTURA: [struktura tahlili]
TIL VA USLuB: [til tahlili]
TAVSIYALAR: [tavsiyalar ro'yxati]

Professional, aniq va konstruktiv bo'ling.
`;

    try {
      const response = await geminiService.customPrompt(prompt);
      
      // Extract suggestions
      const suggestions = extractSuggestions(response);
      
      return {
        analysis: response,
        suggestions
      };
    } catch (error) {
      console.error('Cover letter analysis error:', error);
      throw new Error('Cover letter tahlil qilishda xatolik yuz berdi');
    }
  }
  
  /**
   * Analyze a job description
   */
  private static async analyzeJobDescription(text: string): Promise<FileAnalysisResponse> {
    const prompt = `
ISH TA'RIFI TAHLILI VAZIFASI:

Quyidagi ish ta'rifini tahlil qiling va ish izlovchilarga foydali ma'lumotlar bering. O'zbek tilida javob bering.

ISH TA'RIFI MATNI:
${text}

Quyidagilarni o'z ichiga olgan tahlil bering:
1. Umumiy ma'lumot - Lavozim va kompaniya haqida asosiy ma'lumotlar
2. Asosiy mas'uliyatlar va majburiyatlar
3. Zarur ko'nikmalar va malakalar
4. Ish izlovchilar e'tibor berishi kerak bo'lgan muhim nuqtalar
5. Ish uchun zarur bo'lgan eng muhim kalit so'zlar ro'yxati
6. Resumega kiritish uchun muhim kalit so'zlar (kamida 10 ta)
7. Intervyuga tayyorgarlik bo'yicha maslahatlar

Tahlil quyidagi formatda bo'lsin:
UMUMIY MA'LUMOT: [umumiy ma'lumot]
MAS'ULIYATLAR: [asosiy mas'uliyatlar]
ZARUR KO'NIKMALAR: [ko'nikmalar tahlili]
MUHIM NUQTALAR: [muhim nuqtalar]
KALIT SO'ZLAR: [kalit so'zlar ro'yxati]
INTERVYU MASLAHATLARI: [intervyu maslahatlari]

Professional va aniq bo'ling.
`;

    try {
      const response = await geminiService.customPrompt(prompt);
      
      // Extract keywords
      const keywords = extractKeywords(response);
      
      // Extract suggestions (interview tips)
      const suggestions = extractSuggestions(response);
      
      return {
        analysis: response,
        suggestions,
        keywords
      };
    } catch (error) {
      console.error('Job description analysis error:', error);
      throw new Error('Ish tavsifi tahlil qilishda xatolik yuz berdi');
    }
  }
  
  /**
   * Analyze general text
   */
  private static async analyzeGeneralText(text: string): Promise<FileAnalysisResponse> {
    const prompt = `
MATN TAHLILI VAZIFASI:

Quyidagi matnni tahlil qilib, uning asosiy mazmuni, tuzilishi va uslubi haqida fikr bildiring. O'zbek tilida javob bering.

MATN:
${text}

Quyidagilarni o'z ichiga olgan tahlil bering:
1. Matn haqida umumiy ma'lumot - turi, mavzu va maqsadi
2. Asosiy g'oyalar va tezislar
3. Tuzilishi va mantiqiy oqimi
4. Til va uslub xususiyatlari
5. Matnni yaxshilash bo'yicha tavsiyalar

Tahlil quyidagi formatda bo'lsin:
UMUMIY MA'LUMOT: [umumiy ma'lumot]
ASOSIY G'OYALAR: [asosiy g'oyalar]
TUZILISH VA MANTIQ: [tuzilish tahlili]
TIL VA USLUB: [til va uslub tahlili]
TAVSIYALAR: [tavsiyalar]

Aniq va konstruktiv bo'ling.
`;

    try {
      const response = await geminiService.customPrompt(prompt);
      
      // Extract suggestions
      const suggestions = extractSuggestions(response);
      
      return {
        analysis: response,
        suggestions
      };
    } catch (error) {
      console.error('Text analysis error:', error);
      throw new Error('Matn tahlil qilishda xatolik yuz berdi');
    }
  }
}

/**
 * Extract suggestions from AI response
 */
function extractSuggestions(text: string): string[] {
  // Look for suggestions section
  const suggestionMatches = text.match(/TAVSIYALAR:[\s\S]*?(KALIT|$)/i);
  
  if (suggestionMatches && suggestionMatches[0]) {
    const suggestionsSection = suggestionMatches[0]
      .replace(/TAVSIYALAR:/i, '')
      .replace(/KALIT.*/i, '')
      .trim();
    
    // Split by numbered list items or bullet points
    return suggestionsSection
      .split(/\d+\.\s|\-\s|\•\s/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
  }
  
  return [];
}

/**
 * Extract keywords from AI response
 */
function extractKeywords(text: string): string[] {
  // Look for keywords section
  const keywordMatches = text.match(/KALIT SO[''']ZLAR:[\s\S]*?($|INTERVYU|TAVSIYALAR)/i);
  
  if (keywordMatches && keywordMatches[0]) {
    const keywordsSection = keywordMatches[0]
      .replace(/KALIT SO[''']ZLAR:/i, '')
      .replace(/(INTERVYU|TAVSIYALAR).*/i, '')
      .trim();
    
    // Split by commas, bullet points, or new lines
    return keywordsSection
      .split(/,|\n|\•|\-/)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
  }
  
  return [];
}