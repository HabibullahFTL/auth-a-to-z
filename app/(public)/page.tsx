'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const font = Poppins({
  subsets: ['latin'],
  weight: '600',
});

const HomePage = () => {
  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800 space-y-4">
      <h1
        className={cn(
          'text-3xl font-semibold text-white drop-shadow-md',
          font.className
        )}
      >
        🔐 Auth
      </h1>
      <p className="text-lg text-white">A simple authentication service</p>
      <Button variant={'secondary'} size={'lg'} asChild>
        <Link href={'/login'}>Login</Link>
      </Button>
    </div>
  );
};

export default HomePage;
