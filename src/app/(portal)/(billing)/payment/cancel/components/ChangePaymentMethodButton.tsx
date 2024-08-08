'use client';

import { LoadingButton } from '@/components/LoadingButton';
import { ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useStripeBillingPortalSessionMutation } from '@/hooks/useBilling';

export const ChangePaymentMethodButton = ({
  children,
  ...props
}: ButtonProps) => {
  const { isPending, mutateAsync } = useStripeBillingPortalSessionMutation();

  const handleClick = async () => {
    try {
      const result = await mutateAsync();

      window.location.href = result.url;
    } catch (error) {
      toast({
        description:
          'Failed to create a payment session. Please try again later or contact support.',
        variant: 'error',
      });
    }
  };

  return (
    <LoadingButton {...props} loading={isPending} onClick={handleClick}>
      {children || 'Change Payment Method'}
    </LoadingButton>
  );
};
