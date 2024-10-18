import ResetPassword from '@/components/auth/reset-password';
import { DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { redirect } from 'next/navigation';

interface IProps {
  searchParams: {
    token?: string;
  };
}

const ResetPasswordPage = async ({ searchParams }: IProps) => {
  const token = searchParams?.token;

  if (!token) {
    redirect(DEFAULT_LOGIN_PAGE);
  }

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
