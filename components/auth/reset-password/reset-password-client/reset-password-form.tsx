'use client';
import { resetPasswordWithToken } from '@/actions/reset-password';
import AuthCard from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormInput from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { getSuccessMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { resetPasswordValidationSchema } from '@/lib/validation/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';
import AuthCardWrapper from '../../auth-card-wrapper';

interface IProps {
  token: string;
  email: string;
}

const ResetPasswordForm = ({ token, email }: IProps) => {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  const formMethods = useForm<z.infer<typeof resetPasswordValidationSchema>>({
    defaultValues: {
      email: email || '',
      password: '',
      confPassword: '',
      token: token || '',
    },
    resolver: zodResolver(resetPasswordValidationSchema),
  });

  const onSubmit = (values: z.infer<typeof resetPasswordValidationSchema>) => {
    startTransition(async () => {
      await resetPasswordWithToken(values).then((res) => {
        toast({
          variant: res?.success ? 'default' : 'destructive',
          title: res?.message,
          duration: res?.success ? 3000 : 5000,
        });

        if (res?.success) {
          setIsSuccess(true);
        }
      });
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
        <AuthCardWrapper>
          <div className="space-y-3">
            <div className="flex justify-center">
              <FaCheckCircle className="text-emerald-600 size-10" />
            </div>
            <h3 className="text-3xl font-semibold">Success</h3>
            <div className="text-gray-700">
              {getSuccessMessageByCode('ResetPasswordSuccess')}
            </div>
            <Button size={'lg'} variant={'outline'} className="w-full" asChild>
              <Link href={DEFAULT_LOGIN_PAGE}>Back to login</Link>
            </Button>
          </div>
        </AuthCardWrapper>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCard
        hideSocialLogin
        title="Reset Password"
        subTitle="Set a new password to get access"
        backButtonLabel="Back to login"
        backButtonHref="/login"
      >
        <Form {...formMethods}>
          <form
            className="space-y-4"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <FormInput
              disabled={true}
              name="email"
              label="Email"
              placeholder="bahar@example.com"
              type="email"
            />
            <FormInput
              disabled={isPending}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />
            <FormInput
              disabled={isPending}
              name="confPassword"
              label="Confirm Password"
              placeholder="Confirm password"
              type="password"
            />
            <Button className="w-full" size={'lg'} disabled={isPending}>
              Reset Password
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordForm;
