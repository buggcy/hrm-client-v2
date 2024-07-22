'use client';

import { LoadingButton } from '@/components/LoadingButton';
import { ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useCreateStripeCheckoutSessionUrlMutation } from '@/hooks/useBilling';

export const ChangePaymentMethodButton = ({
  children,
  ...props
}: ButtonProps) => {
  const { isPending, mutateAsync } =
    useCreateStripeCheckoutSessionUrlMutation();

  const handleClick = async () => {
    try {
      window.location.href = await mutateAsync();
    } catch (error) {
      toast({
        description:
          'Failed to create a new payment session. Please try again later or contact support.',
      });
    }
  };

  return (
    <LoadingButton {...props} loading={isPending} onClick={handleClick}>
      {children || 'Change Payment Method'}
    </LoadingButton>
  );
};
