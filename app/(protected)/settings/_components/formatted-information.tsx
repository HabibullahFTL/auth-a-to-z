'use client';

import { change2FASettings } from '@/actions/change-settings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import useConfirmation from '@/hooks/use-confirmation';
import { useToast } from '@/hooks/use-toast';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaEdit, FaEnvelope, FaLock, FaUser, FaUserLock } from 'react-icons/fa';
import ChangeEmailDialog from './change-email-dialog';
import ChangeNameDialog from './change-name-dialog';
import ChangePasswordDialog from './change-password-dialog';

interface IProps {
  user?: User;
}

const FormattedInformation = ({ user }: IProps) => {
  const { update } = useSession();
  const { toast } = useToast();

  // Dialog confirmation for the dialogs [ 2FA ]
  const [TwoFAConfirmationDialog, twoFAConfirm] = useConfirmation({
    title: `${
      user?.isTwoFactorEnabled ? 'Disable' : 'Enable'
    } Two-Factor Authentication`,
    description: `Are you sure you want to ${
      user?.isTwoFactorEnabled ? 'disable' : 'enable'
    } two-factor authentication for added security?`,
  });

  // Dialog info for the dialogs [ Name, email and password change ]
  const [dialogInfo, setDialogInfo] = useState<{
    openedDialog: string;
    data: {
      [key: string]: string;
    };
  }>();

  // Formatted information to show in the settings page
  const formattedInformation = [
    {
      key: 'name',
      label: 'Name',
      icon: FaUser,
      value: user?.name || '',
    },
    ...(user?.provider === 'credentials'
      ? [
          {
            key: 'email',
            label: 'Email',
            icon: FaEnvelope,
            value: user?.email || '',
          },
          {
            key: 'password',
            label: 'Password',
            icon: FaLock,
            value: '**********',
          },
          {
            key: '2FA',
            label: 'Two Factor Authentication',
            icon: FaUserLock,
            value: user?.isTwoFactorEnabled || false,
          },
        ]
      : []),
  ];

  // 2FA service handler
  const handle2FA = async (isChecked: boolean) => {
    const ok = await twoFAConfirm();

    if (ok) {
      toast({
        title: 'Changing the 2FA settings...',
        variant: 'loading',
      });
      const response = await change2FASettings(isChecked);
      update();
      toast({
        title: response?.success
          ? 'Changed the 2FA setting successfully'
          : response?.message,
        variant: response?.success ? 'default' : 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mb-6 px-2">
      {formattedInformation?.map(({ key, label, value, icon: Icon }) => (
        <div key={key} className="flex items-center gap-3 justify-start w-full">
          <div className="flex items-center gap-3 justify-start flex-1">
            <div>
              <Icon className="size-5 text-gray-700" />
            </div>

            <div className="">
              <h3 className="font-semibold text-gray-700">{label}</h3>
              <p className="text-sm">
                {key !== '2FA'
                  ? value
                  : 'Enable two factor authentication for your account'}
              </p>
            </div>
          </div>

          {key !== '2FA' ? (
            <Button
              variant={'ghost'}
              className="px-2.5"
              onClick={() =>
                setDialogInfo({
                  openedDialog: key,
                  data: {
                    ...(key === 'name' ? { name: value?.toString() } : {}),
                    ...(key === 'email' ? { email: value?.toString() } : {}),
                  },
                })
              }
            >
              <FaEdit className="size-4 text-gray-600" />
            </Button>
          ) : (
            <div className="flex flex-col gap-1 justify-end items-end">
              <Switch checked={!!value} onCheckedChange={handle2FA} />
              <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
            </div>
          )}
        </div>
      ))}

      {/* 2FA Authentication Dialog  */}
      <TwoFAConfirmationDialog />

      {/* Change Name Dialog  */}
      {dialogInfo?.openedDialog && dialogInfo?.openedDialog === 'name' ? (
        <ChangeNameDialog
          name={dialogInfo?.data?.name}
          isOpen={dialogInfo?.openedDialog === 'name'}
          onClose={() => setDialogInfo(undefined)}
        />
      ) : null}

      {/* Change Email Dialog  */}
      {dialogInfo?.openedDialog && dialogInfo?.openedDialog === 'email' ? (
        <ChangeEmailDialog
          email={dialogInfo?.data?.email}
          isOpen={dialogInfo?.openedDialog === 'email'}
          onClose={() => setDialogInfo(undefined)}
        />
      ) : null}

      {/* Change Password Dialog  */}
      {dialogInfo?.openedDialog && dialogInfo?.openedDialog === 'password' ? (
        <ChangePasswordDialog
          isOpen={dialogInfo?.openedDialog === 'password'}
          onClose={() => setDialogInfo(undefined)}
        />
      ) : null}
    </div>
  );
};

export default FormattedInformation;
