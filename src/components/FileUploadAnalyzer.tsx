/**
 * FileUploadAnalyzer Component
 * 
 * Component for uploading and analyzing documents like resumes and cover letters
 * Features:
 * - File upload with drag and drop
 * - File type validation
 * - AI-powered document analysis
 * - Results display with suggestions
 */

"use client";

import React, { useState, useRef, useCallback } from 'react';

// Mock types and services since they're not available
type AnalysisRequestType = 'resume' | 'coverLetter' | 'jobDescription';

interface FileAnalysisResponse {
  success: boolean;
  data?: {
    analysis: string;
    suggestions: string[];
    score?: number;
  };
  error?: string;
}

// Mock file processing service
const processFile = async (file: File): Promise<{ text: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ text: reader.result as string });
    };
    reader.readAsText(file);
  });
};

// Mock analysis service
const FileAnalysisService = {
  analyzeDocument: async (request: {
    text: string;
    type: AnalysisRequestType;
    fileName?: string;
    additionalContext?: string;
  }): Promise<FileAnalysisResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      data: {
        analysis: `Bu fayl uchun AI tahlili: ${request.text.substring(0, 100)}...`,
        suggestions: [
          'Kalit so\'zlarni qo\'shing',
          'Formatni yaxshilang',
          'Batafsil ma\'lumot qo\'shing'
        ],
        score: Math.floor(Math.random() * 30) + 70 // 70-100 random score
      }
    };
  }
};

interface FileUploadAnalyzerProps {
  analysisType: AnalysisRequestType;
  title?: string;
  description?: string;
  acceptedFileTypes?: string;
  className?: string;
  onAnalysisComplete?: (result: FileAnalysisResponse) => void;
}

export default function FileUploadAnalyzer({
  analysisType = 'resume',
  title = 'Fayl yuklash',
  description = 'PDF, DOCX yoki TXT formatidagi fayl yuklang',
  acceptedFileTypes = '.pdf,.docx,.txt',
  className = '',
  onAnalysisComplete
}: FileUploadAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    try {
      await processSelectedFile(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fayl yuklashda xatolik yuz berdi');
      setFile(null);
    }
  };
  
  // Process the selected file
  const processSelectedFile = async (selectedFile: File) => {
    // Validate file type
    const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = acceptedFileTypes.split(',').map(t => t.replace('.', ''));
    
    if (fileType && !acceptedTypes.includes(fileType)) {
      setError(`Qo'llab-quvvatlanmaydigan fayl turi. Quyidagi turlarni qo'llab-quvvatlaydi: ${acceptedTypes.join(', ')}`);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setAnalysisResult(null);
    setIsProcessing(true);
    
    try {
      // Process file to extract text
      const result = await processFile(selectedFile);
      setExtractedText(result.text);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setError(err instanceof Error ? err.message : 'Faylni o\'qishda xatolik yuz berdi');
    }
  };
  
  // Handle drag and drop
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        try {
          await processSelectedFile(e.dataTransfer.files[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Fayl yuklashda xatolik yuz berdi');
        }
      }
    },
    []
  );
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Open file browser
  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };
  
  // Analyze the document
  const analyzeDocument = async () => {
    if (!extractedText || extractedText.trim().length === 0) {
      setError('Tahlil qilish uchun matn mavjud emas');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await FileAnalysisService.analyzeDocument({
        text: extractedText,
        type: analysisType,
        fileName: file?.name,
        additionalContext: additionalContext.trim() || undefined
      });
      
      setAnalysisResult(result);
      
      // Call the callback if provided
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tahlil qilishda xatolik yuz berdi');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Reset the component
  const resetAnalyzer = () => {
    setFile(null);
    setExtractedText('');
    setAdditionalContext('');
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* File upload area */}
        {!file && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-sm text-gray-600">
                <button
                  onClick={openFileBrowser}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Fayl tanlash
                </button>
                {' yoki bu yerga tashlang'}
              </div>
              <p className="text-xs text-gray-500">
                Qo'llab-quvvatlanadigan formatlar: {acceptedFileTypes}
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={handleFileChange}
            />
          </div>
        )}
        
        {/* File info */}
        {file && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={resetAnalyzer}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Fayl qayta ishlanmoqda...</p>
          </div>
        )}
        
        {/* Additional context */}
        {extractedText && !isProcessing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qo'shimcha kontekst (ixtiyoriy)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tahlilni yaxshilash uchun qo'shimcha ma'lumot kiriting..."
            />
          </div>
        )}
        
        {/* Analyze button */}
        {extractedText && !isProcessing && (
          <div className="text-center mb-4">
            <button
              onClick={analyzeDocument}
              disabled={isAnalyzing}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Tahlil qilinmoqda...
                </>
              ) : (
                'AI tahlili boshlash'
              )}
            </button>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Analysis results */}
        {analysisResult && analysisResult.success && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Tahlil natijalari</h3>
            
            {analysisResult.data?.score && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Umumiy ball</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {analysisResult.data.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analysisResult.data.score}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">AI tahlili</h4>
              <p className="text-gray-700">{analysisResult.data?.analysis}</p>
            </div>
            
            {analysisResult.data?.suggestions && analysisResult.data.suggestions.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Tavsiyalar</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.data.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}