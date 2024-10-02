import { FC, memo } from 'react';
import Link from 'next/link';

import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils';

export const NavigationItem: FC<{
  title: string;
  icon: LucideIcon | FC<{ className?: string }>;
  href: string;
  active: boolean;
}> = memo(({ title, icon: Icon, href, active }) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'justify-start overflow-hidden pl-2.5 text-muted-foreground',
        {
          'bg-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary':
            active,
        },
      )}
    >
      <Link href={href}>
        <div className="flex w-52 items-center gap-2">
          {Icon && <Icon className="size-5" />}
          <span className="transition-all duration-200 sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
            {title}
          </span>
        </div>
      </Link>
    </Button>
  );
});

NavigationItem.displayName = 'NavigationItem';
