import { Suspense } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ResetPasswordForm } from '@/app/(authentication)/auth/forgot-password/components/Form.component';
import { AuthLayout } from '@/app/(authentication)/auth/Layout.component';

export default function ForgetPasswordPage() {
  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email to reset a password
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
      <div className="text-center text-sm">
        Know your password?{' '}
        <Button asChild variant="link" className="p-0">
          <Link href="/auth/sign-in" className="underline">
            Login here
          </Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
