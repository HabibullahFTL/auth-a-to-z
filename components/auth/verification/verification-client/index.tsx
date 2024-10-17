'use client';

import { resendVerification } from '@/actions/resend-verification';
import { verifyEmail } from '@/actions/verify-email';
import AuthCardTitle from '@/components/auth/auth-card-title';
import Hint from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useResendCoolDown } from '@/hooks/useResendCooldown';
import { getSuccessMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_AFTER_LOGIN_PAGE, DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { MailCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import SwitchAccountPrompt from '../switch-account-prompt';
import VerificationWithCode from './verification-with-code';
import VerificationWithLink from './verification-with-link';

interface IProps {
  email?: string;
  token: string;
}

const VerificationClient = ({ email, token }: IProps) => {
  const router = useRouter();

  const { toast } = useToast();

  const [isCodeVerifying, startCodeVerifying] = useTransition();
  const [isResending, startResending] = useTransition();

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLinkVerifying, setIsLinkVerifying] = useState(true);
  const [statusCodes, setStatusCodes] = useState({
    errorCode: '',
    successCode: '',
  });

  const { successCode, errorCode } = statusCodes;

  const verificationType = token || errorCode || successCode ? 'link' : 'code';
  const isDisabled = isResending || isCodeVerifying;

  // Hook to manage resend cool down for verification email
  const { canResend, formattedTimeLeft, startCoolDown } = useResendCoolDown();

  // Resend verification code handler
  const handleResendVerification = async () => {
    // URL origin
    const urlOrigin = location.origin;

    if (!isCodeVerifying && !isResending && email) {
      startResending(async () => {
        const response = await resendVerification(email, urlOrigin);

        toast({
          title: response?.message,
          variant: response?.success ? 'default' : 'destructive',
        });

        // Started cool down - [ Counting ]
        if (response?.success && response?.code === 'EmailVerificationSent') {
          startCoolDown();
        }
      });
    }
  };

  // Verify code handler
  const handleVerifyCode = async () => {
    if (
      email &&
      (verificationCode || '')?.length === 6 &&
      !isCodeVerifying &&
      !isResending
    ) {
      startCodeVerifying(async () => {
        const response = await verifyEmail({
          email,
          code: verificationCode,
          type: 'code',
        });

        if (response?.success) {
          setStatusCodes({ errorCode: '', successCode: response?.code || '' });
        } else {
          toast({
            title: response?.message,
            variant: 'destructive',
          });
        }
      });
    }
  };

  useEffect(() => {
    if (successCode && email) {
      setTimeout(() => {
        router.push(DEFAULT_AFTER_LOGIN_PAGE);
      }, 3000);
    }
  }, [email, router, successCode]);

  if (successCode) {
    return (
      <div className="space-y-3">
        <div className="flex justify-center">
          <MailCheckIcon className="size-10" />
        </div>
        <AuthCardTitle>Email Verified</AuthCardTitle>
        <div className="text-emerald-600">
          {getSuccessMessageByCode(successCode)}
        </div>

        {/* For showing Login button, if user not logged in  */}
        {!email && (
          <Button size={'lg'} variant={'outline'} className="w-full" asChild>
            <Link href={DEFAULT_LOGIN_PAGE}>Back to Login</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="w-full space-y-3">
        {verificationType == 'code' && email ? (
          <VerificationWithCode
            email={email}
            isVerifying={isCodeVerifying}
            setVerificationCode={setVerificationCode}
          />
        ) : (
          <VerificationWithLink
            email={email}
            token={token}
            errorCode={errorCode}
            isVerifying={isLinkVerifying}
            setIsVerifying={setIsLinkVerifying}
            setStatusCodes={setStatusCodes}
          />
        )}

        <div
          className={cn(
            'grid gap-x-2',
            verificationType === 'code' && 'grid-cols-2',
            verificationType === 'link' && isLinkVerifying ? 'hidden' : ''
          )}
        >
          {/* For resending verification email  */}
          {email && (
            <Button
              disabled={isDisabled || !canResend}
              size={'lg'}
              variant={'outline'}
              className="w-full"
              onClick={handleResendVerification}
            >
              {isResending ? 'Resending..' : 'Resend'}{' '}
              {!canResend && formattedTimeLeft
                ? `(${formattedTimeLeft})`
                : null}
            </Button>
          )}

          {/* For verifying the code  */}
          {verificationType === 'code' && (
            <Hint
              label={
                (verificationCode || '')?.length !== 6
                  ? 'Enter code to activate'
                  : !isDisabled
                  ? 'Ready to verify'
                  : 'Verify code'
              }
            >
              <div className="w-full">
                <Button
                  disabled={
                    isDisabled || (verificationCode || '')?.length !== 6
                  }
                  size={'lg'}
                  className="w-full"
                  onClick={handleVerifyCode}
                >
                  {isCodeVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </Hint>
          )}
        </div>

        {/* Account switcher prompt  */}
        {(!isLinkVerifying || !token) && !successCode && email && (
          <>
            <Separator />
            <SwitchAccountPrompt />
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationClient;
