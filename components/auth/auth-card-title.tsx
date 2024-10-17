import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  isSubtitle?: boolean;
}

const font = Poppins({
  subsets: ['latin'],
  weight: '600',
});

const AuthCardTitle = ({ children, isSubtitle }: IProps) => {
  return isSubtitle ? (
    <p className="text-base text-gray-500">{children}</p>
  ) : (
    <h1 className={cn('text-3xl font-semibold text-primary', font.className)}>
      {children}
    </h1>
  );
};

export default AuthCardTitle;
