import { FC } from 'react';
import Image from 'next/image';

import { cn } from '@/utils';

export const LogoHorizontal: FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      <Image
        className={cn('dark:hidden', className)}
        src="/images/buggcy/logo-buggcy.png"
        alt="Buggcy Logo"
        width={84}
        height={32}
        priority
      />
      <Image
        className={cn('hidden dark:block', className)}
        src="/images/buggcy/logo-buggcy.png"
        alt="Buggcy Logo"
        width={84}
        height={32}
        priority
      />
    </>
  );
};
