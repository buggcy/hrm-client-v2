import React from 'react';
import Link from 'next/link';

import { ArrowRight, Loader2 } from 'lucide-react';

import { Button, ButtonProps } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';

export const noQuotasTooltipContent = (
  <p>
    {"You don't have enough quotas. Please "}
    <Button asChild variant="link" className="p-0">
      <Link href="/billing">upgrade your plan</Link>
    </Button>{' '}
    to continue.
  </p>
);

export const GenerateSubmitButton = ({
  isGenerating,
  isOutOfQuotas,
  disabled,
  children,
  ...props
}: ButtonProps & {
  isGenerating: boolean;
  isOutOfQuotas: boolean;
}) => (
  <SimpleTooltip
    disabled={!isOutOfQuotas && !isGenerating && !disabled}
    tooltipContent={
      isGenerating ? 'Generating' : isOutOfQuotas ? noQuotasTooltipContent : ''
    }
  >
    <div>
      <Button
        type="submit"
        disabled={isGenerating || isOutOfQuotas || disabled}
        {...props}
      >
        {children}{' '}
        <span className="size-4">
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
        </span>
      </Button>
    </div>
  </SimpleTooltip>
);
