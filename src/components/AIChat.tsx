/**
 * AIChat Component
 * 
 * Modern chat interface for CareerPath's AI assistant
 * Features:
 * - Full-width chat container with proper layout
 * - Professional message styling
 * - Typing indicator animation
 * - Smooth scrolling to new messages
 * - Enhanced mobile responsiveness
 */

"use client";
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '@/lib/geminiService';
import { formatChatResponse } from '@/lib/textFormatter';
import type { PersonalityScores } from '@/types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import Avatar from './Avatar';
import AIPromptSuggestions from './AIPromptSuggestions';
import styles from '@/styles/chat.module.css';

// Avatar moved to ChatMessage and TypingIndicator components

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIChatProps {
  personalityData?: PersonalityScores;
  className?: string;
}

export default function AIChat({ personalityData, className = '' }: AIChatProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load chat history from localStorage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chat_history');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // First-time welcome message
        setMessages([
          {
            role: 'assistant' as const,
            content: "Salom! Men CareerPath'ning AI karyera maslahatchisiman. Karyera, ta'lim yoki shaxsiy rivojlanish bo'yicha savollaringiz bo'lsa, bemalol so'rang.",
            timestamp: Date.now()
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
  }, []);
  
  // Save chat history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Save only the last 20 messages to avoid localStorage limits
        const messagesToSave = messages.slice(-20);
        localStorage.setItem('chat_history', JSON.stringify(messagesToSave));
      } catch (e) {
        console.error('Failed to save chat history', e);
      }
    }
  }, [messages]);
  
  // Auto-grow textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    // Update messages with user input
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, content: userMessage, timestamp: Date.now() }
    ];
    setMessages(updatedMessages);
    
    // Reset input field height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Prepare previous messages context
      const previousMessages = messages
        .slice(-6) // Only use last 6 messages for context
        .map(msg => msg.content);
      
      // Call AI service with context
      const response = await geminiService.chatWithAI(
        userMessage, 
        { 
          personality: personalityData,
          previousMessages
        }
      );
      
      // Format the response for better readability
      const formattedResponse = formatChatResponse(response);
      
      // Update messages with AI response
      setMessages([
        ...updatedMessages,
        { role: 'assistant' as const, content: formattedResponse, timestamp: Date.now() }
      ]);
      
    } catch (err) {
      console.error('Chat error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Xatolik yuz berdi. Qayta urinib ko'ring."
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Clear chat history
  const clearChat = () => {
    const confirmed = window.confirm('Haqiqatan ham suhbat tarixini tozalamoqchimisiz?');
    if (confirmed) {
      setMessages([
        {
          role: 'assistant' as const,
          content: "Suhbat tarixi tozalandi. Yangi suhbatni boshlashingiz mumkin.",
          timestamp: Date.now()
        }
      ]);
      localStorage.removeItem('chat_history');
    }
  };
  
  // Function removed - moved to ChatMessage component
  
  return (
    <div 
      className={`ai-chat flex flex-col bg-white rounded-lg shadow-lg ${className}`}
      style={{ height: '500px', maxHeight: '80vh' }}
      ref={chatContainerRef}
    >
      {/* Chat Header */}
      <div className="chat-header flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Avatar type="ai" />
          <div>
            <h3 className="font-semibold">AI Karyera Maslahatchisi</h3>
            <p className="text-xs text-blue-100">Professional yordam 24/7</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearChat}
            className="p-1 text-blue-100 hover:text-white transition-colors"
            title="Suhbatni tozalash"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="messages-container flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && <TypingIndicator className="mt-2" />}
        
        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="chat-input-container border-t border-gray-200 p-3 bg-white rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Xabaringizni yozing..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-20 min-h-[40px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              px-4 py-2 rounded-lg flex-shrink-0 transition-colors
              ${isLoading || !input.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-1">Enter tugmasini bosib xabar yuboring, Shift+Enter orqali yangi qator qo'shing</p>
      </div>
      
      {/* Prompt Suggestions */}
      <div className="prompt-suggestions border-t border-gray-200 bg-gray-50 p-3">
        <AIPromptSuggestions 
          onSelectPrompt={(prompt) => setInput(prompt)} 
          className="space-x-2"
        />
      </div>
    </div>
  );
}