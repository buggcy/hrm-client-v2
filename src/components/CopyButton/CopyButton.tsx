import { FC } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useCopyToClipboard } from '@/hooks';

import { CopyButtonProps } from './types';

const CopyButton: FC<CopyButtonProps> = ({ textToCopy, icon, label }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: textToCopy,
  });

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    void copyToClipboard();
  };

  const Icon = icon || Copy;

  return (
    <Button
      variant="ghost"
      className="group/btn h-8 w-fit gap-2 rounded-md px-1"
      onClick={handleCopy}
    >
      {isCopied ? (
        <Check className="size-3.5" />
      ) : (
        <Icon className="size-3.5 opacity-0 group-hover/btn:opacity-100" />
      )}
      {label}
    </Button>
  );
};

export { CopyButton };
