import { isAdminInDB } from '@/lib/auth/current-user';
import { db } from '@/lib/db';
import { generateResponse } from '@/lib/request/generate-response';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  console.log({ request });

  const isAdmin = await isAdminInDB();

  if (!isAdmin) {
    return NextResponse.json(generateResponse({ code: 'Unauthorized' }));
  }

  const users = await db.user.findMany({});

  return NextResponse.json(generateResponse({ success: true, data: users }));
};
