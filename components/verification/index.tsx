import AuthCardWrapper from '@/components/auth/auth-card-wrapper';
import { auth } from '@/lib/auth/auth';
import { DEFAULT_AFTER_LOGIN_PAGE } from '@/lib/routes';
import { redirect } from 'next/navigation';
import NoSessionFound from './no-session-found';
import VerificationClient from './verification-client';

interface IProps {
  token?: string;
}

const Verification = async ({ token }: IProps) => {
  // Getting session
  const session = await auth();

  // Signing Out, if no session or user found
  if (!token && (!session || !session?.user || !session?.user?.email)) {
    return <NoSessionFound />;
  }

  // For VERIFIED users, redirecting to the Default After Login Page
  if (session?.user?.emailVerified) {
    redirect(DEFAULT_AFTER_LOGIN_PAGE);
  }

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCardWrapper>
        <div className="space-y-3">
          <VerificationClient
            token={token || ''}
            email={session?.user?.email || undefined}
          />
        </div>
      </AuthCardWrapper>
    </div>
  );
};

export default Verification;
