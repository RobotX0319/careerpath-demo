/**
 * Jest setup configuration file
 * 
 * This file contains global setup for Jest tests
 */

import '@testing-library/jest-dom';

// Mock IntersectionObserver which is not available in test environment
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  
  disconnect() {
    return null;
  }
  
  observe() {
    return null;
  }
  
  takeRecords() {
    return [];
  }
  
  unobserve() {
    return null;
  }
}

// Define global mocks for JSDOM environment
const globalMocks = {
  IntersectionObserver: MockIntersectionObserver,
  ResizeObserver: function ResizeObserver() {
    return {
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    };
  },
  matchMedia: function(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => null,
      removeListener: () => null,
      addEventListener: () => null,
      removeEventListener: () => null,
      dispatchEvent: () => null,
    };
  },
  scrollTo: () => null,
};

// Apply mocks to global object
Object.assign(global, globalMocks);

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  value: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0].includes('Warning:') ||
    args[0].includes('React does not recognize the') ||
    args[0].includes('Invalid DOM property')
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.log('Test setup configured');