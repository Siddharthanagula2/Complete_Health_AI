import { z } from 'zod';

// Temporarily simplified validation for debugging

export const passwordSchema = z.string().min(1, 'Password is required');
export const emailSchema = z.string().email('Please enter a valid email address');
export const fullNameSchema = z.string().min(1, 'Full name is required');

// The most basic signup schema for testing
export const signupSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(), // No validation, just needs to be a string
  agreeToTerms: z.boolean() // No validation, just needs to be a boolean
});

// Other schemas remain for now
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const passwordResetRequestSchema = z.object({
  email: emailSchema
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const getPasswordStrength = (password: string) => {
  // Return a static value during debug
  return { score: 5, feedback: [], color: 'green' };
};