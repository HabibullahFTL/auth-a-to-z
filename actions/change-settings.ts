'use server';

import { PASSWORD_SALT } from '@/lib/auth/auth';
import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import { sendVerificationEmail } from '@/lib/request/send-mails';
import { getUserById } from '@/lib/request/users';
import { generateVerificationToken } from '@/lib/request/verification-tokens';
import {
  changeEmailSchema,
  changePasswordSchema,
  changeUserNameSchema,
} from '@/lib/validation/user-settings';
import * as bcrypt from 'bcryptjs';
import { User } from 'next-auth';
import { z } from 'zod';

export const changeName = async (
  values: z.infer<typeof changeUserNameSchema>
) => {
  const validateInputs = changeUserNameSchema.safeParse(values);

  if (!validateInputs?.success) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const user = await getCurrentUser();

  if (!user || !user?.id) {
    return generateResponse({ code: 'Unauthorized' });
  }

  const updatedUserData = await db.user.update({
    where: { id: user?.id },
    data: { name: values?.name },
  });

  if (!updatedUserData) {
    return generateResponse({ code: 'UpdatingFailed' });
  }

  return generateResponse<User>({
    success: true,
    code: 'UpdatedSuccessfully',
    data: updatedUserData,
  });
};

export const changeEmail = async (
  values: z.infer<typeof changeEmailSchema>,
  urlOrigin: string
) => {
  const validateInputs = changeEmailSchema.safeParse(values);

  // If given inputs are wrong
  if (!validateInputs?.success || !urlOrigin) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const user = await getCurrentUser();
  // If user is not logged in
  if (!user || !user?.id) {
    return generateResponse({ code: 'Unauthorized' });
  }

  // If logged in email and given email is same
  if (user?.email === values?.email) {
    return generateResponse({ success: true, code: 'DefaultSuccess' });
  }

  const otherUser = await db.user.findUnique({
    where: { NOT: { id: user?.id }, email: values?.email },
  });
  if (otherUser) {
    return generateResponse({ code: 'EmailIsInUse' });
  }

  // Generating an verification token for given email
  const verificationToken = await generateVerificationToken(
    user.id,
    values?.email
  );

  // If failed to generate verification token
  if (!verificationToken) {
    return generateResponse({ code: 'UnexpectedError' });
  }

  // Send the generated token to email
  const response = await sendVerificationEmail({
    type: 'change-email',
    urlOrigin,
    verification: {
      token: verificationToken?.token,
      code: verificationToken?.code,
    },
    user: { email: values?.email, name: user?.name || '' },
  });

  if (!response?.success) {
    return generateResponse({
      success: false,
      code: response?.code || 'UnexpectedError',
    });
  }

  return generateResponse<User>({
    success: true,
    code: 'EmailVerificationSent',
  });
};

export const changePassword = async (
  values: z.infer<typeof changePasswordSchema>
) => {
  const validateInputs = changePasswordSchema.safeParse(values);

  if (!validateInputs?.success) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const user = await getCurrentUser();
  const dbUser = user?.id ? await getUserById(user?.id) : null;

  if (!user || !user?.id || !dbUser || !dbUser?.password) {
    return generateResponse({ code: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = values;

  const isMatched = await bcrypt.compare(currentPassword, dbUser?.password);

  if (!isMatched) {
    return generateResponse({ code: 'InvalidCurrentPassword' });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, PASSWORD_SALT);

  const updatedUserData = await db.user.update({
    where: { id: user?.id },
    data: { password: newHashedPassword },
  });

  if (!updatedUserData) {
    return generateResponse({ code: 'UpdatingFailed' });
  }

  return generateResponse<User>({
    success: true,
    code: 'UpdatedSuccessfully',
    data: updatedUserData,
  });
};

export const change2FASettings = async (enable2FA: boolean) => {
  const user = await getCurrentUser();

  if (!user || !user?.id) {
    return generateResponse({ code: 'Unauthorized' });
  }

  const updatedUserData = await db.user.update({
    where: { id: user?.id },
    data: { isTwoFactorEnabled: enable2FA },
  });

  if (!updatedUserData) {
    return generateResponse({ code: 'UpdatingFailed' });
  }

  return generateResponse<User>({
    success: true,
    code: 'UpdatedSuccessfully',
    data: updatedUserData,
  });
};
