import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/utils';

export const CopyToClipboardButton = ({
  textToCopy,
  className,
}: {
  textToCopy: string;
  className?: string;
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy,
  });

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn('size-8 p-2', className)}
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
