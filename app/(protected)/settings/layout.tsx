import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const SettingsLayout = ({ children }: IProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SettingsLayout;
