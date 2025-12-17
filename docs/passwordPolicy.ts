/**
 * Password Policy Enforcement
 * 
 * Enforces strong password requirements for user registration and password changes.
 * 
 * ISO 27001 Control: A.9.4.3 - Password management system
 * Normen: Section 7 - Access control and password requirements
 */

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * Password policy configuration
 */
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  maxLength: 128, // Prevent DoS attacks with extremely long passwords
  preventCommonPasswords: true
};

/**
 * Common passwords to block (top 20 most common)
 * In production, use a more comprehensive list
 */
const COMMON_PASSWORDS = [
  'password',
  'password123',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'monkey',
  '1234567',
  'letmein',
  'trustno1',
  'dragon',
  'baseball',
  'iloveyou',
  'master',
  'sunshine',
  'ashley',
  'bailey',
  'shadow',
  '123123',
  '654321'
];

/**
 * Validate password against policy
 * 
 * @param password - Password to validate
 * @returns Validation result with errors and strength
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Check if password is provided
  if (!password) {
    return {
      valid: false,
      errors: ['Password is required'],
      strength: 'weak'
    };
  }
  
  // Check minimum length
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }
  
  // Check maximum length
  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(`Password must be less than ${PASSWORD_POLICY.maxLength} characters long`);
  }
  
  // Check for uppercase letters
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  
  // Check for lowercase letters
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  
  // Check for numbers
  if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }
  
  // Check for special characters
  if (PASSWORD_POLICY.requireSpecialChars) {
    const specialCharsRegex = new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialCharsRegex.test(password)) {
      errors.push(`Password must contain at least one special character (${PASSWORD_POLICY.specialChars})`);
    }
  }
  
  // Check against common passwords
  if (PASSWORD_POLICY.preventCommonPasswords) {
    const lowerPassword = password.toLowerCase();
    if (COMMON_PASSWORDS.includes(lowerPassword)) {
      errors.push('This password is too common. Please choose a more unique password');
    }
  }
  
  // Check for sequential characters (e.g., 123456, abcdef)
  if (hasSequentialCharacters(password)) {
    errors.push('Password should not contain sequential characters (e.g., 123456, abcdef)');
  }
  
  // Check for repeated characters (e.g., aaaaaa, 111111)
  if (hasRepeatedCharacters(password)) {
    errors.push('Password should not contain many repeated characters (e.g., aaaaaa)');
  }
  
  // Calculate password strength
  const strength = calculatePasswordStrength(password);
  
  return {
    valid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Calculate password strength
 * 
 * @param password - Password to evaluate
 * @returns Strength rating
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  
  // Length score
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;
  
  // Character diversity score
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Bonus for multiple special characters
  const specialCharCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
  if (specialCharCount >= 2) score += 1;
  
  // Bonus for multiple numbers
  const numberCount = (password.match(/[0-9]/g) || []).length;
  if (numberCount >= 3) score += 1;
  
  // Penalty for common patterns
  if (hasSequentialCharacters(password)) score -= 2;
  if (hasRepeatedCharacters(password)) score -= 2;
  
  // Determine strength
  if (score >= 7) return 'strong';
  if (score >= 4) return 'medium';
  return 'weak';
}

/**
 * Check if password contains sequential characters
 * 
 * @param password - Password to check
 * @returns True if sequential characters found
 */
function hasSequentialCharacters(password: string): boolean {
  const sequences = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];
  
  const lowerPassword = password.toLowerCase();
  
  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 4; i++) {
      const subseq = sequence.substring(i, i + 4);
      if (lowerPassword.includes(subseq)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if password contains too many repeated characters
 * 
 * @param password - Password to check
 * @returns True if too many repeated characters found
 */
function hasRepeatedCharacters(password: string): boolean {
  // Check for 4 or more of the same character in a row
  return /(.)\1{3,}/.test(password);
}

/**
 * Generate a password strength indicator message
 * 
 * @param strength - Password strength
 * @returns User-friendly message
 */
export function getStrengthMessage(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'strong':
      return 'Strong password! ✓';
    case 'medium':
      return 'Medium strength. Consider adding more characters or special symbols.';
    case 'weak':
      return 'Weak password. Please follow the password requirements.';
  }
}

/**
 * Get password strength color for UI
 * 
 * @param strength - Password strength
 * @returns Color class
 */
export function getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'strong':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'weak':
      return 'text-red-600';
  }
}

/**
 * Format validation errors as a list
 * 
 * @param errors - Array of error messages
 * @returns Formatted error list
 */
export function formatPasswordErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0];
  }
  
  return `Password requirements:\n${errors.map(e => `• ${e}`).join('\n')}`;
}

/**
 * Get password requirements as a formatted list
 * 
 * @returns List of requirements
 */
export function getPasswordRequirements(): string[] {
  return [
    `At least ${PASSWORD_POLICY.minLength} characters long`,
    'Contains at least one uppercase letter (A-Z)',
    'Contains at least one lowercase letter (a-z)',
    'Contains at least one number (0-9)',
    `Contains at least one special character (${PASSWORD_POLICY.specialChars})`,
    'Not a commonly used password',
    'No sequential characters (e.g., 123456, abcdef)',
    'No repeated characters (e.g., aaaaaa)'
  ];
}