'use client';

import { ReactNode, useCallback, useState } from 'react';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const useClipboard = () => {
  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  return { copy };
};

export default function CopyToClipboard({
  text = 'example@email.com',
  icon = 'Mail',
  type = 'Email address',
}: {
  text?: string;
  icon?: ReactNode;
  type?: string;
}) {
  const [tooltipContent, setTooltipContent] = useState(text);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { copy } = useClipboard();

  const handleCopy = useCallback(() => {
    setCopied(true);
    void copy(text);
    setTooltipContent(`${type} copied to clipboard!`);
    setIsOpen(true);
    setTimeout(() => {
      setTooltipContent(text);
      setIsOpen(false);
    }, 2000);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copy, text, type]);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
              if (tooltipContent === text) {
                setIsOpen(false);
              }
            }}
            className="size-6 rounded-full"
          >
            {copied ? <Check size={12} /> : icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
