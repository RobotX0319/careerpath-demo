#!/usr/bin/env node

/**
 * Command-line script to validate Gemini AI responses
 * Run with: node scripts/validate-responses.js
 */

console.log('🧪 Starting CareerPath AI response validation...');
console.log('Loading environment...');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Check for API key
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error('❌ ERROR: Missing Gemini API key in environment variables');
  console.log('Please create a .env.local file with your NEXT_PUBLIC_GEMINI_API_KEY');
  process.exit(1);
}

// Ensure we're using Node.js environment
process.env.NODE_ENV = 'development';

console.log('Building project...');

// This script requires the TypeScript to be compiled
// In a real project, we'd use ts-node or compile first
require('child_process').execSync('npm run build', {
  stdio: 'inherit'
});

console.log('Running validation...');

// Import the validation function from the compiled code
const { validateGeminiResponses } = require('../dist/lib/validationUtils');

// Run validation tests
validateGeminiResponses()
  .then(() => {
    console.log('Validation complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Validation failed with error:', err);
    process.exit(1);
  });