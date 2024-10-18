import LogoutButton from '@/components/auth/logout-button';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth/auth';
import Link from 'next/link';

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <div>
        <Button>
          {' '}
          <Link href={'/check'}> Check button</Link>
        </Button>
        <LogoutButton>Logout</LogoutButton>
      </div>
    </div>
  );
};

export default SettingsPage;
