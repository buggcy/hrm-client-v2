'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, Key, ListVideo, Users, Video } from 'lucide-react';

import { LogoHorizontal } from '@/components/LogoHorizontal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { NavigationItem } from './components/NavigationItem';
import { NavSection } from './components/NavSection';
import { SupportPopover } from './components/SupportPopover';
import { UserPopover } from './components/UserPopover';

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden overflow-hidden border-r bg-background sm:flex">
      <div className="group relative flex size-full w-w-sidebar flex-col gap-2 overflow-x-hidden px-4 pb-8  pt-6 transition-all duration-300 hover:w-w-sidebar-open">
        <nav className="flex size-full flex-col gap-2">
          <Button
            asChild
            variant="ghost"
            className="mb-3 h-9 items-center justify-start overflow-hidden px-0 hover:bg-transparent"
          >
            <Link href="/" aria-label="Go to Home Page">
              <Image
                className="mx-1 transition-all duration-200 group-hover:-translate-x-8 group-hover:opacity-0"
                src="/images/logo_small.svg"
                alt="Tavus Logo"
                width={32}
                height={32}
                priority
              />
              <LogoHorizontal className="opacity-0 transition-all duration-200 group-hover:-translate-x-8 group-hover:opacity-100" />
            </Link>
          </Button>

          <NavigationItem
            title="Home"
            icon={Home}
            href="/"
            active={pathname === '/'}
          />

          <NavSection title="VIDEO">
            <li className="flex">
              <NavigationItem
                title="Video Generation"
                icon={Video}
                href="/videos/create"
                active={pathname === '/videos/create'}
              />
            </li>
            <li className="flex">
              <NavigationItem
                title="Video Library"
                icon={ListVideo}
                href="/videos"
                active={pathname === '/videos'}
              />
            </li>
          </NavSection>
          <NavSection title="REPLICA">
            <li className="flex">
              <NavigationItem
                title="Replica Generation"
                icon={Users}
                href="/replicas/create"
                active={pathname === '/replicas/create'}
              />
            </li>
            <li className="flex">
              <NavigationItem
                title="Replica Library"
                icon={Home}
                href="/replicas"
                active={pathname === '/replicas'}
              />
            </li>
          </NavSection>
          <NavSection>
            <li className="flex">
              <NavigationItem
                title="Api Keys"
                icon={Key}
                href="/api-keys"
                active={pathname === '/api-keys'}
              />
            </li>
          </NavSection>
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
      </div>
    </aside>
  );
};
