/**
 * Test Setup Configuration
 * 
 * Basic test environment setup without external dependencies
 */

// Mock window object for testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  length: 0,
  key: (index: number) => null,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

// Mock fetch
(global as any).fetch = async (url: string | URL | Request, init?: RequestInit) => {
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export {};