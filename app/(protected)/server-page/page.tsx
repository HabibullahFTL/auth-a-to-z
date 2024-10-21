import UserDetails from '@/components/user-details/user-details';
import { getCurrentUser } from '@/lib/auth/current-user';

const ServerPage = async () => {
  const currentUser = await getCurrentUser();

  return <UserDetails title={'💻 Server Page'} user={currentUser} />;
};

export default ServerPage;
