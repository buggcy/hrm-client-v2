import { FC } from 'react';

import { Check, DownloadIcon, LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/utils';

import { IVideo, VideoStatus } from '@/types';

export const ShareFooterButtons: FC<{
  className?: string;
  status?: VideoStatus;
  downloadUrl?: IVideo['download_url'];
  hostedUrl?: IVideo['hosted_url'];
}> = ({ className, status, downloadUrl, hostedUrl }) => {
  const { t } = useTranslation();
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: hostedUrl as string,
  });

  const handleDownload = () => {
    if (downloadUrl) window.open(downloadUrl, '_blank');
  };

  if (status !== VideoStatus.READY) return null;

  return (
    <div
      className={cn(
        'mt-auto flex w-full items-center justify-between',
        className,
      )}
    >
      <Button onClick={handleDownload} variant="outline" className="gap-2">
        <DownloadIcon className="mr-2 size-4" />
        {t('general.share.download')}
      </Button>
      <Button
        onClick={copyToClipboard}
        variant="primary-inverted"
        className="gap-2"
      >
        {isCopied ? (
          <Check className="size-4" />
        ) : (
          <LinkIcon className="size-4" />
        )}
        {t('general.share.copy_link')}
      </Button>
    </div>
  );
};
