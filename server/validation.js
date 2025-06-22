const { z } = require('zod');

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// Email validation schema
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Full name validation schema
const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(50, 'Full name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces');

// Signup validation schema - Now matches frontend exactly
const signupSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Login validation schema
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Password reset request schema
const passwordResetRequestSchema = z.object({
  email: emailSchema
});

// Password reset schema
const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

module.exports = {
  signupSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  passwordSchema,
  emailSchema,
  fullNameSchema
};