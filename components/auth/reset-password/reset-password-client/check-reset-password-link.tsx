'use client';
import { checkResetPasswordToken } from '@/actions/reset-password';
import AuthCardTitle from '@/components/auth/auth-card-title';
import { Button } from '@/components/ui/button';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_FORGET_PASSWORD_PAGE } from '@/lib/routes';
import { CircleXIcon } from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface IProps {
  token: string;
  errorCode?: string;
  isChecking: boolean;
  setIsChecking: Dispatch<SetStateAction<boolean>>;
  setResponse: Dispatch<
    SetStateAction<{ errorCode: string; successCode: string; email: string }>
  >;
}

const CheckResetPasswordLink = ({
  token,
  errorCode,
  isChecking,
  setIsChecking,
  setResponse,
}: IProps) => {
  const [isRequestedToCheck, setIsRequestedToCheck] = useState(false);

  // Use ref to track if the effect has already run
  const hasEffectRunRef = useRef(false);

  useEffect(() => {
    const startChecking = async () => {
      if (!token) {
        return setIsChecking(false);
      }

      // Guard: Don't run if already requested to check
      if (isRequestedToCheck || hasEffectRunRef.current) return;

      setIsChecking(true);
      setIsRequestedToCheck(true);
      hasEffectRunRef.current = true; // Prevent future executions

      const response = await checkResetPasswordToken(token);

      if (response?.success) {
        setResponse({
          errorCode: '',
          successCode: response?.code || '',
          email: response?.data?.email || '',
        });
      } else if (response?.code) {
        setResponse({
          errorCode: response?.code || '',
          successCode: '',
          email: response?.data?.email || '',
        });
      }
    };

    startChecking();
  }, [isRequestedToCheck, setIsChecking, setResponse, token]);

  // Showing reset password failed error message
  if (errorCode) {
    return (
      <div className="space-y-3">
        <div className="flex justify-center">
          <CircleXIcon className="size-10 text-destructive" />
        </div>
        <AuthCardTitle>Invalid Link</AuthCardTitle>
        <div className="text-destructive">
          {getErrorMessageByCode(errorCode)}
        </div>
        <Button size={'lg'} variant={'outline'} className="w-full" asChild>
          <Link href={DEFAULT_FORGET_PASSWORD_PAGE}>
            Back to forget password
          </Link>
        </Button>
      </div>
    );
  }

  // Showing verifying email
  if (isChecking) {
    return (
      <div className="py-10">
        <BeatLoader size={15} />
        <p className="text-lg">Checking reset password link...</p>
      </div>
    );
  }

  return null;
};

export default CheckResetPasswordLink;
