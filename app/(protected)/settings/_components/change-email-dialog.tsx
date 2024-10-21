import { changeEmail } from '@/actions/change-settings';
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
import { changeEmailSchema } from '@/lib/validation/user-settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChangeEmailDialog = ({ isOpen, email, onClose }: IProps) => {
  const { update } = useSession();
  const { toast } = useToast();

  const [isChanging, startChanging] = useTransition();

  const formMethods = useForm<z.infer<typeof changeEmailSchema>>({
    defaultValues: { email: email },
    resolver: zodResolver(changeEmailSchema),
  });

  const onSubmit = async (values: z.infer<typeof changeEmailSchema>) => {
    const urlOrigin = location.origin;

    if (values?.email === email) {
      onClose();
      return;
    }

    startChanging(async () => {
      const response = await changeEmail(values, urlOrigin);
      toast({
        variant: response?.success ? 'default' : 'destructive',
        title: response?.message,
      });
      if (response?.success) {
        update();
        onClose();
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={!isChanging ? onClose : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your email</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Separator />
        <div className="px-2">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <FormInput
                disabled={isChanging}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
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

export default ChangeEmailDialog;
