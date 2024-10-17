'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const LogoutButton = ({ children }: IProps) => {
  return (
    <Button
      onClick={async () => {
        await signOut();
      }}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;
