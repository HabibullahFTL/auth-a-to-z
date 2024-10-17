import Verification from '@/components/auth/verification';
import { auth } from '@/lib/auth/auth';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const ProtectedLayout = async ({ children }: IProps) => {
  const session = await auth();

  // Non verified users always will see the email verification component
  if (!session?.user?.emailVerified) {
    return <Verification />;
  }

  return children;
};

export default ProtectedLayout;
