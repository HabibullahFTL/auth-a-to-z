import { z } from 'zod';
import { emailValidation, passwordValidation } from './auth-schemas';

export const changeUserNameSchema = z.object({
  name: z.string().min(2, 'Minimum 2 character is required!'),
});

export const changeEmailSchema = z.object({
  email: emailValidation,
});

export const changePasswordSchema = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    confPassword: passwordValidation,
  })
  .refine((arg) => arg.newPassword === arg.confPassword, {
    message: 'Confirm password does not match',
    path: ['confPassword'], // This indicates where the error will appear
  });
