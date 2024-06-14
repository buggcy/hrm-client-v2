import { useEffect, useRef, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';

export const useAudio = (url: string) => {
  const { toast } = useToast();
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    audioRef.current.src = url;
  }, [url]);

  useEffect(() => {
    if (isPlaying)
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        toast({ title: 'Error', description: 'Failed to play audio' });
      });
    else audioRef.current.pause();
  }, [isPlaying, toast]);

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  return {
    isPlaying,
    toggle,
  };
};
