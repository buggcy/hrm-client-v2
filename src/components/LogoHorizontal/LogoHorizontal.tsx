import { FC } from 'react';
import Image from 'next/image';

import { cn } from '@/utils';

export const LogoHorizontal: FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      <Image
        className={cn('dark:hidden', className)}
        src="/images/logo_full.svg"
        alt="Tavus Logo"
        width={84}
        height={32}
        priority
      />
      <Image
        className={cn('hidden dark:block', className)}
        src="/images/logo_full_inverted.svg"
        alt="Tavus Logo"
        width={84}
        height={32}
        priority
      />
    </>
  );
};
