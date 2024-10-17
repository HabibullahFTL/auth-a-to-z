'use server';

import { auth } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from '@/lib/request/verification-tokens';

interface IVerifyEmailCode {
  email: string;
  code: string; // Must pass 'code' when type is 'code'
  type: 'code';
  token?: never; // 'token' must not be provided
}

interface IVerifyEmailLink {
  email?: string;
  token: string; // Must pass 'token' when type is 'link'
  type: 'link';
  code?: never; // 'code' must not be provided
}

type IVerifyEmailFnParams = IVerifyEmailCode | IVerifyEmailLink;

export const verifyEmail = async ({
  email,
  code,
  token,
  type,
}: IVerifyEmailFnParams) => {
  // Check if both email and code are provided; if not, return an error response
  if (type === 'code' ? !email || !code : !token) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  // Authenticate the session; this checks if the user is logged in
  const session = await auth();

  // If there is no session or the user is not found, return an unauthorized response
  if (type === 'code' && (!session || !session?.user)) {
    return generateResponse({ code: 'Unauthorized' });
  }

  // If the user's given email is already verified, return a success response
  if (session?.user?.email === email && session?.user?.emailVerified) {
    return generateResponse({ success: true, code: 'EmailVerifiedSuccess' });
  }

  // Retrieve the verification token associated with the provided email
  const verificationToken =
    type === 'code'
      ? await getVerificationTokenByEmail(email)
      : type === 'link' && token
      ? await getVerificationTokenByToken(token)
      : null;

  // If no verification token has been found
  if (!verificationToken) {
    return generateResponse({
      code:
        type === 'code' ? 'InvalidVerificationCode' : 'InvalidVerificationLink',
    });
  }

  // If the verification code/token is expired, returning an error
  if (new Date(verificationToken?.expires) < new Date()) {
    return generateResponse({
      code:
        type === 'code' ? 'ExpiredVerificationCode' : 'ExpiredVerificationLink',
    });
  }

  // If the code/token do not match, return an error response indicating an invalid verification code/token
  const isInvalid =
    type === 'code'
      ? verificationToken?.code !== code
      : verificationToken?.token !== token;
  if (isInvalid) {
    return generateResponse({
      code:
        type == 'code' ? 'InvalidVerificationCode' : 'InvalidVerificationLink',
    });
  }

  // Verifying email of the user
  const user = await db.user.update({
    where: { id: verificationToken?.userId },
    data: {
      emailVerified: new Date(),
      // Only updating email if user is trying to verify another email, while they are changing previous email
      ...(session?.user?.email !== email
        ? { email: verificationToken?.email }
        : {}),
    },
  });

  await db.emailVerificationToken.delete({
    where: {
      id: verificationToken?.id,
    },
  });

  // Returning success response after verifying
  if (user?.emailVerified) {
    return generateResponse({ success: true, code: 'EmailVerifiedSuccess' });
  }

  // Returning error if any unexpected error occures
  return generateResponse({ code: 'UnexpectedError' });
};
