'use client';
import { login } from '@/actions/login';
import AuthCard from '@/components/auth/auth-card';
import FormError from '@/components/form-status/form-error';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormInput from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessageByCode } from '@/lib/handlers/generate-message';
import { DEFAULT_AFTER_LOGIN_PAGE } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { loginValidationSchema } from '@/lib/validation/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [show2FA, setShow2FA] = useState(false);

  const errorKey = searchParams.get('error');
  const errorMessage = errorKey && getErrorMessageByCode(errorKey || '');

  const formMethods = useForm<z.infer<typeof loginValidationSchema>>({
    defaultValues: {
      email: '',
      password: '',
      code: '',
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

        if (res?.success && res?.code === '2FATokenSent') {
          setShow2FA(true);
        } else if (res?.success && res?.code === 'LoginSuccess') {
          router.replace(DEFAULT_AFTER_LOGIN_PAGE);
        }
      });
    });
  };

  const handleBackToLogin = () => {
    if (isPending) return;

    setShow2FA(false);
    formMethods.setValue('code', '');
  };

  return (
    <div className="flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-sky-800">
      <AuthCard
        hideSocialLogin={show2FA}
        title={'Login'}
        subTitle={show2FA ? 'Complete 2FA verification' : 'Welcome back'}
        backButtonLabel="Don't have an account? Sign up"
        backButtonHref="/sign-up"
      >
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            {show2FA ? (
              <>
                <div className="mb-4">
                  <FormInput
                    disabled={isPending}
                    name="code"
                    label="2FA Code"
                    placeholder="Enter 2FA code"
                  />
                </div>
              </>
            ) : (
              <>
                {' '}
                {/* Login inputs */}
                <div className="space-y-4">
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
                </div>
                {errorMessage && <FormError message={errorMessage} />}
                <div className="flex justify-end w-full">
                  <Button variant={'link'} className="pl-1 py-0" asChild>
                    <Link href="/forget-password">Forgot your password?</Link>
                  </Button>
                </div>
              </>
            )}

            <div className={cn(show2FA ? 'grid grid-cols-2 gap-x-3' : '')}>
              <Button className="w-full" size={'lg'} disabled={isPending}>
                {show2FA ? 'Confirm' : 'Login'}
              </Button>
              {show2FA && (
                <Button
                  disabled={isPending}
                  type="button"
                  className="w-full"
                  size={'lg'}
                  variant={'outline'}
                  onClick={handleBackToLogin}
                >
                  Back
                </Button>
              )}
            </div>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
