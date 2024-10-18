'use server';

import { PASSWORD_SALT } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import { sendVerificationEmail } from '@/lib/request/send-mails';
import { generateVerificationToken } from '@/lib/request/verification-tokens';
import { signUpValidationSchema } from '@/lib/validation/auth-schemas';
import { IResponse } from '@/types/common';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import { login } from './login';

/**
 * Registers a new user by validating the input, checking for existing users,
 * creating a new user, and logging them in immediately after sign-up.
 *
 * - Validates the sign-up form values against the `signUpValidationSchema`.
 * - Checks if the email is already in use.
 * - Hashes the password and creates the user in the database.
 * - Generates an email verification token.
 * - Logs in the user immediately after registration.
 *
 * @param {z.infer<typeof signUpValidationSchema>} values - The user-provided registration form data (name, email, password).
 * @returns {Promise<IResponse>} A promise that resolves to a response indicating success or error.
 *
 * @example
 * const response = await registration({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
 * console.log(response); // { success: true, code: 'SignUpSuccess' } or an error response
 */

export const registration = async (
  values: z.infer<typeof signUpValidationSchema>,
  urlOrigin: string
): Promise<IResponse> => {
  const validated = signUpValidationSchema.safeParse(values);

  // Checking given inputs are valid or not
  if (!validated?.success || !urlOrigin) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const { email, name, password } = values;

  // Check if the user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  // Showing error of an existing user
  if (existingUser) {
    return generateResponse({ code: 'EmailIsInUse' });
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

  // Creating user in database
  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  // If failed to generate verification token
  if (!user) {
    return generateResponse({ code: 'UnexpectedError' });
  }

  // Generating an verification token for given email
  const verificationToken = await generateVerificationToken(user.id, email);

  // If failed to generate verification token
  if (!verificationToken) {
    return generateResponse({ code: 'UnexpectedError' });
  }

  // Send the generated token to email
  const response = await sendVerificationEmail({
    urlOrigin,
    verification: {
      token: verificationToken?.token,
      code: verificationToken?.code,
    },
    user: { email, name: name || '' },
  });

  if (!response?.success) {
    return generateResponse({
      success: false,
      code: response?.code || 'UnexpectedError',
    });
  }

  // After sign-up, logging in the user immediately
  const loginResponse = await login({ email, password });
  if (!loginResponse?.success) {
    return generateResponse({ code: 'AfterSignupLoginFailed' });
  }

  // Returning success response after successful sign-up & login
  return generateResponse({ success: true, code: 'SignUpSuccess' });
};
