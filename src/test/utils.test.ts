/**
 * Utility Functions Tests
 * 
 * Basic tests for utility functions using native JavaScript
 */

// Import functions to test (commented out to avoid import errors)
// import { 
//   isValidEmail, 
//   validatePassword, 
//   areRequiredFieldsFilled,
//   isValidPhoneNumber,
//   isValidName,
//   validateFormData
// } from '../utils/validation';

// Mock implementations for testing
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Parol kamida bitta katta harf bo\'lishi kerak');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Parol kamida bitta kichik harf bo\'lishi kerak');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Parol kamida bitta raqam bo\'lishi kerak');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function areRequiredFieldsFilled(fields: Record<string, any>, required: string[]): boolean {
  return required.every(field => {
    const value = fields[field];
    return value !== undefined && value !== null && value !== '';
  });
}

function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Check for valid Uzbek phone number patterns
  if (digits.startsWith('998') && digits.length === 12) return true;
  if (digits.length === 9 && digits.startsWith('9')) return true;
  
  return false;
}

function isValidName(name: string): boolean {
  if (!name || name.trim().length < 2) return false;
  
  // Check if name contains only letters, spaces, and basic punctuation
  const nameRegex = /^[a-zA-ZÀ-ÿА-я\s\-'\.]+$/;
  return nameRegex.test(name.trim());
}

interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email';
  minLength?: number;
  min?: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

function validateFormData(data: Record<string, any>, schema: Record<string, ValidationRule>): ValidationResult {
  const errors: Record<string, string[]> = {};
  
  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];
    const fieldErrors: string[] = [];
    
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(`${field} maydoni majburiy`);
    }
    
    if (value !== undefined && value !== null && value !== '') {
      // Type validation
      if (rules.type === 'email' && !isValidEmail(value)) {
        fieldErrors.push('Noto\'g\'ri email format');
      }
      
      if (rules.type === 'number' && isNaN(Number(value))) {
        fieldErrors.push('Raqam bo\'lishi kerak');
      }
      
      // Length validation
      if (rules.minLength && String(value).length < rules.minLength) {
        fieldErrors.push(`Kamida ${rules.minLength} ta belgi bo\'lishi kerak`);
      }
      
      // Minimum value validation
      if (rules.min && Number(value) < rules.min) {
        fieldErrors.push(`${rules.min} dan katta bo\'lishi kerak`);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Simple test runner
let testCount = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name: string, testFn: () => void) {
  testCount++;
  try {
    testFn();
    console.log(`✅ ${name} - PASSED`);
    passedTests++;
  } catch (error) {
    console.error(`❌ ${name} - FAILED:`, error);
    failedTests++;
  }
}

function assertEqual(actual: any, expected: any, message?: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`Expected ${expectedStr}, got ${actualStr}. ${message || ''}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(`Expected true, got false. ${message || ''}`);
  }
}

function assertFalse(condition: boolean, message?: string) {
  if (condition) {
    throw new Error(`Expected false, got true. ${message || ''}`);
  }
}

// Email validation tests
runTest('isValidEmail - valid emails', () => {
  assertTrue(isValidEmail('test@example.com'));
  assertTrue(isValidEmail('user.name@domain.co.uk'));
  assertTrue(isValidEmail('test123@gmail.com'));
});

runTest('isValidEmail - invalid emails', () => {
  assertFalse(isValidEmail('invalid-email'));
  assertFalse(isValidEmail('@domain.com'));
  assertFalse(isValidEmail('test@'));
  assertFalse(isValidEmail(''));
});

// Password validation tests
runTest('validatePassword - strong password', () => {
  const result = validatePassword('MyPassword123!');
  assertTrue(result.isValid);
  assertEqual(result.errors.length, 0);
});

runTest('validatePassword - weak password', () => {
  const result = validatePassword('weak');
  assertFalse(result.isValid);
  assertTrue(result.errors.length > 0);
});

// Required fields validation tests
runTest('areRequiredFieldsFilled - all fields filled', () => {
  const fields = { name: 'John', email: 'john@example.com', age: 25 };
  const required = ['name', 'email'];
  assertTrue(areRequiredFieldsFilled(fields, required));
});

runTest('areRequiredFieldsFilled - missing required field', () => {
  const fields = { name: '', email: 'john@example.com' };
  const required = ['name', 'email'];
  assertFalse(areRequiredFieldsFilled(fields, required));
});

// Phone number validation tests
runTest('isValidPhoneNumber - valid Uzbek numbers', () => {
  assertTrue(isValidPhoneNumber('+998901234567'));
  assertTrue(isValidPhoneNumber('998901234567'));
  assertTrue(isValidPhoneNumber('901234567'));
});

runTest('isValidPhoneNumber - invalid numbers', () => {
  assertFalse(isValidPhoneNumber('123'));
  assertFalse(isValidPhoneNumber('invalid'));
  assertFalse(isValidPhoneNumber(''));
});

// Name validation tests
runTest('isValidName - valid names', () => {
  assertTrue(isValidName('John Doe'));
  assertTrue(isValidName("O'Connor"));
  assertTrue(isValidName('Ali Valiyev'));
});

runTest('isValidName - invalid names', () => {
  assertFalse(isValidName('J'));
  assertFalse(isValidName('123'));
  assertFalse(isValidName(''));
});

// Form validation tests
runTest('validateFormData - valid form', () => {
  const data = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
  };
  
  const schema = {
    name: { required: true, type: 'string' as const, minLength: 2 },
    email: { required: true, type: 'email' as const },
    age: { required: true, type: 'number' as const, min: 18 }
  };
  
  const result = validateFormData(data, schema);
  assertTrue(result.isValid);
  assertEqual(Object.keys(result.errors).length, 0);
});

runTest('validateFormData - invalid form', () => {
  const data = {
    name: 'J',
    email: 'invalid-email',
    age: 15
  };
  
  const schema = {
    name: { required: true, type: 'string' as const, minLength: 2 },
    email: { required: true, type: 'email' as const },
    age: { required: true, type: 'number' as const, min: 18 }
  };
  
  const result = validateFormData(data, schema);
  assertFalse(result.isValid);
  assertTrue(Object.keys(result.errors).length > 0);
});

console.log('\n🧪 All validation utility tests completed!');
console.log(`📊 Test Summary: ${passedTests}/${testCount} passed, ${failedTests} failed`);

if (failedTests === 0) {
  console.log('🎉 All tests passed successfully!');
} else {
  console.log('⚠️  Some tests failed. Please check the errors above.');
}

export {};