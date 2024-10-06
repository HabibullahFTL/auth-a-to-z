'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

interface IProps {
  title: string;
  subTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  children: ReactNode;
}

const font = Poppins({
  subsets: ['latin'],
  weight: '600',
});

const AuthCardWrapper = ({
  title,
  subTitle,
  backButtonLabel,
  backButtonHref,
  children,
}: IProps) => {
  return (
    <div className="bg-white w-full xs:w-80 sm:w-[400px] rounded-lg px-4 py-5">
      <div className="space-y-2 text-center ">
        <h1
          className={cn(
            'text-3xl font-semibold text-primary drop-shadow-md',
            font.className
          )}
        >
          🔐 {title}
        </h1>
        <p className="text-base text-gray-500">{subTitle}</p>
        <div className="py-2">{children}</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={'ghost'} className="border" size={'lg'}>
            <FcGoogle className="text-xl" />
          </Button>
          <Button variant={'ghost'} className="border" size={'lg'}>
            <FaGithub className="text-xl" />
          </Button>
        </div>
        <div className="">
          <Button asChild variant={'link'}>
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthCardWrapper;
