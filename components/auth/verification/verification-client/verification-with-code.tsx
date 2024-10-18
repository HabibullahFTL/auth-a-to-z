import AuthCardTitle from '@/components/auth/auth-card-title';
import { Button } from '@/components/ui/button';
import { MailIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import VerificationCodeInput from './verification-code-input';

interface IProps {
  email: string;
  isVerifying: boolean;
  setVerificationCode: Dispatch<SetStateAction<string>>;
}

const VerificationWithCode = ({
  email,
  isVerifying,
  setVerificationCode,
}: IProps) => {
  return (
    <>
      <div className="flex justify-center items-center">
        <MailIcon className="size-10" />
      </div>
      <AuthCardTitle>Verify Email Address</AuthCardTitle>
      <div className="space-y-3">
        <div className="w-full">
          <AuthCardTitle isSubtitle>
            A verification email has been send to
          </AuthCardTitle>
          <div className="text-base flex items-center justify-center font-semibold">
            {email}
            <Button variant={'link'} className="px-2">
              <FaRegEdit />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-sm text-center text-gray-500">
        Please check your inbox and click the verification link or enter the OTP
        below to verify your email address.
      </p>

      {/* Verification handling section  */}
      <VerificationCodeInput
        isVerifying={isVerifying}
        setVerificationCode={setVerificationCode}
      />
    </>
  );
};

export default VerificationWithCode;
