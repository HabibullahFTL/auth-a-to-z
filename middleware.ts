import authConfig from '@/lib/auth/auth.config';
import NextAuth from 'next-auth';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_AFTER_LOGIN_PAGE,
  DEFAULT_LOGIN_PAGE,
  publicRoutes,
} from './lib/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req?.auth;

  const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl?.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl?.pathname);

  // If user trying to access API routes, giving your access
  if (isAPIAuthRoute) return;

  // AUTH pages/routes access handling
  if (isAuthRoute) {
    // Logged in & verified users is being redirected to DEFAULT AFTER LOGIN PAGE
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_AFTER_LOGIN_PAGE, nextUrl));
    }

    // Otherwise giving access to the AUTH pages
    return;
  }

  // All PROTECTED pages/routes access handling
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_LOGIN_PAGE, nextUrl));
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
