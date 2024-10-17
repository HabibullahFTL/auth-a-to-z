'use client';
import { login } from '@/actions/login';
import { loginValidationSchema } from '@/app/validation/auth-schemas';
import AuthCard from '@/components/auth/auth-card';
import FormError from '@/components/form-status/form-error';
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
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_AFTER_LOGIN_PAGE } from '@/lib/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const errorKey = searchParams.get('error');
  const errorMessage = errorKey && getErrorMessageByCode(errorKey || '');

  const formMethods = useForm<z.infer<typeof loginValidationSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginValidationSchema),
  });

  const onSubmit = (values: z.infer<typeof loginValidationSchema>) => {
    startTransition(async () => {
      await login(values).then((res) => {
        toast({
          variant: res?.success ? 'default' : 'destructive',
          title: res?.message,
          duration: res?.success ? 3000 : 5000,
        });

        // TODO: 2FA functionalities need to implement
        if (res?.success) {
          router.replace(DEFAULT_AFTER_LOGIN_PAGE);
        }
      });
    });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCard
        title="Login"
        subTitle="Welcome back"
        backButtonLabel="Don't have an account? Sign up"
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

            {errorMessage && <FormError message={errorMessage} />}

            <Button className="w-full" size={'lg'} disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
