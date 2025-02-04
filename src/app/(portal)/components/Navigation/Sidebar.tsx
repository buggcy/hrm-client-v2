'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Search, X } from 'lucide-react';

import { LogoHorizontal } from '@/components/LogoHorizontal';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';
import { employeeMenu } from '@/utils/menu/employee.menu';
import { hrMenu } from '@/utils/menu/hr.menu';
import { managerMenu } from '@/utils/menu/manager.menu';

import { NavigationItem } from './components/NavigationItem';
import { NavSection } from './components/NavSection';
import { NavigationSupportBtn } from './components/SupportButton';
import { UserPopover } from './components/UserPopover';

import { MenuItem } from '@/types/menu';

export const Sidebar = () => {
  const pathname = usePathname();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user, accessPermissions } = authStore;

  const menuItems: MenuItem[] =
    user?.roleId === 1
      ? hrMenu(accessPermissions)
      : user?.roleId === 3
        ? managerMenu(accessPermissions)
        : employeeMenu(accessPermissions);

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesTitle = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesChildren =
      item.children &&
      item.children.some(child =>
        child.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesTitle || matchesChildren;
  });
  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSidebarMouseLeave = () => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setSearchQuery('');
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r bg-background sm:flex"
      onMouseLeave={handleSidebarMouseLeave}
    >
      <div className="group relative flex size-full w-w-sidebar flex-col gap-2 px-4 pb-8 pt-6 transition-all duration-300 hover:w-w-sidebar-open">
        <nav className="flex size-full flex-col gap-2">
          <Button
            asChild
            variant="ghost"
            className="mb-3 h-9 items-center justify-start overflow-hidden px-0 hover:bg-transparent"
          >
            <Link href="/" aria-label="Go to Home Page">
              <Image
                className="mx-1 transition-all duration-200 group-hover:-translate-x-8 group-hover:opacity-0"
                src="/images/buggcy/logo-buggcy-small.png"
                alt="Buggcy Logo"
                width={32}
                height={32}
                priority
              />
              <LogoHorizontal className="opacity-0 transition-all duration-200 group-hover:-translate-x-8 group-hover:opacity-100" />
            </Link>
          </Button>
          <ScrollArea
            className="mt-2 h-[calc(100vh-260px)] w-full overflow-visible"
            hideScrollbar={true}
          >
            <ScrollBar className="mr-[-17px]" />
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 overflow-hidden text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pages..."
                className="w-full rounded-md bg-muted py-2 pl-10 pr-4 text-sm text-foreground outline-none group-hover:border"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-all hover:bg-muted group-hover:text-muted-foreground/70"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            {filteredMenuItems.length === 0 ? (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredMenuItems.map(item =>
                item.children ? (
                  !item.disabled && (
                    <NavSection title={item.title} key={item.title}>
                      {item.children.map(child => {
                        if (child.disabled === false) {
                          return (
                            <NavigationItem
                              key={child.href}
                              title={child.title}
                              icon={child.icon}
                              href={child.href!}
                              active={pathname === child.href}
                            />
                          );
                        }
                      })}
                    </NavSection>
                  )
                ) : (
                  <li className="flex" key={item.href}>
                    <NavigationItem
                      title={item.title}
                      icon={item.icon}
                      href={item.href!}
                      active={pathname === item.href}
                    />
                  </li>
                ),
              )
            )}
          </ScrollArea>
        </nav>
        <ul className="mt-auto flex flex-col gap-3">
          {/* <li>
            <QuotasCard className="hidden group-hover:flex" />
          </li> */}
          <li>
            <NavigationSupportBtn />
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
