'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import AuthCardTitle from './auth-card-title';
import AuthCardWrapper from './auth-card-wrapper';
import SocialLoginButton from './social-login-button';

interface IProps {
  title: string;
  subTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  children: ReactNode;
  hideSocialLogin?: boolean;
}

const AuthCard = ({
  title,
  subTitle,
  backButtonLabel,
  backButtonHref,
  hideSocialLogin,
  children,
}: IProps) => {
  return (
    <AuthCardWrapper>
      <AuthCardTitle>🔐 {title}</AuthCardTitle>
      <AuthCardTitle isSubtitle>{subTitle}</AuthCardTitle>

      {/* Card content */}
      <div className="py-2">{children}</div>

      {/* Social logins - [ OAuth Provider Login ] */}
      {!hideSocialLogin && (
        <div className="grid grid-cols-2 gap-2">
          <SocialLoginButton icon={FcGoogle} provider="google" />
          <SocialLoginButton icon={FaGithub} provider="github" />
        </div>
      )}

      {/* Card bottom content */}
      <div className="">
        <Button asChild variant={'link'}>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </div>
    </AuthCardWrapper>
  );
};

export default AuthCard;
