import { FC } from 'react';

import { Check, Copy } from 'lucide-react';

import { AudioCard } from '@/components/AudioCard';
import { Button } from '@/components/ui/button';

import { useCopyToClipboard } from '@/hooks';

import { IVideo } from '@/types';

export const VideoDataBlock: FC<{
  data?: IVideo['data'];
}> = ({ data }) => {
  const { script, audio_url } = data || {};
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: script,
  });

  return (
    <>
      {script && (
        <div className="rounded-md border bg-secondary pb-4">
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Script
            </p>
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
            className="h-48 w-full resize-none rounded-md bg-secondary px-4 text-sm font-normal text-muted-foreground outline-none"
            value={
              'Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling! Parents, give your child the gift of coding. Summer boot camps now enrolling!'
            }
            readOnly
          ></textarea>
        </div>
      )}
      {audio_url && <AudioCard url={audio_url} />}
    </>
  );
};
