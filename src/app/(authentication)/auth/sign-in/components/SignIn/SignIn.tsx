'use client';

import { FC } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useRedirectAfterAuth } from '@/app/(authentication)/auth/hooks';
import { AuthLayout } from '@/app/(authentication)/auth/Layout.component';
import { signInWithGoogle } from '@/services';

import { SignInForm } from './components/Form';

const SignIn: FC = () => {
  const { mutate: handleSignInWithGoogle, isPending } = useMutation({
    mutationFn: signInWithGoogle,
    onError: () => {
      toast({
        title: 'An error occurred while signing in with Google.',
        variant: 'error',
      });
    },
  });

  useRedirectAfterAuth();

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account.
        </p>
      </div>
      <div className="space-y-4">
        <SignInForm />
        <Button
          variant="outline"
          className="w-full"
          disabled={isPending}
          // @ts-expect-error
          onClick={handleSignInWithGoogle}
        >
          <img src="/images/icon_google.svg" alt="google icon" /> Login with
          Google {isPending && '...'}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href="/auth/sign-up" className="underline">
            Sign up
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
};

export { SignIn };
