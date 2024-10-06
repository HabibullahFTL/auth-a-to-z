'use client';

import { login } from '@/actions/login';
import { signInValidationSchema } from '@/app/validation/auth-schemas';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginPage = () => {
  const [isPending, startTransition] = useTransition();

  const formMethods = useForm<z.infer<typeof signInValidationSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInValidationSchema),
  });

  const onSubmit = (values: z.infer<typeof signInValidationSchema>) => {
    startTransition(() => {
      login(values).then((res) => {
        console.log({ res });
      });
    });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCardWrapper
        title="Sign In"
        subTitle="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/sign-up"
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
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size={'lg'} disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </AuthCardWrapper>
    </div>
  );
};

export default LoginPage;
