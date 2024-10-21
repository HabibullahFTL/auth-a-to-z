'use server';

import { signIn } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { errorMessages } from '@/lib/handlers/default-messages';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { generateResponse } from '@/lib/request/generate-response';
import { send2FATokenEmail } from '@/lib/request/send-mails';
import {
  generate2FAToken,
  get2FATokenByEmail,
} from '@/lib/request/two-factor-tokens';
import { getUserByEmail } from '@/lib/request/users';
import { loginValidationSchema } from '@/lib/validation/auth-schemas';
import * as bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof loginValidationSchema>) => {
  const validatedResult = loginValidationSchema.safeParse(values);

  // Checking given inputs are valid or not
  if (!validatedResult?.success) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  try {
    const { email, password, code } = validatedResult.data;

    // Retrieving user data
    const existingUser = await getUserByEmail(email);

    // Returning error if user not found
    if (!existingUser || !existingUser?.id) {
      return generateResponse({ code: 'UserNotFound' });
    }

    // Returning error if user has no password
    if (!existingUser?.password) {
      return generateResponse({ code: 'OAuthAccountNotLinked' });
    }

    // If user has enabled 2FA, executing 2FA process
    if (existingUser?.isTwoFactorEnabled) {
      // Validating password
      const isValid = await bcrypt.compare(password, existingUser?.password);
      if (!isValid) {
        return generateResponse({ code: 'InvalidCredentials' });
      }

      // If user trying to login with 2FA token(code/OTP)
      if (code) {
        const twoFAToken = await get2FATokenByEmail(email);

        // If token is invalid
        if (!twoFAToken || code !== twoFAToken?.code) {
          return generateResponse({ code: 'Invalid2FACode' });
        }

        // If token is expired
        if (new Date(twoFAToken?.expires) < new Date()) {
          return generateResponse({ code: 'Expired2FACode' });
        }

        // Creating an confirmation that user's 2FA code is valid
        await db.twoFactorConfirmation.create({
          data: { userId: existingUser?.id },
        });

        // Deleting the token, as this token will no longer be used
        await db.twoFactorToken.delete({
          where: { id: twoFAToken?.id },
        });
      } else {
        const twoFactorToken = await generate2FAToken(email);

        if (!twoFactorToken) {
          return generateResponse({ code: 'Failed2FATokenGeneration' });
        }

        const response = await send2FATokenEmail({
          user: existingUser,
          verification: {
            code: twoFactorToken?.code,
          },
        });

        return response;
      }
    }

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
