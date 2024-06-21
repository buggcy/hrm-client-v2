import { FC } from 'react';

import { Loader2 } from 'lucide-react';

import { LoadingButtonProps } from './types';
import { Button } from '../ui/button';

const LoadingButton: FC<LoadingButtonProps> = ({
  loading,
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-muted opacity-85">
          <Loader2 className="size-3/5 animate-spin text-primary" />
        </div>
      )}
      {children}
    </Button>
  );
};

export { LoadingButton };
