import Verification from '@/components/auth/verification';
import { auth } from '@/lib/auth/auth';
import { DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { redirect } from 'next/navigation';

interface IProps {
  searchParams: {
    token?: string;
  };
}

const EmailVerificationPage = async ({ searchParams }: IProps) => {
  const token = searchParams?.token;

  const session = await auth();

  if (!token && !session) {
    redirect(DEFAULT_LOGIN_PAGE);
  }

  return <Verification token={token} />;
};

export default EmailVerificationPage;
