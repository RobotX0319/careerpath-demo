'use client';

/**
 * NavBar Component
 * 
 * Main navigation component
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Safe NavBar component without notifications
const NavBarClient = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                CareerPath
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/test" className="text-gray-600 hover:text-blue-600">
                Test
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-blue-600">
                Kasblar
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CareerPath
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/test" className="text-gray-600 hover:text-blue-600">
              Test
            </Link>
            <Link href="/careers" className="text-gray-600 hover:text-blue-600">
              Kasblar
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/notifications" className="text-gray-600 hover:text-blue-600">
              Bildirishnomalar
            </Link>
            <Link href="/admin" className="text-orange-600 hover:text-orange-800 font-medium">
              🔐 Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export with dynamic import
export default dynamic(() => Promise.resolve(NavBarClient), {
  ssr: false,
  loading: () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-blue-600">CareerPath</div>
          </div>
        </div>
      </div>
    </nav>
  )
});