'use client';
import { useState } from 'react';

import { toast } from '@/components/ui/use-toast';

export const useCopyToClipboard = ({
  toastText = 'Copied',
  textToCopy,
  errorToastText = 'Not copied!',
}: {
  toastText?: string;
  textToCopy: string;
  errorToastText?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (isCopied) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      toast({
        title: toastText,
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      setIsCopied(false);
      toast({
        title: errorToastText,
        variant: 'destructive',
      });
    }
  };

  return { isCopied, copyToClipboard };
};
