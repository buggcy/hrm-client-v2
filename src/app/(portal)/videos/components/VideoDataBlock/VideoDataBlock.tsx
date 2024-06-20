import { FC } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCopyToClipboard } from '@/hooks';

import { IVideo } from '@/types';

export const VideoDataBlock: FC<{
  data?: IVideo['data'];
}> = ({ data }) => {
  const { script } = data || {};
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: script,
  });

  if (!script) return null;

  // TODO: Add audio player
  return (
    <div className="h-[15.375rem] rounded-md border bg-secondary">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <p className="text-sm font-semibold text-muted-foreground">Script</p>
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
        className="h-48 w-full resize-none rounded-md bg-secondary px-4 pb-4 text-sm font-normal text-muted-foreground outline-none"
        value={script}
        readOnly
      ></textarea>
    </div>
  );
};
