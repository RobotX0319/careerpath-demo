'use client';

import React from 'react';
import AICallToAction from '@/components/AICallToAction';
import AIFeatures from '@/components/AIFeatures';
import AnimatedAIBanner from '@/components/AnimatedAIBanner';
import AIDemo from '@/components/AIDemo';
import AIChat from '@/components/AIChat';

export default function AIIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Integration Examples</h1>
      
      {/* Animated Banner Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Animated AI Banner</h2>
        <AnimatedAIBanner />
      </section>
      
      {/* AICallToAction Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Call to Action Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AICallToAction 
            type="chat"
            title="AI karyera maslahatchisi"
            description="Karyera savollaringizga tezkor va professional javoblar oling"
            buttonText="Savol berish"
          />
          <AICallToAction 
            type="personality"
            title="Shaxsiyat tahlili"
            description="O'zingizning kuchli tomonlaringizni aniqlang va shaxsiyatingizni chuqur tushunib oling"
            buttonText="Testni boshlash"
            buttonLink="/personality"
          />
        </div>
      </section>
      
      {/* AI Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">AI Features Showcase</h2>
        <AIFeatures />
      </section>
      
      {/* AI Demo and Chat Side by Side */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">AI Demo and Live Chat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AIDemo className="h-96" />
          <AIChat className="h-96" />
        </div>
      </section>
    </div>
  );
}