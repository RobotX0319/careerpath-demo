/**
 * PDF Reading Utility
 * 
 * Extract text from PDF files using simple approach
 */

interface PDFResult {
  text: string;
  pageCount: number;
}

/**
 * Extract text content from a PDF file
 */
export async function readPdfText(file: File): Promise<PDFResult> {
  try {
    // Simple PDF text extraction
    // In production, you would use PDF.js or similar library
    const text = await file.text();
    
    return { 
      text: text || 'PDF matnini o\'qib bo\'lmadi', 
      pageCount: 1 
    };
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw new Error('PDF faylni o\'qishda xatolik yuz berdi');
  }
}

/**
 * Validate that a file is a PDF before processing
 */
export function validatePdfFile(file: File): boolean {
  // Check MIME type
  if (file.type !== 'application/pdf') {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      return false;
    }
  }
  
  // Check file size (limit to 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fayl hajmi juda katta (maksimum 10MB)');
  }
  
  return true;
}