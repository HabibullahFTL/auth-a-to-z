'use server';

import { getCurrentUser } from '@/lib/auth/current-user';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import { User, UserRole } from '@prisma/client';

export const changeRole = async (userId: string, role: UserRole) => {
  if (!userId || !role) {
    return generateResponse({ code: 'InvalidInputs' });
  }

  const user = await getCurrentUser();

  // Checking the user is admin in session data or not
  if (!user || user?.role !== 'ADMIN') {
    return generateResponse({ code: 'Unauthorized' });
  }

  const dbUser = await db.user.findUnique({
    where: { id: user?.id },
  });

  // Checking the user is admin in database data or not for more safety
  if (!dbUser || dbUser?.role !== 'ADMIN') {
    return generateResponse({ code: 'Unauthorized' });
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });

  if (!updatedUser) {
    return generateResponse({ code: 'UserNotFound' });
  }
  return generateResponse<User>({
    success: true,
    code: 'DefaultSuccess',
    data: updatedUser,
  });
};
