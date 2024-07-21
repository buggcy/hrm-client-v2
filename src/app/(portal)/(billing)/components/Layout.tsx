import { LayoutBaseProps } from '@/components/Layout/types';

import { cn } from '@/utils';

export const LayoutCenter = ({
  children,
  className,
  ...props
}: LayoutBaseProps) => (
  <div
    className={cn('flex h-screen items-center justify-center p-10', className)}
    {...props}
  >
    {children}
  </div>
);
