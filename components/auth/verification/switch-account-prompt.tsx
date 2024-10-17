'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const SwitchAccountPrompt = () => {
  return (
    <div className="text-sm text-center text-gray-500 flex items-center justify-center gap-x-1">
      Want to use a different account?{' '}
      <Button
        variant={'link'}
        size={'default'}
        className="text-sm px-0 text-gray-600 font-semibold"
        onClick={async () => {
          await signOut();
        }}
      >
        Log out
      </Button>
    </div>
  );
};

export default SwitchAccountPrompt;
