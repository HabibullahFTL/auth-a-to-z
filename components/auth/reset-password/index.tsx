import AuthCardWrapper from '@/components/auth/auth-card-wrapper';
import ResetPasswordClient from './reset-password-client';

interface IProps {
  token?: string;
}

const ResetPassword = async ({ token }: IProps) => {
  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCardWrapper>
        <div className="space-y-3">
          <ResetPasswordClient token={token || ''} />
        </div>
      </AuthCardWrapper>
    </div>
  );
};

export default ResetPassword;
