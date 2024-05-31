'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { ArrowRightIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useUserQuery } from '@/hooks';
import { logout } from '@/services';

export const UserPopover = () => {
  const { data: user } = useUserQuery();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex w-52 items-center gap-2 pl-1">
          <Avatar className="size-8">
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback>
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="translate-x-2 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:opacity-0">
            {user?.first_name} {user?.last_name}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[13.5rem]">
        {/* <ul className="flex flex-col gap-1">
    <li>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-between"
      >
        <a href="/support/faq" target="_blank">
          Documentation
          <ExternalLink className="size-4" />
        </a>
      </Button>
    </li>
    <li>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-between"
      >
        <a href="/support/faq" target="_blank">
          Documentation
          <ExternalLink className="size-4" />
        </a>
      </Button>
    </li>
    <li>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-between"
      >
        <a href="/support/faq" target="_blank">
          Documentation
          <ExternalLink className="size-4" />
        </a>
      </Button>
    </li>
  </ul> */}
        <div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Cameron Williamson</h3>
            <p className="text-sm text-gray-500">williamson034@gmail.com</p>
          </div>
          <div className="my-4 border-t" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg">Theme</p>
              <div className="flex space-x-2">
                <Button
                  className="p-2"
                  variant="ghost"
                  onClick={() => setTheme('light')}
                >
                  <SunIcon className="size-5 text-gray-500" />
                </Button>
                <Button
                  className="p-2"
                  variant="ghost"
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="size-5 text-gray-500" />
                </Button>
                <Button
                  className="p-2"
                  variant="ghost"
                  onClick={() => setTheme('system')}
                >
                  <MonitorIcon className="size-5 text-gray-500" />
                </Button>
              </div>
            </div>
            <Link className="block text-lg" href="#">
              Terms & Policies
            </Link>
            <Link className="block text-lg" href="#">
              Billing
            </Link>
            <Button
              variant="ghost"
              className="block text-lg"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleLogout}
            >
              <ArrowRightIcon className="mr-2 inline size-5" />
              Log Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
