'use client';

import { registration } from '@/actions/registration';
import AuthCard from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormInput from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_RESEND_VERIFICATION_PAGE } from '@/lib/routes';
import { signUpValidationSchema } from '@/lib/validation/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignUpPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const formMethods = useForm<z.infer<typeof signUpValidationSchema>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpValidationSchema),
  });

  const onSubmit = (values: z.infer<typeof signUpValidationSchema>) => {
    if (isPending) return;

    // URL origin
    const urlOrigin = location.origin;

    startTransition(() => {
      registration(values, urlOrigin).then((res) => {
        if (res?.success) {
          toast({
            variant: 'default',
            title: res?.message || 'Successfully created a user!',
            duration: 5000,
          });
          formMethods.reset();
          if (res?.success) {
            router.replace(DEFAULT_RESEND_VERIFICATION_PAGE);
          }
        } else {
          toast({
            variant: 'destructive',
            title: res?.message || 'Failed to create a user!',
          });
        }
      });
    });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCard
        title="Sign Up"
        subTitle="Create you account"
        backButtonLabel="Already have an account? Login"
        backButtonHref="/login"
      >
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormInput
              disabled={isPending}
              name="name"
              label="Name"
              placeholder="Enter you name"
            />
            <FormInput
              disabled={isPending}
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

            <Button className="w-full" size={'lg'} disabled={isPending}>
              Sign Up
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default SignUpPage;
