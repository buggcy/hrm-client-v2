import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import {
  ArrowRight,
  Check,
  Copy,
  InfoIcon,
  Loader,
  MoreHorizontal,
  Scaling,
  Trash2,
  Volume2Icon,
  VolumeX,
} from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCopyToClipboard, useDeleteReplicaMutation } from '@/hooks';
import { cn } from '@/utils';

import { DeleteDialog } from '../DeleteDialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

export const CopyReplicaID = ({
  id,
  label,
  variant = 'default',
}: {
  id?: IReplica['replica_id'];
  label: string;
  variant?: 'default' | 'muted';
}) => {
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
      variant="card"
      className={cn(
        'group/btn flex h-6 w-fit rounded-full px-3 text-sm font-semibold',
        {
          'bg-border text-muted-foreground': variant === 'muted',
        },
      )}
      onClick={handleCopy}
    >
      {label}
      {isCopied ? (
        <Check className="size-3.5" />
      ) : (
        <Copy className="hidden size-3.5 group-hover/btn:block" />
      )}
    </Button>
  );
};

const useReplicasVideoMute = () => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const onMuteChange = (mute: boolean) => {
    setIsMuted(mute);
  };

  return { isMuted, toggleMute, onMuteChange };
};

// TODO: add rename functionality
// TODO: add keyboard support

const SkeletonReplicaCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <Card className={cn('rounded-md', className)}>
    <CardContent className="p-4">
      <Skeleton className="aspect-video size-full rounded-md" />
    </CardContent>
    <div className="flex flex-col gap-3 px-2.5 pb-4">
      <Skeleton className="h-8 w-full rounded-md" />
      <Skeleton className="h-5 w-full rounded-md" />
    </div>
  </Card>
);

const ReplicaCard = ({
  replica,
  isMuted = true,
  toggleMute,
  onMuteChange,
  onSelect,
  selected,
  isSelectable,
}: {
  replica: IReplica;
  isMuted?: boolean;
  toggleMute: () => void;
  onMuteChange: (mute: boolean) => void;
  onSelect?: (replica: IReplica) => void;
  selected?: boolean;
  isSelectable?: boolean;
}) => {
  const {
    replica_name,
    replica_id,
    thumbnail_video_url,
    status,
    training_progress,
    error_message,
    replica_type,
  } = replica;
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: replica_id,
  });
  const [error, setError] = useState(false);
  const [bgLoading, setBgLoading] = useState(true);
  const {
    mutate: deleteReplica,
    isPending,
    isSuccess,
  } = useDeleteReplicaMutation();

  const isUserReplica = replica_type === ReplicaType.PERSONAL;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVolumeChange = () => {
      onMuteChange(video.muted);
    };

    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onMuteChange]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleMouseEnter = () => {
    void videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  const handleFullScreen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRef.current;
    if (video?.requestFullscreen) {
      void video.requestFullscreen();
    }
  };

  const handleSelect = () => {
    onSelect?.(replica);
  };

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleMute();
  };

  const handleDelete = () => {
    void deleteReplica(replica_id);
  };

  const [preload, setPreload] = useState<'none' | 'metadata'>('none');
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setPreload('metadata');
          }
        });
      },
      {
        rootMargin: '150px',
      },
    );
    observer.observe(videoRef.current as Element);
  }, []);

  return (
    <Card
      className={cn('group rounded-md outline-primary hover:shadow', {
        'ring ring-primary': selected,
        'cursor-pointer': isSelectable,
      })}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleMouseLeave}
    >
      <CardContent className="p-2.5 pb-4">
        <div className="relative overflow-hidden rounded-md border bg-secondary">
          <div className="aspect-video size-full">
            {thumbnail_video_url && bgLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="size-8 animate-spin text-primary" />
              </div>
            )}
            {!error &&
              thumbnail_video_url &&
              status === ReplicaStatus.COMPLETED && (
                <video
                  ref={videoRef}
                  src={thumbnail_video_url}
                  className="aspect-video size-full rounded-md bg-black object-contain"
                  muted={isMuted}
                  loop
                  preload={preload}
                  onError={() => setError(true)}
                  onLoadedData={() => setBgLoading(false)}
                />
              )}

            {error && (
              <div className="flex aspect-video size-full flex-col items-center justify-center gap-2">
                <p className="text-sm text-destructive/80">
                  Error loading preview
                </p>
              </div>
            )}
            {status === ReplicaStatus.STARTED && (
              <div className="flex aspect-video size-full flex-col items-center justify-center gap-2">
                <p className="text-xs font-semibold text-progress">
                  {training_progress.split('/')[0]}%
                </p>
                <Progress value={33} className="h-2 max-w-40" />
              </div>
            )}
            {status === ReplicaStatus.ERROR && (
              <div className="flex aspect-video size-full items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="label-error">
                        Error
                        <InfoIcon className="ml-1 size-4 text-destructive" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[40ch]">{error_message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <CopyReplicaID
              id={replica_id}
              label={`ID: ${replica_id}`}
              variant={status === ReplicaStatus.COMPLETED ? 'default' : 'muted'}
            />
          </div>
          {thumbnail_video_url && (
            <div className="absolute right-2 top-2 hidden flex-col gap-2 group-hover:flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="card"
                      size="icon"
                      onClick={handleToggleMute}
                      className="size-8 rounded-full"
                    >
                      {isMuted ? (
                        <VolumeX className="size-5" />
                      ) : (
                        <Volume2Icon className="size-5" />
                      )}
                      <span className="sr-only">Toggle Mute</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="max-w-[40ch]">Toggle Mute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="card"
                      size="icon"
                      onClick={handleFullScreen}
                      className="size-8 rounded-full"
                    >
                      <Scaling className="size-5" />
                      <span className="sr-only">Toggle Fullscreen</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="max-w-[40ch]">Toggle Fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col content-start items-start px-2.5 pb-4">
        <div className="flex w-full items-center">
          <h4 className="mr-1 truncate text-sm font-semibold">
            {replica_name}
          </h4>

          {!isSelectable && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-auto size-8 rounded-full"
                  size="icon"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-45 p-1">
                <div className="flex flex-col">
                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    className="justify-start gap-3"
                  >
                    {isCopied ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    Copy Replica ID
                  </Button>
                  {isUserReplica && (
                    <DeleteDialog
                      isLoading={isPending}
                      isSuccess={isSuccess}
                      onDelete={handleDelete}
                      description="This action cannot be undone. This will permanently delete your replica."
                    >
                      <Button
                        variant="destructive-inverted"
                        className="justify-start gap-3"
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </DeleteDialog>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {!isSelectable &&
          (status === ReplicaStatus.COMPLETED ? (
            <Button asChild variant="link" className="mt-2.5 h-5 p-0">
              <Link
                href={`/videos/create/?replica=${replica_id}`}
                prefetch={false}
              >
                Create Video
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              variant="link"
              className="mt-2.5 h-5 p-0 text-muted-foreground"
            >
              Create Video
              <ArrowRight className="size-4" />
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
};

export { ReplicaCard, useReplicasVideoMute, SkeletonReplicaCard };
