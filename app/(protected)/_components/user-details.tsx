import { Badge } from '@/components/ui/badge';
import { User } from 'next-auth';

interface IProps {
  title: string;
  user?: User;
}

const UserDetails = ({ title, user }: IProps) => {
  const contents: { key: keyof typeof user | string; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    ...(user?.provider === 'credentials'
      ? [{ key: 'isTwoFactorEnabled', label: '2FA Enabled' }]
      : []),
    { key: 'provider', label: 'Provider' },
  ];
  return (
    <div className="bg-white rounded px-3 py-5 w-full grid gap-3">
      <h3 className="text-4xl text-center mb-6 font-semibold">{title}</h3>
      {contents?.map((item) => {
        const value = user?.[item?.key as keyof typeof user];

        return (
          <div
            key={item?.key}
            className="border-y px-2 py-2 flex justify-between rounded"
          >
            <p className="text-sm font-semibold">{item?.label}</p>
            {typeof value === 'boolean' ? (
              <Badge variant={value ? 'success' : 'destructive'}>
                {value ? 'ON' : 'OFF'}
              </Badge>
            ) : (
              <p className="text-sm">{(value || '')?.toString()}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserDetails;
