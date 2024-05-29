'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { signInWithGoogle } from '@/services';

import { SignInForm } from './components/Form';
import { toast } from '../ui/use-toast';

const SignIn: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSignInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch {
      toast({
        title: 'An error occurred while signing in with Google.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
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
            disabled={loading}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleSignInWithGoogle}
          >
            Login with Google {loading && '...'}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Button asChild variant="link" className="p-0">
              <Link href="#" className="underline">
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="size-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export { SignIn };
