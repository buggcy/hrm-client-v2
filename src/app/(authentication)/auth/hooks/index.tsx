import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useUserQuery } from '@/hooks';
import { firebaseAuth } from '@/libs';
import { NonDeveloperError } from '@/services';

export const useRedirectAfterAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useUserQuery({
    enabled: !!firebaseAuth.currentUser,
  });

  useEffect(() => {
    if (user) {
      if (user.billingAccount?.status === null) {
        const plan = searchParams.get('plan');

        router.push('/billing' + (plan ? `?plan=${plan}` : ''));
      } else if (pathname.startsWith('/auth')) router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};

const nonDeveloperToastDescription = (
  <>
    If you think there’s a mistake, or are interested in the Tavus Developer
    platform, please let us know at{' '}
    <a href="mailto:support@tavus.io" className="underline">
      support@tavus.io
    </a>
    <br />
    <br />
    <Button asChild variant="primary-inverted" className="ml-auto w-full">
      <a href="https://app.tavus.io">Access Tavus Business Portal</a>
    </Button>
  </>
);

export const createHandleAuthError = (title: string) => (error: Error) => {
  if (error instanceof NonDeveloperError) {
    toast({
      title:
        'Looking for the Tavus Business Portal? Please login via the link below.',
      description: nonDeveloperToastDescription,
      variant: 'destructive',
    });
  } else
    toast({
      title,
      variant: 'error',
    });
};
