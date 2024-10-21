'use client';

import { Button } from '@/components/ui/button';
import { User } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserButton from './user-button';

interface IProps {
  user: User;
}

export const leftSideLinks = [
  {
    id: 'server-page',
    href: '/server-page',
    label: 'Server Page',
  },
  {
    id: 'client-page',
    href: '/client-page',
    label: 'Client Page',
  },
  {
    id: 'admin',
    href: '/admin',
    label: 'Admin',
  },
  {
    id: 'settings',
    href: '/settings',
    label: 'Settings',
  },
];

const Navbar = ({ user }: IProps) => {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white rounded px-3 py-2 flex justify-between items-center">
      <div className="flex gap-3">
        {leftSideLinks?.map((item) => (
          <Button
            key={item?.id}
            asChild
            variant={pathname === item?.href ? 'outline' : 'default'}
          >
            <Link href={item?.href}>{item?.label}</Link>
          </Button>
        ))}
      </div>

      <UserButton user={user} />
    </div>
  );
};

export default Navbar;
