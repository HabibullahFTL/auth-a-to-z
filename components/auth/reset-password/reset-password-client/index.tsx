'use client';

import { useState } from 'react';
import CheckResetPasswordLink from './check-reset-password-link';
import ResetPasswordForm from './reset-password-form';

interface IProps {
  token: string;
}

const ResetPasswordClient = ({ token }: IProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [response, setResponse] = useState({
    errorCode: '',
    successCode: '',
    email: '',
  });

  const { successCode, errorCode, email } = response;

  // After verifying reset token showing reset password form
  if (successCode && token) {
    return <ResetPasswordForm token={token} email={email} />;
  }

  return (
    <div>
      <div className="w-full space-y-3">
        <CheckResetPasswordLink
          token={token}
          errorCode={errorCode}
          isChecking={isChecking}
          setIsChecking={setIsChecking}
          setResponse={setResponse}
        />
      </div>
    </div>
  );
};

export default ResetPasswordClient;
