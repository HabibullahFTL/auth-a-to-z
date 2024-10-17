import LogoutButton from '@/components/auth/logout-button';
import { auth } from '@/lib/auth/auth';

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <div>
        <LogoutButton>Logout</LogoutButton>
      </div>
    </div>
  );
};

export default SettingsPage;
