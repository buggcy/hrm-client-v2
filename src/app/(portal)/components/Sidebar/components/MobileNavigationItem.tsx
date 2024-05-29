'use client';
import { FC, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils';

export const MobileNavigationItem: FC<{
  title: string;
  icon: LucideIcon;
  href: string;
  active: boolean;
  onClick?: () => void;
}> = memo(({ title, icon: Icon, href, active, onClick }) => {
  const router = useRouter();

  return (
    <Button
      asChild
      variant="ghost"
      className={cn('w-full justify-start pl-2.5', active && 'bg-secondary')}
    >
      <Link
        href={href}
        onClick={() => {
          router.push(href);
          onClick?.();
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-5" />
          <span>{title}</span>
        </div>
      </Link>
    </Button>
  );
});

MobileNavigationItem.displayName = 'MobileNavigationItem';
