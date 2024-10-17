'use server';

import { auth } from '@/lib/auth/auth';
import { generateResponse } from '@/lib/request/generate-response';
import { sendVerificationEmail } from '@/lib/request/send-mails';
import { generateVerificationToken } from '@/lib/request/verification-tokens';

export const resendVerification = async (email: string, urlOrigin: string) => {
  // Checking if email or urlOrigin is missing
  if (!email || !urlOrigin) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  // Authenticate the session; this checks if the user is logged in
  const session = await auth();

  // If there is no session or the user is not found, return an unauthorized response
  if (
    !session ||
    !session?.user ||
    !session?.user?.id ||
    session?.user?.email !== email
  ) {
    return generateResponse({ code: 'Unauthorized' });
  }

  // If the user's email is already verified, return a success response
  if (session?.user?.emailVerified) {
    return generateResponse({ success: true, code: 'EmailAlreadyVerified' });
  }

  const verificationToken = await generateVerificationToken(
    session?.user?.id,
    email
  );
  // If failed to generate verification token
  if (!verificationToken) {
    return generateResponse({ code: 'ResendVerificationFailed' });
  }

  // Send the generated token to email
  const response = await sendVerificationEmail({
    urlOrigin,
    verification: {
      token: verificationToken?.token,
      code: verificationToken?.code,
    },
    user: { email, name: session?.user?.name || '' },
  });

  return generateResponse({
    success: response?.success,
    code: response?.code || 'UnexpectedError',
  });
};
