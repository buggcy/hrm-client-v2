'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AlignJustify } from 'lucide-react';

import { LogoHorizontal } from '@/components/LogoHorizontal';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';
import { employeeMenu } from '@/utils/menu/employee.menu';
import { hrMenu } from '@/utils/menu/hr.menu';
import { managerMenu } from '@/utils/menu/manager.menu';

import { MobileNavigationItem } from './components/MobileNavigationItem';
import { NavSection } from './components/NavSection';
import { NavigationSupportBtn } from './components/SupportButton';
import { UserPopover } from './components/UserPopover';

import { MenuItem } from '@/types/menu';

export const MobileHeader = () => {
  const pathname = usePathname();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user, accessPermissions } = authStore;
  const menuItems: MenuItem[] =
    user?.roleId === 1
      ? hrMenu(accessPermissions)
      : user?.roleId === 3
        ? managerMenu(accessPermissions)
        : employeeMenu(accessPermissions);
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:hidden sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link
        href="/"
        aria-label="Go to Home Page"
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:hidden"
      >
        <LogoHorizontal />
      </Link>

      <div className="flex gap-2">
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
            className="flex w-full flex-col overflow-y-auto p-4 sm:max-w-xs"
          >
            <div className="flex size-full min-h-[calc(100dvh-2rem)] flex-col">
              <nav className="mb-5 grid gap-2">
                <Link
                  href="/"
                  aria-label="Go to Home Page"
                  className="flex w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <LogoHorizontal />
                </Link>

                <Separator className="w-full" />
                {menuItems.map(item =>
                  item.children ? (
                    <NavSection title={item.title} key={item.title}>
                      {item.children.map(child => (
                        <li className="flex" key={child.href}>
                          <MobileNavigationItem
                            title={child.title}
                            icon={child.icon}
                            href={child.href!}
                            active={pathname === child.href}
                            onClick={onClose}
                          />
                        </li>
                      ))}
                    </NavSection>
                  ) : (
                    <li className="flex" key={item.href}>
                      <MobileNavigationItem
                        title={item.title}
                        icon={item.icon}
                        href={item.href!}
                        active={pathname === item.href}
                        onClick={onClose}
                      />
                    </li>
                  ),
                )}
              </nav>
              <ul className="mt-auto flex flex-col gap-3">
                {/* <li>
                <QuotasCard className="w-full" />
              </li> */}
                <li>
                  <NavigationSupportBtn />
                </li>
                <li>
                  <Separator />
                </li>
                <li className="flex pb-4">
                  <UserPopover />
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
        <Notification />
      </div>
    </header>
  );
};
