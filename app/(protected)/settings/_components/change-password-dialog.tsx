import { changePassword } from '@/actions/change-settings';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormInput from '@/components/ui/form-input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { changePasswordSchema } from '@/lib/validation/user-settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog = ({ isOpen, onClose }: IProps) => {
  const { toast } = useToast();

  const [isChanging, startChanging] = useTransition();

  const formMethods = useForm<z.infer<typeof changePasswordSchema>>({
    defaultValues: { currentPassword: '', newPassword: '', confPassword: '' },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    startChanging(async () => {
      const response = await changePassword(values);
      toast({
        variant: response?.success ? 'default' : 'destructive',
        title: response?.message,
      });
      if (response?.success) {
        onClose();
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={!isChanging ? onClose : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your password</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Separator />
        <div className="px-2">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full gap-3">
                <FormInput
                  disabled={isChanging}
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                  type={'password'}
                />
                <FormInput
                  disabled={isChanging}
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  type={'password'}
                />
                <FormInput
                  disabled={isChanging}
                  name="confPassword"
                  label="Confirm Password"
                  placeholder="Enter confirm password"
                  type={'password'}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button disabled={isChanging} type="submit">
                  {isChanging ? 'Changing...' : 'Change'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
