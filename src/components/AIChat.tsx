"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { geminiService } from '@/lib/geminiService';
import { supabaseService } from '@/lib/supabase';
import type { PersonalityScores, ChatMessage } from '@/types';

interface AIChatProps {
  userId?: string;
  personalityScores?: PersonalityScores;
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({
  userId = 'demo-user',
  personalityScores,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize chat session
  useEffect(() => {
    initializeChat();
  }, [userId]);

  const initializeChat = async () => {
    try {
      // Create new chat session
      const session = await supabaseService.createChatSession(userId, 'Karyera maslahat');
      if (session) {
        setSessionId(session.id);
        // Add welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Salom! Men sizning shaxsiy karyera maslahatchi AI assistentingizman. Sizga quyidagi mavzularda yordam bera olaman:

🎯 Karyera yo'nalishi tanlash
💼 Ish qidirish strategiyalari  
📚 Ta'lim va kurslar bo'yicha maslahat
🚀 Professional rivojlanish
💬 Suhbatga tayyorgarlik

Menga savol bering yoki muammongizni bayon qiling!`,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Save user message to database
      if (sessionId) {
        await supabaseService.saveChatMessage(sessionId, {
          role: 'user',
          content: userMessage.content
        });
      }

      // Get AI response
      const previousMessages = messages.map(m => `${m.role}: ${m.content}`);
      const aiResponse = await geminiService.chatWithAI(
        userMessage.content,
        {
          personality: personalityScores,
          previousMessages
        },
        userId
      );

      // Create AI message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save AI message to database
      if (sessionId) {
        await supabaseService.saveChatMessage(sessionId, {
          role: 'assistant',
          content: assistantMessage.content
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Uzr, xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Typing indicator
  const TypingIndicator = () => (
    <div className="flex items-center gap-2 p-4 animate-fade-in">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <SparklesIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  // Message bubble component
  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';
    
    return (
      <div className={`flex gap-3 p-4 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-blue-500' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}>
          {isUser ? (
            <UserIcon className="w-4 h-4 text-white" />
          ) : (
            <SparklesIcon className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message content */}
        <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? 'bg-blue-500 text-white ml-auto' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
              {message.content.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString('uz-UZ', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">AI Karyera Maslahatchi</h3>
          <p className="text-sm text-gray-600">Professional yordam 24/7</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
        <div className="max-h-full">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Savolingizni yozing..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Qanday kasb tanlash kerak?",
            "Dasturchi bo'lish uchun nima qilish kerak?",
            "Karyeramni qanday rivojlantirish mumkin?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputValue(suggestion)}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChat;