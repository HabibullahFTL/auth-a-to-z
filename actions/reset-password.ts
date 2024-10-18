'use server';
import { PASSWORD_SALT } from '@/lib/auth/auth';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import {
  generateResetToken,
  getRestTokenByToken,
} from '@/lib/request/reset-password-tokens';
import { sendResetPasswordRequestEmail } from '@/lib/request/send-mails';
import {
  resetPasswordValidationSchema,
  resetRequestValidationSchema,
} from '@/lib/validation/auth-schemas';
import { IResponse } from '@/types/common';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

export const resetPasswordRequest = async (
  values: z.infer<typeof resetRequestValidationSchema>,
  urlOrigin: string
) => {
  const validated = resetRequestValidationSchema.safeParse(values);

  // Checking given inputs are valid or not
  if (!validated?.success || !urlOrigin) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const { email } = values;

  // Check if the user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  // Showing error of user not found
  if (!existingUser) {
    return generateResponse({ code: 'UserNotFound' });
  }

  const resetToken = await generateResetToken(existingUser?.id, email);
  // If failed to generate reset password token
  if (!resetToken) {
    return generateResponse({ code: 'ResetPasswordRequestFailed' });
  }

  // Send the generated token to email
  const response = await sendResetPasswordRequestEmail({
    urlOrigin,
    verification: {
      token: resetToken?.token,
    },
    user: { email, name: existingUser?.name || '' },
  });

  return generateResponse({
    success: response?.success,
    code: response?.code || 'UnexpectedError',
  });
};

export const checkResetPasswordToken = async (
  token: string
): Promise<IResponse<{ email?: string }>> => {
  // Check if both email and code are provided; if not, return an error response
  if (!token) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  // Retrieve the reset password token associated with the provided token
  const resetPasswordToken = await getRestTokenByToken(token);

  // If no reset password token has been found
  if (!resetPasswordToken) {
    return generateResponse({
      code: 'InvalidResetPasswordLink',
    });
  }

  // If the verification code/token is expired, returning an error
  if (new Date(resetPasswordToken?.expires) < new Date()) {
    return generateResponse({
      code: 'ExpiredResetPasswordLink',
    });
  }

  // If the token do not match, return an error response indicating an invalid reset password token
  const isInvalid = resetPasswordToken?.token !== token;
  if (isInvalid) {
    return generateResponse({
      code: 'InvalidResetPasswordLink',
    });
  }

  // Returning error if any unexpected error occures
  return generateResponse({
    success: true,
    code: 'ValidResetPasswordLink',
    data: { email: resetPasswordToken?.email },
  });
};

export const resetPasswordWithToken = async (
  values: z.infer<typeof resetPasswordValidationSchema>
) => {
  const validated = resetRequestValidationSchema.safeParse(values);

  // Checking given inputs are valid or not
  if (!validated?.success) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const { email, token, password } = values;

  const resetToken = await getRestTokenByToken(token);
  // If failed to generate reset password token
  if (!resetToken) {
    return generateResponse({ code: 'InvalidResetPasswordLink' });
  }

  // If the token is expired, returning an error
  if (new Date(resetToken?.expires) < new Date()) {
    return generateResponse({ code: 'ExpiredResetPasswordLink' });
  }

  // If the token do not match, return an error response indicating an invalid reset password token
  const isInvalid = resetToken?.token !== token;
  if (isInvalid) {
    return generateResponse({ code: 'InvalidResetPasswordLink' });
  }

  // Check if the user already exists
  const existingUser = await db.user.findUnique({ where: { email } });

  // Showing error of user not found
  if (!existingUser) {
    return generateResponse({ code: 'UserNotFound' });
  }

  const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);
  const updatedUser = await db.user.update({
    where: { id: existingUser?.id },
    data: { password: hashedPassword },
  });

  if (!updatedUser) {
    return generateResponse({ code: 'UnexpectedError' });
  }

  await db.resetPasswordToken.delete({
    where: {
      id: resetToken?.id,
    },
  });

  return generateResponse({
    success: true,
    code: 'ResetPasswordSuccess',
  });
};
