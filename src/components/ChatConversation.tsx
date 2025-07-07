'use client';

/**
 * ChatConversation Component
 * 
 * Chat interface for career guidance
 */

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'career-recommendation';
}

interface ChatConversationProps {
  onClose?: () => void;
}

export default function ChatConversation({ onClose }: ChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salom! Men sizning karyera maslahatchingizman. Qanday yordam bera olaman?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Mock responses for demo
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('karyera') || lowerMessage.includes('ish')) {
      return 'Karyera yo\'nalishini tanlashda sizning qiziqishlaringiz, ko\'nikmalaringiz va shaxsiy xususiyatlaringizni hisobga olish muhim. Test topshirib, o\'zingizga mos yo\'nalishni aniqlashingiz mumkin.';
    }
    
    if (lowerMessage.includes('test') || lowerMessage.includes('sinov')) {
      return 'Bizning shaxsiyat testi sizning kuchli tomonlaringizni va qiziqishlaringizni aniqlashga yordam beradi. Test 10-15 daqiqa davom etadi va natijada sizga mos karyera yo\'nalishlari tavsiya etiladi.';
    }
    
    if (lowerMessage.includes('maosh') || lowerMessage.includes('oylik')) {
      return 'Maosh darajasi sohaga, tajribaga va joylashuvga bog\'liq. IT sohasida junior mutaxassislar $500-1500, middle $1500-3000, senior $3000+ maosh olishlari mumkin.';
    }
    
    if (lowerMessage.includes('o\'rganish') || lowerMessage.includes('tayyorgarlik')) {
      return 'Yangi sohaga tayyorgarlik ko\'rish uchun: 1) Asosiy ko\'nikmalarni o\'rganing, 2) Amaliy loyihalar ustida ishlang, 3) Portfolio yarating, 4) Networking qiling, 5) Tajriba orttiring.';
    }
    
    return 'Qiziqarli savol! Men sizga karyera yo\'nalishini tanlash, ko\'nikmalarni rivojlantirish va ish topishda yordam bera olaman. Aniqroq savol bering, men batafsil javob beraman.';
  };
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 seconds delay
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const quickSuggestions = [
    'Qaysi karyera yo\'nalishi menga mos?',
    'IT sohasiga qanday kirsam?',
    'Ko\'nikmalarimni qanday rivojlantirsam?',
    'Portfolio qanday yaratiladi?',
    'Ish topishda yordam kerak'
  ];
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Karyera Maslahatchi</h3>
            <p className="text-sm text-gray-500">Onlayn</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Tezkor savollar:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Savolingizni yozing..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-20"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className={`px-4 py-2 rounded-lg font-medium ${
              inputText.trim() && !isTyping
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}