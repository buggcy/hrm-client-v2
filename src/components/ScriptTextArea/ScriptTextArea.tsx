import { Check, Copy } from 'lucide-react';

import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/utils';

import { Button } from '../ui/button';

export const ScriptTextArea = ({
  label,
  script,
  className,
}: {
  label: string;
  script?: string | null;
  className?: string;
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: script as string,
  });

  if (!script) return null;

  return (
    <div className={cn('rounded-md border bg-secondary py-4', className)}>
      <div className="mb-2 flex items-center justify-between px-4">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
      <textarea
        className="w-full resize-none rounded-md bg-secondary px-4 text-sm font-normal text-muted-foreground outline-none"
        value={script}
        readOnly
        rows={10}
      ></textarea>
    </div>
  );
};
