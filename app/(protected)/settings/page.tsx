'use client';
import Loader from '@/components/common/loader';
import useCurrentUser from '@/hooks/use-current-user';
import FormattedInformation from './_components/formatted-information';

const SettingsPage = () => {
  const user = useCurrentUser();

  return (
    <div className="w-full bg-white rounded px-3 py-2 flex-col flex justify-between items-center">
      <h3 className="text-4xl text-center font-semibold mb-6 w-full">
        ⚙️ Settings
      </h3>
      {!user ? (
        <Loader type="relative" />
      ) : (
        <FormattedInformation user={user} />
      )}
    </div>
  );
};

export default SettingsPage;
