import { changeName } from '@/actions/change-settings';
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
import { changeUserNameSchema } from '@/lib/validation/user-settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

interface IProps {
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChangeNameDialog = ({ isOpen, name, onClose }: IProps) => {
  const { update } = useSession();
  const { toast } = useToast();

  const [isChanging, startChanging] = useTransition();

  const formMethods = useForm<z.infer<typeof changeUserNameSchema>>({
    defaultValues: { name: name },
    resolver: zodResolver(changeUserNameSchema),
  });

  const onSubmit = async (values: z.infer<typeof changeUserNameSchema>) => {
    startChanging(async () => {
      const response = await changeName(values);
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
          <DialogTitle>Change your name</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Separator />
        <div className="px-2">
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <FormInput
                disabled={isChanging}
                name="name"
                label="Name"
                placeholder="Enter your name"
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

export default ChangeNameDialog;
