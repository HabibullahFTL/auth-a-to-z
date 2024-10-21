'use client';

import UserDetails from '@/app/(protected)/_components/user-details';
import useCurrentUser from '@/hooks/use-current-user';

const ClientPage = () => {
  const currentUser = useCurrentUser();

  return <UserDetails title={'🖥️ Client Page'} user={currentUser} />;
};

export default ClientPage;
