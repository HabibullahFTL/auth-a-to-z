import {
  deleteCookie as deleteNextCookie,
  getCookie as getNextCookie,
  setCookie as setNextCookie,
} from 'cookies-next';

/**
 * Convert max age in days to seconds.
 *
 * @param {number} maxAge - The max age in days.
 * @returns {number} The max age in seconds.
 */
const getMaxAgeInDays = (maxAge: number) => maxAge * 24 * 60 * 60;

/**
 * Set a cookie with a specified key, value, and expiration.
 *
 * @param {string} key - The name of the cookie.
 * @param {string} value - The value to be stored in the cookie.
 * @param {number} expires - The expiration period in days. Defaults to 30 days if NaN.
 */
export const setCookie = (key: string, value: string, expires: number) => {
  // Converting Max Age in days
  const maxAge = getMaxAgeInDays(Number.isNaN(expires) ? 30 : expires);

  setNextCookie(key, value, {
    maxAge,
  });
};

/**
 * Get the value of a cookie by its key.
 *
 * @param {string} key - The name of the cookie to retrieve.
 * @returns {string | undefined} The value of the cookie, or an empty string if not found.
 */
export const getCookie = (key: string): string | undefined => {
  return getNextCookie(key) || '';
};

/**
 * Delete a cookie by its key.
 *
 * @param {string} key - The name of the cookie to delete.
 */
export const deleteCookie = (key: string) => {
  deleteNextCookie(key);
};

/**
 * Parse a cookie string into an object of key-value pairs.
 *
 * @param {string} cookieString - The cookie string to parse.
 * @returns {{ [key: string]: string }} An object containing key-value pairs of parsed cookies.
 */
export const parseCookieString = (
  cookieString: string
): { [key: string]: string } => {
  if (cookieString) {
    const cookiesArray = cookieString.split(';');

    // Create an object to store the parsed cookies
    const parsedCookies: { [key: string]: string } = {};

    // Iterate through each cookie and extract the key-value pairs
    for (const cookie of cookiesArray) {
      const [key, value] = cookie.trim().split('=');
      parsedCookies[key] = decodeURIComponent(value);
    }
    return parsedCookies;
  } else {
    return {};
  }
};
