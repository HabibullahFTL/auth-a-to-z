import { db } from '../db';

/**
 * Fetches a user by their email address from the database.
 *
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not.
 */
export const getUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: { email },
  });
};

/**
 * Fetches a user by their ID from the database.
 *
 * @param {string} id - The ID of the user to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not.
 */
export const getUserById = (id: string) => {
  return db.user.findUnique({
    where: { id },
  });
};
