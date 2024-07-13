'use client';
import * as React from 'react';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const progressVariantsRoot = cva(
  'relative h-4 w-full overflow-hidden rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-primary-foreground',
        progress: 'bg-progress-foreground',
        white: 'bg-border',
      },
    },
    defaultVariants: {
      variant: 'progress',
    },
  },
);

const progressVariantsIndicator = cva('size-full flex-1 transition-all', {
  variants: {
    variant: {
      primary: 'bg-primary',
      progress: 'bg-progress',
      white: 'bg-white',
    },
  },
  defaultVariants: {
    variant: 'progress',
  },
});

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: VariantProps<typeof progressVariantsRoot>['variant'];
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariantsRoot({ variant }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={progressVariantsIndicator({ variant })}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
