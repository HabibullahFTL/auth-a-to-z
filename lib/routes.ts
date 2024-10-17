// routes.ts

/**
 * The prefix for API authentication routes.
 * Routes starting with this prefix are used for authentication purposes.
 * @type {string}
 */
const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path for the login page.
 * @type {string}
 */
const DEFAULT_LOGIN_PAGE = '/login';

/**
 * The default redirect path for the signup page.
 * @type {string}
 */
const DEFAULT_SIGNUP_PAGE = '/sign-up';

/**
 * The default redirect path for the resend email verification page.
 * @type {string}
 */
const DEFAULT_RESEND_VERIFICATION_PAGE = '/email-verification';

/**
 * The default redirect path after logging in.
 * @type {string}
 */
const DEFAULT_AFTER_LOGIN_PAGE = '/settings';

/**
 * The array of public routes.
 * Non-logged-in users can access these routes.
 * @type {string[]}
 */
const publicRoutes: string[] = ['/', '/test', DEFAULT_RESEND_VERIFICATION_PAGE];

/**
 * The array of authentication routes.
 * Logged-in users will be redirected to the "/settings" page from these routes.
 * @type {string[]}
 */
const authRoutes: string[] = [DEFAULT_LOGIN_PAGE, DEFAULT_SIGNUP_PAGE];

/**
 * The array of routes for email verification.
 * @type {string[]}
 */
const emailVerificationRoutes: string[] = [DEFAULT_RESEND_VERIFICATION_PAGE];

// All the exports here
export {
  // Default page links
  DEFAULT_AFTER_LOGIN_PAGE,
  DEFAULT_LOGIN_PAGE,
  DEFAULT_RESEND_VERIFICATION_PAGE,
  DEFAULT_SIGNUP_PAGE,

  // API route prefix
  apiAuthPrefix,

  // Array of routes - [Route Groups]
  authRoutes,
  emailVerificationRoutes,
  publicRoutes,
};
