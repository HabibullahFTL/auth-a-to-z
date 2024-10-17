'use client';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const AuthCardWrapper = ({ children }: IProps) => {
  return (
    <div className="bg-white w-full xs:w-80 sm:w-[400px] rounded-lg px-4 py-5">
      <div className="space-y-2 text-center ">{children}</div>
    </div>
  );
};

export default AuthCardWrapper;
