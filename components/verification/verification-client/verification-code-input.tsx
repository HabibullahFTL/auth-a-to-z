'use client';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import VerificationInput from 'react-verification-input';

interface IProps {
  isVerifying: boolean;
  setVerificationCode: Dispatch<SetStateAction<string>>;
}

const VerificationCodeInput = ({
  isVerifying,
  setVerificationCode,
}: IProps) => {
  return (
    <div className="flex justify-center">
      <VerificationInput
        autoFocus
        length={6}
        inputProps={{ disabled: isVerifying }}
        //   onComplete={handleVerifyCodeOnComplete} // It can be enabled if need to auto verify after completing input
        validChars="0123456789"
        onChange={setVerificationCode}
        classNames={{
          container: cn('flex gap-x-2', isVerifying && 'opacity-50'),
          character:
            'uppercase h-auto rounded-md border border-gray-300 flex justify-center text-lg font-medium items-center text-gray-500',
          characterInactive: 'bg-muted',
          characterSelected: 'bg-white text-black',
          characterFilled: 'bg-white text-black',
        }}
      />
    </div>
  );
};

export default VerificationCodeInput;
