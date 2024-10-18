import { v4 as uuid } from 'uuid';
import { db } from '../db';

/**
 * Fetches the email verification token associated with a specific email.
 *
 * @param {string} email - The email address to search for the verification token.
 * @returns {Promise<Object|null>} A promise that resolves to the verification token object if found, or null if not.
 */
export const getRestTokenByEmail = async (email: string) => {
  try {
    if (email) {
      const resetToken = await db.resetPasswordToken.findFirst({
        where: {
          email,
        },
      });

      return resetToken;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Fetches the email verification token associated with a specific token string.
 *
 * @param {string} token - The token string to search for the verification token.
 * @returns {Promise<Object|null>} A promise that resolves to the verification token object if found, or null if not.
 */
export const getRestTokenByToken = async (token: string) => {
  try {
    if (token) {
      const resetToken = await db.resetPasswordToken.findFirst({
        where: {
          token,
        },
      });

      return resetToken;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Generates a new email verification token and code for the provided email address.
 *
 * - A unique token and a 6-digit verification code are generated.
 * - The token will expire after one hour.
 * - If an existing verification token is found for the email, it is deleted and replaced with a new one.
 *
 * @param {string} email - The email address for which the verification token and code are generated.
 * @returns {Promise<Object>} A promise that resolves to the newly created verification token record.
 *
 * @example
 * const token = await generateVerificationToken('user@example.com');
 * console.log(token); // { email: 'user@example.com', code: '123456', token: 'uuid-generated-token', expires: Date }
 */
export const generateResetToken = async (userId: string, email: string) => {
  // Retrieving an existing verification token for the email (if any)
  const existingToken = await getRestTokenByEmail(email);

  // If an existing token is found, delete it before creating a new one
  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Generating expiration time (expires after one hour)
  const expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);

  // Generating a unique verification token
  const token = uuid()?.replaceAll('-', '');

  // Creating and storing the new verification token with email, code, token, and expiration time
  const resetToken = await db.resetPasswordToken.create({
    data: { userId, email, token, expires: expiresAt },
  });

  // Returning the newly created verification token
  return resetToken;
};