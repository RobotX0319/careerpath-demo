/**
 * Validation Utilities
 * 
 * Common validation functions for forms and user input
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Parolda kamida bitta katta harf bo\'lishi kerak');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Parolda kamida bitta kichik harf bo\'lishi kerak');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Parolda kamida bitta raqam bo\'lishi kerak');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Parolda kamida bitta maxsus belgi bo\'lishi kerak');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if all required fields are filled
 */
export function areRequiredFieldsFilled(fields: Record<string, any>, requiredFields: string[]): boolean {
  return requiredFields.every(field => {
    const value = fields[field];
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  });
}

/**
 * Validate phone number (Uzbekistan format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Uzbek phone number format: +998XXXXXXXXX or 998XXXXXXXXX or XXXXXXXXX
  const phoneRegex = /^(\+?998)?[0-9]{9}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * Validate name (only letters and spaces)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s']+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - replace common dangerous characters
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): {
  isValid: boolean;
  error?: string;
} {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  } = options;
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Fayl hajmi ${Math.round(maxSize / (1024 * 1024))}MB dan oshmasligi kerak`
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Ruxsat etilgan fayl turlari: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Ruxsat etilgan kengaytmalar: ${allowedExtensions.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate;
}

/**
 * Validate age (must be between min and max)
 */
export function isValidAge(birthDate: Date, minAge: number = 13, maxAge: number = 120): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
}

/**
 * Validate form data based on schema
 */
export function validateFormData<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'phone' | 'url';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  }>
): {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
} {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field as keyof T];
    
    // Check required
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field as keyof T] = 'Bu maydon majburiy';
      continue;
    }
    
    // Skip validation if field is empty and not required
    if (!value && !rules.required) continue;
    
    // Type validation
    switch (rules.type) {
      case 'email':
        if (!isValidEmail(value)) {
          errors[field as keyof T] = 'Email format noto\'g\'ri';
        }
        break;
      case 'phone':
        if (!isValidPhoneNumber(value)) {
          errors[field as keyof T] = 'Telefon raqami noto\'g\'ri';
        }
        break;
      case 'url':
        if (!isValidURL(value)) {
          errors[field as keyof T] = 'URL format noto\'g\'ri';
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          errors[field as keyof T] = 'Raqam kiritish kerak';
        }
        break;
    }
    
    // Length validation for strings
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field as keyof T] = `Kamida ${rules.minLength} ta belgi kiritish kerak`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field as keyof T] = `Ko'pi bilan ${rules.maxLength} ta belgi kiritish mumkin`;
      }
    }
    
    // Range validation for numbers
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors[field as keyof T] = `Qiymat ${rules.min} dan kichik bo'lmasligi kerak`;
      }
      if (rules.max !== undefined && value > rules.max) {
        errors[field as keyof T] = `Qiymat ${rules.max} dan katta bo'lmasligi kerak`;
      }
    }
    
    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      errors[field as keyof T] = 'Format noto\'g\'ri';
    }
    
    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') {
        errors[field as keyof T] = result;
      } else if (result === false) {
        errors[field as keyof T] = 'Qiymat noto\'g\'ri';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}