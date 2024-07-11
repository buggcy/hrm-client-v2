'use client';

import { FC } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import { useRedirectAfterAuth } from '@/app/(authentication)/auth/hooks';
import { AuthLayout } from '@/app/(authentication)/auth/Layout.component';
import { signInWithGoogle } from '@/services';

import { SignInForm } from './components/Form';
import { toast } from '../ui/use-toast';

const SignIn: FC = () => {
  const { mutate: handleSignInWithGoogle, isPending } = useMutation({
    mutationFn: signInWithGoogle,
    onError: () => {
      toast({
        title: 'An error occurred while signing in with Google.',
        variant: 'destructive',
      });
    },
  });

  useRedirectAfterAuth();

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <SignInForm />
      <Button
        variant="outline"
        className="w-full"
        disabled={isPending}
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-expect-error
        onClick={handleSignInWithGoogle}
      >
        Login with Google {isPending && '...'}
      </Button>
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
