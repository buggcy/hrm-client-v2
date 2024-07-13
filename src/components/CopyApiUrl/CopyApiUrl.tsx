'use client';
import { FC, Fragment } from 'react';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

import { RQH_API_BASE_URL } from '@/constants';
import { cn } from '@/utils';

import { CopyApiUrlProps } from './types';

export const URLS = {
  video: '/v2/videos',
  replica: '/v2/replicas',
};

const CopyApiUrl: FC<CopyApiUrlProps> = ({ type, url, id }) => {
  const URL = URLS[url];
  const urlArr = URL.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-2 rounded-md border py-0.5 pl-2 pr-0.5">
      <div
        className={cn(
          'flex items-center justify-center rounded px-2 py-0.5 font-medium',
          {
            'bg-success-foreground text-success': type === 'GET',
            'bg-progress-foreground text-progress': type === 'POST',
            'bg-destructive-foreground text-destructive': type === 'DELETE',
            'bg-secondary-foreground text-secondary': type === 'PATCH',
          },
        )}
      >
        <span
          className={cn('fond-semibold text-xs text-success', {
            'text-text': type === 'POST',
          })}
        >
          {type}
        </span>
      </div>
      <code className="inline-flex text-sm text-foreground sm:gap-1">
        {urlArr.map(part => (
          <Fragment key={part}>
            <span className="text-muted-foreground">/</span>
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
      <CopyToClipboardButton
        className="ml-2 sm:ml-6"
        textToCopy={`${RQH_API_BASE_URL}${URL}${id ? `/${id}` : ''}`}
      />
    </div>
  );
};

export { CopyApiUrl };
