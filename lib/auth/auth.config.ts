import { loginValidationSchema } from '@/lib/validation/auth-schemas';
import * as bcrypt from 'bcryptjs';
import { AuthError, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { getUserByEmail } from '../request/users';

export default {
  providers: [
    Github,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedResult = loginValidationSchema.safeParse(credentials);

        // If any invalid inputs given
        if (!validatedResult?.success) {
          throw new AuthError({ cause: 'InvalidCredentials' });
        }

        const { password, email } = validatedResult?.data;

        const user = await getUserByEmail(email);
        // If the user not found
        if (!user) {
          throw new AuthError({ cause: 'UserNotFound' });
        }

        // If the password is not given
        if (!user?.password) {
          throw new AuthError({ cause: 'AccountNotLinked' });
        }

        const passwordMatched = await bcrypt.compare(password, user?.password);
        // If the password is incorrect
        if (!passwordMatched) {
          throw new AuthError({ cause: 'InvalidCredentials' });
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
