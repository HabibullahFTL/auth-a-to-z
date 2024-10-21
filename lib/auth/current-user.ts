import { db } from '../db';
import { auth } from './auth';

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const isAdminInDB = async () => {
  const session = await auth();
  const dbUser = session?.user?.id
    ? await db.user.findUnique({
        where: { id: session?.user?.id },
      })
    : null;
  return dbUser?.role === 'ADMIN';
};
