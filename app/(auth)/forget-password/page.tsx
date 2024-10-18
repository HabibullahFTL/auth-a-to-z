'use client';
import { resetPasswordRequest } from '@/actions/reset-password';
import AuthCard from '@/components/auth/auth-card';
import AuthCardTitle from '@/components/auth/auth-card-title';
import AuthCardWrapper from '@/components/auth/auth-card-wrapper';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_LOGIN_PAGE } from '@/lib/routes';
import { resetRequestValidationSchema } from '@/lib/validation/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ForgetPage = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const formMethods = useForm<z.infer<typeof resetRequestValidationSchema>>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(resetRequestValidationSchema),
  });

  const onSubmit = (values: z.infer<typeof resetRequestValidationSchema>) => {
    if (isSuccess) return;

    // URL origin
    const urlOrigin = location.origin;

    startTransition(async () => {
      await resetPasswordRequest(values, urlOrigin).then((res) => {
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

  // Showing SUCCESS message after successful reset password request sent
  if (isSuccess) {
    return (
      <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
        <AuthCardWrapper>
          <div className="space-y-3">
            <div className="flex justify-center">
              <MailIcon className="size-10" />
            </div>
            <AuthCardTitle>Reset request sent</AuthCardTitle>
            <div className="text-gray-600 text-sm">
              Please check your inbox. A password reset link has been sent to
              your email address.
            </div>

            <Button size={'lg'} variant={'outline'} className="w-full" asChild>
              <Link href={DEFAULT_LOGIN_PAGE}>Back to Login</Link>
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
        title="Forget Password"
        subTitle="Did you forget your password?"
        backButtonLabel="Back to login"
        backButtonHref="/login"
      >
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              disabled={isPending}
              control={formMethods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="bahar@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size={'lg'} disabled={isPending}>
              Reset request
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default ForgetPage;
