'use client';

import { FC } from 'react';

import { AuthLayout } from '@/app/(authentication)/auth/Layout.component';

import { VerifyCodeForm } from './VerifyCodeForm';

const VerifyCode: FC = () => {
  return (
    <AuthLayout maxWidth={false}>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
      </div>
      <div className="w-full space-y-4">
        <VerifyCodeForm />
      </div>
    </AuthLayout>
  );
};

export { VerifyCode };
