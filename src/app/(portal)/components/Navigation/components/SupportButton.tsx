import { CircleHelp } from 'lucide-react';

import { toggleIntercom } from '@/components/Intercom';
import { Button, ButtonProps } from '@/components/ui/button';

import { cn } from '@/utils';

export const NavigationSupportBtn = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-10 w-full justify-start overflow-hidden pl-2.5 text-muted-foreground transition-all duration-200 group-hover:w-52 sm:size-10',
        className,
      )}
      onClick={toggleIntercom}
      {...props}
    >
      <div className="flex w-52 items-center gap-2">
        <CircleHelp className="size-5" />
        <span className="transition-all duration-200 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          {children || 'Support'}
        </span>
      </div>
    </Button>
  );
};

export const SupportButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'h-10 w-full justify-start overflow-hidden text-muted-foreground',
        className,
      )}
      onClick={toggleIntercom}
      {...props}
    >
      {children || (
        <>
          <CircleHelp className="size-5" />
          Support
        </>
      )}
    </Button>
  );
};
