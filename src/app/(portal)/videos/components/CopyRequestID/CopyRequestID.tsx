import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCopyToClipboard } from '@/hooks';

import { IVideo } from '@/types';

export const CopyRequestID = ({ id }: { id?: IVideo['video_id'] }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: id,
  });

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    void copyToClipboard();
  };

  return (
    <Button
      variant="ghost"
      className="group/btn h-8 w-fit gap-2 rounded-md px-1"
      onClick={handleCopy}
    >
      {id}
      {isCopied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="size-3.5 opacity-0 group-hover/btn:opacity-100" />
      )}
    </Button>
  );
};
