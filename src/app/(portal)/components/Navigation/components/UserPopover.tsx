'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { useMutation } from '@tanstack/react-query';
import {
  LoaderCircle,
  LogOut,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStores } from '@/providers/Store.Provider';

import { logout as logoutFn } from '@/services';
import { AuthStoreType } from '@/stores/auth';

const TERMS_LINK = 'https://www.tavus.io/terms-of-service';
const PRIVACY_LINK = 'https://www.tavus.io/privacy-policy';

export const UserPopover = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user, resetSession } = authStore;

  const { theme, setTheme } = useTheme();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutFn,
  });

  const handleLogout = () => {
    resetSession();
    logout();
  };

  const username = `${user?.firstName} ${user?.lastName}`;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start overflow-hidden p-0 pl-1 transition-all duration-200 group-hover:w-52 sm:w-10"
          >
            <div className="flex w-52 items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate sm:translate-x-2 sm:opacity-0 sm:transition-all sm:duration-200 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
                {username}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[13.5rem] p-2" align="start">
          <div className="space-y-1 p-2">
            <h3 className="truncate text-sm font-semibold">{username}</h3>
            <p className="truncate text-xs text-gray-500">
              {user?.companyEmail}
            </p>
          </div>
          <Separator className="mb-1 w-full" />
          <ul className="space-y-1">
            <li>
              <div className="flex items-center justify-between">
                <p className="p-2 text-sm font-medium">Theme</p>
                <Tabs defaultValue={theme} className="w-32">
                  <TabsList className="h-7 w-32 p-0.5">
                    <TabsTrigger
                      className="h-6"
                      value="light"
                      onClick={() => setTheme('light')}
                    >
                      <SunIcon className="size-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      className="h-6"
                      value="dark"
                      onClick={() => setTheme('dark')}
                    >
                      <MoonIcon className="size-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      className="h-6"
                      value="system"
                      onClick={() => setTheme('system')}
                    >
                      <MonitorIcon className="size-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                asChild
              >
                <a href={TERMS_LINK} target="_blank">
                  Terms of Service
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                asChild
              >
                <a href={PRIVACY_LINK} target="_blank">
                  Privacy Policy
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                asChild
              >
                <Link href="/billing">Billing</Link>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start p-2"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut className="mr-1 size-4" />
                Log Out
                {isPending && (
                  <LoaderCircle className="ml-2 size-4 animate-spin" />
                )}
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
