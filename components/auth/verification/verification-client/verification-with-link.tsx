'use client';
import { verifyEmail } from '@/actions/verify-email';
import AuthCardTitle from '@/components/auth/auth-card-title';
import { Button } from '@/components/ui/button';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_AFTER_LOGIN_PAGE, DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { MailXIcon } from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface IProps {
  email?: string;
  token: string;
  errorCode?: string;
  isVerifying: boolean;
  setIsVerifying: Dispatch<SetStateAction<boolean>>;
  setStatusCodes: Dispatch<
    SetStateAction<{ errorCode: string; successCode: string }>
  >;
}

const VerificationWithLink = ({
  email,
  token,
  errorCode,
  isVerifying,
  setIsVerifying,
  setStatusCodes,
}: IProps) => {
  const [isRequestedToCheck, setIsRequestedToCheck] = useState(false);

  // Use ref to track if the effect has already run
  const hasEffectRunRef = useRef(false);

  useEffect(() => {
    const startVerifying = async () => {
      if (!token) {
        return setIsVerifying(false);
      }

      // Guard: Don't run if already requested to check
      if (isRequestedToCheck || hasEffectRunRef.current) return;

      setIsVerifying(true);
      setIsRequestedToCheck(true);
      hasEffectRunRef.current = true; // Prevent future executions

      const response = await verifyEmail({ email, token, type: 'link' });

      if (response?.success) {
        setStatusCodes({
          errorCode: '',
          successCode: response?.code || '',
        });
      } else if (response?.code) {
        setStatusCodes({
          errorCode: response?.code || '',
          successCode: '',
        });
      }
    };

    startVerifying();
  }, [email, isRequestedToCheck, setIsVerifying, setStatusCodes, token]);

  // Showing verification failed error message
  if (errorCode) {
    return (
      <div className="space-y-3">
        <div className="flex justify-center">
          <MailXIcon className="size-10" />
        </div>
        <AuthCardTitle>Verification failed</AuthCardTitle>
        <div className="text-destructive">
          {getErrorMessageByCode(errorCode)}
        </div>
        {/* For showing Login button, if user not logged in */}
        {email ? (
          <Button size={'lg'} variant={'outline'} className="w-full" asChild>
            <Link href={DEFAULT_AFTER_LOGIN_PAGE}>Back to Settings</Link>
          </Button>
        ) : (
          <Button size={'lg'} variant={'outline'} className="w-full" asChild>
            <Link href={DEFAULT_LOGIN_PAGE}>Back to Login</Link>
          </Button>
        )}
      </div>
    );
  }

  // Showing verifying email
  if (isVerifying) {
    return (
      <div className="py-10">
        <BeatLoader size={15} />
        <p className="text-lg">Verifying your email address...</p>
      </div>
    );
  }

  return null;
};

export default VerificationWithLink;
