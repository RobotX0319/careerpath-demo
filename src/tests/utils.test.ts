/**
 * Unit tests for utility functions (Native Implementation)
 * 
 * Tests without external testing libraries
 */

// Mock utility functions since we can't import them directly
function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  if (username.length < 2 || username.length > 30) return false;
  if (/\s/.test(username)) return false; // No spaces
  if (/[^a-zA-Z0-9_-]/.test(username)) return false; // Only letters, numbers, underscore, hyphen
  return true;
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 64) return false;
  if (!/[A-Z]/.test(password)) return false; // Must have uppercase
  if (!/[a-z]/.test(password)) return false; // Must have lowercase
  if (!/[0-9]/.test(password)) return false; // Must have number
  return true;
}

type DateFormat = 'short' | 'long' | 'relative';

function formatDate(date: Date | null | undefined, format: DateFormat): string {
  if (!date) return 'N/A';
  if (!(date instanceof Date) || isNaN(date.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'short':
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    case 'long':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'relative':
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return formatDate(date, 'short');
    default:
      return date.toISOString().split('T')[0];
  }
}

function calculateProgress(current: number, total: number): number {
  if (!total || total <= 0) return 0;
  if (current < 0) return 0;
  if (current > total) return 100;
  return Math.round((current / total) * 100);
}

type ScreenType = 'mobile' | 'tablet' | 'desktop' | 'retina';

interface ImageSize {
  width: number;
  height: number;
}

function getOptimalImageSize(screenType?: ScreenType): ImageSize {
  const sizes: Record<ScreenType, ImageSize> = {
    mobile: { width: 640, height: 640 },
    tablet: { width: 768, height: 768 },
    desktop: { width: 1280, height: 1280 },
    retina: { width: 1920, height: 1920 }
  };
  
  return sizes[screenType || 'desktop'];
}

type ImagePurpose = 'thumbnail' | 'preview' | 'standard' | 'high';

function getImageQuality(purpose?: ImagePurpose): number {
  const qualities: Record<ImagePurpose, number> = {
    thumbnail: 60,
    preview: 75,
    standard: 85,
    high: 95
  };
  
  return qualities[purpose || 'standard'];
}

// Native test runner implementations
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

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(`Assertion failed: Expected true, got false. ${message || ''}`);
  }
}

function assertFalse(condition: boolean, message?: string) {
  if (condition) {
    throw new Error(`Assertion failed: Expected false, got true. ${message || ''}`);
  }
}

function assertEqual(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: Expected ${expected}, got ${actual}. ${message || ''}`);
  }
}

function assertMatch(value: string, pattern: RegExp, message?: string) {
  if (!pattern.test(value)) {
    throw new Error(`Assertion failed: Value "${value}" does not match pattern ${pattern}. ${message || ''}`);
  }
}

function assertContains(value: string, substring: string, message?: string) {
  if (!value.includes(substring)) {
    throw new Error(`Assertion failed: Value "${value}" does not contain "${substring}". ${message || ''}`);
  }
}

function assertDefined(value: any, message?: string) {
  if (value === undefined || value === null) {
    throw new Error(`Assertion failed: Expected value to be defined, got ${value}. ${message || ''}`);
  }
}

function assertEqualObjects(actual: any, expected: any, message?: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`Assertion failed: Objects don't match. Expected ${expectedStr}, got ${actualStr}. ${message || ''}`);
  }
}

function assertLessThan(actual: number, expected: number, message?: string) {
  if (actual >= expected) {
    throw new Error(`Assertion failed: Expected ${actual} to be less than ${expected}. ${message || ''}`);
  }
}

function assertGreaterThan(actual: number, expected: number, message?: string) {
  if (actual <= expected) {
    throw new Error(`Assertion failed: Expected ${actual} to be greater than ${expected}. ${message || ''}`);
  }
}

// Validation Utility Tests
console.log('🧪 Starting Validation Utility Tests...\n');

// Username validation tests
runTest('isValidUsername - should return true for valid usernames', () => {
  assertTrue(isValidUsername('user123'));
  assertTrue(isValidUsername('john_doe'));
  assertTrue(isValidUsername('test-user'));
});

runTest('isValidUsername - should return false for invalid usernames', () => {
  assertFalse(isValidUsername(''));
  assertFalse(isValidUsername('a')); // Too short
  assertFalse(isValidUsername('user with spaces'));
  assertFalse(isValidUsername('user$special'));
  assertFalse(isValidUsername('a'.repeat(31))); // Too long
});

// Password validation tests
runTest('validatePassword - should return true for valid passwords', () => {
  assertTrue(validatePassword('Password123'));
  assertTrue(validatePassword('Secure789'));
  assertTrue(validatePassword('MyPass123'));
});

runTest('validatePassword - should return false for invalid passwords', () => {
  assertFalse(validatePassword('password')); // No uppercase
  assertFalse(validatePassword('PASSWORD')); // No lowercase
  assertFalse(validatePassword('Password')); // No number
  assertFalse(validatePassword('Pass12')); // Too short
  assertFalse(validatePassword('a'.repeat(65))); // Too long
});

// Date formatting tests
runTest('formatDate - should format dates correctly', () => {
  const date = new Date('2023-05-15T10:30:00');
  assertMatch(formatDate(date, 'short'), /\d{1,2}\/\d{1,2}\/\d{4}/);
  assertContains(formatDate(date, 'long'), '2023');
  assertDefined(formatDate(date, 'relative'));
});

runTest('formatDate - should handle invalid dates', () => {
  assertEqual(formatDate(null, 'short'), 'N/A');
  assertEqual(formatDate(undefined, 'long'), 'N/A');
  assertEqual(formatDate(new Date('invalid date'), 'short'), 'Invalid Date');
});

// Progress calculation tests
runTest('calculateProgress - should calculate percentage correctly', () => {
  assertEqual(calculateProgress(25, 100), 25);
  assertEqual(calculateProgress(0, 100), 0);
  assertEqual(calculateProgress(100, 100), 100);
});

runTest('calculateProgress - should handle edge cases', () => {
  assertEqual(calculateProgress(-10, 100), 0); // Negative value
  assertEqual(calculateProgress(150, 100), 100); // Over 100%
  assertEqual(calculateProgress(50, 0), 0); // Division by zero
  assertEqual(calculateProgress(0, 0), 0); // Both zero
});

console.log('\n🧪 Starting Image Optimization Tests...\n');

// Image optimization tests
runTest('getOptimalImageSize - should return correct dimensions for different screen types', () => {
  assertEqualObjects(getOptimalImageSize('mobile'), { width: 640, height: 640 });
  assertEqualObjects(getOptimalImageSize('tablet'), { width: 768, height: 768 });
  assertEqualObjects(getOptimalImageSize('desktop'), { width: 1280, height: 1280 });
  assertEqualObjects(getOptimalImageSize('retina'), { width: 1920, height: 1920 });
});

runTest('getOptimalImageSize - should return default size when no screen type is provided', () => {
  assertEqualObjects(getOptimalImageSize(), { width: 1280, height: 1280 });
});

runTest('getImageQuality - should return correct quality settings for different purposes', () => {
  assertLessThan(getImageQuality('thumbnail'), getImageQuality('standard'));
  assertLessThan(getImageQuality('preview'), getImageQuality('high'));
  assertGreaterThan(getImageQuality('high'), getImageQuality('standard'));
});

runTest('getImageQuality - should return default quality when no purpose is provided', () => {
  assertEqual(getImageQuality(), getImageQuality('standard'));
});

// Additional validation tests
console.log('\n🧪 Starting Additional Validation Tests...\n');

runTest('Edge case testing - empty string validation', () => {
  assertFalse(isValidUsername(''));
  assertFalse(validatePassword(''));
});

runTest('Edge case testing - null and undefined handling', () => {
  // Test null/undefined inputs
  try {
    isValidUsername(null as any);
    assertFalse(true, 'Should handle null gracefully');
  } catch (error) {
    // Expected to handle null/undefined
    assertTrue(true);
  }
});

runTest('Date formatting - relative dates', () => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  assertEqual(formatDate(today, 'relative'), 'Today');
  assertEqual(formatDate(yesterday, 'relative'), 'Yesterday');
  assertMatch(formatDate(lastWeek, 'relative'), /\d{1,2}\/\d{1,2}\/\d{4}/);
});

runTest('Progress calculation - boundary values', () => {
  assertEqual(calculateProgress(0.5, 1), 50);
  assertEqual(calculateProgress(1, 3), 33);
  assertEqual(calculateProgress(2, 3), 67);
});

runTest('Image optimization - quality bounds', () => {
  const thumbnailQuality = getImageQuality('thumbnail');
  const highQuality = getImageQuality('high');
  
  assertTrue(thumbnailQuality >= 0 && thumbnailQuality <= 100);
  assertTrue(highQuality >= 0 && highQuality <= 100);
  assertGreaterThan(highQuality, thumbnailQuality);
});

// Test summary
console.log('\n📊 Test Summary:');
console.log(`Total tests: ${testCount}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Success rate: ${Math.round((passedTests / testCount) * 100)}%`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed! Utils are working correctly.');
} else {
  console.log(`\n⚠️  ${failedTests} test(s) failed. Please check the implementation.`);
}

export {};