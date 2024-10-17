import { db } from '@/lib/db';
import { IUserRole } from '@/types/common';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { AuthError, DefaultSession } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from 'next-auth/jwt';
import { getUserById } from '../request/users';
import { DEFAULT_LOGIN_PAGE } from '../routes';
import authConfig from './auth.config';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      emailVerified: Date | null;
      role: IUserRole;
    } & DefaultSession['user'];
  }

  /**
   * Extending user type, this will be accessible from `singIn()` callback
   */
  interface User {
    emailVerified: Date | null;
    role?: IUserRole;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role?: IUserRole;
    emailVerified: Date | null;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: DEFAULT_LOGIN_PAGE,
    signOut: DEFAULT_LOGIN_PAGE,
  },
  events: {
    linkAccount: async ({ user }) => {
      if (user?.id) {
        // Verifying user as they are using OAuth providers
        await db.user.update({
          where: { id: user?.id },
          data: {
            emailVerified: new Date(),
          },
        });
      }
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      console.log('FROM signIn() ----------> ', {
        user,
        account,
      });

      // Throwing an error if no user found
      if (!user) {
        throw new AuthError({ cause: 'UserNotFound' });
      }

      // Throwing an error if the user role is BLOCKED
      if (user?.role === 'BLOCKED') {
        throw new AuthError({ cause: 'UserBlocked' });
      }

      // TODO: 2FA check

      return true;
    },
    jwt: async ({ token }) => {
      // If user is not logged in
      if (!token.sub) return token;

      // Fetching the user data
      const existingUser = await getUserById(token.sub);

      // If no user found
      if (!existingUser) {
        return null;
      }

      token.name = existingUser?.name;
      token.picture = existingUser?.image;
      token.role = existingUser.role;
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;

      // console.log('FROM jwt() ----------> ', {
      //   existingUser,
      //   token,
      // });

      return token;
    },
    session: async ({ session, token }) => {
      // console.log('FROM session() --------> ', {
      //   session,
      //   token,
      // });

      if (!token) {
        session.expires = new Date()?.toISOString() as typeof session.expires;
        return session;
      }

      if (session?.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role || 'BLOCKED';
        session.user.name = token.name || '';
        session.user.image = token.picture || '';
        session.user.email = token.email || '';
        session.user.emailVerified = token.emailVerified;
      }

      return session;
    },
  },
  ...authConfig,
});

export const PASSWORD_SALT = 10;