'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AlignJustify, Home, Key, ListVideo, Users, Video } from 'lucide-react';

import { LogoHorizontal } from '@/components/LogoHorizontal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { MobileNavigationItem } from './components/MobileNavigationItem';
import { NavSection } from './components/NavSection';
import QuotasCard from './components/QuotasCard';
import { ReplicaIcon } from './components/ReplicaIcon';
import { SupportBtn } from './components/SupportBtn';
import { UserPopover } from './components/UserPopover';

export const MobileHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link
        href="/"
        aria-label="Go to Home Page"
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:hidden"
      >
        <LogoHorizontal />
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full sm:hidden"
          >
            <AlignJustify className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-full flex-col p-4 sm:max-w-xs"
        >
          <nav className="grid gap-2">
            <Link
              href="/"
              aria-label="Go to Home Page"
              className="flex w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <LogoHorizontal />
            </Link>

            <Separator className="w-full" />

            <MobileNavigationItem
              title="Home"
              icon={Home}
              href="/"
              active={pathname === '/'}
              onClick={onClose}
            />
            <NavSection title="VIDEO">
              <li className="flex">
                <MobileNavigationItem
                  title="Video Generation"
                  icon={Video}
                  href="/videos/create"
                  active={pathname === '/videos/create'}
                  onClick={onClose}
                />
              </li>
              <li className="flex">
                <MobileNavigationItem
                  title="Video Library"
                  icon={ListVideo}
                  href="/videos"
                  active={pathname === '/videos'}
                  onClick={onClose}
                />
              </li>
            </NavSection>
            <NavSection title="REPLICA">
              <li className="flex">
                <MobileNavigationItem
                  title="Replica Generation"
                  icon={Users}
                  href="/replicas/create"
                  active={pathname === '/replicas/create'}
                  onClick={onClose}
                />
              </li>
              <li className="flex">
                <MobileNavigationItem
                  title="Replica Library"
                  icon={ReplicaIcon}
                  href="/replicas"
                  active={pathname === '/replicas'}
                  onClick={onClose}
                />
              </li>
            </NavSection>

            <NavSection>
              <li className="flex">
                <MobileNavigationItem
                  title="API Keys"
                  icon={Key}
                  href="/api-keys"
                  active={pathname === '/api-keys'}
                  onClick={onClose}
                />
              </li>
            </NavSection>
          </nav>
          <ul className="mt-auto flex flex-col gap-3">
            <li>
              <QuotasCard className="w-full" />
            </li>
            <li>
              <SupportBtn />
            </li>
            <li>
              <Separator />
            </li>
            <li className="flex">
              <UserPopover />
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </header>
  );
};
