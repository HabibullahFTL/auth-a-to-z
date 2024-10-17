'use client';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

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
