/**
 * Progress Tracker Component
 */

import React from 'react';

export default function ProgressTracker() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Tracker</h3>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700">Resume yaratish</h4>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">60% bajarildi</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700">Portfolio yaratish</h4>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">90% bajarildi</p>
        </div>
      </div>
    </div>
  );
}