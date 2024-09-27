'use client';

import { FC } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { AuthLayout } from '@/app/(authentication)/auth/Layout.component';

import { SignInForm } from './components/Form';

const SignIn: FC = () => {
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
