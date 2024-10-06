'use client';

import { signUp } from '@/actions/sign-up';
import { signUpValidationSchema } from '@/app/validation/auth-schemas';
import AuthCardWrapper from '@/components/auth/auth-card-wrapper';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignUpPage = () => {
  const [isPending, startTransition] = useTransition();

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

    startTransition(() => {
      signUp(values).then((res) => {
        console.log({ res });
      });
    });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCardWrapper
        title="Sign Up"
        subTitle="Create you account"
        backButtonLabel="Already have an account?"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter you name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={formMethods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size={'lg'} disabled={isPending}>
              Sign Up
            </Button>
          </form>
        </Form>
      </AuthCardWrapper>
    </div>
  );
};

export default SignUpPage;
