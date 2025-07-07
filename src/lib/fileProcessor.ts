/**
 * File Processor Utilities
 * 
 * Handles file upload, processing and analysis
 */

// File types and their MIME types
export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  TXT: 'text/plain',
  IMAGE: ['image/jpeg', 'image/png', 'image/gif']
} as const;

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface FileProcessingResult {
  success: boolean;
  content?: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    wordCount?: number;
    pageCount?: number;
  };
  error?: string;
}

/**
 * Validates file before processing
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Fayl hajmi ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB dan oshmasligi kerak`
    };
  }
  
  // Check file type
  const supportedTypes = [
    SUPPORTED_FILE_TYPES.PDF,
    SUPPORTED_FILE_TYPES.DOC,
    SUPPORTED_FILE_TYPES.DOCX,
    SUPPORTED_FILE_TYPES.TXT,
    ...SUPPORTED_FILE_TYPES.IMAGE
  ];
  
  if (!supportedTypes.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Qo\'llab-quvvatlanmaydigan fayl turi. PDF, DOC, DOCX, TXT yoki rasm fayllarini yuklang.'
    };
  }
  
  return { isValid: true };
}

/**
 * Processes uploaded file and extracts text content
 */
export async function processFile(file: File): Promise<FileProcessingResult> {
  const validation = validateFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    };
  }
  
  try {
    let content = '';
    
    switch (file.type) {
      case SUPPORTED_FILE_TYPES.TXT:
        content = await readTextFile(file);
        break;
        
      case SUPPORTED_FILE_TYPES.PDF:
        content = await extractPDFText(file);
        break;
        
      case SUPPORTED_FILE_TYPES.DOC:
      case SUPPORTED_FILE_TYPES.DOCX:
        content = await extractDocText(file);
        break;
        
      default:
        if (SUPPORTED_FILE_TYPES.IMAGE.includes(file.type as any)) {
          content = await extractImageText(file);
        } else {
          throw new Error('Qo\'llab-quvvatlanmaydigan fayl turi');
        }
    }
    
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      success: true,
      content,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        wordCount
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Faylni qayta ishlashda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`
    };
  }
}

/**
 * Reads plain text file content
 */
async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string || '');
    };
    reader.onerror = () => reject(new Error('Fayl o\'qishda xatolik'));
    reader.readAsText(file);
  });
}

/**
 * Extracts text from PDF files (mock implementation)
 */
async function extractPDFText(file: File): Promise<string> {
  // In a real application, you would use a library like pdf-parse or PDF.js
  // This is a mock implementation
  await delay(1000); // Simulate processing time
  
  return `[PDF FAYLI: ${file.name}]
  
Bu PDF fayldan olingan matn. Haqiqiy ilovada PDF.js yoki shunga o'xshash kutubxona ishlatiladi.

Karyera maqsadi: Dasturiy ta'minot sohasida malakali mutaxassis bo'lish.

Tajriba:
- Frontend Developer, ABC Company (2020-2023)
- Junior Developer, XYZ Startup (2019-2020)

Ta'lim:
- Kompyuter ilmlari bo'yicha bakalavr, Toshkent IT Universiteti (2019)

Ko'nikmalar:
- JavaScript, React, Node.js
- HTML, CSS, TypeScript
- Git, Docker, AWS

Tillar:
- O'zbek tili (ona tili)
- Ingliz tili (B2 darajasi)
- Rus tili (fluent)`;
}

/**
 * Extracts text from DOC/DOCX files (mock implementation)
 */
async function extractDocText(file: File): Promise<string> {
  // In a real application, you would use mammoth.js or similar library
  // This is a mock implementation
  await delay(1500); // Simulate processing time
  
  return `[WORD HUJJATI: ${file.name}]
  
Bu Word hujjatidan olingan matn. Haqiqiy ilovada mammoth.js kutubxonasi ishlatiladi.

RESUME

Ism: Ali Valiyev
Telefon: +998 90 123 45 67
Email: ali.valiyev@example.com
LinkedIn: linkedin.com/in/alivaliyev

PROFESSIONAL SUMMARY
Tajribali frontend developer bo'lib, 3+ yillik React va JavaScript tajribasiga ega.
Responsive web applications yaratish va performance optimization bo'yicha expertise.

EXPERIENCE
Senior Frontend Developer | TechCorp (2022-2023)
- React va TypeScript yordamida enterprise application yaratish
- Performance optimization va code review
- Junior developerlarga mentoring

Frontend Developer | StartupXYZ (2020-2022)
- Modern web applicationlar yaratish
- API integration va state management
- Agile team environment

EDUCATION
Computer Science, Toshkent IT University (2020)

SKILLS
- Frontend: React, Vue.js, Angular
- Languages: JavaScript, TypeScript, Python
- Tools: Git, Docker, AWS, Figma`;
}

/**
 * Extracts text from images using OCR (mock implementation)
 */
async function extractImageText(file: File): Promise<string> {
  // In a real application, you would use Tesseract.js or cloud OCR service
  // This is a mock implementation
  await delay(2000); // Simulate OCR processing time
  
  return `[RASM FAYLIDAN OLINGAN MATN: ${file.name}]
  
Bu rasmdan OCR yordamida olingan matn. Haqiqiy ilovada Tesseract.js yoki cloud OCR xizmati ishlatiladi.

SERTIFIKAT

Ushbu guvohnoma Ali Valiyevga
"React Developer" kursi muvaffaqiyatli 
yakunlanganligini tasdiqlaydi.

Kurs davomiyligi: 6 oy
Baholash natijasi: A+ (Excellent)
Sana: 2023 yil mart

TechAcademy tomonidan berilgan.`;
}

/**
 * Utility function to simulate async operations
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates file processing statistics
 */
export function generateFileStats(content: string) {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    characterCount: content.length,
    characterCountNoSpaces: content.replace(/\s/g, '').length,
    avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
    readingTime: Math.ceil(words.length / 200) // Average reading speed: 200 words per minute
  };
}

/**
 * Extracts keywords from text content
 */
export function extractKeywords(content: string, maxKeywords: number = 20): string[] {
  // Common stop words in Uzbek and English
  const stopWords = new Set([
    'va', 'yoki', 'lekin', 'uchun', 'bilan', 'dan', 'ga', 'ni', 'ning', 'da', 'dagi',
    'and', 'or', 'but', 'for', 'with', 'from', 'to', 'the', 'a', 'an', 'in', 'on', 'at',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
  ]);
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

export default {
  validateFile,
  processFile,
  generateFileStats,
  extractKeywords,
  SUPPORTED_FILE_TYPES,
  MAX_FILE_SIZE
};