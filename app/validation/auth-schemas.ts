import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('This is not a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Minimum 8 characters are required'),
});

export const signUpValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Minimum 2 character is required'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('This is not a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Minimum 8 characters are required'),
});
