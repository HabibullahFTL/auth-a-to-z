'use server';

import { loginValidationSchema } from '@/app/validation/auth-schemas';
import { signIn } from '@/lib/auth/auth';
import { errorMessages } from '@/lib/handlers/default-messages';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { generateResponse } from '@/lib/request/generate-response';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof loginValidationSchema>) => {
  const validatedResult = loginValidationSchema.safeParse(values);

  // Checking given inputs are valid or not
  if (!validatedResult?.success) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  try {
    const { email, password } = validatedResult.data;

    // Signing in...
    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // Handle errors if signIn result indicates failure
    if (signInResult?.error) {
      return generateResponse({ code: 'LoginFailed' });
    }

    // Returning successful login response
    return generateResponse({ success: true, code: 'LoginSuccess' });
  } catch (error) {
    // Checking error is it matches to AuthError and then handling responses
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'AuthError' as typeof error.type:
          // Handling custom AuthErrors throwing ourself
          return generateResponse({
            code: error?.cause as unknown as string,
          });

        default:
          // Handling AuthError of Auth.js
          return generateResponse({
            code: error?.type,
            message: getErrorMessageByCode(
              error?.type,
              error.message || errorMessages.UnexpectedError
            ),
          });
      }
    }

    // Returning unexpected error response
    return generateResponse({ code: 'UnexpectedError' });
  }
};
