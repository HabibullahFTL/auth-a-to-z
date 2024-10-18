import { db } from '../db';

export const getTwoFactorConfirmation = async (userId: string) => {
  if (!userId) return null;

  try {
    const twoFAConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });

    return twoFAConfirmation;
  } catch {
    return null;
  }
};

export const get2FATokenByEmail = async (email: string) => {
  if (!email) return null;

  try {
    const twoFAConfirmation = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFAConfirmation;
  } catch {
    return null;
  }
};

export const generate2FAToken = async (email: string) => {
  if (!email) return null;

  // Retrieving an existing 2FA token for the email (if any)
  const existingToken = await get2FATokenByEmail(email);

  // If an existing 2FA token is found, delete it before creating a new one
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Generating expiration time (expires after 5 minutes)
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

  // Generating a 6-digit numeric 2FA code
  const code = Array.from(
    { length: 6 },
    () => '0123456789'[Math.floor(Math.random() * 10)]
  )?.join('');

  // Creating and storing the new 2FA token with email, code, and expiration time
  const twoFactorToken = await db.twoFactorToken.create({
    data: { email, code, expires: expiresAt },
  });

  // Returning the newly created 2FA token
  return twoFactorToken;
};
