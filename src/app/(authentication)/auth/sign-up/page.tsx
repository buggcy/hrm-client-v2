'use client';

import { FC } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { signInWithGoogle } from '@/services';

import { SignUpForm } from './components/SignUpForm';
import { useRedirectAfterAuth } from '../hooks';
import { AuthLayout } from '../Layout.component';

const SignUp: FC = () => {
  const { mutate: handleSignUpWithGoogle, isPending } = useMutation({
    mutationFn: () => signInWithGoogle(true),
    onError: () => {
      toast({
        title: 'An error occurred while signing up with Google.',
        variant: 'error',
      });
    },
  });

  useRedirectAfterAuth();

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Create developer account</h1>
        <p className="text-balance text-muted-foreground">
          Enter your information to create an account.
        </p>
      </div>
      <div className="space-y-4">
        <SignUpForm />
        <LoadingButton
          variant="outline"
          className="w-full"
          disabled={isPending}
          loading={isPending}
          onClick={handleSignUpWithGoogle as () => void}
        >
          <img src="/images/icon_google.svg" alt="google icon" />
          Sign Up with Google
        </LoadingButton>
      </div>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href="/auth/sign-in" className="underline">
            Sign In
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
