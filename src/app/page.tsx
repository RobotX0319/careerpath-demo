'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import './globals.css';

// Dynamically import NavBar to avoid SSR issues
const NavBar = dynamic(() => import('@/components/NavBar'), {
  ssr: false,
  loading: () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CareerPath
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
});

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-700">CareerPath</span>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="#features" className="hover:text-blue-600 transition">Xususiyatlar</Link>
          <Link href="#how" className="hover:text-blue-600 transition">Qanday ishlaydi?</Link>
          <Link href="#contact" className="hover:text-blue-600 transition">Aloqa</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-12 px-4 md:py-20">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
          CareerPath - O'zingizni kashf eting, kelajagingizni yarating
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl">
          Sun'iy intellekt asosida shaxsiy karyera yo'nalishlari va kasb tavsiyalari. 10 ta savolga javob bering, AI sizga eng mos kasblarni aniqlab beradi!
        </p>
        <Link href="/test">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
            Demo Testni Boshlash
          </button>
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <span className="text-4xl mb-2">📝</span>
          <h3 className="text-xl font-bold mb-2 text-blue-700">10 savollik test</h3>
          <p className="text-gray-600">Qisqa va aniq savollar orqali shaxsiyatingizni baholang.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <span className="text-4xl mb-2">🤖</span>
          <h3 className="text-xl font-bold mb-2 text-green-600">AI Powered tahlil</h3>
          <p className="text-gray-600">AI algoritmlari sizga mos kasblarni aniqlaydi va tavsiya beradi.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <span className="text-4xl mb-2">💼</span>
          <h3 className="text-xl font-bold mb-2 text-blue-600">5 kasb tavsiyasi</h3>
          <p className="text-gray-600">Eng mos 5 ta kasb va ularning imkoniyatlari haqida batafsil ma'lumot oling.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto py-8 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">10+</div>
          <div className="text-gray-600 text-sm">Kasb yo'nalishlari</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-500">1000+</div>
          <div className="text-gray-600 text-sm">Foydalanuvchi natijalari</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-500">90%</div>
          <div className="text-gray-600 text-sm">Moslik aniqligi</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-400">24/7</div>
          <div className="text-gray-600 text-sm">Onlayn xizmat</div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-700">Qanday ishlaydi?</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-xl shadow p-5 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">1️⃣</span>
            <h4 className="font-semibold mb-1">Testdan o'ting</h4>
            <p className="text-gray-600 text-sm">10 ta savolga javob bering va shaxsiyatingizni aniqlang.</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-5 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">2️⃣</span>
            <h4 className="font-semibold mb-1">AI tahlil qiladi</h4>
            <p className="text-gray-600 text-sm">AI sizning javoblaringiz asosida shaxsiy xususiyatlaringizni tahlil qiladi.</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-5 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">3️⃣</span>
            <h4 className="font-semibold mb-1">Kasb tavsiyasi oling</h4>
            <p className="text-gray-600 text-sm">Sizga eng mos 5 ta kasb va ularning imkoniyatlari taqdim etiladi.</p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-10 flex flex-col items-center bg-gradient-to-r from-blue-50 to-green-50">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Karyerangizni bugun boshlang!</h3>
        <Link href="/test">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white text-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200">
            Demo Testni Boshlash
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full py-6 bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-600 text-sm">
          <div>© {new Date().getFullYear()} CareerPath. Barcha huquqlar himoyalangan.</div>
          <div>
            Aloqa: <a href="mailto:info@careerpath.uz" className="text-blue-600 hover:underline">info@careerpath.uz</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
