'use client';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AlignJustify, Home, Key, ListVideo, Users, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { MobileNavigationItem } from './MobileNavigationItem';
import { SupportPopover } from './SupportPopover';
import { UserPopover } from './UserPopover';

export const MobileNav = () => {
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
        <Image
          src="/images/logo_full.svg"
          alt="Tavus Logo"
          width={84}
          height={32}
          priority
        />
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
              <Image
                src="/images/logo_full.svg"
                alt="Tavus Logo"
                width={84}
                height={32}
                priority
              />
            </Link>

            <Separator className="w-full" />

            <MobileNavigationItem
              title="Home"
              icon={Home}
              href="/"
              active={pathname === '/'}
              onClick={onClose}
            />

            <section>
              <div className="mb-1 flex w-full items-center gap-1 pl-2.5">
                <h3 className="text-[0.625rem] leading-5 tracking-wide">
                  VIDEO
                </h3>
              </div>
              <ul className="flex flex-col gap-1">
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
              </ul>
            </section>
            <section>
              <div className="mb-1 flex w-full items-center gap-1 pl-2.5">
                <h3 className="text-[0.625rem] leading-5 tracking-wide">
                  REPLICA
                </h3>
              </div>
              <ul className="flex flex-col gap-1">
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
                    icon={Home}
                    href="/replicas"
                    active={pathname === '/replicas'}
                    onClick={onClose}
                  />
                </li>
              </ul>
            </section>
            <Separator className="w-full" />
            <MobileNavigationItem
              title="Api Keys"
              icon={Key}
              href="/api-keys"
              active={pathname === '/api-keys'}
              onClick={onClose}
            />
          </nav>
          <ul className="mt-auto flex flex-col gap-3">
            <li>
              <SupportPopover />
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
