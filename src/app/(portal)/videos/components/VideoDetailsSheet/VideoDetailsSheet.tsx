import { FC, useState } from 'react';
import Link from 'next/link';

import { Close, Content } from '@radix-ui/react-dialog';
import { ArrowUpRight, ChevronsRight, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
  sheetVariants,
} from '@/components/ui/sheet';

import { useVideoQuery } from '@/hooks';
import { cn } from '@/utils';

import { VideoDetailsSheetProps, VideoId } from './types';
import { DeleteVideoBtn } from '../DeleteVideoBtn';
import { ShareFooterButtons } from '../ShareFooterButtons';
import { VideoBlock } from '../VideoBlock';
import { VideoDataBlock } from '../VideoDataBlock';
import { VideoInfoBlock } from '../VideoInfoBlock';

export const useVideoDetailsSheet = () => {
  const [video_id, setVideoId] = useState<VideoId>(null);

  const onOpenChange = (id?: VideoId) => {
    if (id) {
      setVideoId(id);
    } else {
      setVideoId(null);
    }
  };

  return {
    onOpenChange,
    video_id,
  };
};

const VideoDetailsSheet: FC<VideoDetailsSheetProps> = ({
  id,
  onOpenChange,
}) => {
  const { data: video, isLoading } = useVideoQuery(id as string, {
    enabled: !!id,
  });

  return (
    <Sheet open={!!id} onOpenChange={() => onOpenChange()}>
      <SheetPortal>
        <SheetOverlay />
        <Content
          className={cn(
            sheetVariants({ side: 'right' }),
            'bottom-2 right-2 top-2 flex h-auto w-[calc(100%-1rem)] flex-col gap-4 overflow-auto rounded-md p-4 sm:w-[460px] sm:max-w-[460px]',
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white opacity-90">
              <Loader className="size-6 animate-spin" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Close asChild>
              <Button variant="ghost" size="icon">
                <ChevronsRight />
              </Button>
            </Close>
            <Button variant="outline" asChild>
              <Link
                target="_blank"
                href={`/videos/details?id=${video?.video_id}`}
              >
                Video Details
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <DeleteVideoBtn
              id={video?.video_id as string}
              className="ml-auto"
              onDeleted={onOpenChange}
            />
          </div>
          <div className="mb-2">
            <VideoBlock
              status={video?.status}
              stream_url={video?.stream_url}
              status_details={video?.status_details}
            />
          </div>
          <VideoInfoBlock
            video_name={video?.video_name}
            video_id={video?.video_id}
            created_at={video?.created_at}
            status={video?.status}
            replicaId={video?.replica_id}
            generationProgress={video?.generation_progress}
          />
          <VideoDataBlock data={video?.data} />
          <ShareFooterButtons
            status={video?.status}
            downloadUrl={video?.download_url}
            hostedUrl={video?.hosted_url}
          />
        </Content>
      </SheetPortal>
    </Sheet>
  );
};

export { VideoDetailsSheet };
