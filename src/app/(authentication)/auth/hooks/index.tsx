import { CancelledError } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Toast, toast } from '@/components/ui/use-toast';

import { DEVELOPER_SUPPORT_EMAIL, DEVELOPER_SUPPORT_LINK } from '@/constants';
import { NonDeveloperError } from '@/services';

export const useRedirectAfterAuth = () => {
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const pathname = usePathname();
  // const user = null;
};

const nonDeveloperToastDescription = (
  <>
    If you think there’s a mistake, or are interested in the Buggcy Developer
    platform, please let us know at{' '}
    <a href={DEVELOPER_SUPPORT_LINK} className="underline">
      {DEVELOPER_SUPPORT_EMAIL}
    </a>
    <br />
    <br />
    <Button asChild variant="primary-inverted" className="ml-auto w-full">
      <a href="https://app.tavus.io">Access Buggcy Business Portal</a>
    </Button>
  </>
);

export const createHandleAuthError =
  (data: Toast) => (error: Error | CancelledError) => {
    // TODO: fix to handle NonDeveloperError properly
    if (
      error instanceof NonDeveloperError ||
      (error instanceof AxiosError && error.response?.status === 401) ||
      error instanceof CancelledError
    ) {
      toast({
        title:
          'Looking for the Buggcy Business Portal? Please login via the link below.',
        description: nonDeveloperToastDescription,
        variant: 'error',
      });
    } else
      toast({
        variant: 'error',
        ...data,
      });
  };
