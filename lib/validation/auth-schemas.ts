import { z } from 'zod';

// Email validation
export const emailValidation = z
  .string()
  .min(1, 'Email address is required')
  .email('This is not a valid email address');

// Password validation
export const passwordValidation = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Minimum 8 characters are required');

// Sign up request validation schema
export const signUpValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Minimum 2 character is required'),
  email: emailValidation,
  password: passwordValidation,
});

// Login validation schema
export const loginValidationSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  code: z.optional(z.string()),
});

// Reset password request validation schema
export const resetRequestValidationSchema = z.object({
  email: emailValidation,
});

// Reset password validation schema
export const resetPasswordValidationSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confPassword: passwordValidation,
    token: z.string().min(6, 'Token is required'),
  })
  .refine((arg) => arg.password === arg.confPassword, {
    message: 'Confirm password does not match',
    path: ['confPassword'], // This indicates where the error will appear
  });
