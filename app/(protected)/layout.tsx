import Verification from '@/components/auth/verification';
import { auth } from '@/lib/auth/auth';
import { ReactNode } from 'react';
import Navbar from './_components/navbar';

interface IProps {
  children: ReactNode;
}

const ProtectedLayout = async ({ children }: IProps) => {
  const session = await auth();

  // Non verified users always will see the email verification component
  if (!session?.user?.emailVerified) {
    return <Verification />;
  }

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <div className="w-[600px] space-y-4">
        <Navbar user={session?.user} />
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
