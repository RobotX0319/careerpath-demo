/**
 * ChatConversation component
 * 
 * Displays a full conversation with the AI assistant
 * including user messages and AI responses with feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { recordFeedback } from '@/lib/feedbackService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: 'helpful' | 'unhelpful';
}

interface ChatConversationProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  personalityContext?: any;
}

export default function ChatConversation({
  messages,
  onSendMessage,
  isLoading = false,
  personalityContext
}: ChatConversationProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;
    
    const message = inputMessage;
    setInputMessage('');
    
    await onSendMessage(message);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Context information */}
      {personalityContext && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
          <p className="font-medium mb-1">Siz haqingizda ma'lumot:</p>
          <p className="text-gray-600">
            Ochiqlik: {personalityContext.openness}%, 
            Mas'uliyatlilik: {personalityContext.conscientiousness}%, 
            Ekstraversiya: {personalityContext.extraversion}%, 
            Do'stona xususiyat: {personalityContext.agreeableness}%, 
            Emotsionallik: {personalityContext.neuroticism}%
          </p>
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              CareerPath AI karyera maslahatchi bilan suhbatni boshlang
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-2">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                showFeedback={true}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center p-4 rounded-lg bg-white border mr-8 my-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
              AI
            </div>
            <div className="ml-2">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="mt-4 pt-2 border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Savolingizni yozing..."
            className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-r-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            Yuborish
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500">
          AI karyera maslahatchi bilan suhbatlashing. Masalan: "Dasturlash sohasida qanday karyera yo'llari bor?"
        </p>
      </div>
    </div>
  );
}