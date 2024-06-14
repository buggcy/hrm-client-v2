'use client';
import { FC, Fragment } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { RQH_API_BASE_URL } from '@/constants';
import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/utils';

import { CopyApiUrlProps } from './types';

const URLS = {
  video: '/v2/videos',
  replica: '/v2/replicas',
};

const CopyApiUrl: FC<CopyApiUrlProps> = ({ type, url, id }) => {
  const URL = URLS[url];
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: `${RQH_API_BASE_URL}${URL}${id ? `/${id}` : ''}`,
  });
  const urlArr = URL.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-2 rounded-md border py-0.5 pl-2 pr-0.5">
      <div
        className={cn(
          'flex items-center justify-center rounded px-2 py-0.5 font-medium',
          {
            'bg-success-foreground text-success': type === 'GET',
            'bg-aqua-foreground text-aqua': type === 'POST',
            'bg-destructive-foreground text-destructive': type === 'DELETE',
            'bg-secondary-foreground text-secondary': type === 'PATCH',
          },
        )}
      >
        <span className="text-xs text-green-600">{type}</span>
      </div>
      <code className="inline-flex text-sm text-muted-foreground sm:gap-1">
        {urlArr.map(part => (
          <Fragment key={part}>
            <span>/</span>
            <span>
              <span>{part}</span>
            </span>
          </Fragment>
        ))}
        {id && (
          <>
            <span>/</span>
            <span className="text-foreground">{id}</span>
          </>
        )}
      </code>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="ml-2 size-8 p-2 sm:ml-6"
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
    </div>
  );
};

export { CopyApiUrl };
