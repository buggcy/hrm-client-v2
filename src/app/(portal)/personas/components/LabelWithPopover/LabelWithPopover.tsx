import { CircleHelp } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/utils';

export const LabelWithPopover = ({
  children,
  popoverContent,
  className,
}: {
  children: React.ReactNode;
  popoverContent: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <Label className={(cn('inline-block'), className)}>{children}</Label>
      <Popover>
        <PopoverTrigger>
          <CircleHelp className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="text-xs">{popoverContent}</PopoverContent>
      </Popover>
    </div>
  );
};
