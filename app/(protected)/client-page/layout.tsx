import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

const ClientPageLayout = ({ children }: IProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientPageLayout;
