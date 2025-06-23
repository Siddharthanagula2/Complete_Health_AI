const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(50, 'Full name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces');

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

module.exports = {
  signupSchema,
  passwordSchema,
  emailSchema,
  fullNameSchema
};