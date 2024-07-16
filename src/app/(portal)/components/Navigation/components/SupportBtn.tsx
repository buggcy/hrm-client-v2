import { CircleHelp } from 'lucide-react';

import { toggleIntercom } from '@/components/Intercom';
import { Button } from '@/components/ui/button';

export const SupportBtn = () => {
  return (
    <Button
      variant="ghost"
      className="h-10 w-full justify-start overflow-hidden pl-2.5 text-muted-foreground transition-all duration-200 group-hover:w-52 sm:size-10"
      onClick={toggleIntercom}
    >
      <div className="flex w-52 items-center gap-2">
        <CircleHelp className="size-5" />
        <span className="transition-all duration-200 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          Support
        </span>
      </div>
    </Button>
  );
};
