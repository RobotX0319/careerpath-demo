/**
 * Test Configuration
 * 
 * Central configuration for all test environments
 */

export interface TestConfig {
  timeout: number;
  retries: number;
  verbose: boolean;
  parallel: boolean;
  coverage: boolean;
  environment: 'development' | 'staging' | 'production';
  mockData: boolean;
  headless: boolean;
}

export const DEFAULT_TEST_CONFIG: TestConfig = {
  timeout: 30000, // 30 seconds
  retries: 2,
  verbose: true,
  parallel: false,
  coverage: true,
  environment: 'development',
  mockData: true,
  headless: true
};

export const TEST_ENVIRONMENTS = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    dbUrl: 'mock://localhost',
    enableMocks: true,
    logLevel: 'debug'
  },
  staging: {
    apiUrl: 'https://staging-api.careerpath.uz',
    dbUrl: 'postgresql://staging-db',
    enableMocks: false,
    logLevel: 'info'
  },
  production: {
    apiUrl: 'https://api.careerpath.uz',
    dbUrl: 'postgresql://production-db',
    enableMocks: false,
    logLevel: 'error'
  }
};

export const TEST_DATA = {
  users: {
    validUser: {
      id: 'user-123',
      name: 'Ali Valiyev',
      email: 'ali@example.com',
      phone: '+998901234567'
    },
    invalidUser: {
      id: '',
      name: '',
      email: 'invalid-email',
      phone: '123'
    }
  },
  personalityScores: {
    balanced: {
      openness: 70,
      conscientiousness: 75,
      extraversion: 65,
      agreeableness: 80,
      neuroticism: 45
    },
    extreme: {
      openness: 95,
      conscientiousness: 10,
      extraversion: 90,
      agreeableness: 20,
      neuroticism: 85
    }
  },
  careerRecommendations: [
    {
      id: 'software-dev',
      title: 'Software Developer',
      compatibility: 92,
      description: 'Create innovative software solutions'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      compatibility: 78,
      description: 'Analyze data to extract insights'
    }
  ]
};

export const MOCK_RESPONSES = {
  success: {
    status: 200,
    data: { message: 'Success' }
  },
  error: {
    status: 500,
    error: 'Internal Server Error'
  },
  notFound: {
    status: 404,
    error: 'Not Found'
  },
  unauthorized: {
    status: 401,
    error: 'Unauthorized'
  }
};

export const TEST_SELECTORS = {
  // Navigation
  navbar: '[data-testid="navbar"]',
  logo: '[data-testid="logo"]',
  userMenu: '[data-testid="user-menu"]',
  
  // Forms
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  submitButton: '[data-testid="submit-button"]',
  
  // Charts
  personalityChart: '[data-testid="personality-chart"]',
  careerChart: '[data-testid="career-chart"]',
  comparisonChart: '[data-testid="comparison-chart"]',
  
  // Components
  loadingSpinner: '[data-testid="loading-spinner"]',
  errorMessage: '[data-testid="error-message"]',
  successMessage: '[data-testid="success-message"]'
};

export const PERFORMANCE_THRESHOLDS = {
  pageLoad: 2000, // 2 seconds
  apiResponse: 500, // 500ms
  componentRender: 100, // 100ms
  bundleSize: 2 * 1024 * 1024, // 2MB
  firstContentfulPaint: 1500, // 1.5 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
  cumulativeLayoutShift: 0.1
};

export const ACCESSIBILITY_STANDARDS = {
  colorContrast: 4.5, // WCAG AA standard
  fontSizeMin: 16, // Minimum font size in pixels
  touchTargetMin: 44, // Minimum touch target size in pixels
  maxTabIndex: 0, // Maximum allowed tabindex value
  requiredAriaLabels: [
    'button',
    'link',
    'input',
    'select',
    'textarea'
  ]
};

export function getTestConfig(environment?: string): TestConfig {
  const env = environment || process.env.NODE_ENV || 'development';
  
  const config = { ...DEFAULT_TEST_CONFIG };
  
  // Environment-specific overrides
  switch (env) {
    case 'production':
      config.timeout = 60000; // Longer timeout for production
      config.retries = 3;
      config.mockData = false;
      break;
      
    case 'staging':
      config.timeout = 45000;
      config.retries = 2;
      config.mockData = false;
      break;
      
    default:
      // Development settings (already set as default)
      break;
  }
  
  return config;
}

export function validateTestEnvironment(): boolean {
  const required = [
    'NODE_ENV',
    // Add other required environment variables
  ];
  
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}

export default {
  DEFAULT_TEST_CONFIG,
  TEST_ENVIRONMENTS,
  TEST_DATA,
  MOCK_RESPONSES,
  TEST_SELECTORS,
  PERFORMANCE_THRESHOLDS,
  ACCESSIBILITY_STANDARDS,
  getTestConfig,
  validateTestEnvironment
};