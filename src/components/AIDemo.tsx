/**
 * AIDemo Component
 * 
 * Demonstrates AI interaction in an attractive way
 * Features:
 * - Simulated chat with AI
 * - Visual cues about how AI works
 * - Interactive elements
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';

interface AIMessage {
  text: string;
  delay: number;
}

interface AIDemoProps {
  className?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export default function AIDemo({ className = '', onComplete, autoPlay = true }: AIDemoProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showCta, setShowCta] = useState(false);
  
  // Demo conversation messages
  const messages: AIMessage[] = [
    { 
      text: "Salom! Men CareerPath'ning AI karyera maslahatchisiman. Sizga qanday yordam bera olaman?", 
      delay: 1000 
    },
    { 
      text: "Menga o'zimga mos kasbni topishda yordam bera olasizmi?", 
      delay: 2000 
    },
    { 
      text: "Albatta! Sizga mos kasbni topish uchun shaxsiyat testini topshirishni tavsiya qilaman. Bu test orqali kuchli tomonlaringiz, qiziqishlaringiz va qobiliyatlaringizni aniqlaymiz.", 
      delay: 3000 
    },
    { 
      text: "Testni tugatgach, sizning xarakteringiz, ko'nikmalaringiz va qiziqishlaringizga mos kasblarni tavsiya qilaman.", 
      delay: 2000 
    }
  ];
  
  // Start demo conversation with delays
  useEffect(() => {
    if (!autoPlay) return;
    
    let timer: NodeJS.Timeout;
    
    const showNextMessage = (index: number) => {
      if (index < messages.length) {
        setIsTyping(true);
        
        timer = setTimeout(() => {
          setIsTyping(false);
          setActiveIndex(index);
          
          if (index < messages.length - 1) {
            timer = setTimeout(() => {
              showNextMessage(index + 1);
            }, messages[index].delay);
          } else {
            // Show CTA after last message
            timer = setTimeout(() => {
              setShowCta(true);
              if (onComplete) onComplete();
            }, 1000);
          }
        }, index % 2 === 0 ? 1500 : 500); // AI takes longer to "type"
      }
    };
    
    timer = setTimeout(() => {
      showNextMessage(0);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [autoPlay, messages, onComplete]);
  
  const handleStartTest = () => {
    router.push('/personality');
  };
  
  const handleStartChat = () => {
    router.push('/chat');
  };
  
  return (
    <div className={`rounded-lg border border-gray-200 shadow-md overflow-hidden ${className}`}>
      <div className="bg-blue-600 px-4 py-3 text-white flex items-center">
        <Avatar type="ai" size="sm" />
        <span className="ml-2 font-medium">AI Karyera Maslahatchisi</span>
      </div>
      
      <div className="bg-gray-50 p-4 h-72 overflow-y-auto flex flex-col space-y-4">
        {messages.map((message, index) => {
          if (index > activeIndex) return null;
          
          const isAi = index % 2 === 0;
          
          return (
            <div 
              key={index} 
              className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              <div 
                className={`
                  max-w-[80%] rounded-lg px-4 py-2 
                  ${isAi 
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-none' 
                    : 'bg-blue-600 text-white rounded-br-none'}
                `}
              >
                {message.text}
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showCta && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleStartTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Shaxsiyat testini boshlash
            </button>
            <button
              onClick={handleStartChat}
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              AI bilan suhbatlashish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}