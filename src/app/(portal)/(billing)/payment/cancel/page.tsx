import Link from 'next/link';

import { TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ChangePaymentMethodButton } from '@/app/(portal)/(billing)/payment/cancel/components/ChangePaymentMethodButton';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-transparent p-10 dark:bg-none">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-red-100 p-4">
          <TriangleAlertIcon className="size-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold">Payment failed</h1>
        <p className="text-center text-muted-foreground">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          We're sorry, but your payment could not be processed due to incorrect
          card details. Please check your card information and try again.
        </p>
        <p className="text-center text-muted-foreground">
          If you continue to experience issues, please contact{' '}
          <a
            href="mailto:developer-support@tavus.io"
            className="text-blue-500 underline"
          >
            developer-support@tavus.io
          </a>
          .
        </p>
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href="/billing">Try Again</Link>
          </Button>
          <ChangePaymentMethodButton />
        </div>
      </div>
    </div>
  );
}
