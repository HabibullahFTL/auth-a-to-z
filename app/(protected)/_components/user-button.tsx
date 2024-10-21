import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { leftSideLinks } from './navbar';

interface IProps {
  user?: User;
}

const UserButton = ({ user }: IProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="relative size-9 rounded-full overflow-hidden flex justify-center items-center border">
          {user?.image ? (
            <Image
              fill
              src={user?.image || ''}
              alt={user?.name || ''}
              className="rounded-full overflow-hidden"
            />
          ) : (
            <FaUser />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {leftSideLinks?.map((item) => (
            <DropdownMenuItem key={item?.id}>
              <Link href={item?.href}>{item?.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
